import React, { useEffect, useState } from 'react';
import {
  X,
  History,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnalysis: (item: AnalysisHistoryItem) => void;
  showToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectAnalysis,
  showToast
}) => {
  const [historyList, setHistoryList] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="console-card w-full max-w-2xl bg-[#0d1c23] border border-[#203942] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#203942] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#43d6d0]" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#e7f1ef]">
                Screening Analysis History
              </h3>
              <p className="text-[11px] text-[#86a3a3]">
                Previous semiconductor lot screening executions and cached results.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#86a3a3] hover:text-[#e7f1ef] hover:bg-[#12262e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Analyses */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#86a3a3] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#43d6d0]" />
              <span>Loading analysis audit log...</span>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#86a3a3]">
              No previous analyses found in record log.
            </div>
          ) : (
            historyList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#12262e] border border-[#203942] hover:border-[#43d6d0] rounded-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-xs text-[#43d6d0]">
                      {item.id}
                    </span>
                    <span className="badge-blue text-[10px]">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-[#e7f1ef]">
                    {item.total_components} components screened ({item.high_risk_count} high risk)
                  </div>
                  <div className="text-[10px] text-[#86a3a3] flex items-center gap-2 font-mono-num">
                    <Clock className="w-3 h-3 text-[#86a3a3]" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectAnalysis(item);
                    onClose();
                    showToast('info', 'Loaded Analysis', `Active view set to ${item.id}`);
                  }}
                  className="btn-cyan text-xs self-start sm:self-center"
                >
                  <span>Load Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#071217] border-t border-[#203942] flex items-center justify-between text-xs text-[#86a3a3]">
          <span>Archived records preserved in local store</span>
          <button onClick={onClose} className="btn-outline text-xs py-1 px-3">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

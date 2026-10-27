import React from 'react';
import {
  X,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  TrendingUp,
  Download,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { ComponentRecord, RiskLevel } from '../types';

interface ComponentDetailModalProps {
  component: ComponentRecord | null;
  onClose: () => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  onClose
}) => {
  if (!component) return null;

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return <span className="badge-high">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="badge-med">MEDIUM RISK</span>;
      case 'LOW':
      default:
        return <span className="badge-low">LOW RISK</span>;
    }
  };

  const handleDownloadTelemetry = () => {
    const jsonStr = JSON.stringify(component, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DUT_${component.component_id}_telemetry.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="console-card w-full max-w-3xl bg-[#0d1c23] border border-[#203942] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#203942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#12262e] border border-[#43d6d0] flex items-center justify-center text-[#43d6d0]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono-num text-[#43d6d0]">
                  {component.component_id}
                </h3>
                {getRiskBadge(component.risk)}
              </div>
              <p className="text-xs text-[#86a3a3]">
                Lot: <span className="font-mono-num text-[#e7f1ef]">{component.batch_id}</span> | Part:{' '}
                <span className="text-[#e7f1ef]">{component.part_type || 'Semiconductor IC'}</span> | {component.test_temperature_c || 125}°C, {component.voltage_v || 1.2}V
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

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Anomaly & Risk Summary Banner */}
          <div className="p-4 bg-[#12262e] border border-[#203942] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#86a3a3] tracking-wider">
                Burn-In Anomaly Assessment
              </div>
              <div className="text-2xl font-mono-num font-bold text-[#e7f1ef] mt-0.5">
                {component.anomaly_score.toFixed(1)}% Score
              </div>
              <div className="text-xs text-[#86a3a3] mt-1">
                {component.anomaly_score >= 70
                  ? 'Critical degradation outlier. Unit quarantine required.'
                  : component.anomaly_score >= 35
                  ? 'Moderate drift observed. Engineering review advised.'
                  : 'Normal aging signature within standard tolerance bounds.'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTelemetry}
                className="btn-outline text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Telemetry</span>
              </button>
            </div>
          </div>

          {/* 3 Parametric Measured vs 168h Predicted Channels */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#43d6d0]">
              Physical Degradation Trajectories
            </div>

            {/* 1. Iddq Channel */}
            <div className="p-3.5 bg-[#071217] border border-[#203942] rounded-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#43d6d0]">Quiescent Current (Iddq)</span>
                <span className="text-[#86a3a3] font-mono-num">
                  Total Predicted Drift: +{(component.iddq_168h_pred - component.iddq_0h).toFixed(2)} µA
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-num">
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.iddq_0h.toFixed(2)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.iddq_24h.toFixed(2)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.iddq_96h.toFixed(2)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#43d6d0]">
                  <div className="text-[10px] text-[#43d6d0] font-bold">168h (Pred)</div>
                  <div className="text-[#43d6d0] font-bold mt-1">{component.iddq_168h_pred.toFixed(2)} µA</div>
                </div>
              </div>
            </div>

            {/* 2. Leakage Current Channel */}
            <div className="p-3.5 bg-[#071217] border border-[#203942] rounded-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#efb765]">Junction Leakage Current</span>
                <span className="text-[#86a3a3] font-mono-num">
                  Total Predicted Drift: +{(component.leakage_168h_pred - component.leakage_0h).toFixed(3)} µA
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-num">
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.leakage_0h.toFixed(3)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.leakage_24h.toFixed(3)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.leakage_96h.toFixed(3)} µA</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#efb765]">
                  <div className="text-[10px] text-[#efb765] font-bold">168h (Pred)</div>
                  <div className="text-[#efb765] font-bold mt-1">{component.leakage_168h_pred.toFixed(3)} µA</div>
                </div>
              </div>
            </div>

            {/* 3. Delay Channel */}
            <div className="p-3.5 bg-[#071217] border border-[#203942] rounded-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#7eb9ed]">Propagation Delay</span>
                <span className="text-[#86a3a3] font-mono-num">
                  Total Predicted Drift: +{((component.delay_168h_pred - component.delay_0h) * 1000).toFixed(0)} ps
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono-num">
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.delay_0h.toFixed(3)} ns</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.delay_24h.toFixed(3)} ns</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#203942]">
                  <div className="text-[10px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-bold mt-1">{component.delay_96h.toFixed(3)} ns</div>
                </div>
                <div className="p-2 bg-[#12262e] rounded-xs border border-[#7eb9ed]">
                  <div className="text-[10px] text-[#7eb9ed] font-bold">168h (Pred)</div>
                  <div className="text-[#7eb9ed] font-bold mt-1">{component.delay_168h_pred.toFixed(3)} ns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Root Cause Analysis */}
          {component.anomaly_reasons && component.anomaly_reasons.length > 0 && (
            <div className="p-4 bg-[#12262e] border border-[#203942] rounded-xs space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#ef7778] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Identified Defect Mechanisms</span>
              </div>
              <ul className="space-y-1 text-xs text-[#e7f1ef] list-disc list-inside">
                {component.anomaly_reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#071217] border-t border-[#203942] flex items-center justify-end">
          <button onClick={onClose} className="btn-cyan text-xs">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

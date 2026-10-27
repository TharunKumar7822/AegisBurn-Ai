import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Download,
  Layers,
  AlertTriangle,
  Flame,
  Activity,
  ArrowRight,
  Eye,
  CheckCircle
} from 'lucide-react';
import { ComponentRecord, NavPage } from '../types';

interface AnomalyCenterViewProps {
  components: ComponentRecord[];
  onSelectComponent: (comp: ComponentRecord) => void;
  onNavigate: (page: NavPage) => void;
  onExportCSV: () => void;
}

export const AnomalyCenterView: React.FC<AnomalyCenterViewProps> = ({
  components,
  onSelectComponent,
  onNavigate,
  onExportCSV
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Anomalous parts (Score >= 70 or HIGH risk)
  const anomalies = useMemo(() => {
    return components.filter((c) => c.anomaly_score >= 70 || c.risk === 'HIGH');
  }, [components]);

  const filteredAnomalies = useMemo(() => {
    if (!searchQuery.trim()) return anomalies;
    const q = searchQuery.toLowerCase().trim();
    return anomalies.filter(
      (c) =>
        c.component_id.toLowerCase().includes(q) ||
        c.batch_id.toLowerCase().includes(q) ||
        (c.anomaly_reasons && c.anomaly_reasons.some((r) => r.toLowerCase().includes(q)))
    );
  }, [anomalies, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Critical Anomaly Alert Header */}
      <div className="console-card p-5 border-l-4 border-l-[#ef7778]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#ef7778] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>ANOMALY SCREENING CENTER (SCORE ≥ 70%)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
              {anomalies.length} Critical Units Flagged for Rejection / Inspection
            </h2>
            <p className="text-xs text-[#86a3a3] mt-1">
              Devices exhibiting accelerated thermal leakage drift, 24h-to-96h Iddq divergence, or statistical lot outlier status.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('components')}
              className="btn-outline text-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Full Component Registry</span>
            </button>
            <button
              onClick={onExportCSV}
              className="btn-danger text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export {anomalies.length} Anomaly Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Anomaly Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="console-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#ef7778]/10 border border-[#ef7778]/30 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#ef7778]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#e7f1ef]">Thermal Drift Outliers</div>
              <div className="text-[11px] text-[#86a3a3]">
                {anomalies.filter((a) => (a.iddq_drift_24_to_96 || 0) > 1.5).length} units with runaway Iddq slope
              </div>
            </div>
          </div>
        </div>

        <div className="console-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#efb765]/10 border border-[#efb765]/30 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-[#efb765]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#e7f1ef]">Die Junction Leakage</div>
              <div className="text-[11px] text-[#86a3a3]">
                {anomalies.filter((a) => a.leakage_168h_pred > 0.8).length} units exceeding 0.80 µA at 125°C
              </div>
            </div>
          </div>
        </div>

        <div className="console-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#43d6d0]/10 border border-[#43d6d0]/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#43d6d0]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#e7f1ef]">Lot Variance Z-Score</div>
              <div className="text-[11px] text-[#86a3a3]">
                {anomalies.filter((a) => Math.abs(a.batch_iddq_zscore || 0) > 2.5).length} units beyond 2.5σ lot deviation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Anomalous Devices Table */}
      <div className="console-card">
        <div className="p-4 border-b border-[#203942] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#86a3a3]" />
            <input
              type="text"
              placeholder="Search anomalous DUT ID or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#12262e] border border-[#203942] rounded px-3 py-1 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0] w-64"
            />
          </div>

          <div className="text-xs text-[#86a3a3]">
            Showing <span className="text-[#ef7778] font-mono-num font-bold">{filteredAnomalies.length}</span> anomalous units
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Component ID</th>
                <th>Batch</th>
                <th>Anomaly Score</th>
                <th>Risk</th>
                <th>Pred Iddq 168h</th>
                <th>Pred Leakage 168h</th>
                <th>Pred Delay 168h</th>
                <th>Primary Root Cause</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnomalies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#86a3a3]">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-[#70d3a1] opacity-60" />
                    <div>No critical anomalous components detected in this filter.</div>
                  </td>
                </tr>
              ) : (
                filteredAnomalies.map((comp) => (
                  <tr
                    key={comp.component_id}
                    className="hover:bg-[#12262e]/80 cursor-pointer"
                    onClick={() => onSelectComponent(comp)}
                  >
                    <td className="font-mono-num font-semibold text-[#ef7778]">
                      {comp.component_id}
                    </td>
                    <td className="font-mono-num text-[#86a3a3]">
                      {comp.batch_id}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#12262e] rounded-xs overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, comp.anomaly_score)}%` }}
                            className="h-full bg-[#ef7778]"
                          />
                        </div>
                        <span className="font-mono-num text-xs font-bold text-[#ef7778]">
                          {comp.anomaly_score.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-high">HIGH</span>
                    </td>
                    <td className="font-mono-num text-[#e7f1ef]">
                      {comp.iddq_168h_pred.toFixed(2)} µA
                    </td>
                    <td className="font-mono-num text-[#e7f1ef]">
                      {comp.leakage_168h_pred.toFixed(3)} µA
                    </td>
                    <td className="font-mono-num text-[#e7f1ef]">
                      {comp.delay_168h_pred.toFixed(3)} ns
                    </td>
                    <td className="text-xs text-[#efb765] max-w-xs truncate">
                      {comp.anomaly_reasons?.[0] || 'Accelerated burn-in drift'}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComponent(comp);
                        }}
                        className="text-[#43d6d0] hover:underline text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

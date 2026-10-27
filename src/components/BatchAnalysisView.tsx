import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Layers,
  AlertTriangle,
  Activity,
  CheckCircle,
  ShieldAlert,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ComponentRecord, RiskLevel } from '../types';

interface BatchAnalysisViewProps {
  components: ComponentRecord[];
  onSelectComponent: (comp: ComponentRecord) => void;
}

export const BatchAnalysisView: React.FC<BatchAnalysisViewProps> = ({
  components,
  onSelectComponent
}) => {
  // Extract all distinct batches
  const batches = useMemo(() => {
    const set = new Set(components.map((c) => c.batch_id));
    return Array.from(set).sort();
  }, [components]);

  const [selectedBatch, setSelectedBatch] = useState<string>(
    batches[0] || 'LOT-X701'
  );

  // Components belonging to the selected batch
  const batchComponents = useMemo(() => {
    return components.filter((c) => c.batch_id === selectedBatch);
  }, [components, selectedBatch]);

  // Calculations for selected batch
  const batchTotal = batchComponents.length;
  const highRiskUnits = batchComponents.filter((c) => c.risk === 'HIGH').length;
  const mediumRiskUnits = batchComponents.filter((c) => c.risk === 'MEDIUM').length;
  const lowRiskUnits = batchComponents.filter((c) => c.risk === 'LOW').length;

  const totalScore = batchComponents.reduce((acc, c) => acc + c.anomaly_score, 0);
  const avgAnomaly = batchTotal > 0 ? (totalScore / batchTotal).toFixed(1) : '0.0';

  const lowPct = batchTotal > 0 ? Math.round((lowRiskUnits / batchTotal) * 100) : 0;
  const medPct = batchTotal > 0 ? Math.round((mediumRiskUnits / batchTotal) * 100) : 0;
  const highPct = batchTotal > 0 ? 100 - lowPct - medPct : 0;

  // Mean parametric values for selected batch
  const meanIddq0 = batchTotal > 0 ? (batchComponents.reduce((acc, c) => acc + c.iddq_0h, 0) / batchTotal).toFixed(2) : '0';
  const meanIddq96 = batchTotal > 0 ? (batchComponents.reduce((acc, c) => acc + c.iddq_96h, 0) / batchTotal).toFixed(2) : '0';
  const meanLeak96 = batchTotal > 0 ? (batchComponents.reduce((acc, c) => acc + c.leakage_96h, 0) / batchTotal).toFixed(3) : '0';

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return <span className="badge-high">HIGH</span>;
      case 'MEDIUM':
        return <span className="badge-med">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="badge-low">LOW</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Batch Selector */}
      <div className="console-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#efb765]">
              STATISTICAL LOT SCREENING
            </div>
            <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
              Batch & Wafer Lot Quality Analysis
            </h2>
            <p className="text-xs text-[#86a3a3] mt-1">
              Evaluates wafer-to-wafer drift dispersion, batch outliers, and fabrication lot defect density.
            </p>
          </div>

          {/* Batch Selector Dropdown */}
          <div className="flex items-center gap-2 bg-[#12262e] border border-[#203942] p-2 rounded-xs">
            <span className="text-xs text-[#86a3a3] font-semibold">Select Lot:</span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-[#071217] border border-[#203942] text-[#43d6d0] font-mono-num text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#43d6d0]"
            >
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. 4 KPI Metrics for Selected Batch */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="console-card p-4">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Components in Lot
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#e7f1ef] mt-1">
            {batchTotal}
          </div>
          <div className="text-[10px] text-[#43d6d0] mt-1 flex items-center gap-1">
            <Boxes className="w-3 h-3" />
            <span>Active wafer test sample</span>
          </div>
        </div>

        <div className="console-card p-4">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            High-Risk Components
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#ef7778] mt-1">
            {highRiskUnits}
          </div>
          <div className="text-[10px] text-[#ef7778] mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{highPct}% of selected lot</span>
          </div>
        </div>

        <div className="console-card p-4">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Avg Anomaly Score
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#efb765] mt-1">
            {avgAnomaly}%
          </div>
          <div className="text-[10px] text-[#86a3a3] mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#efb765]" />
            <span>Batch drift density</span>
          </div>
        </div>

        <div className="console-card p-4">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Nominal Iddq (96h)
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#70d3a1] mt-1">
            {meanIddq96} <span className="text-xs text-[#86a3a3]">µA</span>
          </div>
          <div className="text-[10px] text-[#70d3a1] mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Mean leakage: {meanLeak96} µA</span>
          </div>
        </div>
      </div>

      {/* 3. Batch Risk Distribution Breakdown */}
      <div className="console-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#203942] pb-3">
          <div>
            <div className="text-xs font-semibold text-[#e7f1ef]">
              Risk Distribution for Lot {selectedBatch}
            </div>
            <div className="text-[11px] text-[#86a3a3]">
              LOW: {lowRiskUnits} ({lowPct}%) | MEDIUM: {mediumRiskUnits} ({medPct}%) | HIGH: {highRiskUnits} ({highPct}%)
            </div>
          </div>
          <span className="badge-blue font-mono-num">{selectedBatch}</span>
        </div>

        {/* Proportional Stack Bar */}
        <div className="h-3 w-full bg-[#12262e] rounded-xs flex overflow-hidden border border-[#203942]">
          <div style={{ width: `${lowPct}%` }} className="bg-[#70d3a1] h-full" title={`LOW: ${lowPct}%`} />
          <div style={{ width: `${medPct}%` }} className="bg-[#efb765] h-full" title={`MEDIUM: ${medPct}%`} />
          <div style={{ width: `${highPct}%` }} className="bg-[#ef7778] h-full" title={`HIGH: ${highPct}%`} />
        </div>
      </div>

      {/* 4. Batch Component Table */}
      <div className="console-card">
        <div className="console-card-header flex items-center justify-between">
          <span>Components in {selectedBatch} ({batchTotal} Units)</span>
          <span className="text-[#86a3a3] font-normal text-[11px]">Click row to inspect</span>
        </div>

        <div className="overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Component ID</th>
                <th>Iddq (0h)</th>
                <th>Iddq (96h)</th>
                <th>Pred Iddq (168h)</th>
                <th>Pred Leakage (168h)</th>
                <th>Anomaly Score</th>
                <th>Risk</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {batchComponents.map((comp) => (
                <tr
                  key={comp.component_id}
                  className="hover:bg-[#12262e]/80 cursor-pointer"
                  onClick={() => onSelectComponent(comp)}
                >
                  <td className="font-mono-num font-semibold text-[#43d6d0]">
                    {comp.component_id}
                  </td>
                  <td className="font-mono-num">{comp.iddq_0h.toFixed(2)} µA</td>
                  <td className="font-mono-num">{comp.iddq_96h.toFixed(2)} µA</td>
                  <td className="font-mono-num text-[#43d6d0] font-semibold">
                    {comp.iddq_168h_pred.toFixed(2)} µA
                  </td>
                  <td className="font-mono-num">{comp.leakage_168h_pred.toFixed(3)} µA</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-[#12262e] rounded-xs overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, comp.anomaly_score)}%` }}
                          className={`h-full ${
                            comp.risk === 'HIGH'
                              ? 'bg-[#ef7778]'
                              : comp.risk === 'MEDIUM'
                              ? 'bg-[#efb765]'
                              : 'bg-[#70d3a1]'
                          }`}
                        />
                      </div>
                      <span className="font-mono-num text-xs">
                        {comp.anomaly_score.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td>{getRiskBadge(comp.risk)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

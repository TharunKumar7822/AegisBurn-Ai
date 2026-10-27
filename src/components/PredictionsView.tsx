import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Activity,
  Zap,
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle,
  Eye
} from 'lucide-react';
import { ComponentRecord, RiskLevel } from '../types';

interface PredictionsViewProps {
  components: ComponentRecord[];
  onSelectComponent: (comp: ComponentRecord) => void;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  components,
  onSelectComponent
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(
    components[0]?.component_id || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeComp = useMemo(() => {
    return (
      components.find((c) => c.component_id === selectedCompId) ||
      components[0]
    );
  }, [components, selectedCompId]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return components.slice(0, 50);
    const q = searchQuery.toLowerCase().trim();
    return components.filter(
      (c) =>
        c.component_id.toLowerCase().includes(q) ||
        c.batch_id.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [components, searchQuery]);

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
      {/* 1. Header */}
      <div className="console-card p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
          PHYSICS OF FAILURE ENGINE
        </div>
        <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
          168-Hour Burn-in Parametric Trajectory Predictor
        </h2>
        <p className="text-xs text-[#86a3a3] mt-1">
          Combines empirical 0h, 24h, and 96h chamber measurements with multivariate Random Forest regressors to forecast end-of-life degradation at 168 hours.
        </p>
      </div>

      {/* 2. Active Component Trajectory Visualization */}
      {activeComp && (
        <div className="console-card p-6 border-l-4 border-l-[#43d6d0] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#203942] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-num text-lg font-bold text-[#43d6d0]">
                  {activeComp.component_id}
                </span>
                <span className="text-[#86a3a3]">|</span>
                <span className="font-mono-num text-xs text-[#86a3a3]">
                  Lot: {activeComp.batch_id}
                </span>
                <span className="text-[#86a3a3]">|</span>
                <span className="text-xs text-[#86a3a3]">
                  Part: {activeComp.part_type || 'Semiconductor IC'}
                </span>
              </div>
              <div className="text-xs text-[#86a3a3] mt-1">
                Stress Conditions: {activeComp.test_temperature_c || 125}°C | {activeComp.voltage_v || 1.2}V VDD
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-[#86a3a3] uppercase tracking-wider">
                  Anomaly Score
                </div>
                <div className="text-base font-mono-num font-bold text-[#e7f1ef]">
                  {activeComp.anomaly_score.toFixed(1)}%
                </div>
              </div>
              {getRiskBadge(activeComp.risk)}
            </div>
          </div>

          {/* 3 Parametric Channels (Iddq, Leakage, Delay) Trajectory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Channel 1: Iddq Trajectory */}
            <div className="p-4 bg-[#12262e] border border-[#203942] rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#43d6d0]">
                  Iddq Current (µA)
                </span>
                <span className="text-[10px] text-[#86a3a3] font-mono-num">
                  Δ +{((activeComp.iddq_168h_pred - activeComp.iddq_0h)).toFixed(2)} µA
                </span>
              </div>

              {/* Trajectory Step Points */}
              <div className="grid grid-cols-4 gap-1 text-center font-mono-num text-xs">
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.iddq_0h.toFixed(2)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.iddq_24h.toFixed(2)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.iddq_96h.toFixed(2)}</div>
                </div>
                <div className="p-1.5 bg-[#071217] rounded-xs border border-[#43d6d0]/60">
                  <div className="text-[9px] text-[#43d6d0] font-bold">168h (Pred)</div>
                  <div className="text-[#43d6d0] font-bold mt-0.5">{activeComp.iddq_168h_pred.toFixed(2)}</div>
                </div>
              </div>

              <div className="text-[10px] text-[#86a3a3]">
                Drift Rate: {((activeComp.iddq_96h - activeComp.iddq_24h) / 72).toFixed(4)} µA/hr
              </div>
            </div>

            {/* Channel 2: Leakage Current Trajectory */}
            <div className="p-4 bg-[#12262e] border border-[#203942] rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#efb765]">
                  Junction Leakage (µA)
                </span>
                <span className="text-[10px] text-[#86a3a3] font-mono-num">
                  Δ +{((activeComp.leakage_168h_pred - activeComp.leakage_0h)).toFixed(3)} µA
                </span>
              </div>

              {/* Trajectory Step Points */}
              <div className="grid grid-cols-4 gap-1 text-center font-mono-num text-xs">
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.leakage_0h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.leakage_24h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.leakage_96h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#071217] rounded-xs border border-[#efb765]/60">
                  <div className="text-[9px] text-[#efb765] font-bold">168h (Pred)</div>
                  <div className="text-[#efb765] font-bold mt-0.5">{activeComp.leakage_168h_pred.toFixed(3)}</div>
                </div>
              </div>

              <div className="text-[10px] text-[#86a3a3]">
                Thermal Acceleration: Arrhenius activation energy Ea ~ 0.7 eV
              </div>
            </div>

            {/* Channel 3: Propagation Delay Trajectory */}
            <div className="p-4 bg-[#12262e] border border-[#203942] rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7eb9ed]">
                  Propagation Delay (ns)
                </span>
                <span className="text-[10px] text-[#86a3a3] font-mono-num">
                  Δ +{((activeComp.delay_168h_pred - activeComp.delay_0h) * 1000).toFixed(0)} ps
                </span>
              </div>

              {/* Trajectory Step Points */}
              <div className="grid grid-cols-4 gap-1 text-center font-mono-num text-xs">
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">0h (Init)</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.delay_0h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">24h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.delay_24h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#0d1c23] rounded-xs border border-[#203942]">
                  <div className="text-[9px] text-[#86a3a3]">96h</div>
                  <div className="text-[#e7f1ef] font-semibold mt-0.5">{activeComp.delay_96h.toFixed(3)}</div>
                </div>
                <div className="p-1.5 bg-[#071217] rounded-xs border border-[#7eb9ed]/60">
                  <div className="text-[9px] text-[#7eb9ed] font-bold">168h (Pred)</div>
                  <div className="text-[#7eb9ed] font-bold mt-0.5">{activeComp.delay_168h_pred.toFixed(3)}</div>
                </div>
              </div>

              <div className="text-[10px] text-[#86a3a3]">
                BTI / Hot-carrier NBTI degradation coefficient: n ≈ 0.25
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Predictions Registry Table */}
      <div className="console-card">
        <div className="p-4 border-b border-[#203942] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#86a3a3]" />
            <input
              type="text"
              placeholder="Search component..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#12262e] border border-[#203942] rounded px-3 py-1 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0] w-64"
            />
          </div>
          <div className="text-xs text-[#86a3a3]">
            Select any component row to view its physical trajectory curve
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Component ID</th>
                <th>Batch</th>
                <th>Pred Iddq 168h</th>
                <th>Pred Leakage 168h</th>
                <th>Pred Delay 168h</th>
                <th>Anomaly</th>
                <th>Risk</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((comp) => (
                <tr
                  key={comp.component_id}
                  className={`hover:bg-[#12262e]/80 cursor-pointer ${
                    comp.component_id === selectedCompId ? 'bg-[#12262e] border-l-2 border-l-[#43d6d0]' : ''
                  }`}
                  onClick={() => setSelectedCompId(comp.component_id)}
                >
                  <td className="font-mono-num font-semibold text-[#43d6d0]">
                    {comp.component_id}
                  </td>
                  <td className="font-mono-num text-[#86a3a3]">
                    {comp.batch_id}
                  </td>
                  <td className="font-mono-num">
                    {comp.iddq_168h_pred.toFixed(2)} µA
                  </td>
                  <td className="font-mono-num">
                    {comp.leakage_168h_pred.toFixed(3)} µA
                  </td>
                  <td className="font-mono-num">
                    {comp.delay_168h_pred.toFixed(3)} ns
                  </td>
                  <td>
                    <span className="font-mono-num text-xs font-semibold">
                      {comp.anomaly_score.toFixed(1)}%
                    </span>
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
                      <span>Details</span>
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

import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Activity,
  Layers,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { DashboardStats, ComponentRecord, RiskLevel, NavPage } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  analysisId: string;
  onNavigate: (page: NavPage, filter?: { risk?: RiskLevel; query?: string }) => void;
  onSelectComponent: (comp: ComponentRecord) => void;
  allComponents: ComponentRecord[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  analysisId,
  onNavigate,
  onSelectComponent,
  allComponents
}) => {
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
    <div className="space-y-6 pb-8">
      {/* 1. Screening Overview Banner */}
      <div className="console-card p-5 border-l-4 border-l-[#43d6d0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
              SCREENING OVERVIEW
            </div>
            <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
              {analysisId} is ready for review
            </h2>
            <p className="text-xs text-[#86a3a3] mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#70d3a1]"></span>
              <span>Live backend dataset analysis active</span>
              <span className="text-[#203942]">|</span>
              <span>Supervised 168h physics & drift modeling complete</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('train-predict')}
              className="btn-outline text-xs"
            >
              <Cpu className="w-4 h-4 text-[#43d6d0]" />
              <span>New Screening Batch</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="btn-cyan text-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 6 KPI Cards (Clickable filtering) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total components */}
        <div
          onClick={() => onNavigate('components')}
          className="console-card p-4 hover:border-[#43d6d0] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Total components
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#e7f1ef] mt-2">
            {stats.total_components.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#43d6d0] mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Screened DUTs</span>
          </div>
        </div>

        {/* Card 2: Normal */}
        <div
          onClick={() => onNavigate('components', { risk: 'LOW' })}
          className="console-card p-4 hover:border-[#70d3a1] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Normal
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#70d3a1] mt-2">
            {stats.normal_count.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#70d3a1] mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{stats.risk_distribution.low_pct}% low risk</span>
          </div>
        </div>

        {/* Card 3: Review */}
        <div
          onClick={() => onNavigate('components', { risk: 'MEDIUM' })}
          className="console-card p-4 hover:border-[#efb765] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Review
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#efb765] mt-2">
            {stats.review_count.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#efb765] mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{stats.risk_distribution.medium_pct}% medium risk</span>
          </div>
        </div>

        {/* Card 4: High risk */}
        <div
          onClick={() => onNavigate('components', { risk: 'HIGH' })}
          className="console-card p-4 hover:border-[#ef7778] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            High risk
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#ef7778] mt-2">
            {stats.high_risk_count.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#ef7778] mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{stats.risk_distribution.high_pct}% critical risk</span>
          </div>
        </div>

        {/* Card 5: Anomalies */}
        <div
          onClick={() => onNavigate('anomaly-center')}
          className="console-card p-4 hover:border-[#ef7778] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Anomalies
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#ef7778] mt-2">
            {stats.anomalies_count.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#ef7778] mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Score ≥ 70%</span>
          </div>
        </div>

        {/* Card 6: Avg anomaly score */}
        <div
          onClick={() => onNavigate('model-performance')}
          className="console-card p-4 hover:border-[#43d6d0] cursor-pointer transition-all duration-200"
        >
          <div className="text-[10px] font-semibold tracking-wider uppercase text-[#86a3a3]">
            Avg anomaly score
          </div>
          <div className="text-2xl font-mono-num font-bold text-[#43d6d0] mt-2">
            {stats.avg_anomaly_score.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#86a3a3] mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#43d6d0]" />
            <span>Fleet baseline</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Risk Distribution & Latest Screening Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="console-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="console-card-header flex items-center justify-between">
              <span>Risk Distribution</span>
              <span className="text-[#43d6d0] font-mono-num">{stats.total_components} Total DUTs</span>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Stacked Risk Proportion Bar */}
              <div className="h-3 w-full bg-[#12262e] rounded-xs flex overflow-hidden border border-[#203942]">
                <div
                  style={{ width: `${stats.risk_distribution.low_pct}%` }}
                  className="bg-[#70d3a1] h-full"
                  title={`LOW: ${stats.risk_distribution.low_pct}%`}
                />
                <div
                  style={{ width: `${stats.risk_distribution.medium_pct}%` }}
                  className="bg-[#efb765] h-full"
                  title={`MEDIUM: ${stats.risk_distribution.medium_pct}%`}
                />
                <div
                  style={{ width: `${stats.risk_distribution.high_pct}%` }}
                  className="bg-[#ef7778] h-full"
                  title={`HIGH: ${stats.risk_distribution.high_pct}%`}
                />
              </div>

              {/* Categorical Details */}
              <div className="space-y-3 pt-1">
                {/* LOW */}
                <div
                  onClick={() => onNavigate('components', { risk: 'LOW' })}
                  className="p-3 bg-[#12262e]/50 border border-[#203942] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#70d3a1] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#70d3a1]"></span>
                    <div>
                      <div className="text-xs font-semibold text-[#e7f1ef]">LOW RISK</div>
                      <div className="text-[10px] text-[#86a3a3]">Normal degradation profile (&lt; 35)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-num text-sm font-bold text-[#70d3a1]">
                      {stats.risk_distribution.low}
                    </div>
                    <div className="text-[10px] text-[#86a3a3] font-mono-num">
                      {stats.risk_distribution.low_pct}%
                    </div>
                  </div>
                </div>

                {/* MEDIUM */}
                <div
                  onClick={() => onNavigate('components', { risk: 'MEDIUM' })}
                  className="p-3 bg-[#12262e]/50 border border-[#203942] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#efb765] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#efb765]"></span>
                    <div>
                      <div className="text-xs font-semibold text-[#e7f1ef]">MEDIUM RISK</div>
                      <div className="text-[10px] text-[#86a3a3]">Review recommended (35 - 69)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-num text-sm font-bold text-[#efb765]">
                      {stats.risk_distribution.medium}
                    </div>
                    <div className="text-[10px] text-[#86a3a3] font-mono-num">
                      {stats.risk_distribution.medium_pct}%
                    </div>
                  </div>
                </div>

                {/* HIGH */}
                <div
                  onClick={() => onNavigate('components', { risk: 'HIGH' })}
                  className="p-3 bg-[#12262e]/50 border border-[#203942] rounded-xs flex items-center justify-between cursor-pointer hover:border-[#ef7778] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef7778]"></span>
                    <div>
                      <div className="text-xs font-semibold text-[#e7f1ef]">HIGH RISK</div>
                      <div className="text-[10px] text-[#86a3a3]">Anomalous drift or lot outlier (≥ 70)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-num text-sm font-bold text-[#ef7778]">
                      {stats.risk_distribution.high}
                    </div>
                    <div className="text-[10px] text-[#86a3a3] font-mono-num">
                      {stats.risk_distribution.high_pct}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#071217]/50 border-t border-[#203942] text-[11px] text-[#86a3a3] flex items-center justify-between">
            <span>Thresholds: Low &lt; 35 | High ≥ 70</span>
            <button
              onClick={() => onNavigate('settings')}
              className="text-[#43d6d0] hover:underline flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Adjust</span>
            </button>
          </div>
        </div>

        {/* Latest Screening Results Table */}
        <div className="console-card lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="console-card-header flex items-center justify-between">
              <span>Latest Screening Results</span>
              <button
                onClick={() => onNavigate('components')}
                className="text-[#43d6d0] hover:text-[#5ce0da] text-[11px] flex items-center gap-1 normal-case font-normal"
              >
                <span>View all {stats.total_components}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="eng-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Batch</th>
                    <th>Anomaly</th>
                    <th>Risk</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.latest_results.map((res) => {
                    const fullRecord = allComponents.find(c => c.component_id === res.id);
                    return (
                      <tr
                        key={res.id}
                        className="cursor-pointer"
                        onClick={() => {
                          if (fullRecord) onSelectComponent(fullRecord);
                        }}
                      >
                        <td className="font-mono-num font-semibold text-[#43d6d0]">
                          {res.id}
                        </td>
                        <td className="font-mono-num text-[#86a3a3]">
                          {res.batch}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#12262e] rounded-xs overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, res.anomaly)}%` }}
                                className={`h-full ${
                                  res.risk === 'HIGH'
                                    ? 'bg-[#ef7778]'
                                    : res.risk === 'MEDIUM'
                                    ? 'bg-[#efb765]'
                                    : 'bg-[#70d3a1]'
                                }`}
                              />
                            </div>
                            <span className="font-mono-num text-xs">
                              {res.anomaly.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td>{getRiskBadge(res.risk)}</td>
                        <td className="text-right">
                          <span className="text-[11px] text-[#43d6d0] hover:underline">
                            Inspect
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-[#071217]/50 border-t border-[#203942] flex items-center justify-between text-[11px]">
            <span className="text-[#86a3a3]">
              Showing top priority semiconductor devices
            </span>
            <button
              onClick={() => onNavigate('components')}
              className="text-[#43d6d0] hover:underline"
            >
              Browse Full Inventory →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Quick Nav / Workflow shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('anomaly-center')}
          className="console-card p-4 hover:border-[#ef7778] cursor-pointer transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded bg-[#ef7778]/10 border border-[#ef7778]/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-[#ef7778]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#e7f1ef]">Anomaly Center</div>
            <div className="text-[11px] text-[#86a3a3] mt-0.5">
              Review {stats.anomalies_count} critical outlier units with high drift signatures.
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('predictions')}
          className="console-card p-4 hover:border-[#43d6d0] cursor-pointer transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded bg-[#43d6d0]/10 border border-[#43d6d0]/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-[#43d6d0]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#e7f1ef]">168-Hour Predictor</div>
            <div className="text-[11px] text-[#86a3a3] mt-0.5">
              Simulate parametric degradation curves from 0h through 168h burn-in.
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('batch-analysis')}
          className="console-card p-4 hover:border-[#efb765] cursor-pointer transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded bg-[#efb765]/10 border border-[#efb765]/30 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-[#efb765]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#e7f1ef]">Batch Lot Analysis</div>
            <div className="text-[11px] text-[#86a3a3] mt-0.5">
              Cross-wafer variance, batch statistical distributions, and yield insights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

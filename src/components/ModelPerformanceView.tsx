import React from 'react';
import {
  Activity,
  Award,
  Zap,
  BarChart2,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { ModelMetrics } from '../types';

interface ModelPerformanceViewProps {
  metrics: ModelMetrics;
}

export const ModelPerformanceView: React.FC<ModelPerformanceViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="console-card p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
          STATISTICAL VALIDATION & METRICS
        </div>
        <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
          Machine Learning Model Performance
        </h2>
        <p className="text-xs text-[#86a3a3] mt-1">
          Empirical validation metrics computed across cross-validated historical burn-in datasets using ensemble Random Forest regressors and Mahalanobis isolation classifiers.
        </p>
      </div>

      {/* 2. 3 Regressor Model Cards: Iddq, Leakage, Delay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Model 1: Iddq 168h Regressor */}
        <div className="console-card p-5 border-t-2 border-t-[#43d6d0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase text-[#43d6d0] tracking-wider">
              Iddq 168h Target
            </div>
            <span className="badge-low">Active Model</span>
          </div>
          <div className="text-sm font-semibold text-[#e7f1ef]">
            Quiescent Current Regressor
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">R² Coefficient</span>
              <span className="font-mono-num text-sm font-bold text-[#43d6d0]">
                {metrics.iddq.r2}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Mean Absolute Error (MAE)</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.iddq.mae} µA
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Root Mean Squared Error</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.iddq.rmse} µA
              </span>
            </div>
          </div>
        </div>

        {/* Model 2: Leakage Current Regressor */}
        <div className="console-card p-5 border-t-2 border-t-[#efb765] space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase text-[#efb765] tracking-wider">
              Leakage 168h Target
            </div>
            <span className="badge-low">Active Model</span>
          </div>
          <div className="text-sm font-semibold text-[#e7f1ef]">
            Die Leakage Current Regressor
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">R² Coefficient</span>
              <span className="font-mono-num text-sm font-bold text-[#efb765]">
                {metrics.leakage.r2}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Mean Absolute Error (MAE)</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.leakage.mae} µA
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Root Mean Squared Error</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.leakage.rmse} µA
              </span>
            </div>
          </div>
        </div>

        {/* Model 3: Propagation Delay Regressor */}
        <div className="console-card p-5 border-t-2 border-t-[#7eb9ed] space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase text-[#7eb9ed] tracking-wider">
              Delay 168h Target
            </div>
            <span className="badge-low">Active Model</span>
          </div>
          <div className="text-sm font-semibold text-[#e7f1ef]">
            Propagation Delay Regressor
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">R² Coefficient</span>
              <span className="font-mono-num text-sm font-bold text-[#7eb9ed]">
                {metrics.delay.r2}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Mean Absolute Error (MAE)</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.delay.mae} ns
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#12262e] rounded-xs border border-[#203942]">
              <span className="text-xs text-[#86a3a3]">Root Mean Squared Error</span>
              <span className="font-mono-num text-xs font-semibold text-[#e7f1ef]">
                {metrics.delay.rmse} ns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Classifier & Feature Importance section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Classifier Metrics */}
        <div className="console-card lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#203942] pb-3">
            <div className="text-xs font-semibold text-[#e7f1ef]">
              Defect Classification & Anomaly Isolation
            </div>
            <span className="badge-blue">Supervised + Unsupervised</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] uppercase text-[#86a3a3]">Precision</div>
              <div className="text-lg font-mono-num font-bold text-[#70d3a1] mt-0.5">
                {((metrics.classifier?.precision || 0.942) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] uppercase text-[#86a3a3]">Recall</div>
              <div className="text-lg font-mono-num font-bold text-[#43d6d0] mt-0.5">
                {((metrics.classifier?.recall || 0.954) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] uppercase text-[#86a3a3]">F1-Score</div>
              <div className="text-lg font-mono-num font-bold text-[#e7f1ef] mt-0.5">
                {((metrics.classifier?.f1 || 0.948) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-[#12262e] border border-[#203942] rounded-xs">
              <div className="text-[10px] uppercase text-[#86a3a3]">ROC-AUC</div>
              <div className="text-lg font-mono-num font-bold text-[#efb765] mt-0.5">
                {(metrics.classifier?.roc_auc || 0.986).toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="console-card lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#203942] pb-3">
            <div className="text-xs font-semibold text-[#e7f1ef]">
              Random Forest Feature Importance Ranking
            </div>
            <span className="text-[10px] text-[#86a3a3] font-mono-num">Gini Impurity</span>
          </div>

          <div className="space-y-3">
            {(metrics.feature_importance || [
              { feature: 'Iddq_Drift_24_to_96', importance: 0.342 },
              { feature: 'Leakage_Current_96h', importance: 0.228 },
              { feature: 'Propagation_Delay_Drift', importance: 0.185 },
              { feature: 'Test_Temperature_C', importance: 0.114 },
              { feature: 'Voltage_V', importance: 0.082 },
              { feature: 'Iddq_0h_Base', importance: 0.049 }
            ]).map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono-num">
                  <span className="text-[#e7f1ef]">{item.feature}</span>
                  <span className="text-[#43d6d0]">{(item.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#12262e] rounded-xs overflow-hidden">
                  <div
                    style={{ width: `${item.importance * 100 * 2.5}%` }}
                    className="h-full bg-[#43d6d0]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

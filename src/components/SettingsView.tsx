import React, { useState, useEffect } from 'react';
import {
  Save,
  User,
  Sliders,
  Shield,
  RotateCcw,
  CheckCircle,
  Database,
  Lock,
  Cpu
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => Promise<void>;
  showToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  showToast
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      showToast('success', 'Settings Saved', 'Configuration and risk thresholds updated successfully.');
    } catch (err: any) {
      showToast('error', 'Save Failed', err.message || 'Could not update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      user_name: 'R. Kumar',
      email: 'r.kumar@semicorp.com',
      low_risk_threshold: 35,
      medium_risk_threshold: 70,
      missing_data_policy: 'impute_mean',
      model_profile: 'balanced'
    });
    showToast('info', 'Reset Defaults', 'Settings restored to factory defaults.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="console-card p-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
          SYSTEM CONFIGURATION
        </div>
        <h2 className="text-xl md:text-2xl font-serif-heading text-[#e7f1ef] mt-1">
          Console & Model Settings
        </h2>
        <p className="text-xs text-[#86a3a3] mt-1">
          Configure screening thresholds, data imputation policies, and operator profile metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: User Profile */}
        <div className="console-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#203942] pb-3">
            <User className="w-4 h-4 text-[#43d6d0]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e7f1ef]">
              Operator Profile
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86a3a3] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-2 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#86a3a3] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-2 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Anomaly Risk Thresholds */}
        <div className="console-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#203942] pb-3">
            <Sliders className="w-4 h-4 text-[#efb765]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e7f1ef]">
              Risk Classification Thresholds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#86a3a3]">Low Risk Cutoff Score (&lt;)</span>
                <span className="font-mono-num font-bold text-[#70d3a1]">{formData.low_risk_threshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={formData.low_risk_threshold}
                onChange={(e) => setFormData({ ...formData, low_risk_threshold: Number(e.target.value) })}
                className="w-full accent-[#70d3a1]"
              />
              <p className="text-[10px] text-[#86a3a3] mt-1">
                Units below this score pass screening as normal without inspection.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#86a3a3]">High Risk Cutoff Score (≥)</span>
                <span className="font-mono-num font-bold text-[#ef7778]">{formData.medium_risk_threshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={formData.medium_risk_threshold}
                onChange={(e) => setFormData({ ...formData, medium_risk_threshold: Number(e.target.value) })}
                className="w-full accent-[#ef7778]"
              />
              <p className="text-[10px] text-[#86a3a3] mt-1">
                Units above this score are flagged for critical quarantine and defect review.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: ML Imputation & Engine Policy */}
        <div className="console-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#203942] pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#7eb9ed]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#e7f1ef]">
                Python Machine Learning Backend & Engine Policy
              </span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[#43d6d0]/10 text-[#43d6d0] border border-[#43d6d0]/30 rounded">
              Python 3.11 / FastAPI / Scikit-Learn
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86a3a3] mb-1">
                Missing-Data Policy (NumPy/Pandas Imputation)
              </label>
              <select
                value={formData.missing_data_policy}
                onChange={(e) => setFormData({ ...formData, missing_data_policy: e.target.value })}
                className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-2 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
              >
                <option value="impute_mean">Mean / Median Drift Imputation (Pandas)</option>
                <option value="interpolate">Spline Polynomial Interpolation (SciPy)</option>
                <option value="drop">Strict Drop Incomplete Rows</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#86a3a3] mb-1">
                Model Profile (Scikit-Learn Ensemble)
              </label>
              <select
                value={formData.model_profile}
                onChange={(e) => setFormData({ ...formData, model_profile: e.target.value })}
                className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-2 text-xs text-[#e7f1ef] focus:outline-none focus:border-[#43d6d0]"
              >
                <option value="balanced">Scikit-Learn Random Forest + Isolation Forest (Standard)</option>
                <option value="high_precision">GradientBoosting + Isolation Forest (High Precision)</option>
                <option value="aggressive_quarantine">Aggressive Quarantine (AEC-Q100 Automotive Zero-Defect)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between p-4 bg-[#0d1c23] border border-[#203942] rounded-xs">
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline text-xs text-[#86a3a3]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-cyan"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

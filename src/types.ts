/**
 * AegisBurn AI - Type Definitions
 * Semiconductor Burn-in Screening System
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ComponentStatus = 'Normal' | 'Review' | 'Anomalous';

export interface ComponentRecord {
  component_id: string;
  batch_id: string;
  part_type?: string;
  test_temperature_c?: number;
  voltage_v?: number;

  // Iddq measurements
  iddq_0h: number;
  iddq_24h: number;
  iddq_96h: number;
  iddq_168h_pred: number;
  iddq_168h_actual?: number;

  // Leakage Current measurements
  leakage_0h: number;
  leakage_24h: number;
  leakage_96h: number;
  leakage_168h_pred: number;
  leakage_168h_actual?: number;

  // Propagation Delay measurements
  delay_0h: number;
  delay_24h: number;
  delay_96h: number;
  delay_168h_pred: number;
  delay_168h_actual?: number;

  // Derived drift & statistics
  iddq_drift_0_to_96?: number;
  iddq_drift_24_to_96?: number;
  leakage_drift_0_to_96?: number;
  delay_drift_0_to_96?: number;
  batch_iddq_zscore?: number;
  batch_leakage_zscore?: number;

  // Classification & Risk
  anomaly_score: number; // 0 to 100
  risk: RiskLevel;
  status: ComponentStatus;
  anomaly_reasons?: string[];
  defect_label?: number;
}

export interface DashboardStats {
  total_components: number;
  normal_count: number;
  review_count: number;
  high_risk_count: number;
  anomalies_count: number;
  avg_anomaly_score: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    low_pct: number;
    medium_pct: number;
    high_pct: number;
  };
  latest_results: Array<{
    id: string;
    batch: string;
    anomaly: number;
    risk: RiskLevel;
  }>;
}

export interface ModelMetricDetails {
  mae: number;
  rmse: number;
  r2: number;
}

export interface ModelMetrics {
  iddq: ModelMetricDetails;
  leakage: ModelMetricDetails;
  delay: ModelMetricDetails;
  classifier?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
  feature_importance?: Array<{ feature: string; importance: number }>;
}

export interface ColumnMapping {
  component_id: string;
  batch_id: string;
  part_type: string;
  test_temperature_c: string;
  voltage_v: string;
  iddq_0h: string;
  iddq_24h: string;
  iddq_96h: string;
  iddq_168h?: string;
  leakage_0h: string;
  leakage_24h: string;
  leakage_96h: string;
  leakage_168h?: string;
  delay_0h: string;
  delay_24h: string;
  delay_96h: string;
  delay_168h?: string;
  defect_label?: string;
}

export interface ValidationItem {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'pending';
  details?: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  timestamp: string;
  training_filename: string;
  new_filename: string;
  dashboard: DashboardStats;
  results: ComponentRecord[];
  model_metrics: ModelMetrics;
  mapping: ColumnMapping;
  validation: ValidationItem[];
}

export interface HistoryItem {
  analysis_id: string;
  training_file: string;
  new_file: string;
  timestamp: string;
  components: number;
  high_risk: number;
  status: string;
  avg_anomaly_score?: number;
}

export interface AnalysisHistoryItem {
  id: string;
  analysis_id?: string;
  timestamp: string;
  total_components: number;
  high_risk_count: number;
  status: string;
}

export interface UserSettings {
  user_name: string;
  email: string;
  low_risk_threshold: number;
  medium_risk_threshold: number;
  missing_data_policy: string;
  model_profile: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export interface SettingsConfig {
  user_name: string;
  email: string;
  role: string;
  low_threshold: number; // default: 35
  medium_threshold: number; // default: 70
  missing_data_policy: 'Impute Mean' | 'Forward Fill' | 'Reject Record' | string;
  default_model_profile: 'Random Forest High Precision' | 'Fast Gradient Ensemble' | 'Balanced Burn-in Model' | 'Scikit-Learn Random Forest + Isolation Forest' | string;
  auto_export_reports: boolean;
}

export type NavPage =
  | 'dashboard'
  | 'train-predict'
  | 'components'
  | 'anomaly-center'
  | 'predictions'
  | 'batch-analysis'
  | 'model-performance'
  | 'reports'
  | 'settings';

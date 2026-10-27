import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/Toast';
import { DashboardView } from './components/DashboardView';
import { TrainPredictView } from './components/TrainPredictView';
import { ComponentsView } from './components/ComponentsView';
import { AnomalyCenterView } from './components/AnomalyCenterView';
import { PredictionsView } from './components/PredictionsView';
import { BatchAnalysisView } from './components/BatchAnalysisView';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { HistoryModal } from './components/HistoryModal';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { SignOutModal } from './components/SignOutModal';
import {
  NavPage,
  AnalysisResponse,
  ComponentRecord,
  UserSettings,
  ToastMessage,
  RiskLevel
} from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    user_name: 'R. Kumar',
    email: 'r.kumar@semicorp.com',
    low_risk_threshold: 35,
    medium_risk_threshold: 70,
    missing_data_policy: 'impute_mean',
    model_profile: 'balanced'
  });

  // Filters & State
  const [componentFilterRisk, setComponentFilterRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [componentSearchQuery, setComponentSearchQuery] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentRecord | null>(null);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSignedOut, setIsSignedOut] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: 'success' | 'warning' | 'error' | 'info',
    title: string,
    message: string
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: Date.now() }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load initial demo analysis & settings
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [demoRes, settingsRes] = await Promise.all([
          fetch('/api/demo'),
          fetch('/api/settings')
        ]);

        if (demoRes.ok) {
          const demoJson = await demoRes.json();
          setAnalysisData(demoJson);
        }

        if (settingsRes.ok) {
          const settingsJson = await settingsRes.json();
          setSettings(settingsJson);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
        addToast('error', 'Network Warning', 'Using cached benchmark data.');
      }
    };

    loadInitialData();
  }, []);

  const handleNavigate = (
    page: NavPage,
    filter?: { risk?: RiskLevel; query?: string }
  ) => {
    if (filter) {
      if (filter.risk) setComponentFilterRisk(filter.risk);
      if (filter.query) setComponentSearchQuery(filter.query);
    } else {
      // Reset filter defaults when normal navigation occurs
      if (page === 'components') {
        setComponentFilterRisk('ALL');
        setComponentSearchQuery('');
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSettings = async (newSettings: UserSettings) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (res.ok) {
      const saved = await res.json();
      setSettings(saved);
    } else {
      throw new Error('Failed to save settings to server');
    }
  };

  const handleExportCSV = () => {
    if (!analysisData || !analysisData.results) return;
    const csv = Papa.unparse(analysisData.results);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisBurn_Analysis_${analysisData.analysis_id.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Export Completed', 'CSV file downloaded successfully.');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#071217] text-[#e7f1ef] font-sans antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSignOut={() => setIsSignedOut(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          currentPage={currentPage}
          analysisId={analysisData?.analysis_id || 'ANALYSIS-2026-0830-492'}
          activeCount={analysisData?.dashboard.total_components || 1000}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onSignOut={() => setIsSignedOut(true)}
          userName={settings.user_name}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {analysisData ? (
            <>
              {currentPage === 'dashboard' && (
                <DashboardView
                  stats={analysisData.dashboard}
                  analysisId={analysisData.analysis_id}
                  onNavigate={handleNavigate}
                  onSelectComponent={setSelectedComponent}
                  allComponents={analysisData.results}
                />
              )}

              {currentPage === 'train-predict' && (
                <TrainPredictView
                  onAnalysisCompleted={(newAnalysis) => {
                    setAnalysisData(newAnalysis);
                  }}
                  onNavigate={handleNavigate}
                  showToast={addToast}
                />
              )}

              {currentPage === 'components' && (
                <ComponentsView
                  components={analysisData.results}
                  initialRiskFilter={componentFilterRisk}
                  initialSearchQuery={componentSearchQuery}
                  onSelectComponent={setSelectedComponent}
                  onExportCSV={handleExportCSV}
                />
              )}

              {currentPage === 'anomaly-center' && (
                <AnomalyCenterView
                  components={analysisData.results}
                  onSelectComponent={setSelectedComponent}
                  onNavigate={handleNavigate}
                  onExportCSV={handleExportCSV}
                />
              )}

              {currentPage === 'predictions' && (
                <PredictionsView
                  components={analysisData.results}
                  onSelectComponent={setSelectedComponent}
                />
              )}

              {currentPage === 'batch-analysis' && (
                <BatchAnalysisView
                  components={analysisData.results}
                  onSelectComponent={setSelectedComponent}
                />
              )}

              {currentPage === 'model-performance' && (
                <ModelPerformanceView metrics={analysisData.model_metrics} />
              )}

              {currentPage === 'reports' && (
                <ReportsView
                  analysis={analysisData}
                  onExportCSV={handleExportCSV}
                  showToast={addToast}
                />
              )}

              {currentPage === 'settings' && (
                <SettingsView
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  showToast={addToast}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-[#86a3a3] text-sm">
              <div className="text-center space-y-2">
                <div className="w-6 h-6 border-2 border-[#43d6d0] border-t-transparent rounded-full animate-spin mx-auto" />
                <div>Booting AegisBurn AI Core Engine...</div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Global Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* 4. Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectAnalysis={(item) => {
          if (item.analysis_id) {
            fetch('/api/demo')
              .then((r) => r.json())
              .then((d) => setAnalysisData(d));
          }
        }}
        showToast={addToast}
      />

      <ComponentDetailModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      <SignOutModal
        isOpen={isSignedOut}
        settings={settings}
        onUnlock={() => {
          setIsSignedOut(false);
          addToast('info', 'Session Resumed', `Welcome back, ${settings.user_name}`);
        }}
      />
    </div>
  );
}

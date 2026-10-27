import React, { useState } from 'react';
import { Bell, Menu, User, Sparkles, Check, FileSpreadsheet } from 'lucide-react';
import { NavPage } from '../types';

interface TopBarProps {
  analysisId: string;
  currentPage: NavPage;
  userName: string;
  onOpenMobileMenu: () => void;
  onRunDemo: () => void;
  isLoading?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  analysisId,
  currentPage,
  userName,
  onOpenMobileMenu,
  onRunDemo,
  isLoading
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const formatPageTitle = (page: NavPage) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard';
      case 'train-predict':
        return 'Train & Predict Workflow';
      case 'components':
        return 'Component Inventory';
      case 'anomaly-center':
        return 'Anomaly Center';
      case 'predictions':
        return '168-Hour Predictor';
      case 'batch-analysis':
        return 'Batch Lot Analytics';
      case 'model-performance':
        return 'Model Performance & Physics';
      case 'reports':
        return 'Screening Reports & Export';
      case 'settings':
        return 'System Settings';
      default:
        return 'Screening System';
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Batch Analysis Finished',
      time: '3m ago',
      desc: `${analysisId} completed with 28 high-risk anomaly flags.`,
      unread: true
    },
    {
      id: 2,
      title: 'Model Retrained',
      time: '24m ago',
      desc: 'RandomForest 168h Regressor reached R² = 0.948.',
      unread: true
    },
    {
      id: 3,
      title: 'Temperature Chamber Stable',
      time: '1h ago',
      desc: 'Burn-in oven #4 calibrated to 125.0°C ± 0.2°C.',
      unread: true
    }
  ];

  return (
    <header className="h-14 bg-[#0d1c23] border-b border-[#203942] px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left side: Mobile menu & Contextual analysis title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-[#86a3a3] hover:text-[#e7f1ef] p-1.5 rounded"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[10px] tracking-widest uppercase font-semibold text-[#43d6d0] flex items-center gap-1.5">
            <span>{analysisId || 'ANALYSIS #1042'}</span>
            <span className="text-[#86a3a3]">/</span>
            <span className="text-[#86a3a3]">LIVE WORKSPACE</span>
          </div>
          <h1 className="text-sm md:text-base font-semibold text-[#e7f1ef] leading-tight">
            {formatPageTitle(currentPage)}
          </h1>
        </div>
      </div>

      {/* Right side: Actions, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Re-run button */}
        <button
          onClick={onRunDemo}
          disabled={isLoading}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#12262e] hover:bg-[#1b7778]/30 border border-[#203942] hover:border-[#43d6d0] text-[#43d6d0] text-xs rounded transition-colors"
          title="Reload reference burn-in dataset screening"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Processing...' : 'Run Benchmark'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#86a3a3] hover:text-[#e7f1ef] hover:bg-[#12262e] rounded relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ef7778] text-[#071217] text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1c23] border border-[#203942] rounded shadow-2xl z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-[#203942] flex items-center justify-between text-[#86a3a3] font-semibold text-[11px] uppercase tracking-wider">
                <span>Notifications</span>
                <span className="text-[#43d6d0] text-[10px]">3 New</span>
              </div>
              <div className="divide-y divide-[#203942]/60 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-[#12262e]/70 transition-colors">
                    <div className="flex items-center justify-between text-[#e7f1ef] font-medium">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#86a3a3]">{n.time}</span>
                    </div>
                    <div className="text-[#86a3a3] text-[11px] mt-0.5">{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#203942]">
          <div className="w-7 h-7 rounded bg-[#12262e] border border-[#203942] text-[#43d6d0] font-semibold flex items-center justify-center text-xs">
            {userName.charAt(0) || 'R'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-[#e7f1ef] leading-tight">
              {userName}
            </div>
            <div className="text-[10px] text-[#70d3a1] leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70d3a1]"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  AlertOctagon,
  TrendingUp,
  Boxes,
  Activity,
  FileText,
  Settings,
  LogOut,
  History,
  X
} from 'lucide-react';
import { NavPage } from '../types';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  anomalyCount: number;
  onOpenHistory: () => void;
  onSignOut: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  anomalyCount,
  onOpenHistory,
  onSignOut,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'train-predict', label: 'Train & Predict', icon: Cpu },
    { id: 'components', label: 'Components', icon: Layers },
    { id: 'anomaly-center', label: 'Anomaly Center', icon: AlertOctagon, badge: anomalyCount > 0 ? anomalyCount : undefined },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'batch-analysis', label: 'Batch Analysis', icon: Boxes },
    { id: 'model-performance', label: 'Model Performance', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#071217]/80 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[250px] bg-[#0d1c23] border-r border-[#203942] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-4 border-b border-[#203942] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#12262e] border border-[#43d6d0] text-[#43d6d0] font-bold flex items-center justify-center text-xs tracking-wider shadow-inner">
                AB
              </div>
              <div>
                <div className="text-[#e7f1ef] font-bold tracking-wider text-sm">
                  AEGISBURN
                </div>
                <div className="text-[#86a3a3] text-[10px] tracking-widest uppercase">
                  AI SCREENING SYSTEM
                </div>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden text-[#86a3a3] hover:text-[#e7f1ef]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workspace Status Tag */}
          <div className="px-4 py-2.5 bg-[#071217]/60 border-b border-[#203942] flex items-center justify-between text-[11px]">
            <span className="text-[#86a3a3] tracking-wider uppercase font-semibold">
              PRODUCTION WORKSPACE
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43d6d0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43d6d0]"></span>
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2 space-y-0.5 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as NavPage);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs tracking-wide transition-colors ${
                    isActive
                      ? 'sidebar-active-item font-semibold'
                      : 'text-[#86a3a3] hover:bg-[#12262e]/70 hover:text-[#e7f1ef]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#43d6d0]' : 'text-[#86a3a3]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#ef7778]/20 text-[#ef7778] border border-[#ef7778]/40 rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions Section */}
        <div className="p-2 border-t border-[#203942] space-y-1">
          <button
            onClick={() => {
              onOpenHistory();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#86a3a3] hover:bg-[#12262e] hover:text-[#e7f1ef] rounded-xs transition-colors"
          >
            <History className="w-4 h-4 text-[#86a3a3]" />
            <span>Analysis History</span>
          </button>

          <button
            onClick={() => {
              onNavigate('settings');
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors rounded-xs ${
              currentPage === 'settings'
                ? 'sidebar-active-item font-semibold'
                : 'text-[#86a3a3] hover:bg-[#12262e] hover:text-[#e7f1ef]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#86a3a3]" />
            <span>Settings</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#ef7778] hover:bg-[#ef7778]/10 rounded-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-[#ef7778]" />
              <span>Sign out</span>
            </div>
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
};

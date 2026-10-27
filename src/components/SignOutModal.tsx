import React, { useState } from 'react';
import { Lock, LogOut, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { UserSettings } from '../types';

interface SignOutModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onUnlock: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  settings,
  onUnlock
}) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock();
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050e12]/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="console-card w-full max-w-md p-8 bg-[#0d1c23] border border-[#203942] shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#12262e] border-2 border-[#43d6d0] mx-auto flex items-center justify-center text-[#43d6d0] shadow-lg shadow-[#43d6d0]/10">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#43d6d0]">
            AEGISBURN AI SECURITY
          </div>
          <h2 className="text-xl font-serif-heading text-[#e7f1ef] mt-1">
            Console Session Locked
          </h2>
          <p className="text-xs text-[#86a3a3] mt-2">
            Engineering session for operator <span className="text-[#e7f1ef] font-semibold">{settings.user_name}</span> ({settings.email}) is currently suspended.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter PIN / Password (any key to unlock)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#12262e] border border-[#203942] rounded px-3 py-2 text-xs text-[#e7f1ef] text-center focus:outline-none focus:border-[#43d6d0]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-cyan w-full justify-center py-2 text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock & Resume Screening Console</span>
          </button>
        </form>

        <div className="text-[10px] text-[#86a3a3]">
          Automated lock ensures calibration security and test repeatability.
        </div>
      </div>
    </div>
  );
};

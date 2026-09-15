import React from 'react';
import { Shield, ShieldAlert, Terminal, FileText, Video, Radio, Volume2, VolumeX, Globe, Tv, RefreshCw, AlertOctagon, LayoutGrid, HardDriveDownload, Download } from 'lucide-react';
import { Language, PortalTab, ThemeMode } from '../types';
import { soundEngine } from '../utils/audio';

interface HeaderHUDProps {
  language: Language;
  currentTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  defcon: 1 | 2 | 3 | 4 | 5;
  onSetDefcon: (level: 1 | 2 | 3 | 4 | 5) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  theme: ThemeMode;
  onChangeTheme: (theme: ThemeMode) => void;
  onToggleLanguage: () => void;
  onReplayIntro: () => void;
  onTriggerLockdown: () => void;
  onOpenExportModal?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  language,
  currentTab,
  onSelectTab,
  defcon,
  onSetDefcon,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  theme,
  onChangeTheme,
  onToggleLanguage,
  onReplayIntro,
  onTriggerLockdown,
  onOpenExportModal
}) => {
  const isAr = language === 'ar';

  const defconColors = {
    1: 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_#dc2626] animate-pulse',
    2: 'bg-red-950 text-red-300 border-red-500',
    3: 'bg-amber-950 text-amber-300 border-amber-500',
    4: 'bg-blue-950 text-blue-300 border-blue-500',
    5: 'bg-emerald-950 text-emerald-300 border-emerald-500'
  }[defcon];

  const defconLabelsAr = {
    1: 'DEFCON 1: تأهب نووي وحربي أقصى',
    2: 'DEFCON 2: إنذار أحمر - تدبير قتالي',
    3: 'DEFCON 3: جاهزية استخباراتية مرتفعة',
    4: 'DEFCON 4: مراقبة أمنية مشددة',
    5: 'DEFCON 5: الحالة الاعتيادية'
  };

  const defconLabelsEn = {
    1: 'DEFCON 1: MAXIMUM ALERT / COMBAT',
    2: 'DEFCON 2: RED ALERT ARMED INGRESS',
    3: 'DEFCON 3: ELEVATED INTEL READINESS',
    4: 'DEFCON 4: HIGH SURVEILLANCE POSTURE',
    5: 'DEFCON 5: NOMINAL PEACE STATE'
  };

  const tabs: { id: PortalTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelAr: 'اللوحة الشاملة', labelEn: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'terminal', labelAr: 'الطرفية التكتيكية', labelEn: 'Terminal', icon: <Terminal className="w-4 h-4" /> },
    { id: 'files', labelAr: 'الملفات السرية', labelEn: 'Classified Files', icon: <FileText className="w-4 h-4" /> },
    { id: 'feed', labelAr: 'بث المراقبة الحي', labelEn: 'Live Feed', icon: <Video className="w-4 h-4" /> },
    { id: 'radar', labelAr: 'الرادار التكتيكي', labelEn: 'Radar Array', icon: <Radio className="w-4 h-4" /> }
  ];

  return (
    <header className="bg-black/90 border-b border-emerald-500/40 text-emerald-300 font-mono-tactical px-4 py-2.5 shadow-xl select-none relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Clearance Level */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider font-display-tactical text-gray-100 uppercase">
                  {isAr ? 'بوابة العمليات السرية' : 'COVERT OPERATIONS PORTAL'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                  LEVEL 5 // BLACK OPS
                </span>
              </div>
              <div className="text-[10px] text-emerald-500/70 flex items-center gap-2">
                <span>NODE: SATELLITE-PEGASUS</span>
                <span>•</span>
                <span className="text-emerald-400">LATENCY: 14ms</span>
              </div>
            </div>
          </div>

          {/* Mobile DEFCON button */}
          <button
            onClick={() => {
              const next = (defcon === 1 ? 5 : defcon - 1) as 1 | 2 | 3 | 4 | 5;
              onSetDefcon(next);
              soundEngine.playTargetLock(soundEnabled);
            }}
            className={`md:hidden px-2.5 py-1 text-[10px] rounded font-bold border ${defconColors}`}
          >
            DEFCON {defcon}
          </button>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playKeyClick(soundEnabled);
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-gray-950/70 text-gray-400 border-gray-800 hover:border-emerald-500/40 hover:text-gray-200'
                }`}
              >
                {tab.icon}
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: DEFCON Selector & Quick Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* DEFCON Dropdown on Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">READINESS:</span>
            <button
              onClick={() => {
                const next = (defcon === 1 ? 5 : defcon - 1) as 1 | 2 | 3 | 4 | 5;
                onSetDefcon(next);
                soundEngine.playTargetLock(soundEnabled);
              }}
              title={isAr ? defconLabelsAr[defcon] : defconLabelsEn[defcon]}
              className={`px-2.5 py-1 text-xs rounded font-bold border transition-all cursor-pointer ${defconColors}`}
            >
              DEFCON {defcon}
            </button>
          </div>

          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-1">
            {(['emerald', 'amber', 'cyan', 'crimson'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  onChangeTheme(t);
                  soundEngine.playKeyClick(soundEnabled);
                }}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  t === 'emerald'
                    ? 'bg-emerald-500 border-emerald-300'
                    : t === 'amber'
                    ? 'bg-amber-500 border-amber-300'
                    : t === 'cyan'
                    ? 'bg-cyan-500 border-cyan-300'
                    : 'bg-red-500 border-red-300'
                } ${theme === t ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                title={`Switch theme: ${t}`}
              />
            ))}
          </div>

          <div className="h-4 w-[1px] bg-gray-800" />

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundEngine.playKeyClick(soundEnabled);
            }}
            className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 cursor-pointer transition-all"
            title={soundEnabled ? 'Disable Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {/* CRT Overlay Toggle */}
          <button
            onClick={() => {
              onToggleCrt();
              soundEngine.playKeyClick(soundEnabled);
            }}
            className={`p-1.5 rounded border text-xs cursor-pointer transition-all ${
              crtEnabled ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-500'
            }`}
            title="Toggle CRT Scanline Effect"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Export / Download Intel Archive */}
          {onOpenExportModal && (
            <button
              onClick={() => {
                soundEngine.playKeyClick(soundEnabled);
                onOpenExportModal();
              }}
              className="p-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 cursor-pointer transition-all flex items-center gap-1 text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              title={isAr ? 'تنزيل وتصدير الأرشيف الاستخباري' : 'Download / Export Intel Archive'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline text-[11px] font-bold">{isAr ? 'تنزيل' : 'Export'}</span>
            </button>
          )}

          {/* Replay Intro */}
          <button
            onClick={onReplayIntro}
            className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 cursor-pointer transition-all"
            title={isAr ? 'إعادة محاكاة الاختراق' : 'Replay Breach Intro'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1 rounded bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs font-bold text-emerald-300 flex items-center gap-1 cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Emergency Lockdown */}
          <button
            onClick={onTriggerLockdown}
            className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 border border-red-500 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            title={isAr ? 'إغلاق الطوارئ التام' : 'Trigger Facility Lockdown'}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'إغلاق تام' : 'LOCKDOWN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

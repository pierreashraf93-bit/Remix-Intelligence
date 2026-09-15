import React from 'react';
import { Shield, ShieldAlert, Terminal, FileText, Video, Radio, Cpu, Activity, AlertTriangle, ArrowUpRight, Zap, Lock, Unlock, Download } from 'lucide-react';
import { Language, PortalTab, ClassifiedDocument, RadarTarget, ThemeMode } from '../types';
import { soundEngine } from '../utils/audio';

interface DashboardOverviewProps {
  language: Language;
  soundEnabled: boolean;
  theme: ThemeMode;
  classifiedFiles: ClassifiedDocument[];
  radarTargets: RadarTarget[];
  defcon: number;
  onNavigateTab: (tab: PortalTab) => void;
  onTriggerLockdown: () => void;
  onOpenExportModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  language,
  soundEnabled,
  theme,
  classifiedFiles,
  radarTargets,
  defcon,
  onNavigateTab,
  onTriggerLockdown,
  onOpenExportModal
}) => {
  const isAr = language === 'ar';

  const criticalTargets = radarTargets.filter((t) => t.threatLevel === 'CRITICAL');
  const activeFilesCount = classifiedFiles.filter((f) => !f.isBurned).length;

  return (
    <div className="space-y-4 font-mono-tactical">
      {/* Top Tactical Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: DEFCON / Alert Posture */}
        <div className="bg-gray-950/80 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {isAr ? 'حالة الجاهزية القتالية' : 'READINESS POSTURE'}
            </div>
            <div className="text-base font-bold text-gray-100 flex items-center gap-1.5 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${defcon <= 2 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
              <span>DEFCON {defcon}</span>
            </div>
          </div>
          <ShieldAlert className={`w-6 h-6 ${defcon <= 2 ? 'text-red-400' : 'text-emerald-400'}`} />
        </div>

        {/* Card 2: Radar Contacts */}
        <div
          onClick={() => {
            soundEngine.playKeyClick(soundEnabled);
            onNavigateTab('radar');
          }}
          className="bg-gray-950/80 border border-emerald-500/30 hover:border-emerald-400 rounded-lg p-3 flex items-center justify-between shadow-lg cursor-pointer transition-all group"
        >
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {isAr ? 'الأهداف الرادارية النشطة' : 'RADAR CONTACTS'}
            </div>
            <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-center gap-2">
              <span>{radarTargets.length} {isAr ? 'أهداف' : 'Tracks'}</span>
              {criticalTargets.length > 0 && (
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-500/40 px-1.5 py-0.2 rounded font-bold">
                  {criticalTargets.length} {isAr ? 'حرج' : 'Alert'}
                </span>
              )}
            </div>
          </div>
          <Radio className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-all" />
        </div>

        {/* Card 3: Surveillance Cameras */}
        <div
          onClick={() => {
            soundEngine.playKeyClick(soundEnabled);
            onNavigateTab('feed');
          }}
          className="bg-gray-950/80 border border-emerald-500/30 hover:border-emerald-400 rounded-lg p-3 flex items-center justify-between shadow-lg cursor-pointer transition-all group"
        >
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {isAr ? 'مصفوفة المراقبة التكتيكية' : 'SURVEILLANCE MATRIX'}
            </div>
            <div className="text-base font-bold text-gray-100 mt-0.5 flex items-center gap-2">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                4 FEEDS
              </span>
              <span className="text-[10px] text-emerald-400">100% UP</span>
            </div>
          </div>
          <Video className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-all" />
        </div>

        {/* Card 4: Classified Dossiers */}
        <div
          onClick={() => {
            soundEngine.playKeyClick(soundEnabled);
            onNavigateTab('files');
          }}
          className="bg-gray-950/80 border border-emerald-500/30 hover:border-emerald-400 rounded-lg p-3 flex items-center justify-between shadow-lg cursor-pointer transition-all group"
        >
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">
              {isAr ? 'الأرشيف الاستخباري' : 'INTELLIGENCE VAULT'}
            </div>
            <div className="text-base font-bold text-gray-100 mt-0.5">
              <span>{activeFilesCount} {isAr ? 'ملفات سرية' : 'Dossiers'}</span>
            </div>
          </div>
          <FileText className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-all" />
        </div>
      </div>

      {/* Bento Grid: 4 Interactive Mini Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Widget 1: Radar Array Quick View (Col 6) */}
        <div className="lg:col-span-6 bg-gray-950/90 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {isAr ? 'الرادار التكتيكي (نظرة عامة)' : 'RADAR INTERCEPT ARRAY'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('radar')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'فتح الشاشة الكاملة' : 'Expand Radar'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {radarTargets.slice(0, 3).map((target) => (
              <div
                key={target.id}
                onClick={() => onNavigateTab('radar')}
                className="bg-black/60 hover:bg-black/90 p-2.5 rounded border border-gray-800 hover:border-emerald-500/40 flex items-center justify-between text-xs cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      target.threatLevel === 'CRITICAL'
                        ? 'bg-red-500 animate-ping'
                        : target.threatLevel === 'HIGH'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="font-bold text-gray-200">{target.callsign}</span>
                  <span className="text-[10px] text-gray-400 hidden sm:inline">[{target.bearing}]</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">{target.distanceKm} km</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      target.threatLevel === 'CRITICAL'
                        ? 'bg-red-950 text-red-300'
                        : target.threatLevel === 'HIGH'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {target.threatLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-gray-500 flex justify-between items-center pt-2 border-t border-gray-800/80">
            <span>SWEEP: 360° CONTINUOUS</span>
            <span className="text-emerald-400">IFF INTERROGATOR: READY</span>
          </div>
        </div>

        {/* Widget 2: Live Feed Quick View (Col 6) */}
        <div className="lg:col-span-6 bg-gray-950/90 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {isAr ? 'بث الكاميرات الحي (قناة 01)' : 'SURVEILLANCE CAM 01 // VAULT'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('feed')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'فتح الكاميرات' : 'Expand Feeds'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mini Camera Preview Screen */}
          <div
            onClick={() => onNavigateTab('feed')}
            className="h-32 bg-black rounded border border-emerald-500/30 relative flex items-center justify-center overflow-hidden cursor-pointer group mb-3"
          >
            <div className="absolute inset-0 crt-overlay" />
            <div className="absolute top-2 start-2 text-[10px] text-red-400 font-bold flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>LIVE</span>
            </div>
            <div className="absolute bottom-2 end-2 text-[10px] text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
              SECTOR-01-SUB
            </div>

            {/* Visual simulation graphics */}
            <div className="w-24 h-24 rounded-full border border-emerald-500/30 flex items-center justify-center animate-spin">
              <div className="w-12 h-12 rounded-full border border-dashed border-emerald-400/50 flex items-center justify-center">
                <span className="text-[9px] text-emerald-400">VAULT</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-all" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
            <span>4 CAMERAS ONLINE</span>
            <span className="text-emerald-400">MOTION DETECTION: ARMED</span>
          </div>
        </div>

        {/* Widget 3: Terminal Shortcut Console (Col 6) */}
        <div className="lg:col-span-6 bg-gray-950/90 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {isAr ? 'موجه الأوامر السريع' : 'TACTICAL CLI CONSOLE'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('terminal')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'فتح الموجه بالكامل' : 'Open CLI'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-black/80 rounded p-3 text-xs space-y-1 font-mono-tactical text-gray-300 mb-3 border border-gray-800">
            <div className="text-emerald-400 font-bold">root@black-ops:~# status</div>
            <div className="text-[11px] text-gray-400">
              [✓] Uplink: STABLE // Latency: 14ms // Crypt: AES-GCM-256
            </div>
            <div className="text-[11px] text-emerald-400/90">
              [✓] Root Access Elevated // Clearance: Level-5 Black Ops
            </div>
            <div className="text-[11px] text-amber-400">
              [!] 1 Active Stealth Anomaly tracking on sector edge
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('terminal')}
              className="flex-1 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold transition-all cursor-pointer text-center"
            >
              {isAr ? 'تنفيذ أوامر في الطرفية ⏎' : 'Execute CLI Commands ⏎'}
            </button>
          </div>
        </div>

        {/* Widget 4: Classified Dossiers Quick View (Col 6) */}
        <div className="lg:col-span-6 bg-gray-950/90 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {isAr ? 'أحدث الملفات الاستخباراتية' : 'LATEST CLASSIFIED INTEL'}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('files')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'عرض كافة الملفات' : 'View All Files'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mb-3">
            {classifiedFiles.slice(0, 2).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onNavigateTab('files')}
                className="bg-black/60 hover:bg-black/90 p-2.5 rounded border border-gray-800 hover:border-emerald-500/40 flex items-center justify-between text-xs cursor-pointer transition-all"
              >
                <div>
                  <div className="text-emerald-400 font-bold text-[11px]">{doc.code}</div>
                  <div className="text-gray-300 font-display-tactical line-clamp-1">
                    {isAr ? doc.titleAr : doc.titleEn}
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold whitespace-nowrap">
                  {doc.clearance}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('files')}
              className="flex-1 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 rounded text-xs font-bold transition-all cursor-pointer text-center"
            >
              {isAr ? 'فتح أرشيف الوثائق وتفكيك الحجب' : 'Access Archives & Unmask Dossiers'}
            </button>
            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="py-1.5 px-3 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                title={isAr ? 'تنزيل الأرشيف' : 'Export Dossiers'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'تنزيل' : 'Export'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

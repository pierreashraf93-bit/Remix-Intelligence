import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Play, Trash2, Cpu, Shield, Sparkles, Download } from 'lucide-react';
import { Language, TerminalEntry, ClassifiedDocument, RadarTarget, ThemeMode } from '../types';
import { soundEngine } from '../utils/audio';
import { triggerFileDownload, formatDossierText, formatAllDossiersArchive } from '../utils/downloadHelper';

interface TerminalProps {
  language: Language;
  soundEnabled: boolean;
  theme: ThemeMode;
  classifiedFiles: ClassifiedDocument[];
  radarTargets: RadarTarget[];
  defcon: number;
  onSetDefcon: (level: 1 | 2 | 3 | 4 | 5) => void;
  onSelectTab: (tab: 'dashboard' | 'terminal' | 'files' | 'feed' | 'radar') => void;
  onTriggerLockdown: () => void;
  onChangeTheme: (theme: ThemeMode) => void;
  onReplayIntro: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  language,
  soundEnabled,
  theme,
  classifiedFiles,
  radarTargets,
  defcon,
  onSetDefcon,
  onSelectTab,
  onTriggerLockdown,
  onChangeTheme,
  onReplayIntro
}) => {
  const isAr = language === 'ar';
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialEntries: TerminalEntry[] = [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'ascii',
      text: `
  ██████╗ ██╗      █████╗  ██████╗██╗  ██╗       ██████╗ ██████╗ ███████╗
  ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝      ██╔═══██╗██╔══██╗██╔════╝
  ██████╔╝██║     ███████║██║     █████╔╝ █████╗██║   ██║██████╔╝███████╗
  ██╔══██╗██║     ██╔══██║██║     ██╔═██╗ ╚════╝██║   ██║██╔═══╝ ╚════██║
  ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗      ╚██████╔╝██║     ███████║
  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝       ╚═════╝ ╚═╝     ╚══════╝`
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'success',
      text: isAr
        ? 'بوابة موجه أوامر العمليات السرية جاهزة. اكتب "help" أو "مساعدة" لعرض قائمة الأوامر التكتيكية.'
        : 'Covert Terminal Core initialized. Type "help" for a list of tactical commands.'
    }
  ];

  const [entries, setEntries] = useState<TerminalEntry[]>(initialEntries);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const handleCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    soundEngine.playKeyClick(soundEnabled);

    // Append to command history
    setCommandHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    const inputEntry: TerminalEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString(),
      type: 'input',
      text: `root@black-ops:~# ${raw}`
    };

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    let outputEntry: TerminalEntry;

    switch (cmd) {
      case 'help':
      case 'مساعدة':
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          text: isAr
            ? `قائمة الأوامر التكتيكية المتاحة:
- scan / فحص              : فحص الشبكة ورصد ثغرات الأقمار الصناعية
- files / ls              : عرض قائمة الملفات الاستخباراتية السرية
- cat <id> / read <id>    : قراءة وتفكيك محتوى ملف استخباري
- radar / رادار           : فحص حالة الرادار والأهداف المرصودة في المجال
- cam <1-4>               : الانتقال لكاميرا المراقبة المحددة
- status / حالة           : عرض حالة التأهب (DEFCON) وجودة الاتصال
- defcon <1-5>            : تغيير مستوى الجاهزية القتالية
- decrypt <hash>          : فك تشفير شفرة أو نص عسكري
- theme <emerald|amber|cyan|crimson> : تغيير المظهر اللوني للواجهة
- download / export [id]  : تنزيل وتصدير الملفات أو الأرشيف الاستخباري
- lockdown / إغلاق        : تفعيل بروتوكول الإغلاق التام للطوارئ
- clear / مسح             : تنظيف شاشة الموجه
- reboot / restart        : إعادة تشغيل واجهة الاختراق`
            : `Available Tactical Commands:
- scan                    : Scan local network & orbital relay links
- files / ls              : List classified intelligence dossiers
- cat <id> / read <id>    : Read and decrypt a specific file
- download / export [id]  : Download dossier or master archive (.txt)
- radar                   : Print active radar blips and bearing telemetry
- cam <1-4>               : Switch to target surveillance feed
- status                  : Print DEFCON level and system security posture
- defcon <1-5>            : Elevate or de-escalate readiness level
- decrypt <hash>          : Run quantum decryption on arbitrary cipher text
- theme <color>           : Switch HUD theme (emerald, amber, cyan, crimson)
- lockdown                : Trigger emergency facility lockdown
- clear                   : Clear terminal buffer
- reboot / restart        : Re-run the cyber breach intro simulation`
        };
        break;

      case 'scan':
      case 'فحص':
        soundEngine.playBreachChirp(soundEnabled);
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          text: isAr
            ? `[+] جاري فحص الطيف الراديوي والشبكات المشفرة...
[✓] تم رصد 4 كاميرات مراقبة نشطة في المنشأة (حالة: متصلة)
[✓] تم رصد 5 أهداف رادارية متزامنة في المجال الجوي والبحري
[✓] قناة الاتصال بالقمر الصناعي Pegasus-4 مشفرة (AES-256)
[!] تحذير: رصد محاولة تجسس سيبرانية خارجية تم اعتراضها بنجاح`
            : `[+] Scanning electromagnetic spectrum & dark nodes...
[✓] 4 Surveillance camera feeds active (Status: Nominal)
[✓] 5 Radar targets synced across tactical grid
[✓] Satellite uplink to Pegasus-4 secured with quantum key
[!] Note: Foreign intercept attempt blocked at Layer 4 firewall`
        };
        break;

      case 'files':
      case 'ls':
      case 'ملفات':
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'classified',
          text: classifiedFiles.map((f, i) => 
            `[${i + 1}] ID: ${f.id} | CODE: ${f.code} | [${f.clearance}] | ${isAr ? f.titleAr : f.titleEn}`
          ).join('\n') + `\n\n${isAr ? 'استخدم cat <id> لقراءة أي ملف' : 'Use cat <id> to inspect any dossier.'}`
        };
        break;

      case 'cat':
      case 'read':
      case 'اقرأ':
        if (!arg) {
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'error',
            text: isAr ? 'خطأ: حدد معرف الملف، مثلا: cat doc-001' : 'Error: Specify file id, e.g.: cat doc-001'
          };
          soundEngine.playAccessDenied(soundEnabled);
        } else {
          const found = classifiedFiles.find((f) => f.id.toLowerCase() === arg.toLowerCase() || f.code.toLowerCase().includes(arg.toLowerCase()));
          if (found) {
            soundEngine.playAccessGranted(soundEnabled);
            outputEntry = {
              id: String(Date.now() + 1),
              timestamp: new Date().toLocaleTimeString(),
              type: 'classified',
              text: `=====================================================
FILE: ${found.code}
CLEARANCE: [${found.clearance}] // COORD: ${found.coordinates}
DATE: ${found.date} // OPERATIVE: ${found.operative}
-----------------------------------------------------
${isAr ? found.fullContentAr : found.fullContentEn}
=====================================================`
            };
          } else {
            soundEngine.playAccessDenied(soundEnabled);
            outputEntry = {
              id: String(Date.now() + 1),
              timestamp: new Date().toLocaleTimeString(),
              type: 'error',
              text: isAr ? `لم يتم العثور على الملف: ${arg}` : `Dossier not found: ${arg}`
            };
          }
        }
        break;

      case 'radar':
      case 'رادار':
        soundEngine.playRadarPing(soundEnabled);
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          text: `[TACTICAL RADAR TELEMETRY // SECTOR GRID ALPHA]
` + radarTargets.map((t) => 
            `• [${t.threatLevel}] ${t.callsign} | DIST: ${t.distanceKm}km | BRG: ${t.bearing} | ALT: ${t.altitudeFt}ft | STATUS: ${t.status}`
          ).join('\n')
        };
        break;

      case 'cam':
      case 'كاميرا':
        const camNum = parseInt(arg, 10);
        if (camNum >= 1 && camNum <= 4) {
          soundEngine.playCameraStatic(soundEnabled);
          onSelectTab('feed');
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'success',
            text: isAr ? `تم تحويل شاشة المراقبة إلى الكاميرا رقم 0${camNum}` : `Surveillance matrix switched to Camera 0${camNum}`
          };
        } else {
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning',
            text: isAr ? 'حدد رقم الكاميرا بين 1 و 4 (مثال: cam 2)' : 'Select camera number between 1 and 4 (e.g. cam 2)'
          };
        }
        break;

      case 'status':
      case 'حالة':
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'info',
          text: `================================================
OPERATIONAL READINESS STATUS:
• DEFCON LEVEL       : ${defcon} [${defcon === 1 ? 'MAXIMUM ALERT' : defcon === 2 ? 'HIGH READINESS' : 'MONITORING'}]
• ROOT PRIVILEGES    : ELEVATED (BYPASS ACTIVE)
• SATELLITE LINK     : SECURE (LATENCY: 14ms)
• OPERATIVES ACTIVE  : 3 IN SECTOR
• ACTIVE SURVEILLANCE: 4 FEEDS ONLINE
• RADAR SWEEP        : RUNNING (360° CONTINUOUS)
================================================`
        };
        break;

      case 'defcon':
        const defNum = parseInt(arg, 10);
        if (defNum >= 1 && defNum <= 5) {
          onSetDefcon(defNum as 1 | 2 | 3 | 4 | 5);
          soundEngine.playTargetLock(soundEnabled);
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: defNum <= 2 ? 'warning' : 'success',
            text: isAr ? `تم تعديل حالة التأهب القتالي إلى DEFCON ${defNum}` : `Operational readiness updated to DEFCON ${defNum}`
          };
        } else {
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'error',
            text: isAr ? 'حدد مستوى بين 1 و 5 (مثال: defcon 2)' : 'Specify DEFCON level from 1 to 5 (e.g. defcon 2)'
          };
        }
        break;

      case 'lockdown':
      case 'إغلاق':
        onTriggerLockdown();
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'warning',
          text: isAr ? '!!! تم تفعيل بروتوكول الإغلاق التام للمنشأة !!!' : '!!! EMERGENCY FACILITY LOCKDOWN ENGAGED !!!'
        };
        break;

      case 'decrypt':
      case 'فك':
        soundEngine.playBreachChirp(soundEnabled);
        const dummyDecrypted = arg ? `UNSCRAMBLED [${arg}] => TARGET_ALPHA_CLEARED_CONFIDENTIAL` : 'QUANTUM KEY RECOVERED: 0x9AF4B012';
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          text: isAr ? `[+] تم فك التشفير بنجاح: ${dummyDecrypted}` : `[+] Quantum decryption successful: ${dummyDecrypted}`
        };
        break;

      case 'theme':
        if (['emerald', 'amber', 'cyan', 'crimson'].includes(arg.toLowerCase())) {
          onChangeTheme(arg.toLowerCase() as ThemeMode);
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'success',
            text: `HUD palette updated to: ${arg.toUpperCase()}`
          };
        } else {
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning',
            text: 'Available themes: emerald, amber, cyan, crimson'
          };
        }
        break;

      case 'download':
      case 'export':
      case 'تنزيل':
      case 'تصدير':
        soundEngine.playKeyClick(soundEnabled);
        if (arg) {
          const foundDoc = classifiedFiles.find(
            (f) => f.id.toLowerCase() === arg.toLowerCase() || f.code.toLowerCase().includes(arg.toLowerCase())
          );
          if (foundDoc) {
            triggerFileDownload(`DOSSIER_${foundDoc.code}.txt`, formatDossierText(foundDoc, language), 'text/plain;charset=utf-8');
            outputEntry = {
              id: String(Date.now() + 1),
              timestamp: new Date().toLocaleTimeString(),
              type: 'success',
              text: isAr
                ? `[✓] تم إرسال أمر تنزيل الوثيقة ${foundDoc.code}. يمكنك أيضاً الانتقال لتبويب 'الملفات' للحصول على خيارات النسخ المباشر.`
                : `[✓] Direct download triggered for ${foundDoc.code}. You can also visit 'Classified Files' for 1-click clipboard copy.`
            };
          } else {
            outputEntry = {
              id: String(Date.now() + 1),
              timestamp: new Date().toLocaleTimeString(),
              type: 'error',
              text: isAr ? `لم يتم العثور على ملف يطابق: ${arg}` : `No dossier matching code: ${arg}`
            };
          }
        } else {
          // Trigger archive download
          triggerFileDownload(
            `COVERT_OPS_ARCHIVE_${new Date().toISOString().slice(0, 10)}.txt`,
            formatAllDossiersArchive(classifiedFiles, language),
            'text/plain;charset=utf-8'
          );
          outputEntry = {
            id: String(Date.now() + 1),
            timestamp: new Date().toLocaleTimeString(),
            type: 'classified',
            text: isAr
              ? `================================================
[+] مركز التنزيل والتصدير:
• تم إرسال أمر تنزيل الأرشيف الاستخباري الكامل (${classifiedFiles.filter((d) => !d.isBurned).length} ملفات).
• إذا كان متصفحك يمنع التنزيل داخل الإطار، توجه لتبويب 'الملفات' واستخدم زر 'تنزيل وحفظ التقرير' لنسخه بضغطة زر.
• لتنزيل كامل كود المشروع (ZIP): اضغط على أيقونة الإعدادات (⚙️) في أعلى Google AI Studio واختر 'Download ZIP'.
================================================`
              : `================================================
[+] INTELLIGENCE EXPORT TERMINAL:
• Master Archive (.txt) download initiated in browser (${classifiedFiles.filter((d) => !d.isBurned).length} files).
• If your browser sandbox blocks direct downloads in the preview iframe, open the 'Classified Files' tab and click 'Download / Save Dossier' for 1-click copy.
• To download the full app source code (ZIP): use AI Studio's top Settings (⚙️) → 'Download ZIP'.
================================================`
          };
        }
        break;

      case 'clear':
      case 'مسح':
        setEntries([]);
        setInputVal('');
        return;

      case 'reboot':
      case 'exit':
      case 'restart':
        onReplayIntro();
        return;

      default:
        soundEngine.playAccessDenied(soundEnabled);
        outputEntry = {
          id: String(Date.now() + 1),
          timestamp: new Date().toLocaleTimeString(),
          type: 'error',
          text: isAr
            ? `أمر غير معروف: "${cmd}". اكتب "help" أو "مساعدة" لعرض الأوامر.`
            : `Command not recognized: "${cmd}". Type "help" for syntax.`
        };
    }

    setEntries((prev) => [...prev, inputEntry, outputEntry]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  // Theme color accents
  const themeColors = {
    emerald: {
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      prompt: 'text-emerald-300',
      badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
      chip: 'hover:bg-emerald-950/50 hover:border-emerald-400 text-emerald-300'
    },
    amber: {
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      prompt: 'text-amber-300',
      badge: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
      chip: 'hover:bg-amber-950/50 hover:border-amber-400 text-amber-300'
    },
    cyan: {
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      prompt: 'text-cyan-300',
      badge: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
      chip: 'hover:bg-cyan-950/50 hover:border-cyan-400 text-cyan-300'
    },
    crimson: {
      border: 'border-red-500/40',
      text: 'text-red-400',
      prompt: 'text-red-300',
      badge: 'bg-red-950/40 text-red-300 border-red-500/30',
      chip: 'hover:bg-red-950/50 hover:border-red-400 text-red-300'
    }
  }[theme];

  const quickChips = [
    { label: 'help', cmd: 'help' },
    { label: isAr ? 'فحص الشبكة' : 'scan', cmd: 'scan' },
    { label: isAr ? 'ملفات سرية' : 'files', cmd: 'files' },
    { label: isAr ? 'الرادار' : 'radar', cmd: 'radar' },
    { label: 'cam 1', cmd: 'cam 1' },
    { label: 'status', cmd: 'status' },
    { label: 'defcon 1', cmd: 'defcon 1' },
    { label: 'lockdown', cmd: 'lockdown' },
    { label: 'clear', cmd: 'clear' }
  ];

  return (
    <div className={`h-full flex flex-col bg-gray-950/90 border ${themeColors.border} rounded-lg overflow-hidden font-mono-tactical shadow-2xl backdrop-blur-sm relative`}>
      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 bg-black/80 border-b ${themeColors.border}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setEntries([])} title="Clear" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 ms-2 text-xs font-bold tracking-wider">
            <TerminalIcon className={`w-3.5 h-3.5 ${themeColors.text}`} />
            <span className={themeColors.text}>
              {isAr ? 'موجه أوامر العمليات السرية' : 'BLACK-OPS TACTICAL TERMINAL'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 hidden sm:inline">TTY1 // SH-BASH</span>
          <button
            onClick={() => setEntries([])}
            className="p-1 hover:text-red-400 text-gray-400 text-xs flex items-center gap-1 cursor-pointer"
            title="Clear Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="px-3 py-1.5 bg-black/50 border-b border-gray-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] select-none">
        <span className="text-gray-500 text-[10px] uppercase font-bold whitespace-nowrap">
          {isAr ? 'أوامر سريعة:' : 'Quick Cmd:'}
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleCommand(chip.cmd)}
            className={`px-2 py-0.5 rounded bg-gray-900/80 border border-gray-800 text-gray-300 cursor-pointer transition-all whitespace-nowrap ${themeColors.chip}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Terminal History Log */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="break-words">
            {entry.type === 'input' && (
              <div className="flex items-center gap-1 font-bold text-gray-200">
                <span className={themeColors.prompt}>{entry.text}</span>
              </div>
            )}

            {entry.type === 'output' && (
              <div className="text-gray-300 ps-2 whitespace-pre-wrap">{entry.text}</div>
            )}

            {entry.type === 'ascii' && (
              <pre className={`text-[10px] leading-tight font-bold ${themeColors.text} overflow-x-auto select-none opacity-90`}>
                {entry.text}
              </pre>
            )}

            {entry.type === 'success' && (
              <div className="text-emerald-400 ps-2 whitespace-pre-wrap border-s-2 border-emerald-500">
                {entry.text}
              </div>
            )}

            {entry.type === 'info' && (
              <div className="text-cyan-300 ps-2 whitespace-pre-wrap border-s-2 border-cyan-500">
                {entry.text}
              </div>
            )}

            {entry.type === 'warning' && (
              <div className="text-amber-400 ps-2 whitespace-pre-wrap border-s-2 border-amber-500">
                {entry.text}
              </div>
            )}

            {entry.type === 'error' && (
              <div className="text-red-400 ps-2 whitespace-pre-wrap border-s-2 border-red-500">
                {entry.text}
              </div>
            )}

            {entry.type === 'classified' && (
              <div className="text-emerald-200 ps-2 bg-emerald-950/20 border border-emerald-500/30 rounded p-2.5 whitespace-pre-wrap font-mono-tactical">
                {entry.text}
              </div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt Row */}
      <div className={`p-2.5 bg-black/90 border-t ${themeColors.border} flex items-center gap-2`}>
        <span className={`text-xs font-bold whitespace-nowrap ${themeColors.prompt}`}>
          root@black-ops:~#
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAr ? 'اكتب أمراً هنا (مثال: help, scan, files, radar)...' : 'Type a command (e.g., help, scan, files, radar)...'}
          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-100 placeholder-gray-600 font-mono-tactical"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          className={`p-1.5 rounded bg-gray-900 hover:bg-gray-800 ${themeColors.text} border border-gray-800 transition-all cursor-pointer`}
          title="Execute Command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

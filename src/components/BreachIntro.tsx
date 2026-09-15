import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Terminal, Lock, Key, Cpu, Radio, CheckCircle2, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { soundEngine } from '../utils/audio';

interface BreachIntroProps {
  language: Language;
  soundEnabled: boolean;
  onComplete: () => void;
  onToggleSound: () => void;
}

export const BreachIntro: React.FC<BreachIntroProps> = ({
  language,
  soundEnabled,
  onComplete,
  onToggleSound
}) => {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [hexStream, setHexStream] = useState<string[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [biometricScanned, setBiometricScanned] = useState(false);

  const isAr = language === 'ar';

  const introStepsAr = [
    'بدء الاتصال بالعقدة المظلمة 185.220.101.4...',
    'تجاوز الجدار الناري العسكري فئة 4 (Military Grade Firewalls)...',
    'حقن برمجية الاستغلال في الذاكرة المؤقتة (Zero-Day Injected)...',
    'كسر التشفير الكمومي للبروتوكول RSA-4096...',
    'محاكاة البصمة البيومترية وشبكية العين للرتبة الخامسة...',
    'اختراق موجه الأوامر المركزي وإلغاء صلاحيات الحظر...',
    'تم اختراق البوابة بنجاح! مرحباً بالعميل الميداني.'
  ];

  const introStepsEn = [
    'Initiating connection to quantum dark relay 185.220.101.4...',
    'Bypassing military grade Layer-4 firewall matrix...',
    'Injecting Zero-Day exploit payload into kernel memory...',
    'Brute-forcing quantum-resistant RSA-4096 master key...',
    'Spoofing biometric retinal clearance vector: Level-5 Operative...',
    'Elevating root permissions and suppressing security alarms...',
    'PORTAL COMPROMISED. WELCOME, FIELD OPERATIVE.'
  ];

  const currentSteps = isAr ? introStepsAr : introStepsEn;

  // Generate continuous pseudo hex dump
  useEffect(() => {
    const hexInterval = setInterval(() => {
      const chars = '0123456789ABCDEF';
      let row = '0x' + Math.floor(Math.random() * 0xFFFFF).toString(16).padStart(5, '0').toUpperCase() + ' ';
      for (let i = 0; i < 8; i++) {
        let chunk = '';
        for (let j = 0; j < 2; j++) {
          chunk += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        row += chunk + ' ';
      }
      setHexStream((prev) => [row, ...prev.slice(0, 11)]);
      if (Math.random() > 0.6) {
        soundEngine.playBreachChirp(soundEnabled);
      }
    }, 90);

    return () => clearInterval(hexInterval);
  }, [soundEnabled]);

  // Handle stage and progress progression
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const stepInc = Math.floor(Math.random() * 4) + 2;
        const next = Math.min(prev + stepInc, 100);

        // Update logs based on progress percentage
        const stepIndex = Math.min(Math.floor((next / 100) * currentSteps.length), currentSteps.length - 1);
        if (stepIndex !== stage) {
          setStage(stepIndex);
          setConsoleLogs((logs) => [...logs, currentSteps[stepIndex]]);
          soundEngine.playKeyClick(soundEnabled);

          if (stepIndex === 4) {
            setBiometricScanned(true);
            soundEngine.playTargetLock(soundEnabled);
          }
        }

        if (next === 100) {
          soundEngine.playAccessGranted(soundEnabled);
        }

        return next;
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, [currentSteps, stage, soundEnabled]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-emerald-400 font-mono-tactical flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 hud-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      {/* Top Bar with Audio and Skip Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs text-emerald-500/80 bg-black/70 border border-emerald-500/30 px-3 py-1.5 rounded">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>CYBER-INTRUSION DETECTED // PROTOCOL 0x99</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 text-xs text-emerald-400/80 hover:text-emerald-300 bg-black/70 border border-emerald-500/30 px-3 py-1.5 rounded hover:bg-emerald-950/30 transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            <span className="hidden sm:inline">{soundEnabled ? (isAr ? 'الصوت مشغل' : 'Sound ON') : (isAr ? 'صامت' : 'Muted')}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playAccessGranted(soundEnabled);
              onComplete();
            }}
            className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/60 hover:border-emerald-400 hover:bg-emerald-900/60 px-4 py-1.5 rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <span>{isAr ? 'تخطي الاختراق والدخول' : 'Skip Breach & Enter'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Breach Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl bg-gray-950/90 border border-emerald-500/40 rounded-lg p-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-md"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-emerald-300 font-display-tactical uppercase">
              {isAr ? 'محاكاة اختراق المنظومة الأمنية' : 'Security Perimeter Intrusion Sequence'}
            </span>
          </div>
          <span className="text-xs text-emerald-500/60 font-mono-tactical">
            TARGET: BLACK-NODE.INTRA // PORT 9943
          </span>
        </div>

        {/* Dynamic Hex & Stream Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Hex Stream Column */}
          <div className="bg-black/80 border border-emerald-500/20 rounded p-3 text-[11px] leading-tight text-emerald-500/70 h-36 overflow-hidden flex flex-col justify-end">
            <div className="text-xs text-emerald-400 font-bold mb-1 border-b border-emerald-500/20 pb-1 flex justify-between">
              <span>{isAr ? 'سيل التشفير الخام' : 'RAW CIPHER DUMP'}</span>
              <span className="text-emerald-300 animate-pulse">LIVE</span>
            </div>
            {hexStream.map((line, idx) => (
              <div key={idx} className="font-mono-tactical tracking-tighter opacity-80 truncate">
                {line}
              </div>
            ))}
          </div>

          {/* Biometric / Node Status */}
          <div className="bg-black/80 border border-emerald-500/20 rounded p-3 flex flex-col justify-between h-36">
            <div className="text-xs text-emerald-400 font-bold border-b border-emerald-500/20 pb-1 flex justify-between">
              <span>{isAr ? 'المطابقة البيومترية' : 'BIOMETRIC OVERRIDE'}</span>
              <span className={biometricScanned ? 'text-emerald-400 font-bold' : 'text-amber-400 animate-pulse'}>
                {biometricScanned ? (isAr ? 'مقبول' : 'VERIFIED') : (isAr ? 'جاري الفحص...' : 'SCANNING...')}
              </span>
            </div>

            <div className="flex items-center justify-center py-1">
              <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/50 flex items-center justify-center animate-spin">
                <div className="w-10 h-10 rounded-full border border-emerald-400 flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-center text-emerald-400/90 font-mono-tactical">
              {biometricScanned
                ? (isAr ? 'العميل: الشبح (Spectre) // تصريح: فئة 5' : 'IDENTITY: SPECTRE-07 // LEVEL 5')
                : (isAr ? 'جاري اختراق مستشعر شبكية العين...' : 'Bypassing optical retinal sensor...')}
            </div>
          </div>
        </div>

        {/* Progress Bar with glowing animation */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-emerald-300">
              {isAr ? 'تقدم الاختراق وفك التشفير:' : 'BREACH & DECRYPTION PROGRESS:'}
            </span>
            <span className="text-emerald-400 font-mono-tactical font-bold text-sm">
              {progress}%
            </span>
          </div>

          <div className="w-full bg-gray-900 h-3.5 rounded-full border border-emerald-500/40 p-0.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Real-time Exploit Log Console */}
        <div className="bg-black/90 border border-emerald-500/30 rounded p-3 h-28 overflow-y-auto text-xs space-y-1 text-emerald-400/90 font-mono-tactical">
          {consoleLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-emerald-500/50 select-none">[{index + 1}]</span>
              <span className={index === consoleLogs.length - 1 ? 'text-emerald-200 font-bold' : 'text-emerald-400/80'}>
                {log}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA when 100% */}
        <AnimatePresence>
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-emerald-500/30"
            >
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold glow-emerald">
                  {isAr ? 'تم فتح جميع الصلاحيات الاستخباراتية بنجاح' : 'ALL COVERT OPERATIONAL NODES ACCESSED'}
                </span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playAccessGranted(soundEnabled);
                  onComplete();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 text-black font-bold font-display-tactical text-sm tracking-wider uppercase rounded hover:bg-emerald-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
              >
                {isAr ? 'الدخول إلى بوابة العمليات ⏎' : 'ENTER OPERATIONS PORTAL ⏎'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cyberpunk Footer Watermark */}
      <div className="absolute bottom-3 text-center text-[10px] text-emerald-500/40 tracking-widest font-mono-tactical">
        COVERT OPERATIONS BLACK-PORTAL // AUTHORIZED MILITARY PERSONNEL ONLY
      </div>
    </div>
  );
};

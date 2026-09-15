import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, ShieldAlert, Key, Unlock, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import { soundEngine } from '../utils/audio';

interface LockdownModalProps {
  language: Language;
  soundEnabled: boolean;
  onDismiss: () => void;
}

export const LockdownModal: React.FC<LockdownModalProps> = ({
  language,
  soundEnabled,
  onDismiss
}) => {
  const isAr = language === 'ar';
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    soundEngine.startAlarmSiren(soundEnabled);
    return () => {
      soundEngine.stopAlarmSiren();
    };
  }, [soundEnabled]);

  const handleKeyClick = (num: string) => {
    soundEngine.playKeyClick(soundEnabled);
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError(false);
    }
  };

  const handleClear = () => {
    soundEngine.playKeyClick(soundEnabled);
    setPin('');
    setError(false);
  };

  const handleVerify = () => {
    if (pin === '9941' || pin === '0000' || pin.length === 4) {
      soundEngine.stopAlarmSiren();
      soundEngine.playAccessGranted(soundEnabled);
      onDismiss();
    } else {
      soundEngine.playAccessDenied(soundEnabled);
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 flex items-center justify-center p-4 font-mono-tactical">
      {/* Background strobe / alert */}
      <div className="absolute inset-0 bg-red-600/15 pointer-events-none animate-pulse" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-black/95 border-2 border-red-500 rounded-lg p-6 shadow-[0_0_50px_rgba(239,68,68,0.5)] text-center text-red-100"
      >
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center text-red-400 animate-bounce">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-black text-red-400 font-display-tactical tracking-widest uppercase">
          {isAr ? 'بروتوكول الإغلاق التام للمنشأة' : 'FACILITY RED-ALERT LOCKDOWN'}
        </h2>
        <p className="text-xs text-red-300/80 mt-1 mb-4">
          {isAr
            ? 'تم إغلاق البوابات الهيدروليكية وعزل الخوادم وتفعيل الإنذار الصوتي العام.'
            : 'All hydraulic bulkheads sealed. Air-gap isolation engaged. Klaxons active.'}
        </p>

        {/* Security PIN Display */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 mb-1">
            {isAr ? 'أدخل رمز إلغاء الطوارئ (رمز التخطي: 9941):' : 'ENTER OVERRIDE AUTHORIZATION (KEY: 9941):'}
          </div>
          <div className="h-10 bg-red-950/40 border border-red-500/60 rounded flex items-center justify-center text-lg font-bold tracking-[0.5em] text-red-300">
            {pin.padEnd(4, '•')}
          </div>
          {error && (
            <div className="text-xs text-red-400 font-bold mt-1 animate-pulse">
              {isAr ? 'رمز غير صحيح! تصريح مرفوض' : 'INVALID OVERRIDE CODE! ACCESS DENIED'}
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyClick(digit)}
              className="py-2.5 bg-gray-900/90 hover:bg-red-900/50 text-red-200 border border-red-500/30 rounded text-sm font-bold active:scale-95 cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-2.5 bg-gray-900/90 hover:bg-gray-800 text-gray-400 border border-red-500/30 rounded text-xs font-bold cursor-pointer"
          >
            CLR
          </button>
          <button
            onClick={() => handleKeyClick('0')}
            className="py-2.5 bg-gray-900/90 hover:bg-red-900/50 text-red-200 border border-red-500/30 rounded text-sm font-bold cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleVerify}
            className="py-2.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold shadow-[0_0_15px_#dc2626] cursor-pointer"
          >
            OK
          </button>
        </div>

        {/* Emergency Fast Override Button */}
        <button
          onClick={() => {
            soundEngine.stopAlarmSiren();
            soundEngine.playAccessGranted(soundEnabled);
            onDismiss();
          }}
          className="w-full py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/50 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Unlock className="w-4 h-4 text-red-400" />
          <span>{isAr ? 'إلغاء الإغلاق واستعادة السيطرة الفورية' : 'EMERGENCY OVERRIDE & RESTORE ACCESS'}</span>
        </button>
      </motion.div>
    </div>
  );
};

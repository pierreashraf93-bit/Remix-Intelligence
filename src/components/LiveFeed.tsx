import React, { useState, useEffect } from 'react';
import { Video, Camera, Maximize2, ShieldAlert, Compass, Eye, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw, AlertCircle, Sparkles, Download, Copy, Check } from 'lucide-react';
import { Language, CameraFeed, VisionMode } from '../types';
import { soundEngine } from '../utils/audio';
import { triggerFileDownload, copyTextToClipboard } from '../utils/downloadHelper';

interface LiveFeedProps {
  language: Language;
  soundEnabled: boolean;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ language, soundEnabled }) => {
  const isAr = language === 'ar';

  const defaultFeeds: CameraFeed[] = [
    {
      id: 'cam-01',
      number: 1,
      nameAr: 'الخزينة المركزية المحصنة',
      nameEn: 'Subterranean Vault Alpha',
      sector: 'SECTOR-01-SUB',
      status: 'ONLINE',
      fps: 60,
      visionMode: 'tactical',
      pan: 0,
      tilt: 0,
      zoom: 1,
      hasMotion: false,
      locationAr: 'المستوى -3 // المنشأة المحصنة',
      locationEn: 'Sub-Level 3 // Secure Complex',
      tempCelsius: 18.2,
      securityZone: 'ZONE-A RESTRICTED'
    },
    {
      id: 'cam-02',
      number: 2,
      nameAr: 'مهبط الطائرات والمحيط الخارجي',
      nameEn: 'Rooftop Helipad & Perimeter',
      sector: 'SECTOR-04-AIR',
      status: 'ONLINE',
      fps: 30,
      visionMode: 'nvg',
      pan: 10,
      tilt: -5,
      zoom: 1.2,
      hasMotion: false,
      locationAr: 'السطح الشمالي // مهبط الطوارئ',
      locationEn: 'North Roof // Emergency Helipad',
      tempCelsius: 12.5,
      securityZone: 'ZONE-B PERIMETER'
    },
    {
      id: 'cam-03',
      number: 3,
      nameAr: 'مركز الخوادم والقلب المشفر',
      nameEn: 'Mainframe Server Core',
      sector: 'SECTOR-02-CORE',
      status: 'ONLINE',
      fps: 60,
      visionMode: 'flir',
      pan: -5,
      tilt: 5,
      zoom: 1,
      hasMotion: false,
      locationAr: 'غرفة الحواسيب الفائقة المعزولة',
      locationEn: 'Air-Gapped Supercluster Room',
      tempCelsius: 24.8,
      securityZone: 'ZONE-S ZERO TRUST'
    },
    {
      id: 'cam-04',
      number: 4,
      nameAr: 'نقطة المراقبة الحضرية والشارع',
      nameEn: 'Urban Intercept Checkpoint',
      sector: 'SECTOR-08-EXT',
      status: 'ONLINE',
      fps: 30,
      visionMode: 'wireframe',
      pan: 15,
      tilt: -10,
      zoom: 1.5,
      hasMotion: false,
      locationAr: 'تقاطع طريق الميناء السريع',
      locationEn: 'Harbor Expressway Junction',
      tempCelsius: 19.4,
      securityZone: 'EXTERNAL ASSET'
    }
  ];

  const [feeds, setFeeds] = useState<CameraFeed[]>(defaultFeeds);
  const [activeCamIndex, setActiveCamIndex] = useState<number>(0);
  const [currentTimeCode, setCurrentTimeCode] = useState<string>('');
  const [snapshots, setSnapshots] = useState<{ id: string; time: string; cam: string }[]>([]);
  const [motionAlert, setMotionAlert] = useState<boolean>(false);

  const activeCam = feeds[activeCamIndex];

  // Dynamic real-time timecode with milliseconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTimeCode(`${h}:${m}:${s}:${ms}`);
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const switchCamera = (index: number) => {
    soundEngine.playCameraStatic(soundEnabled);
    setActiveCamIndex(index);
  };

  const setVisionMode = (mode: VisionMode) => {
    soundEngine.playKeyClick(soundEnabled);
    setFeeds((prev) =>
      prev.map((cam, idx) => (idx === activeCamIndex ? { ...cam, visionMode: mode } : cam))
    );
  };

  const adjustPTZ = (dx: number, dy: number, dz: number = 0) => {
    soundEngine.playKeyClick(soundEnabled);
    setFeeds((prev) =>
      prev.map((cam, idx) => {
        if (idx !== activeCamIndex) return cam;
        return {
          ...cam,
          pan: Math.max(-45, Math.min(45, cam.pan + dx)),
          tilt: Math.max(-30, Math.min(30, cam.tilt + dy)),
          zoom: Math.max(0.8, Math.min(2.5, Number((cam.zoom + dz).toFixed(1))))
        };
      })
    );
  };

  const triggerMotionSimulation = () => {
    soundEngine.playTargetLock(soundEnabled);
    setMotionAlert(true);
    setTimeout(() => setMotionAlert(false), 5000);
  };

  const captureSnapshot = () => {
    soundEngine.playKeyClick(soundEnabled);
    const newSnap = {
      id: String(Date.now()),
      time: currentTimeCode,
      cam: isAr ? activeCam.nameAr : activeCam.nameEn
    };
    setSnapshots((prev) => [newSnap, ...prev.slice(0, 4)]);
  };

  // Visual filter for current vision mode
  const getVisionFilterClasses = (mode: VisionMode) => {
    switch (mode) {
      case 'nvg':
        return 'brightness-110 contrast-150 saturate-200 hue-rotate-[65deg] bg-emerald-950/40 text-emerald-400';
      case 'flir':
        return 'brightness-125 contrast-200 invert hue-rotate-[180deg] text-amber-300';
      case 'wireframe':
        return 'contrast-200 saturate-50 text-cyan-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950/90 border border-emerald-500/40 rounded-lg overflow-hidden font-mono-tactical shadow-2xl backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black/80 border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-sm font-bold text-emerald-300 font-display-tactical tracking-wider uppercase">
            {isAr ? 'مصفوفة بث المراقبة الحية' : 'LIVE SURVEILLANCE MATRIX'}
          </h2>
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-950/70 text-red-400 border border-red-500/40 font-bold animate-pulse">
            ● REC
          </span>
        </div>

        {/* Cam Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {feeds.map((cam, idx) => (
            <button
              key={cam.id}
              onClick={() => switchCamera(idx)}
              className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer whitespace-nowrap font-bold ${
                activeCamIndex === idx
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-black/60 text-gray-400 border-gray-800 hover:border-gray-600'
              }`}
            >
              CAM 0{cam.number}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport & Controls */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Main Surveillance Viewport */}
        <div className="lg:col-span-9 bg-black relative flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-e border-emerald-500/20">
          {/* Active Cam Simulation Graphic Canvas / Scene */}
          <div
            className={`w-full h-full relative flex items-center justify-center transition-all duration-300 ${getVisionFilterClasses(
              activeCam.visionMode
            )}`}
            style={{
              transform: `scale(${activeCam.zoom}) translate(${activeCam.pan}px, ${activeCam.tilt}px)`
            }}
          >
            {/* Cam 1: Vault Alpha */}
            {activeCam.number === 1 && (
              <div className="w-full h-full relative bg-radial from-gray-900 to-black p-6 flex flex-col justify-between overflow-hidden">
                {/* Vault Door Graphic */}
                <div className="absolute inset-0 flex items-center justify-center opacity-60">
                  <div className="w-64 h-64 rounded-full border-4 border-emerald-500/40 flex items-center justify-center relative">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-emerald-400/50 flex items-center justify-center animate-spin">
                      <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center">
                        <span className="text-xs font-bold tracking-widest text-emerald-300">VAULT-01</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laser tripwire simulation */}
                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] opacity-75" />

                {/* Patrolling sentry tag */}
                <div className="absolute bottom-16 left-1/4 border border-emerald-400 bg-emerald-950/60 px-2 py-1 text-[10px] rounded animate-bounce">
                  [SENTRY_BOT_04] // PATROL NOMINAL
                </div>
              </div>
            )}

            {/* Cam 2: Helipad / Perimeter */}
            {activeCam.number === 2 && (
              <div className="w-full h-full relative bg-gray-950 p-6 flex flex-col justify-between overflow-hidden">
                {/* Helipad 'H' circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <div className="w-72 h-72 rounded-full border-2 border-emerald-400/40 flex items-center justify-center">
                    <span className="text-8xl font-black text-emerald-400/30 select-none">H</span>
                  </div>
                </div>

                {/* Circling UAV Recon Drone */}
                <div className="absolute top-1/4 right-1/4 p-2 border border-emerald-400/80 rounded bg-black/60 text-[10px] flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>UAV_RECON_VECTOR // ALT 450M</span>
                </div>

                {/* Wind / Rain Weather readout */}
                <div className="absolute bottom-12 right-6 text-[10px] space-y-0.5 text-emerald-300/80 bg-black/60 p-2 rounded border border-emerald-500/30">
                  <div>WIND: 14 KTS // 340° NNW</div>
                  <div>BARO: 1014 hPa // OVERCAST</div>
                  <div>VISIBILITY: 8.5 KM</div>
                </div>
              </div>
            )}

            {/* Cam 3: Mainframe Core */}
            {activeCam.number === 3 && (
              <div className="w-full h-full relative bg-black p-6 flex flex-col justify-between overflow-hidden">
                {/* Server racks in grid */}
                <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-40">
                  {[1, 2, 3, 4].map((rack) => (
                    <div key={rack} className="border border-amber-500/40 rounded p-2 flex flex-col justify-between">
                      <div className="text-[10px] text-amber-400">RACK_{rack}</div>
                      <div className="space-y-1">
                        {[1, 2, 3, 4, 5, 6].map((slot) => (
                          <div key={slot} className="h-2 bg-amber-500/20 rounded flex items-center px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] text-amber-400/60">TEMP: 22°C</div>
                    </div>
                  ))}
                </div>

                {/* Heat sensor core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border border-amber-400/60 bg-amber-950/40 p-4 rounded text-center">
                    <div className="text-xs font-bold text-amber-300">THERMAL HOTSPOT // CLUSTER 0x09</div>
                    <div className="text-xl font-bold text-amber-400 mt-1">42.8°C [NOMINAL]</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cam 4: Urban Street Intercept */}
            {activeCam.number === 4 && (
              <div className="w-full h-full relative bg-gray-950 p-6 flex flex-col justify-between overflow-hidden">
                {/* Road perspective lines */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-full h-full border-t border-b border-dashed border-cyan-400/40 rotate-12" />
                </div>

                {/* Target tracking box */}
                <div className="absolute top-1/3 left-1/3 border-2 border-cyan-400 p-3 bg-black/60 rounded text-[10px] text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <div className="font-bold flex items-center justify-between gap-3">
                    <span>TARGET LOCKED: COURIER-B</span>
                    <span className="text-red-400 animate-pulse">ALERT</span>
                  </div>
                  <div>SPEED: 48 KM/H // VECTOR 180°</div>
                  <div>CONFIDENCE: 94.2% [RECOGNIZED]</div>
                </div>
              </div>
            )}
          </div>

          {/* CRT Scanline and Vignette Layer */}
          <div className="absolute inset-0 crt-overlay pointer-events-none" />

          {/* Crosshair Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-32 h-32 border border-emerald-500/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500/60 rounded-full" />
            </div>
            <div className="absolute w-full h-[1px] bg-emerald-500/15" />
            <div className="absolute h-full w-[1px] bg-emerald-500/15" />
          </div>

          {/* Top In-Feed Telemetry Overlay */}
          <div className="absolute top-3 start-3 end-3 flex items-center justify-between text-xs font-mono-tactical text-emerald-300 bg-black/70 px-3 py-1.5 rounded border border-emerald-500/30 select-none">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">● LIVE</span>
              <span>CAM 0{activeCam.number}: {isAr ? activeCam.nameAr : activeCam.nameEn}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>{currentTimeCode}</span>
              <span className="hidden sm:inline">FPS: {activeCam.fps}</span>
              <span className="hidden sm:inline">{activeCam.sector}</span>
            </div>
          </div>

          {/* Bottom In-Feed Overlay */}
          <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-[11px] font-mono-tactical text-emerald-400/90 bg-black/70 px-3 py-1 rounded border border-emerald-500/30 select-none">
            <div>{isAr ? activeCam.locationAr : activeCam.locationEn}</div>
            <div className="flex items-center gap-3">
              <span>TEMP: {activeCam.tempCelsius}°C</span>
              <span>ZOOM: {activeCam.zoom}x</span>
              <span className="text-emerald-300 font-bold">{activeCam.securityZone}</span>
            </div>
          </div>

          {/* Motion Alert Flasher */}
          {motionAlert && (
            <div className="absolute inset-0 bg-red-600/20 border-4 border-red-500 pointer-events-none flex items-center justify-center animate-pulse">
              <div className="bg-red-950/90 border-2 border-red-500 text-red-100 px-6 py-3 rounded-lg text-center shadow-2xl">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-1 animate-bounce" />
                <div className="text-base font-bold tracking-wider">
                  {isAr ? 'إنذار: تم رصد حركة مشبوهة في القطاع!' : 'MOTION SENSOR ALARM: BREACH DETECTED!'}
                </div>
                <div className="text-xs text-red-300 mt-0.5">SECTOR: {activeCam.sector} // GRID 04</div>
              </div>
            </div>
          )}
        </div>

        {/* Right/Bottom Controls Panel */}
        <div className="lg:col-span-3 bg-gray-950/90 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          {/* Vision Modes */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'أوضاع الرؤية التكتيكية' : 'VISION MODES'}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(['tactical', 'nvg', 'flir', 'wireframe'] as VisionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setVisionMode(mode)}
                  className={`py-1.5 px-2 rounded border text-center font-bold uppercase transition-all cursor-pointer text-[11px] ${
                    activeCam.visionMode === mode
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-black/60 text-gray-300 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* PTZ Camera Pan / Tilt / Zoom Controls */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'التحكم بالكاميرا (PTZ)' : 'PTZ CONTROLS'}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => adjustPTZ(0, 5)}
                className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                title="Tilt Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustPTZ(-5, 0)}
                  className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                  title="Pan Left"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-full border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                  PTZ
                </div>
                <button
                  onClick={() => adjustPTZ(5, 0)}
                  className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                  title="Pan Right"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => adjustPTZ(0, -5)}
                className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                title="Tilt Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-800">
              <span className="text-[11px] text-gray-400">{isAr ? 'التقريب:' : 'ZOOM:'}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => adjustPTZ(0, 0, -0.2)}
                  className="p-1 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-emerald-400 font-bold px-1.5">{activeCam.zoom}x</span>
                <button
                  onClick={() => adjustPTZ(0, 0, 0.2)}
                  className="p-1 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded border border-gray-800 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <button
              onClick={captureSnapshot}
              className="w-full py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'التقاط صورة للرصد' : 'Capture Snapshot'}</span>
            </button>

            <button
              onClick={triggerMotionSimulation}
              className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isAr ? 'محاكاة إنذار حركة' : 'Trigger Motion Alarm'}</span>
            </button>
          </div>

          {/* Recent Snapshots */}
          {snapshots.length > 0 && (
            <div className="pt-2 border-t border-gray-800">
              <div className="text-[10px] text-gray-400 font-bold mb-1.5 uppercase flex items-center justify-between">
                <span>{isAr ? 'اللقطات المحفوظة:' : 'INTERCEPTED SNAPSHOTS:'}</span>
                <button
                  onClick={() => {
                    soundEngine.playKeyClick(soundEnabled);
                    const logContent = snapshots
                      .map((s, i) => `[SNAP-${i + 1}] TIME: ${s.time} | CAM: ${s.cam}`)
                      .join('\n');
                    triggerFileDownload(`SURVEILLANCE_LOGS_${new Date().toISOString().slice(0, 10)}.txt`, logContent);
                  }}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  title="Download All Snapshot Logs"
                >
                  <Download className="w-3 h-3" />
                  <span>{isAr ? 'تنزيل السجل' : 'Download Log'}</span>
                </button>
              </div>
              <div className="space-y-1">
                {snapshots.map((s) => (
                  <div key={s.id} className="text-[10px] bg-black/60 p-1.5 rounded border border-gray-800 flex items-center justify-between text-gray-300">
                    <span className="truncate max-w-[110px]">{s.cam}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">{s.time}</span>
                      <button
                        onClick={() => {
                          soundEngine.playKeyClick(soundEnabled);
                          copyTextToClipboard(`SURVEILLANCE INTERCEPT: ${s.cam} @ ${s.time}`);
                        }}
                        className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-emerald-300 cursor-pointer"
                        title={isAr ? 'نسخ بيانات اللقطة' : 'Copy snapshot telemetry'}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

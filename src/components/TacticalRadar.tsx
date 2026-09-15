import React, { useRef, useEffect, useState } from 'react';
import { Radio, Crosshair, Zap, Shield, AlertTriangle, Disc, RefreshCw, Compass } from 'lucide-react';
import { Language, RadarTarget } from '../types';
import { soundEngine } from '../utils/audio';

interface TacticalRadarProps {
  language: Language;
  soundEnabled: boolean;
  targets: RadarTarget[];
  onUpdateTarget: (id: string, updates: Partial<RadarTarget>) => void;
}

export const TacticalRadar: React.FC<TacticalRadarProps> = ({
  language,
  soundEnabled,
  targets,
  onUpdateTarget
}) => {
  const isAr = language === 'ar';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id || '');
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.2); // radians per second
  const [radarRange, setRadarRange] = useState<number>(50); // km
  const [filterType, setFilterType] = useState<string>('ALL');

  const selectedTarget = targets.find((t) => t.id === selectedTargetId) || targets[0];

  // Radar Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let lastTime = performance.now();
    let lastBeepedTargetId = '';

    const render = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      angle = (angle + sweepSpeed * delta) % (Math.PI * 2);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 25;

      // Clear with dark trail
      ctx.fillStyle = 'rgba(3, 7, 18, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid / Concentric Rings
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;

      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * ratio, 0, Math.PI * 2);
        ctx.stroke();

        // Distance label on ring
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillText(`${Math.round(radarRange * ratio)}km`, centerX + 4, centerY - radius * ratio + 12);
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Azimuth markers (0°, 90°, 180°, 270°)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.font = 'bold 11px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('000° N', centerX, centerY - radius - 8);
      ctx.fillText('090° E', centerX + radius + 18, centerY + 4);
      ctx.fillText('180° S', centerX, centerY + radius + 16);
      ctx.fillText('270° W', centerX - radius - 18, centerY + 4);

      // Draw Radar Sweep Beam (Pie gradient)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle - 0.45, angle);
      ctx.closePath();

      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      sweepGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sharp leading sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Render Target Blips
      targets.forEach((target) => {
        // Position on radar
        const targetRad = (target.angleDeg * Math.PI) / 180;
        const normDist = Math.min(target.distanceKm / radarRange, 1);
        const tx = centerX + radius * normDist * Math.cos(targetRad);
        const ty = centerY + radius * normDist * Math.sin(targetRad);

        // Check if sweep beam is currently passing over target
        const diff = Math.abs((angle % (Math.PI * 2)) - (targetRad % (Math.PI * 2)));
        const isSwept = diff < 0.15 || diff > Math.PI * 2 - 0.15;

        if (isSwept && lastBeepedTargetId !== target.id) {
          lastBeepedTargetId = target.id;
          soundEngine.playRadarPing(soundEnabled);
        }

        const isSelected = target.id === selectedTargetId;

        ctx.save();
        // Target color based on threat
        let targetColor = '#10b981';
        if (target.status === 'JAMMED') {
          targetColor = '#06b6d4'; // Cyan when jammed
        } else if (target.threatLevel === 'CRITICAL') {
          targetColor = '#ef4444';
        } else if (target.threatLevel === 'HIGH') {
          targetColor = '#f59e0b';
        }

        ctx.fillStyle = targetColor;
        ctx.shadowColor = targetColor;
        ctx.shadowBlur = isSwept || isSelected ? 12 : 4;

        // Draw blip shape
        ctx.beginPath();
        if (target.type === 'hostile_air') {
          // Triangle for hostile
          ctx.moveTo(tx, ty - 5);
          ctx.lineTo(tx + 5, ty + 5);
          ctx.lineTo(tx - 5, ty + 5);
          ctx.closePath();
        } else {
          ctx.arc(tx, ty, isSelected ? 6 : 4, 0, Math.PI * 2);
        }
        ctx.fill();

        // If selected, draw lock reticle ring
        if (isSelected) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(tx, ty, 14, 0, Math.PI * 2);
          ctx.stroke();

          // Reticle tick marks
          ctx.strokeRect(tx - 18, ty - 1, 6, 2);
          ctx.strokeRect(tx + 12, ty - 1, 6, 2);
        }

        // Target Tag text
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = targetColor;
        ctx.fillText(target.callsign, tx + 8, ty - 4);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [sweepSpeed, radarRange, targets, selectedTargetId, soundEnabled]);

  // Handle canvas click to select nearest target
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 25;

    // Find closest target
    let closestTarget: RadarTarget | null = null;
    let minDistance = 35; // pixel threshold

    targets.forEach((t) => {
      const targetRad = (t.angleDeg * Math.PI) / 180;
      const normDist = Math.min(t.distanceKm / radarRange, 1);
      const tx = centerX + radius * normDist * Math.cos(targetRad);
      const ty = centerY + radius * normDist * Math.sin(targetRad);

      const d = Math.hypot(clickX - tx, clickY - ty);
      if (d < minDistance) {
        minDistance = d;
        closestTarget = t;
      }
    });

    if (closestTarget) {
      soundEngine.playTargetLock(soundEnabled);
      setSelectedTargetId((closestTarget as RadarTarget).id);
    }
  };

  const handleToggleJamming = (targetId: string) => {
    soundEngine.playBreachChirp(soundEnabled);
    const target = targets.find((t) => t.id === targetId);
    if (!target) return;
    const newStatus = target.status === 'JAMMED' ? 'TRACKING' : 'JAMMED';
    onUpdateTarget(targetId, { status: newStatus });
  };

  const handleTransponderPing = () => {
    soundEngine.playRadarPing(soundEnabled);
  };

  return (
    <div className="h-full flex flex-col bg-gray-950/90 border border-emerald-500/40 rounded-lg overflow-hidden font-mono-tactical shadow-2xl backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black/80 border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold text-emerald-300 font-display-tactical tracking-wider uppercase">
            {isAr ? 'منظومة الرادار والتتبع التكتيكي' : 'TACTICAL RADAR INTERCEPT ARRAY'}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-bold">
            360° ACTIVE SWEEP
          </span>
        </div>

        {/* Range Selector Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 text-[11px]">{isAr ? 'المدى:' : 'RANGE:'}</span>
          {[25, 50, 100].map((r) => (
            <button
              key={r}
              onClick={() => {
                soundEngine.playKeyClick(soundEnabled);
                setRadarRange(r);
              }}
              className={`px-2.5 py-1 rounded border transition-all cursor-pointer font-bold ${
                radarRange === r
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-black/60 text-gray-400 border-gray-800 hover:border-gray-600'
              }`}
            >
              {r} KM
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Radar Canvas Display */}
        <div className="lg:col-span-8 bg-black relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-e border-emerald-500/20 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={520}
            height={520}
            onClick={handleCanvasClick}
            className="w-full max-w-[480px] aspect-square rounded-full border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] cursor-crosshair"
          />

          {/* Radar Scanline Overlay */}
          <div className="absolute inset-0 crt-overlay pointer-events-none" />

          {/* Quick instructions badge */}
          <div className="absolute bottom-3 start-3 text-[11px] text-emerald-500/70 bg-black/80 px-2.5 py-1 rounded border border-emerald-500/20 pointer-events-none">
            {isAr ? 'انقر على أي إشارة رادارية للقفل والتتبع' : 'Click on any blip to lock target'}
          </div>
        </div>

        {/* Target Details & Intercept Controls */}
        <div className="lg:col-span-4 bg-gray-950/90 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          {/* Target Dossier Card */}
          {selectedTarget ? (
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">
                    {isAr ? 'الهدف المقفول' : 'LOCKED TARGET'}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                      selectedTarget.threatLevel === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border-red-500'
                        : selectedTarget.threatLevel === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border-amber-500'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    }`}
                  >
                    {selectedTarget.threatLevel}
                  </span>
                </div>

                <div className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-red-400 animate-spin" />
                  <span>{selectedTarget.callsign}</span>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/60 p-2.5 rounded border border-gray-800">
                  <span className="text-[10px] text-gray-500 block">{isAr ? 'المسافة' : 'DISTANCE'}</span>
                  <span className="text-emerald-400 font-bold">{selectedTarget.distanceKm} KM</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded border border-gray-800">
                  <span className="text-[10px] text-gray-500 block">{isAr ? 'الاتجاه' : 'BEARING'}</span>
                  <span className="text-emerald-400 font-bold">{selectedTarget.bearing} ({selectedTarget.angleDeg}°)</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded border border-gray-800">
                  <span className="text-[10px] text-gray-500 block">{isAr ? 'السرعة' : 'VELOCITY'}</span>
                  <span className="text-emerald-400 font-bold">{selectedTarget.speedKnots} KTS</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded border border-gray-800">
                  <span className="text-[10px] text-gray-500 block">{isAr ? 'الارتفاع' : 'ALTITUDE'}</span>
                  <span className="text-emerald-400 font-bold">{selectedTarget.altitudeFt} FT</span>
                </div>
              </div>

              {/* Status & IFF Transponder */}
              <div className="bg-black/60 p-2.5 rounded border border-gray-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">{isAr ? 'معرف المستجيب:' : 'TRANSPONDER ID:'}</span>
                  <span className="text-emerald-300 font-bold">{selectedTarget.transponderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isAr ? 'حالة التتبع:' : 'TRACKING STATE:'}</span>
                  <span className={selectedTarget.status === 'JAMMED' ? 'text-cyan-400 font-bold animate-pulse' : 'text-emerald-400 font-bold'}>
                    {selectedTarget.status}
                  </span>
                </div>
              </div>

              {/* Tactical Notes */}
              <div className="bg-black/40 border-s-2 border-emerald-500 p-2.5 text-xs text-gray-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-0.5 text-[11px]">
                  {isAr ? 'تقييم التهديد التكتيكي:' : 'TACTICAL ASSESSMENT:'}
                </span>
                {isAr ? selectedTarget.notesAr : selectedTarget.notesEn}
              </div>

              {/* Countermeasure Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <button
                  onClick={() => handleToggleJamming(selectedTarget.id)}
                  className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    selectedTarget.status === 'JAMMED'
                      ? 'bg-cyan-900/60 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-gray-900 hover:bg-gray-800 text-cyan-400 border-cyan-500/40'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {selectedTarget.status === 'JAMMED'
                      ? (isAr ? 'إلغاء التشويش الإلكتروني (ECM)' : 'DISENGAGE ECM JAMMING')
                      : (isAr ? 'تفعيل التشويش الإلكتروني (ECM)' : 'ENGAGE ECM JAMMING')}
                  </span>
                </button>

                <button
                  onClick={handleTransponderPing}
                  className="w-full py-2 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'إرسال نبضة استجواب راداري (IFF)' : 'TRANSMIT IFF INTERROGATION'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-500 py-8">
              {isAr ? 'اختر هدفاً من شاشة الرادار' : 'Select a target on radar to inspect.'}
            </div>
          )}

          {/* Sweep Speed Selector */}
          <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-400">{isAr ? 'سرعة المسح الراداري:' : 'SWEEP SPEED:'}</span>
            <div className="flex items-center gap-1">
              {[0.8, 1.5, 2.5].map((speed, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playKeyClick(soundEnabled);
                    setSweepSpeed(speed);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    sweepSpeed === speed
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-black text-gray-400 border-gray-800'
                  }`}
                >
                  {idx === 0 ? 'SLOW' : idx === 1 ? 'NORM' : 'RAPID'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { RadarTarget } from '../types';

export const INITIAL_RADAR_TARGETS: RadarTarget[] = [
  {
    id: 'tgt-01',
    callsign: 'GHOST-44',
    type: 'hostile_air',
    distanceKm: 28,
    angleDeg: 35,
    speedKnots: 1140, // Supersonic
    altitudeFt: 38000,
    threatLevel: 'CRITICAL',
    status: 'TRACKING',
    bearing: '035° NNE',
    transponderId: 'SPOOFED-IFF-0x91',
    notesAr: 'مقاتلة شبحية معادية من الجيل الخامس تقترب بسرعة تفوق سرعة الصوت نحو محيط المنشأة.',
    notesEn: 'Hostile Gen-5 stealth strike jet on high-speed ingress vector toward facility perimeter.'
  },
  {
    id: 'tgt-02',
    callsign: 'RECON-UAV-09',
    type: 'recon_drone',
    distanceKm: 18,
    angleDeg: 140,
    speedKnots: 260,
    altitudeFt: 46000,
    threatLevel: 'HIGH',
    status: 'TRACKING',
    bearing: '140° SE',
    transponderId: 'DRONE-SIGINT-44',
    notesAr: 'طائرة استطلاع بدون طيار تحلق على ارتفاع شاهق لجمع الإشارات اللاسلكية والتصوير الحراري.',
    notesEn: 'High-altitude SIGINT drone loitering over coastal sector for optical & electromagnetic surveillance.'
  },
  {
    id: 'tgt-03',
    callsign: 'PEGASUS-1',
    type: 'friendly_asset',
    distanceKm: 12,
    angleDeg: 265,
    speedKnots: 145,
    altitudeFt: 2800,
    threatLevel: 'FRIENDLY',
    status: 'TRACKING',
    bearing: '265° W',
    transponderId: 'FRIENDLY-SAR-01',
    notesAr: 'مروحية الإخلاء التكتيكي التابعة للعمليات الخاصة، جاهزة لسحب العميل عند إعطاء الإشارة.',
    notesEn: 'Special ops tactical extraction helicopter holding in holding pattern for operative recovery.'
  },
  {
    id: 'tgt-04',
    callsign: 'CORVETTE-X',
    type: 'naval_stealth',
    distanceKm: 42,
    angleDeg: 310,
    speedKnots: 34,
    altitudeFt: 0,
    threatLevel: 'HIGH',
    status: 'TRACKING',
    bearing: '310° NW',
    transponderId: 'UNKNOWN-VESSEL-88',
    notesAr: 'زورق دورية شبحي غير معرف يبحر بالقرب من خط كابلات الألياف الضوئية البحرية.',
    notesEn: 'Unidentified stealth corvette hovering near submarine fiber-optic communications cable.'
  },
  {
    id: 'tgt-05',
    callsign: 'ECM-PULSE-B',
    type: 'cyber_anomaly',
    distanceKm: 8,
    angleDeg: 5,
    speedKnots: 0,
    altitudeFt: 150,
    threatLevel: 'CRITICAL',
    status: 'TRACKING',
    bearing: '005° N',
    transponderId: 'ANOMALY-JAMMER',
    notesAr: 'مصدر تشويش إلكتروني أرضي يبث نبضات كهرومغناطيسية لتعطيل موجات رادار الدفاع الجوي.',
    notesEn: 'Ground-based electronic warfare transmitter radiating wideband RF noise to disrupt radar arrays.'
  }
];

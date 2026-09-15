import { ClassifiedDocument } from '../types';

export const INITIAL_CLASSIFIED_FILES: ClassifiedDocument[] = [
  {
    id: 'doc-001',
    code: 'SEC-OPS-9941-CHIMERA',
    titleAr: 'عملية كيميرا: اختراق منظومة الدفاع الجوي',
    titleEn: 'Operation Chimera: Air Defense Infiltration',
    categoryAr: 'عمليات سيبرانية',
    categoryEn: 'Cyber Operations',
    clearance: 'TOP SECRET',
    date: '2026-08-24 02:41 UTC',
    operative: 'AGENT VIPER-9',
    coordinates: '34°45\'12.2"N 36°18\'44.8"E',
    checksum: 'a8f9c12b0e77d338',
    isDecrypted: false,
    isBurned: false,
    summaryAr: 'تقرير استخباري مسرب يوثق زرع برمجية خبيثة في محطات رادار الدفاع الجوي بالقطاع الشرقي، تتيح تعطيل التتبع الآلي لمدة 18 دقيقة متواصلة.',
    summaryEn: 'Leaked intelligence report detailing the injection of stealth firmware into Eastern Sector radar arrays, permitting a 18-minute continuous blackout.',
    fullContentAr: `[سري للغاية // استخبارات العمليات الخاصة]
الرمز العملياتي: كيميرا-09
الموقع المستهدف: قاعدة الرادار الاستراتيجية - القطاع الشرقي

تم بنجاح استغلال ثغرة Zero-Day في خوادم التحكم التكتيكي.
العميل الميداني "████████" تمكن من إيصال فلاشة أمنية مخصصة عبر منفذ صيانة معزول.
النتيجة الحالية:
- السيطرة الكاملة على مصفوفة الهوائيات من طراز ████████.
- تغذية شاشات المراقبة بمسارات وهمية لطائرات استطلاع شبحية.
- تعطيل منظومة الإنذار المبكر تلقائياً عند اقتراب سرب ████████.

ملاحظة الموجه: أي تسريب لهذا الملف يعرض سلامة الأصول الميدانية للخطر الشديد.`,
    fullContentEn: `[TOP SECRET // SPECIAL OPS INTELLIGENCE]
Operation Code: CHIMERA-09
Target Location: Strategic Radar Outpost - Eastern Sector

Successfully exploited a Zero-Day vulnerability in tactical command servers.
Field asset "████████" delivered an air-gapped payload via physical maintenance bus.
Current Status:
- Root access gained on ████████ phased array matrix.
- Spoofed radar echoes successfully injected for stealth recon flight paths.
- Early warning telemetry suppressed during approaching ingress of unit ████████.

Director Note: Any unauthorized disclosure compromises active operational assets.`,
    redactedPhrasesAr: ['العميل صقر-3', 'رادارات الجيل الخامس', 'طائرات الفانتوم 7'],
    redactedPhrasesEn: ['ASSET FALCON-3', 'GEN-5 S-400 ARRAYS', 'PHANTOM-7 SQUADRON'],
    interceptedSignal: 'FREQ 142.850 MHz // BURST: 01000011 01001000 01001001 01001101 01000101 01010010 01000001'
  },
  {
    id: 'doc-002',
    code: 'BLACK-OPS-7712-SPECTRE',
    titleAr: 'ملف العميل الميداني: الشبح (Spectre-07)',
    titleEn: 'Field Operative Dossier: Spectre (07)',
    categoryAr: 'أصول بشرية (HUMINT)',
    categoryEn: 'Human Intelligence',
    clearance: 'BLACK OPS',
    date: '2026-09-02 19:15 UTC',
    operative: 'CONTROL DIRECTORATE',
    coordinates: '41°00\'49.0"N 28°57\'18.0"E',
    checksum: 'e7399bf0198ca110',
    isDecrypted: true,
    isBurned: false,
    summaryAr: 'السجل الأمني الكامل للعميل المنشق المسؤول عن تسريب شفرات التشفير الكمومي واختراق المنشأة المحصنة تحت الأرض.',
    summaryEn: 'Full dossier of rogue agent responsible for intercepting quantum encryption keys and breaching subterranean facilities.',
    fullContentAr: `[مستوى التصنيف: عمليات سوداء // إخفاء الهوية]
الاسم المستعار: الشبح (Spectre-07)
الحالة: نشط - غير خاضع للسيطرة
آخر رصد: قطاع الميناء، مستودع الحاويات رقم 14

المواصفات والقدرات:
- خبير في الهندسة العكسية لمنظومات التشفير العسكري.
- مدرب على القتال التكتيكي وتفادي أجهزة الكشف البيومتري.
- يحمل حقيبة اتصال فضائي مشفرة من طراز ████████.

الأوامر الصادرة:
- الرصد الفوري عبر الأقمار الصناعية وكاميرات الشوارع.
- في حال الاقتراب، يحظر الاشتباك المباشر دون دعم فرقة التدخل السريع ████████.`,
    fullContentEn: `[CLASSIFICATION: BLACK OPS // IDENTITY SANITIZED]
Codename: Spectre-07
Status: Active - Unsanctioned
Last Intercept: Harbor Logistics Zone, Container Berth 14

Capabilities & Threat Profile:
- Master level reverse engineering of military hardware cryptography.
- Specialized evasive maneuvers against biometric retinal networks.
- In possession of a hardened satellite link terminal model ████████.

Directives:
- Maintain non-kinetic orbital tracking via IR satellites.
- Direct contact prohibited without Level-5 tactical fire-team ████████.`,
    redactedPhrasesAr: ['الرائد م. ناصر', 'جهاز البث كوانتوم-X', 'فرقة الفجر التكتيكية'],
    redactedPhrasesEn: ['MAJOR M. NASSER', 'QUANTUM-X TRANSCEIVER', 'DAWN RAPID RESPONSE SQUAD'],
    interceptedSignal: 'TELEMETRY BURST // RSSI: -48dBm // LAT 41.0135, LON 28.9550'
  },
  {
    id: 'doc-003',
    code: 'SAT-ORBIT-4401-PEGASUS',
    titleAr: 'حمولة بيغاسوس المدارية: التقاط الترددات العسكرية',
    titleEn: 'Orbital Pegasus Payload: Military Spectrum Intercept',
    categoryAr: 'استخبارات فضائية (SIGINT)',
    categoryEn: 'Signals Intelligence',
    clearance: 'TOP SECRET',
    date: '2026-09-11 11:32 UTC',
    operative: 'ORBITAL SURVEILLANCE DESK',
    coordinates: 'GEO-SYNC ORBIT // ALT 35,786 KM',
    checksum: '55bc2990aa41e881',
    isDecrypted: false,
    isBurned: false,
    summaryAr: 'تفريغ بيانات الأقمار الصناعية العسكرية حول حركات القطع البحرية غير المعرفة في المياه الدولية والتنصت على خطوط الألياف الضوئية البحرية.',
    summaryEn: 'Military satellite feed dump regarding unidentified naval stealth assets in international waters and undersea cable wiretaps.',
    fullContentAr: `[سري للغاية // استخبارات الإشارات المدارية]
المنصة: قمر التجسس بيغاسوس-4
نطاق الالتقاط: الحزمة العسكرية الموجهة (Ku-Band)

النتائج الميدانية:
- رصد تردد لاسلكي مشفر ينبعث من غواصة شبحية على عمق 120 متراً.
- تم اعتراض بث صوتي مدته 42 ثانية بين القيادة والهدف ████████.
- محاولة تفكيك الشفرة أسفرت عن الكشف عن إحداثيات نقل شحنة حساسة في ████████.

الإجراء الموصى به: توجيه طائرة استطلاع بدون طيار (UAV) لمسح القطاع فوراً.`,
    fullContentEn: `[TOP SECRET // SIGNALS INTELLIGENCE ORBITAL]
Platform: Recon Satellite Pegasus-4
Spectrum Range: Hardened Military Ku-Band

Operational Findings:
- Detected frequency hopping signature from submerged contact at -120m depth.
- Intercepted 42-second encrypted voice burst between command and asset ████████.
- Partial decryption indicates transport coordinates for high-value crate at ████████.

Recommended Action: Dispatch high-altitude stealth UAV to sweep the target sector.`,
    redactedPhrasesAr: ['العميل طارق-الظل', 'مضيق هرمز الدولي'],
    redactedPhrasesEn: ['OPERATIVE SHADOW-T', 'STRAIT OF HORMUZ TRANSIT'],
    interceptedSignal: 'FREQ 11.450 GHz // ENCRYPTED AES-GCM-256 // CARRIER DETECTED'
  },
  {
    id: 'doc-004',
    code: 'CYBER-CORE-1052-MIDNIGHT',
    titleAr: 'مشروع شمس منتصف الليل: اختراق خوادم العزل',
    titleEn: 'Project Midnight Sun: Air-Gapped Network Breach',
    categoryAr: 'هندسة عكسية',
    categoryEn: 'Cyber Warfare',
    clearance: 'SECRET',
    date: '2026-09-14 06:10 UTC',
    operative: 'RED-CELL TEAM',
    coordinates: '52°31\'12.0"N 13°24\'18.0"E',
    checksum: '7d91e32948bb3310',
    isDecrypted: true,
    isBurned: false,
    summaryAr: 'دراسة أمنية تفصيلية حول كيفية تجاوز حاجز الهواء (Air-Gap) باستخدام انبعاثات الموجات الكهرومغناطيسية من كروت الرسوميات.',
    summaryEn: 'Comprehensive analysis on breaching air-gapped SCADA infrastructure via GPU electromagnetic acoustic side-channel leaks.',
    fullContentAr: `[سري // فريق الاختراق المتقدم]
الهدف: خوادم التخصيب والتحكم الصناعي المعزولة كلياً عن الإنترنت.

المنهجية المستخدمة:
- استغلال تسريب الترددات الراديوية الناتجة عن مروحة التبريد والمعالج الرسومي.
- تلقي نبضات البيانات من مسافة 15 متراً بواسطة مستقبل راديوي فائق الحساسية.
- استخراج مفاتيح التشفير ومخططات التحكم الهيدروليكي للمنشأة ████████.`,
    fullContentEn: `[SECRET // ADVANCED PENETRATION CELL]
Target: Fully air-gapped SCADA industrial control nodes.

Methodology:
- Exploited electromagnetic side-channel radiation modulated via GPU clock speed.
- Captured raw data bursts from 15 meters using ultra-wideband SDR receivers.
- Exfiltrated master cryptographic seeds and schematic diagrams for facility ████████.`,
    redactedPhrasesAr: ['منشأة نطنز-2', 'بروتوكول شتوتس-4'],
    redactedPhrasesEn: ['FACILITY NATANZ-B', 'STUX-PROTO 04'],
    interceptedSignal: 'SDR LEAK // 433.92 MHz // RAW PACKET DUMP READY'
  }
];

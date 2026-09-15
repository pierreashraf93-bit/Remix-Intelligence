import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, Lock, Unlock, Flame, Download, Search, Eye, EyeOff, Radio, AlertTriangle, CheckCircle, HardDriveDownload, X, Trash2 } from 'lucide-react';
import { Language, ClassifiedDocument, ClearanceLevel } from '../types';
import { soundEngine } from '../utils/audio';
import { ExportDossierModal, ExportMode } from './ExportDossierModal';
import { triggerFileDownload, formatDossierText } from '../utils/downloadHelper';

interface ClassifiedFilesProps {
  language: Language;
  soundEnabled: boolean;
  documents: ClassifiedDocument[];
  onUpdateDocument: (docId: string, updates: Partial<ClassifiedDocument>) => void;
  onOpenGlobalExport?: (doc?: ClassifiedDocument, mode?: ExportMode) => void;
}

export const ClassifiedFiles: React.FC<ClassifiedFilesProps> = ({
  language,
  soundEnabled,
  documents,
  onUpdateDocument,
  onOpenGlobalExport
}) => {
  const isAr = language === 'ar';
  const [selectedId, setSelectedId] = useState<string>(documents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClearance, setFilterClearance] = useState<string>('ALL');
  const [revealedRedactions, setRevealedRedactions] = useState<Record<string, boolean>>({});
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptProgress, setDecryptProgress] = useState<number>(0);
  const [confirmBurnId, setConfirmBurnId] = useState<string | null>(null);

  // Local Export Modal State
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [exportModalMode, setExportModalMode] = useState<ExportMode>('single_doc');
  const [exportModalDoc, setExportModalDoc] = useState<ClassifiedDocument | null>(null);

  const activeDoc = documents.find((d) => d.id === selectedId) || documents[0];

  const filteredDocs = documents.filter((doc) => {
    if (doc.isBurned) return false;
    const matchQuery =
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.operative.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClearance = filterClearance === 'ALL' || doc.clearance === filterClearance;
    return matchQuery && matchClearance;
  });

  const toggleRedaction = (docId: string) => {
    soundEngine.playKeyClick(soundEnabled);
    setRevealedRedactions((prev) => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const handleDecrypt = (docId: string) => {
    if (isDecrypting) return;
    setIsDecrypting(true);
    setDecryptProgress(0);

    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        soundEngine.playBreachChirp(soundEnabled);
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecrypting(false);
          onUpdateDocument(docId, { isDecrypted: true });
          soundEngine.playAccessGranted(soundEnabled);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleTriggerBurnConfirm = (docId: string) => {
    soundEngine.playKeyClick(soundEnabled);
    setConfirmBurnId(docId);
  };

  const handleExecuteBurn = (docId: string) => {
    soundEngine.playAccessDenied(soundEnabled);
    onUpdateDocument(docId, { isBurned: true });
    setConfirmBurnId(null);
    const remaining = documents.filter((d) => d.id !== docId && !d.isBurned);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    }
  };

  const handleOpenExportTerminal = (doc?: ClassifiedDocument, mode: ExportMode = 'single_doc') => {
    soundEngine.playKeyClick(soundEnabled);
    if (onOpenGlobalExport) {
      onOpenGlobalExport(doc, mode);
    } else {
      setExportModalDoc(doc || activeDoc || null);
      setExportModalMode(mode);
      setIsExportOpen(true);
    }
  };

  const handleQuickDownload = (doc: ClassifiedDocument) => {
    soundEngine.playKeyClick(soundEnabled);
    // 1. Attempt direct download
    const content = formatDossierText(doc, language);
    triggerFileDownload(`DOSSIER_${doc.code}.txt`, content, 'text/plain;charset=utf-8');

    // 2. Also open the Export Terminal so the user has immediate access to copy to clipboard or troubleshoot
    handleOpenExportTerminal(doc, 'single_doc');
  };

  const isRedactionRevealed = activeDoc ? !!revealedRedactions[activeDoc.id] : false;

  const renderProcessedContent = (content: string, redactedPhrases: string[]) => {
    let processed = content;
    if (isRedactionRevealed) {
      redactedPhrases.forEach((phrase) => {
        processed = processed.replaceAll('████████', `[DE-MASKED: ${phrase}]`);
      });
    }
    return processed;
  };

  const clearanceBadgeColor = (clearance: ClearanceLevel) => {
    switch (clearance) {
      case 'BLACK OPS':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
      case 'TOP SECRET':
        return 'bg-red-950/80 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case 'SECRET':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950/90 border border-emerald-500/40 rounded-lg overflow-hidden font-mono-tactical shadow-2xl backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-black/80 border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-emerald-300 font-display-tactical tracking-wider uppercase">
            {isAr ? 'الأرشيف الاستخباري والملفات السرية' : 'CLASSIFIED INTELLIGENCE DOSSIERS'}
          </h2>
        </div>

        {/* Search, Filter & Master Archive Export Controls */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl justify-end">
          <button
            onClick={() => handleOpenExportTerminal(undefined, 'all_archive')}
            className="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            title={isAr ? 'تنزيل وتصدير كامل الأرشيف الاستخباري' : 'Export / Download Master Archive'}
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{isAr ? 'تنزيل الأرشيف كاملاً' : 'Export Archive'}</span>
          </button>

          <div className="relative w-full max-w-[180px] sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute top-2.5 start-2.5 text-emerald-500/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في الملفات السرية...' : 'Search dossiers by code or keyword...'}
              className="w-full bg-black/90 border border-emerald-500/30 rounded py-1 ps-8 pe-3 text-xs text-emerald-300 placeholder-gray-600 outline-none focus:border-emerald-400"
            />
          </div>

          <select
            value={filterClearance}
            onChange={(e) => setFilterClearance(e.target.value)}
            className="bg-black/90 border border-emerald-500/30 rounded py-1 px-2 text-xs text-emerald-300 outline-none cursor-pointer"
          >
            <option value="ALL">{isAr ? 'كافة التصنيفات' : 'ALL CLEARANCES'}</option>
            <option value="BLACK OPS">BLACK OPS</option>
            <option value="TOP SECRET">TOP SECRET</option>
            <option value="SECRET">SECRET</option>
          </select>
        </div>
      </div>

      {/* Main Content Split: List & Document Viewer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left/Right Sidebar: File List */}
        <div className="lg:col-span-4 border-e border-emerald-500/20 bg-black/60 overflow-y-auto p-3 space-y-2">
          <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex justify-between">
            <span>{isAr ? 'الملفات المتاحة' : 'ACTIVE DOSSIERS'} ({filteredDocs.length})</span>
            <span>SEC-LEVEL: HIGH</span>
          </div>

          {filteredDocs.map((doc) => {
            const isSelected = activeDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => {
                  soundEngine.playKeyClick(soundEnabled);
                  setSelectedId(doc.id);
                }}
                className={`p-3 rounded border transition-all cursor-pointer select-none relative ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-gray-900/50 border-gray-800/80 hover:border-emerald-500/40 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-emerald-400 font-bold tracking-tight">
                    {doc.code}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${clearanceBadgeColor(doc.clearance)}`}>
                    {doc.clearance}
                  </span>
                </div>

                <div className="text-xs font-semibold text-gray-200 line-clamp-1 mb-1 font-display-tactical">
                  {isAr ? doc.titleAr : doc.titleEn}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>{doc.date.split(' ')[0]}</span>
                  <span className="flex items-center gap-1">
                    {doc.isDecrypted ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> {isAr ? 'مفكك الشفرة' : 'Decrypted'}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> {isAr ? 'مشفر جزئياً' : 'Locked'}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredDocs.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-500">
              {isAr ? 'لا توجد ملفات تطابق معايير البحث' : 'No dossiers match current filter.'}
            </div>
          )}
        </div>

        {/* Document Details & Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-gray-950/70 overflow-y-auto p-4 md:p-6">
          {activeDoc ? (
            <div className="space-y-5">
              {/* Classification Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-black/80 border-2 border-dashed border-red-500/60 rounded">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-600 text-white font-black text-xs tracking-widest uppercase rounded">
                    {activeDoc.clearance}
                  </span>
                  <span className="text-xs text-red-400 font-bold">
                    {isAr ? 'وثيقة استخباراتية محمية - إفشاء السرية خيانة عظمى' : 'RESTRICTED COMPARTMENTALIZED INTEL'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono-tactical">
                  CHECKSUM: <span className="text-emerald-400 font-bold">{activeDoc.checksum}</span>
                </div>
              </div>

              {/* Dossier Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-black/60 p-3 rounded border border-gray-800">
                <div>
                  <span className="text-gray-500 block text-[10px]">{isAr ? 'رمز العملية' : 'OPERATION CODE'}</span>
                  <span className="text-emerald-400 font-bold">{activeDoc.code}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">{isAr ? 'العميل المسؤول' : 'OPERATIVE'}</span>
                  <span className="text-gray-300 font-bold">{activeDoc.operative}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">{isAr ? 'الإحداثيات الجغرافية' : 'COORDINATES'}</span>
                  <span className="text-gray-300">{activeDoc.coordinates}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">{isAr ? 'تاريخ الاعتراض' : 'TIMESTAMP'}</span>
                  <span className="text-gray-300">{activeDoc.date}</span>
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <span className="text-xs text-emerald-500/80 font-bold uppercase">
                  [{isAr ? activeDoc.categoryAr : activeDoc.categoryEn}]
                </span>
                <h1 className="text-lg md:text-xl font-bold text-gray-100 font-display-tactical mt-0.5">
                  {isAr ? activeDoc.titleAr : activeDoc.titleEn}
                </h1>
              </div>

              {/* Summary */}
              <div className="bg-black/40 border-s-2 border-emerald-500 p-3 text-xs text-gray-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">
                  {isAr ? 'ملخص التقرير الميداني:' : 'EXECUTIVE SUMMARY:'}
                </span>
                {isAr ? activeDoc.summaryAr : activeDoc.summaryEn}
              </div>

              {/* Intercepted Signal telemetry if present */}
              {activeDoc.interceptedSignal && (
                <div className="bg-black/80 border border-emerald-500/30 p-3 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 text-[11px] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                      {isAr ? 'الإشارة اللاسلكية المعترضة' : 'INTERCEPTED SPECTRUM BURST'}
                    </span>
                    <span className="text-emerald-500/60">SIGINT HARDWARE FEED</span>
                  </div>
                  <div className="font-mono-tactical text-[11px] text-emerald-300/80 break-all bg-emerald-950/20 p-2 rounded border border-emerald-500/20">
                    {activeDoc.interceptedSignal}
                  </div>
                </div>
              )}

              {/* Full Content with Redactions */}
              <div className="bg-black/70 border border-gray-800 rounded p-4 text-xs text-gray-200 leading-relaxed relative">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-gray-400">
                    {isAr ? 'نص الوثيقة الكامل (سري للغاية)' : 'AUTHENTICATED INTELLIGENCE TEXT'}
                  </span>
                  <button
                    onClick={() => toggleRedaction(activeDoc.id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded cursor-pointer transition-all"
                  >
                    {isRedactionRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إعادة الحجب الأمني' : 'Enforce Redactions'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إلغاء الحجب وكشف الأسماء' : 'Unmask Redactions'}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="whitespace-pre-wrap font-mono-tactical text-xs text-emerald-300/90 leading-loose">
                  {renderProcessedContent(
                    isAr ? activeDoc.fullContentAr : activeDoc.fullContentEn,
                    isAr ? activeDoc.redactedPhrasesAr : activeDoc.redactedPhrasesEn
                  )}
                </pre>
              </div>

              {/* Interactive Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
                <div className="flex flex-wrap items-center gap-2">
                  {!activeDoc.isDecrypted && (
                    <button
                      onClick={() => handleDecrypt(activeDoc.id)}
                      disabled={isDecrypting}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold text-xs rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>
                        {isDecrypting
                          ? `${isAr ? 'جاري فك التشفير' : 'Decrypting'} ${decryptProgress}%`
                          : (isAr ? 'فك تشفير حمولة الملف' : 'Decrypt Payload')}
                      </span>
                    </button>
                  )}

                  {/* Primary Download & Export Button */}
                  <button
                    onClick={() => handleQuickDownload(activeDoc)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    title={isAr ? 'تنزيل التقرير مع خيارات النسخ والحفظ' : 'Download dossier with copy & export options'}
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'تنزيل وحفظ التقرير' : 'Download / Save Dossier'}</span>
                  </button>

                  {/* Export Terminal Details */}
                  <button
                    onClick={() => handleOpenExportTerminal(activeDoc, 'single_doc')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs rounded transition-all cursor-pointer"
                  >
                    <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? 'خيارات التصدير (JSON / نسخ)' : 'Export Options'}</span>
                  </button>
                </div>

                {/* Safe In-App Burn / Purge Confirmation (No blocked alert/confirm dialogs) */}
                {confirmBurnId === activeDoc.id ? (
                  <div className="flex items-center gap-2 bg-red-950/90 border border-red-500 p-1.5 rounded text-xs animate-pulse">
                    <span className="text-red-300 text-[11px] font-bold">
                      {isAr ? 'تأكيد الحرق النهائي؟' : 'Purge permanently?'}
                    </span>
                    <button
                      onClick={() => handleExecuteBurn(activeDoc.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-[10px] cursor-pointer"
                    >
                      {isAr ? 'نعم، إتلاف' : 'Confirm Burn'}
                    </button>
                    <button
                      onClick={() => setConfirmBurnId(null)}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[10px] cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTriggerBurnConfirm(activeDoc.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/40 text-xs rounded transition-all cursor-pointer"
                    title="Emergency Purge"
                  >
                    <Flame className="w-4 h-4" />
                    <span>{isAr ? 'حرق وإتلاف الملف' : 'Burn / Purge'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2">
              <FileText className="w-12 h-12 text-gray-700" />
              <p className="text-xs">{isAr ? 'اختر ملفاً من القائمة الجانبية للاطلاع' : 'Select a dossier from the sidebar to inspect.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Export & Download Terminal Modal */}
      <ExportDossierModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        language={language}
        soundEnabled={soundEnabled}
        selectedDoc={exportModalDoc}
        allDocs={documents}
        initialMode={exportModalMode}
      />
    </div>
  );
};

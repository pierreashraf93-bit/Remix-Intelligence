import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  FileText,
  FileCode,
  Printer,
  X,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  HardDriveDownload,
  Code
} from 'lucide-react';
import { Language, ClassifiedDocument, RadarTarget } from '../types';
import {
  triggerFileDownload,
  copyTextToClipboard,
  openContentInNewWindow,
  formatDossierText,
  formatAllDossiersArchive,
  formatTacticalReport
} from '../utils/downloadHelper';
import { soundEngine } from '../utils/audio';

export type ExportMode = 'single_doc' | 'all_archive' | 'tactical_report';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  soundEnabled: boolean;
  selectedDoc?: ClassifiedDocument | null;
  allDocs: ClassifiedDocument[];
  radarTargets?: RadarTarget[];
  defcon?: number;
  initialMode?: ExportMode;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  language,
  soundEnabled,
  selectedDoc,
  allDocs,
  radarTargets = [],
  defcon = 3,
  initialMode = 'single_doc'
}) => {
  const isAr = language === 'ar';
  const [exportMode, setExportMode] = useState<ExportMode>(
    selectedDoc ? initialMode : 'all_archive'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccessStatus, setDownloadSuccessStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine export payload based on active mode
  let fileTitle = '';
  let fileNameTxt = '';
  let fileNameJson = '';
  let contentText = '';
  let jsonContent = '';

  if (exportMode === 'single_doc' && selectedDoc) {
    fileTitle = `${selectedDoc.code} - ${isAr ? selectedDoc.titleAr : selectedDoc.titleEn}`;
    fileNameTxt = `DOSSIER_${selectedDoc.code}.txt`;
    fileNameJson = `DOSSIER_${selectedDoc.code}.json`;
    contentText = formatDossierText(selectedDoc, language);
    jsonContent = JSON.stringify(selectedDoc, null, 2);
  } else if (exportMode === 'all_archive') {
    fileTitle = isAr ? 'الأرشيف الاستخباري الشامل' : 'MASTER INTELLIGENCE ARCHIVE';
    fileNameTxt = `COVERT_OPS_MASTER_ARCHIVE_${new Date().toISOString().slice(0, 10)}.txt`;
    fileNameJson = `COVERT_OPS_MASTER_ARCHIVE_${new Date().toISOString().slice(0, 10)}.json`;
    contentText = formatAllDossiersArchive(allDocs, language);
    jsonContent = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        totalFiles: allDocs.filter((d) => !d.isBurned).length,
        dossiers: allDocs.filter((d) => !d.isBurned)
      },
      null,
      2
    );
  } else {
    fileTitle = isAr ? 'تقرير العمليات والتتبع التكتيكي' : 'TACTICAL OPS STATUS REPORT';
    fileNameTxt = `TACTICAL_REPORT_${new Date().toISOString().slice(0, 10)}.txt`;
    fileNameJson = `TACTICAL_REPORT_${new Date().toISOString().slice(0, 10)}.json`;
    contentText = formatTacticalReport(defcon, radarTargets, allDocs, language);
    jsonContent = JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        defcon,
        radarTargets,
        dossiersCount: allDocs.filter((d) => !d.isBurned).length
      },
      null,
      2
    );
  }

  const handleDownloadTxt = () => {
    soundEngine.playKeyClick(soundEnabled);
    const ok = triggerFileDownload(fileNameTxt, contentText, 'text/plain;charset=utf-8');
    if (ok) {
      soundEngine.playAccessGranted(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '✓ تم إرسال أمر تنزيل الملف النصي (.txt) إلى متصفحك.'
          : '✓ Text dossier (.txt) download triggered in your browser.'
      );
    } else {
      soundEngine.playAccessDenied(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '⚠️ تعذر التنزيل التلقائي بسبب حظر المتصفح للإطار، يرجى الضغط على زر "نسخ إلى الحافظة" أدناه.'
          : '⚠️ Browser iframe blocked automated download. Please use "Copy to Clipboard" or "Open in New Tab".'
      );
    }
  };

  const handleDownloadJson = () => {
    soundEngine.playKeyClick(soundEnabled);
    const ok = triggerFileDownload(fileNameJson, jsonContent, 'application/json;charset=utf-8');
    if (ok) {
      soundEngine.playAccessGranted(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '✓ تم إرسال أمر تنزيل ملف البيانات الخام (.json).'
          : '✓ Raw JSON (.json) download triggered in your browser.'
      );
    } else {
      soundEngine.playAccessDenied(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '⚠️ تعذر التنزيل التلقائي في الإطار، استخدم زر "نسخ إلى الحافظة".'
          : '⚠️ Browser blocked automated download. Please use "Copy to Clipboard".'
      );
    }
  };

  const handleCopy = async () => {
    soundEngine.playKeyClick(soundEnabled);
    const ok = await copyTextToClipboard(contentText);
    if (ok) {
      setCopied(true);
      soundEngine.playAccessGranted(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '✓ تم نسخ محتوى التقرير بالكامل إلى الحافظة بنجاح!'
          : '✓ Full dossier copied to clipboard! You can paste it into any document.'
      );
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleOpenNewWindow = () => {
    soundEngine.playKeyClick(soundEnabled);
    const ok = openContentInNewWindow(fileTitle, contentText);
    if (ok) {
      soundEngine.playAccessGranted(soundEnabled);
      setDownloadSuccessStatus(
        isAr
          ? '✓ تم فتح التقرير في نافذة مستقلة (يمكنك الحفظ عبر Ctrl + S).'
          : '✓ Dossier opened in clean window (press Ctrl + S to save).'
      );
    } else {
      setDownloadSuccessStatus(
        isAr
          ? '⚠️ تم حظر النوافذ المنبثقة من قبل المتصفح، يرجى نسخ المحتوى إلى الحافظة.'
          : '⚠️ Popups blocked by browser. Please copy content to clipboard.'
      );
    }
  };

  const handlePrint = () => {
    soundEngine.playKeyClick(soundEnabled);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none font-mono-tactical">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-gray-950 border border-emerald-500/50 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-emerald-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
              <HardDriveDownload className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100 font-display-tactical tracking-wider uppercase flex items-center gap-2">
                <span>{isAr ? 'مركز تنزيل وتصدير البيانات الاستخباراتية' : 'INTELLIGENCE EXPORT & DOWNLOAD TERMINAL'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  SECURE PORTAL
                </span>
              </h2>
              <div className="text-[11px] text-emerald-400/80">{fileTitle}</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playKeyClick(soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-700"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Mode Selector Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-black/60 border-b border-gray-800/80 text-xs overflow-x-auto">
          {selectedDoc && (
            <button
              onClick={() => {
                soundEngine.playKeyClick(soundEnabled);
                setExportMode('single_doc');
                setDownloadSuccessStatus(null);
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
                exportMode === 'single_doc'
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? `الملف الحالي (${selectedDoc.code})` : `Active Dossier (${selectedDoc.code})`}</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playKeyClick(soundEnabled);
              setExportMode('all_archive');
              setDownloadSuccessStatus(null);
            }}
            className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
              exportMode === 'all_archive'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-600'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>
              {isAr
                ? `الأرشيف الكامل (${allDocs.filter((d) => !d.isBurned).length} ملفات)`
                : `Master Archive (${allDocs.filter((d) => !d.isBurned).length} Dossiers)`}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playKeyClick(soundEnabled);
              setExportMode('tactical_report');
              setDownloadSuccessStatus(null);
            }}
            className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
              exportMode === 'tactical_report'
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'تقرير الحالة التكتيكية والرادار' : 'Tactical & Radar Report'}</span>
          </button>
        </div>

        {/* Status Notification Banner (if any action performed) */}
        {downloadSuccessStatus && (
          <div className="px-4 py-2.5 bg-emerald-950/70 border-b border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessStatus}</span>
            </span>
            <button
              onClick={() => setDownloadSuccessStatus(null)}
              className="text-gray-400 hover:text-emerald-300 text-[11px]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Body: Action Buttons + Live Preview */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* 1. Direct Download .txt */}
            <button
              onClick={handleDownloadTxt}
              className="p-3 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 rounded-lg text-start transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-all" />
                  <span>{isAr ? 'تنزيل ملف نصي (.txt)' : 'Download File (.txt)'}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
                  STANDARD
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {isAr
                  ? 'حفظ مباشر كملف نصي على جهازك.'
                  : 'Save directly as formatted text file.'}
              </p>
            </button>

            {/* 2. Direct Download JSON */}
            <button
              onClick={handleDownloadJson}
              className="p-3 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700 hover:border-emerald-500/40 rounded-lg text-start transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-all" />
                  <span>{isAr ? 'تصدير بيانات خام (.json)' : 'Export Raw (.json)'}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                  JSON
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {isAr
                  ? 'بيانات برمجية مهيكلة للتحليل والنقل.'
                  : 'Structured data for analysis or systems.'}
              </p>
            </button>

            {/* 3. 1-Click Copy to Clipboard */}
            <button
              onClick={handleCopy}
              className={`p-3 rounded-lg text-start transition-all cursor-pointer group shadow-sm flex flex-col justify-between border ${
                copied
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                  : 'bg-emerald-950/30 hover:bg-emerald-900/40 border-emerald-500/30 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-all" />}
                  <span>{copied ? (isAr ? 'تم النسخ بنجاح!' : 'Copied to Clipboard!') : (isAr ? 'نسخ إلى الحافظة' : 'Copy to Clipboard')}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                  100% RELIABLE
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {isAr
                  ? 'يعمل دائماً حتى لو تم حظر التنزيل في الإطار.'
                  : 'Guaranteed to work if browser blocks iframe downloads.'}
              </p>
            </button>

            {/* 4. Open in Clean Tab */}
            <button
              onClick={handleOpenNewWindow}
              className="p-3 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700 hover:border-emerald-500/40 rounded-lg text-start transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-all" />
                  <span>{isAr ? 'فتح في نافذة مستقلة' : 'Open in New Window'}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                  POPUP
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {isAr
                  ? 'عرض نصي كامل مع إمكانية الحفظ (Ctrl+S).'
                  : 'View clean plaintext and save via Ctrl+S.'}
              </p>
            </button>
          </div>

          {/* Iframe Download Notice & AI Studio Code Export Guidance */}
          <div className="p-3.5 bg-black/80 border border-emerald-500/30 rounded-lg text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'توجيهات حل مشكلة تعذر التنزيل في المتصفح:'
                  : 'Troubleshooting Download Restrictions:'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-gray-300">
              {/* Point 1: Iframe restriction */}
              <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? '1. التنزيل داخل إطار المعاينة (Preview Iframe)' : '1. Preview Iframe Sandbox'}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {isAr
                    ? 'متصفحات مثل Chrome تمنع تلقائياً تحميل الملفات البرمجية من داخل إطارات العرض المعزولة (Sandboxed Iframes). إذا لم يبدأ التنزيل، اضغط ببساطة على زر "نسخ إلى الحافظة" وألصقه في المفكرة، أو افتح التطبيق في نافذة متصفح جديدة عبر زر المعاينة الخارجي.'
                    : 'Modern browsers block programmatic file downloads initiated within sandboxed iframes. If clicking "Download File" does nothing, click "Copy to Clipboard" to paste into any editor, or open this applet in a separate browser tab.'}
                </p>
              </div>

              {/* Point 2: Exporting Project Source Code */}
              <div className="bg-gray-900/60 p-2.5 rounded border border-gray-800">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? '2. تنزيل الكود المصدري للمشروع بالكامل (ZIP)' : '2. Download App Source Code (ZIP)'}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {isAr
                    ? 'إذا كنت تقصد تنزيل كامل ملفات المشروع وكود التطبيق: يمكنك تصديره مباشرة عبر شريط أدوات Google AI Studio: اضغط على أيقونة الإعدادات (⚙️ الترس) في أعلى الواجهة ثم اختر "Export to GitHub" أو "Download ZIP".'
                    : 'If you are looking to download the entire web application source code as a ZIP archive: use Google AI Studio\'s top header menu → click Settings (gear icon) → select "Export to GitHub" or "Download ZIP".'}
                </p>
              </div>
            </div>
          </div>

          {/* Text Preview Box with Manual Copy / Select All */}
          <div className="border border-gray-800 rounded-lg overflow-hidden bg-black/90">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-900/80 border-b border-gray-800 text-xs">
              <span className="text-gray-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'معاينة نص الوثيقة (يمكن تحديده ونسخه يدوياً)' : 'Live Document Preview (Selectable Text)'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Copy className="w-3 h-3 text-emerald-400" />
                  <span>{copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy Text')}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                  title="Print"
                >
                  <Printer className="w-3 h-3 text-gray-400" />
                  <span>{isAr ? 'طباعة' : 'Print'}</span>
                </button>
              </div>
            </div>

            <pre className="p-3 text-[11px] font-mono-tactical text-emerald-300/90 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text selection:bg-emerald-500/40 selection:text-white">
              {contentText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-black/90 border-t border-emerald-500/30 flex items-center justify-between text-xs">
          <span className="text-gray-500 text-[11px] font-mono-tactical">
            CHECKSUM VERIFIED // AES-256 COMPLIANT
          </span>
          <button
            onClick={() => {
              soundEngine.playKeyClick(soundEnabled);
              onClose();
            }}
            className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 rounded text-xs font-bold cursor-pointer transition-all"
          >
            {isAr ? 'إغلاق النافذة' : 'Close Terminal'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

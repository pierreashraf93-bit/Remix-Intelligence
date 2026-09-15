import { ClassifiedDocument, RadarTarget, Language } from '../types';

/**
 * Robust cross-browser file download trigger with multi-tier fallbacks.
 * In sandboxed iframes (like AI Studio preview), synthetic a.click() may be blocked.
 * We attempt standard blob download, then data-uri, and report success/failure.
 */
export function triggerFileDownload(
  filename: string,
  content: string,
  mimeType: string = 'text/plain;charset=utf-8'
): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
    return true;
  } catch (err) {
    console.warn('Blob URL download failed, attempting data-uri fallback:', err);
    try {
      const dataUri = `data:${mimeType},` + encodeURIComponent(content);
      const a = document.createElement('a');
      a.href = dataUri;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 150);
      return true;
    } catch (e) {
      console.error('All download mechanisms failed in this environment:', e);
      return false;
    }
  }
}

/**
 * Bulletproof clipboard copy supporting modern navigator.clipboard and legacy fallback
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard failed, using textarea fallback', err);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed', err);
    return false;
  }
}

/**
 * Opens content in a fresh clean window/tab for manual saving or inspection
 */
export function openContentInNewWindow(title: string, content: string): boolean {
  try {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return false;
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            body {
              background-color: #0a0f1d;
              color: #10b981;
              font-family: 'Courier New', Courier, monospace;
              padding: 24px;
              white-space: pre-wrap;
              word-break: break-word;
              line-height: 1.6;
            }
            .header-bar {
              border-bottom: 2px solid #10b981;
              padding-bottom: 12px;
              margin-bottom: 20px;
              color: #6ee7b7;
            }
            .save-hint {
              background: #064e3b;
              color: #a7f3d0;
              padding: 10px;
              border-radius: 4px;
              margin-bottom: 16px;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="save-hint">
            💡 TIP: Press <strong>Ctrl + S</strong> (or <strong>Cmd + S</strong> on Mac) to save this dossier to your computer as a .txt file.
          </div>
          <div class="header-bar">
            <h2>DIRECTORATE OF COVERT OPERATIONS // INTEL ARCHIVE</h2>
            <div>${title}</div>
          </div>
          <div>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </body>
      </html>
    `);
    newWindow.document.close();
    return true;
  } catch (err) {
    console.warn('Could not open new window due to sandbox restrictions:', err);
    return false;
  }
}

/**
 * Formats a single dossier into a complete intelligence text document
 */
export function formatDossierText(doc: ClassifiedDocument, language: Language = 'ar'): string {
  const isAr = language === 'ar';
  return `===============================================================
DIRECTORATE OF COVERT SPECIAL OPERATIONS // CLASSIFIED ARCHIVE
SECURITY CLASSIFICATION : [ ${doc.clearance} ]
FILE IDENTIFIER CODE    : ${doc.code}
TIMESTAMP OF INTERCEPT  : ${doc.date}
OPERATIVE HANDLER       : ${doc.operative}
GPS GRID COORDINATES    : ${doc.coordinates}
SYSTEM INTEGRITY SHA    : ${doc.checksum}
---------------------------------------------------------------
DOCUMENT TITLE (ARABIC)  : ${doc.titleAr}
DOCUMENT TITLE (ENGLISH) : ${doc.titleEn}
CATEGORY                : ${isAr ? doc.categoryAr : doc.categoryEn}
DECRYPTION STATUS       : ${doc.isDecrypted ? 'DECRYPTED & CLEARED' : 'PARTIALLY ENCRYPTED'}
---------------------------------------------------------------
EXECUTIVE SUMMARY:
[AR] ${doc.summaryAr}

[EN] ${doc.summaryEn}
---------------------------------------------------------------
AUTHENTICATED INTELLIGENCE BODY (FULL INTEL):
${isAr ? doc.fullContentAr : doc.fullContentEn}

${doc.interceptedSignal ? `INTERCEPTED RAW SPECTRUM SIGNAL:\n${doc.interceptedSignal}\n` : ''}
===============================================================
CLASSIFIED DOCUMENT - UNAUTHORIZED TRANSMISSION IS A FELONY OFFENSE
DIRECTORATE OF INTELLIGENCE & RECONNAISSANCE - ALL RIGHTS RESTRICTED
===============================================================`;
}

/**
 * Formats all classified documents into an Intelligence Master Archive
 */
export function formatAllDossiersArchive(docs: ClassifiedDocument[], language: Language = 'ar'): string {
  const activeDocs = docs.filter(d => !d.isBurned);
  const divider = '\n' + '='.repeat(70) + '\n';

  return `======================================================================
DIRECTORATE OF COVERT SPECIAL OPERATIONS // MASTER INTELLIGENCE ARCHIVE
TOTAL COMPARTMENTALIZED DOSSIERS : ${activeDocs.length}
ARCHIVE GENERATION TIMESTAMP     : ${new Date().toISOString()}
AUTHORIZATION CLEARANCE          : LEVEL 5 (BLACK OPS ACCESS ONLY)
======================================================================

TABLE OF CLASSIFIED CONTENTS:
${activeDocs.map((d, i) => `[${i + 1}] CODE: ${d.code.padEnd(14)} | LEVEL: ${d.clearance.padEnd(12)} | ${language === 'ar' ? d.titleAr : d.titleEn}`).join('\n')}

${divider}
${activeDocs.map(d => formatDossierText(d, language)).join(divider)}
`;
}

/**
 * Formats full operational tactical report (DEFCON, Radar, Feeds, Files)
 */
export function formatTacticalReport(
  defcon: number,
  targets: RadarTarget[],
  docs: ClassifiedDocument[],
  language: Language = 'ar'
): string {
  const isAr = language === 'ar';
  return `======================================================================
COVERT OPERATIONS PORTAL // TACTICAL READINESS REPORT
GENERATED: ${new Date().toLocaleString()}
======================================================================
OPERATIONAL READINESS POSTURE:
• DEFCON LEVEL        : DEFCON ${defcon} [${defcon === 1 ? 'MAXIMUM COMBAT ALERT' : defcon === 2 ? 'HIGH READINESS' : 'MONITORING'}]
• ACTIVE SATELLITE    : PEGASUS-4 HIGH-ORBIT (LATENCY: 14ms)
• SECURITY PERIMETER  : BYPASSED & MONITORED
• ARCHIVED DOSSIERS   : ${docs.filter(d => !d.isBurned).length} Active Files

RADAR TELEMETRY SUMMARY (${targets.length} CONTACTS):
${targets.map((t, i) => `[${i + 1}] ${t.callsign.padEnd(16)} | TYPE: ${t.type.padEnd(14)} | DIST: ${String(t.distanceKm).padStart(3)}km | BRG: ${t.bearing.padEnd(4)} | ALT: ${String(t.altitudeFt).padStart(5)}ft | THREAT: ${t.threatLevel.padEnd(8)} | STATUS: ${t.status}`).join('\n')}

INTELLIGENCE DOSSIER SUMMARY:
${docs.filter(d => !d.isBurned).map(d => `• [${d.clearance}] ${d.code}: ${isAr ? d.titleAr : d.titleEn} (Agent: ${d.operative})`).join('\n')}

======================================================================
CONFIDENTIAL INTELLIGENCE DOCUMENT // EYES ONLY
======================================================================`;
}

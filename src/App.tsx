import React, { useState, useEffect } from 'react';
import { Language, PortalTab, ThemeMode, ClassifiedDocument, RadarTarget } from './types';
import { INITIAL_CLASSIFIED_FILES } from './data/classifiedFiles';
import { INITIAL_RADAR_TARGETS } from './data/radarTargets';
import { BreachIntro } from './components/BreachIntro';
import { HeaderHUD } from './components/HeaderHUD';
import { DashboardOverview } from './components/DashboardOverview';
import { Terminal } from './components/Terminal';
import { ClassifiedFiles } from './components/ClassifiedFiles';
import { LiveFeed } from './components/LiveFeed';
import { TacticalRadar } from './components/TacticalRadar';
import { LockdownModal } from './components/LockdownModal';
import { ExportDossierModal, ExportMode } from './components/ExportDossierModal';

export default function App() {
  const [hasBreached, setHasBreached] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<PortalTab>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeMode>('emerald');
  const [defcon, setDefcon] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [isLockdown, setIsLockdown] = useState<boolean>(false);

  // Global Export Modal State
  const [isGlobalExportOpen, setIsGlobalExportOpen] = useState<boolean>(false);
  const [exportSelectedDoc, setExportSelectedDoc] = useState<ClassifiedDocument | null>(null);
  const [globalExportMode, setGlobalExportMode] = useState<ExportMode>('all_archive');

  const [classifiedFiles, setClassifiedFiles] = useState<ClassifiedDocument[]>(INITIAL_CLASSIFIED_FILES);
  const [radarTargets, setRadarTargets] = useState<RadarTarget[]>(INITIAL_RADAR_TARGETS);

  const handleOpenGlobalExport = (doc?: ClassifiedDocument, mode: ExportMode = 'all_archive') => {
    setExportSelectedDoc(doc || null);
    setGlobalExportMode(doc ? 'single_doc' : mode);
    setIsGlobalExportOpen(true);
  };

  // Sync document dir and lang attribute
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Update a single document state
  const handleUpdateDocument = (docId: string, updates: Partial<ClassifiedDocument>) => {
    setClassifiedFiles((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, ...updates } : d))
    );
  };

  // Update a single radar target
  const handleUpdateTarget = (targetId: string, updates: Partial<RadarTarget>) => {
    setRadarTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, ...updates } : t))
    );
  };

  const handleToggleSound = () => setSoundEnabled((prev) => !prev);
  const handleToggleCrt = () => setCrtEnabled((prev) => !prev);
  const handleToggleLanguage = () => setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const handleTriggerLockdown = () => {
    setDefcon(1);
    setIsLockdown(true);
  };

  const handleDismissLockdown = () => {
    setIsLockdown(false);
    setDefcon(3);
  };

  const themeGridClass = {
    emerald: 'hud-grid-pattern',
    amber: 'hud-grid-amber',
    cyan: 'hud-grid-pattern',
    crimson: 'hud-grid-amber'
  }[theme];

  return (
    <div className={`min-h-screen bg-[#030712] text-gray-100 flex flex-col relative select-none ${themeGridClass}`}>
      {/* Optional CRT scanline overlay */}
      {crtEnabled && <div className="fixed inset-0 crt-overlay pointer-events-none z-40" />}

      {/* 1. Fake Hacking Breach Intro (Shows first or upon replay) */}
      {!hasBreached && (
        <BreachIntro
          language={language}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onComplete={() => setHasBreached(true)}
        />
      )}

      {/* 2. Main Portal Operations Center */}
      {hasBreached && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Operational Header */}
          <HeaderHUD
            language={language}
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            defcon={defcon}
            onSetDefcon={setDefcon}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            crtEnabled={crtEnabled}
            onToggleCrt={handleToggleCrt}
            theme={theme}
            onChangeTheme={setTheme}
            onToggleLanguage={handleToggleLanguage}
            onReplayIntro={() => setHasBreached(false)}
            onTriggerLockdown={handleTriggerLockdown}
            onOpenExportModal={() => handleOpenGlobalExport(undefined, 'all_archive')}
          />

          {/* Main Work Area */}
          <main className="flex-1 p-3 md:p-4 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {currentTab === 'dashboard' && (
                <DashboardOverview
                  language={language}
                  soundEnabled={soundEnabled}
                  theme={theme}
                  classifiedFiles={classifiedFiles}
                  radarTargets={radarTargets}
                  defcon={defcon}
                  onNavigateTab={setCurrentTab}
                  onTriggerLockdown={handleTriggerLockdown}
                  onOpenExportModal={() => handleOpenGlobalExport(undefined, 'all_archive')}
                />
              )}

              {currentTab === 'terminal' && (
                <div className="h-[calc(100vh-80px)] min-h-[500px]">
                  <Terminal
                    language={language}
                    soundEnabled={soundEnabled}
                    theme={theme}
                    classifiedFiles={classifiedFiles}
                    radarTargets={radarTargets}
                    defcon={defcon}
                    onSetDefcon={setDefcon}
                    onSelectTab={setCurrentTab}
                    onTriggerLockdown={handleTriggerLockdown}
                    onChangeTheme={setTheme}
                    onReplayIntro={() => setHasBreached(false)}
                  />
                </div>
              )}

              {currentTab === 'files' && (
                <div className="h-[calc(100vh-80px)] min-h-[500px]">
                  <ClassifiedFiles
                    language={language}
                    soundEnabled={soundEnabled}
                    documents={classifiedFiles}
                    onUpdateDocument={handleUpdateDocument}
                    onOpenGlobalExport={handleOpenGlobalExport}
                  />
                </div>
              )}

              {currentTab === 'feed' && (
                <div className="h-[calc(100vh-80px)] min-h-[500px]">
                  <LiveFeed
                    language={language}
                    soundEnabled={soundEnabled}
                  />
                </div>
              )}

              {currentTab === 'radar' && (
                <div className="h-[calc(100vh-80px)] min-h-[500px]">
                  <TacticalRadar
                    language={language}
                    soundEnabled={soundEnabled}
                    targets={radarTargets}
                    onUpdateTarget={handleUpdateTarget}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* 3. Emergency Lockdown Full-screen Alert */}
      {isLockdown && (
        <LockdownModal
          language={language}
          soundEnabled={soundEnabled}
          onDismiss={handleDismissLockdown}
        />
      )}

      {/* 4. Global Intel Export & Download Terminal */}
      <ExportDossierModal
        isOpen={isGlobalExportOpen}
        onClose={() => setIsGlobalExportOpen(false)}
        language={language}
        soundEnabled={soundEnabled}
        selectedDoc={exportSelectedDoc}
        allDocs={classifiedFiles}
        radarTargets={radarTargets}
        defcon={defcon}
        initialMode={globalExportMode}
      />
    </div>
  );
}

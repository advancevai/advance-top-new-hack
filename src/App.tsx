import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import {
  UserSession,
  PredictionPayload,
  WinGoResult,
  HistoryRecord,
  ToastMessage,
  AppSettings,
  OutcomeType,
} from './types';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  verifyActiveSession,
  isSessionLocallyValid,
} from './auth';
import {
  fetchLiveWinGo,
  fetch1kDraws,
  computePrediction,
  generateFallbackPeriod,
  getSecondsRemaining,
  v12Instance,
} from './data';
import { sound } from './audio';
import { fireConfetti } from './confetti';

import { CyberBackdrop } from './components/CyberBackdrop';
import { ToastContainer } from './components/ToastContainer';
import { Header } from './components/Header';
import { PeriodBar } from './components/PeriodBar';
import { RadarHud } from './components/RadarHud';
import { BottomNav } from './components/BottomNav';
import { HistoryAudit } from './components/HistoryAudit';
import { GameFrame } from './components/GameFrame';
import { AuthScreen } from './components/AuthScreen';
import { ResultModal } from './components/ResultModal';
import { APP_CONFIG } from './config';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark-purple',
  glow: true,
  scanlines: true,
  sound: true,
  haptics: true,
  autoScan: true,
  hdQuality8K: true,
};

interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('nexus_core_settings_v3');
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    try {
      localStorage.setItem('nexus_core_settings_v3', JSON.stringify(settings));
    } catch {}
    document.documentElement.setAttribute('data-theme', settings.theme);
    sound.enabled = settings.sound;
  }, [settings]);

  const showToast = useCallback(
    (text: string, type: ToastMessage['type'] = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev.slice(-3), { id, text, type }]);
      if (settings.sound) {
        if (type === 'success') sound.playSuccess();
        else sound.playClick();
      }
      if (settings.haptics && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    },
    [settings]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (settings.sound) sound.playClick();
      setActiveTab(tab);
    },
    [settings.sound]
  );

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings: (ns) => setSettings((s) => ({ ...s, ...ns })),
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab: handleTabChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Main Tool Dashboard
const MainDashboard: React.FC<{
  session: UserSession;
  onLogout: () => void;
}> = ({ session, onLogout }) => {
  const { activeTab, setActiveTab, showToast, settings, updateSettings, toasts, removeToast } = useApp();

  const [historyList, setHistoryList] = useState<HistoryRecord[]>(() => {
    try {
      const raw =
        localStorage.getItem('advance_live_session_history_v4') ||
        localStorage.getItem('ansh_live_session_history_v4');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [currentIssue, setCurrentIssue] = useState<string>(() => generateFallbackPeriod());
  const [latestResult, setLatestResult] = useState<WinGoResult | null>(null);
  const [history1k, setHistory1k] = useState<any[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => getSecondsRemaining());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const activePrediction = computePrediction(currentIssue, history1k);
  const [modalOutcomeData, setModalOutcomeData] = useState<any | null>(null);

  const lastDeclaredIssue = useRef<string>('');
  const isFetchingRef = useRef<boolean>(false);
  const predictionRegistryRef = useRef<Map<string, PredictionPayload>>(new Map());

  // Store active prediction for current issue
  useEffect(() => {
    if (currentIssue && activePrediction) {
      predictionRegistryRef.current.set(currentIssue, activePrediction);
    }
  }, [currentIssue, activePrediction]);

  // Round resolution handler
  const handleDeclareRound = useCallback(
    (issueNum: string, result: WinGoResult, currentList: any[]) => {
      if (lastDeclaredIssue.current === issueNum) return;
      lastDeclaredIssue.current = issueNum;

      let pred = predictionRegistryRef.current.get(issueNum);
      if (!pred) {
        pred = computePrediction(
          issueNum,
          (currentList || []).filter((d) => d.issueNumber !== issueNum)
        );
      }

      const actDigit = Number(result.number);
      const actSize = actDigit >= 5 ? 'BIG' : 'SMALL';
      const actColor = result.color || (actDigit === 0 || actDigit === 5 ? 'violet' : [1, 3, 7, 9].includes(actDigit) ? 'green' : 'red');
      const predSize = (pred.prediction || '').toUpperCase().trim() === 'BIG' ? 'BIG' : 'SMALL';
      const predDigit = Number(pred.digit);

      const isJackpot = predDigit === actDigit;
      const isWin = predSize === actSize;
      const outcome: OutcomeType = isJackpot ? 'JACKPOT' : isWin ? 'WIN' : 'LOSS';

      v12Instance.recordOutcome(predSize, actDigit);

      setModalOutcomeData({
        type: outcome,
        issueNumber: issueNum,
        predictedSize: predSize,
        predictedDigit: predDigit,
        actualDigit: actDigit,
        actualColor: actColor,
        actualSize: actSize,
        titaniumCombo: pred.titaniumCombo,
      });

      const newRec: HistoryRecord = {
        id: issueNum,
        issueNumber: issueNum,
        number: actDigit,
        color: actColor,
        size: actSize,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        predictedSize: predSize,
        predictedDigit: predDigit,
        conf: pred.confidence,
        result: outcome,
      };

      setHistoryList((prev) => {
        if (prev.some((h) => h.issueNumber === issueNum)) return prev;
        const updated = [newRec, ...prev].slice(0, 100);
        try {
          localStorage.setItem('advance_live_session_history_v4', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (outcome === 'JACKPOT') {
        sound.playSuccess();
        fireConfetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#fbbf24', '#00ff66', '#a855f7', '#ffffff'],
        });
        showToast(`★ JACKPOT HIT #${issueNum.slice(-5)}: EXACT NUMBER [${actDigit}] + ${actSize}!`, 'success');
      } else if (outcome === 'WIN') {
        sound.playSuccess();
        fireConfetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#c084fc', '#e879f9', '#ffffff', '#fbbf24'],
        });
        showToast(`✓ WIN DECLARED #${issueNum.slice(-5)}: ${actSize} MATCHED!`, 'success');
      } else {
        sound.playTick();
        showToast(`Round #${issueNum.slice(-5)}: Actual was ${actSize} [${actDigit}]`, 'warn');
      }
    },
    [showToast]
  );

  // Sync API data
  const syncWinGoData = useCallback(
    async (showUserAlert = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsSyncing(true);

      try {
        const live = await fetchLiveWinGo(1);
        const nextPeriod = live.currentIssue;
        setCurrentIssue(nextPeriod);

        let list1k: any[] = [];
        try {
          list1k = await fetch1kDraws();
          if (live.latestResult && list1k.length > 0) {
            try {
              if (BigInt(live.latestResult.issueNumber) > BigInt(list1k[0].issueNumber)) {
                list1k = [
                  {
                    issueNumber: live.latestResult.issueNumber,
                    number: live.latestResult.number,
                    size: live.latestResult.size.toLowerCase(),
                    colour: live.latestResult.color,
                    time: new Date().toLocaleTimeString(),
                  },
                  ...list1k,
                ];
              }
            } catch {}
          }
          if (list1k.length > 0) {
            setHistory1k(list1k);
            setHistoryList((prev) => {
              if (prev && prev.length > 0) return prev;
              // Populate initial verified historical records so the history box on home page is rich right away
              const initial: HistoryRecord[] = list1k.slice(0, 15).map((d: any) => {
                const actDigit = Number(d.number);
                const actSize = actDigit >= 5 ? 'BIG' : 'SMALL';
                const actColor =
                  d.colour ||
                  d.color ||
                  (actDigit === 0 || actDigit === 5 ? 'violet' : [1, 3, 7, 9].includes(actDigit) ? 'green' : 'red');
                const pred = computePrediction(
                  d.issueNumber,
                  list1k.filter((x: any) => x.issueNumber !== d.issueNumber)
                );
                const predSize = (pred.prediction || '').toUpperCase().trim() === 'BIG' ? 'BIG' : 'SMALL';
                const predDigit = Number(pred.digit);
                const isJackpot = predDigit === actDigit;
                const isWin = predSize === actSize;
                const outcome: OutcomeType = isJackpot ? 'JACKPOT' : isWin ? 'WIN' : 'LOSS';

                return {
                  id: d.issueNumber,
                  issueNumber: d.issueNumber,
                  number: actDigit,
                  color: actColor,
                  size: actSize,
                  time: d.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  predictedSize: predSize,
                  predictedDigit: predDigit,
                  conf: pred.confidence,
                  result: outcome,
                };
              });
              try {
                localStorage.setItem('ansh_live_session_history_v4', JSON.stringify(initial));
              } catch {}
              return initial;
            });
          }
        } catch {}

        if (live.latestResult) {
          setLatestResult(live.latestResult);
          if (lastDeclaredIssue.current !== live.latestResult.issueNumber) {
            handleDeclareRound(live.latestResult.issueNumber, live.latestResult, list1k);
          }
        }

        if (showUserAlert) {
          showToast(`API & 1K Analyzed: #${nextPeriod.slice(-5)} Synced (${APP_CONFIG.name} Active)`, 'info');
        }
      } catch {}
      finally {
        setIsSyncing(false);
        isFetchingRef.current = false;
      }
    },
    [handleDeclareRound, showToast]
  );

  // Initial load
  useEffect(() => {
    syncWinGoData(false);
  }, [syncWinGoData]);

  // Periodic 1-second interval
  useEffect(() => {
    const timer = setInterval(() => {
      const sec = getSecondsRemaining();
      setSecondsRemaining(sec);
      if (sec === 60 || sec === 1 || sec === 3 || sec === 5) {
        syncWinGoData(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [syncWinGoData]);

  const handleCopyPeriod = async () => {
    try {
      await navigator.clipboard.writeText(currentIssue);
      showToast(`Period ID ${currentIssue} copied`, 'success');
    } catch {
      showToast('Clipboard copy unavailable', 'warn');
    }
  };

  const scrollToHistory = () => {
    const el = document.getElementById('history-box-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen text-[#f5f3ff] bg-[#05010b] overflow-x-hidden selection:bg-purple-500/30 selection:text-[#c084fc]">
      <CyberBackdrop glow={settings.glow} scanlines={settings.scanlines} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {modalOutcomeData && (
        <ResultModal data={modalOutcomeData} onClose={() => setModalOutcomeData(null)} />
      )}

      <main className="relative z-10 mx-auto w-full max-w-md px-3.5 pt-3 pb-24">
        <Header
          session={session}
          soundEnabled={settings.sound}
          onToggleSound={() => {
            const nextSound = !settings.sound;
            updateSettings({ sound: nextSound });
            showToast(`Cyber Audio ${nextSound ? 'Activated' : 'Muted'}`, nextSound ? 'success' : 'info');
          }}
          onLogout={onLogout}
        />

        {activeTab === 'home' && (
          <div className="space-y-3.5 mt-3">
            <PeriodBar
              periodId={currentIssue}
              onRefresh={() => syncWinGoData(true)}
              isSyncing={isSyncing}
              secondsRemaining={secondsRemaining}
              lastResult={latestResult}
              onCopyPeriod={handleCopyPeriod}
            />

            <RadarHud
              prediction={activePrediction.prediction}
              confidence={activePrediction.confidence}
              digit={activePrediction.digit}
              colorType={activePrediction.colorType}
              secondsLeft={secondsRemaining}
              totalSeconds={60}
              signalStrength={activePrediction.signalStrength}
              accuracyLevel={activePrediction.accuracyLevel}
              isScanning={isSyncing}
              targetPeriodId={currentIssue}
              isLocked={true}
              titaniumCombo={activePrediction.titaniumCombo}
              titaniumComboineSignal={activePrediction.titaniumComboineSignal}
              glowEnabled={settings.glow}
            />

            {/* Quick Home Page Jump Bar */}
            <div className="flex items-center justify-between px-0.5">
              <button
                type="button"
                onClick={scrollToHistory}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 hover:border-purple-400/60 text-[#c084fc] transition-all text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.15)]"
              >
                <span>↓ VIEW ROUNDS HISTORY BOX</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200">
                  {historyList.length} ROUNDS
                </span>
              </button>
            </div>

            {/* History Box on Home Page */}
            <div id="history-box-section" className="scroll-mt-4">
              <HistoryAudit
                historyList={historyList}
                isLoading={isSyncing}
                onRefresh={() => syncWinGoData(true)}
                onClearHistory={() => {
                  setHistoryList([]);
                  try {
                    localStorage.removeItem('advance_live_session_history_v4');
                    localStorage.removeItem('ansh_live_session_history_v4');
                  } catch {}
                  showToast('Session results history cleared', 'info');
                }}
                currentPeriod={currentIssue}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="mt-3">
            <HistoryAudit
              historyList={historyList}
              isLoading={isSyncing}
              onRefresh={() => syncWinGoData(true)}
              onClearHistory={() => {
                setHistoryList([]);
                try {
                  localStorage.removeItem('advance_live_session_history_v4');
                  localStorage.removeItem('ansh_live_session_history_v4');
                } catch {}
                showToast('Session results history cleared', 'info');
              }}
              currentPeriod={currentIssue}
            />
          </div>
        )}

        {activeTab === 'game' && (
          <div className="mt-3">
            <GameFrame isStandaloneTab={true} />
          </div>
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'history' && activeTab === 'home') {
            const el = document.getElementById('history-box-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              showToast('Scrolled to History Box', 'info');
              return;
            }
          }
          if (tab === 'home' && activeTab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setActiveTab(tab);
        }}
      />
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => getActiveSession());
  const [expiredMsg, setExpiredMsg] = useState<string | null>(null);

  // Background verification of active session with PassGate
  useEffect(() => {
    if (!session) return;
    let isMounted = true;

    const check = async () => {
      if (!isSessionLocallyValid(session)) {
        if (!isMounted) return;
        clearActiveSession();
        setSession(null);
        setExpiredMsg('Session Expired! Please login again with your VIP password.');
        sound.playWarning();
        return;
      }

      try {
        const res = await verifyActiveSession(session);
        if (!res.isValid) {
          if (!isMounted) return;
          clearActiveSession();
          setSession(null);
          setExpiredMsg(res.reason || 'Session expired or revoked on PassGate.');
          sound.playWarning();
        }
      } catch {}
    };

    check();
    const iv = setInterval(check, 4000);
    return () => {
      isMounted = false;
      clearInterval(iv);
    };
  }, [session]);

  const handleLoginSuccess = (newSession: UserSession) => {
    setExpiredMsg(null);
    setSession(newSession);
  };

  const handleLogout = () => {
    sound.playClick();
    clearActiveSession();
    setSession(null);
    setExpiredMsg(null);
  };

  if (!session || !isSessionLocallyValid(session)) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} expiredAlertMessage={expiredMsg} />;
  }

  return (
    <div id="pg-secret" style={{ display: 'block' }}>
      <AppProvider>
        <MainDashboard
          session={session}
          onLogout={handleLogout}
        />
      </AppProvider>
    </div>
  );
}

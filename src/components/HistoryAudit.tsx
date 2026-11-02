import React, { useState, useMemo } from 'react';
import {
  Layers,
  Table as TableIcon,
  Trash2,
  RefreshCw,
  Download,
  Check,
  Search,
  FileText,
  Sparkles,
  Clock,
} from 'lucide-react';
import { BallIcon } from './BallIcon';
import { BetSize, HistoryRecord, OutcomeType } from '../types';
import { APP_CONFIG } from '../config';

interface HistoryAuditProps {
  historyList: HistoryRecord[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onClearHistory?: () => void;
  currentPeriod?: string;
}

export const HistoryAudit: React.FC<HistoryAuditProps> = ({
  historyList,
  isLoading = false,
  onRefresh,
  onClearHistory,
  currentPeriod,
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = historyList.length;
    let wins = 0;
    let losses = 0;
    let jackpots = 0;
    let bigs = 0;
    let smalls = 0;
    let curStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    historyList.forEach((h, idx) => {
      const isWin = h.result === 'WIN' || h.result === 'JACKPOT';
      if (isWin) {
        wins++;
        if (h.result === 'JACKPOT') jackpots++;
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
        if (idx === 0) curStreak = tempStreak;
      } else {
        losses++;
        tempStreak = 0;
      }

      if (h.size === 'BIG') bigs++;
      else smalls++;
    });

    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { total, wins, losses, jackpots, winRate, curStreak, bestStreak, bigs, smalls };
  }, [historyList]);

  // Filtered list
  const filteredList = useMemo(() => {
    return historyList.filter((item) => {
      const matchFilter =
        filter === 'ALL' ||
        item.result === filter ||
        item.size === filter ||
        (item.color && item.color.toLowerCase().includes(filter.toLowerCase()));

      const query = search.toLowerCase().trim();
      const matchSearch =
        query === '' ||
        item.issueNumber.includes(query) ||
        item.size.toLowerCase().includes(query) ||
        String(item.number) === query ||
        item.predictedSize.toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [historyList, filter, search]);

  const filterTabs = ['ALL', 'WIN', 'LOSS', 'JACKPOT', 'BIG', 'SMALL'];

  // Export JSON handler
  const handleExportJson = () => {
    if (historyList.length === 0) return;
    const payload = {
      title: `${APP_CONFIG.name} — SESSION HISTORY AUDIT LOG`,
      exportedAt: new Date().toISOString(),
      sessionSummary: {
        totalRounds: stats.total,
        winRate: `${stats.winRate}%`,
        wins: stats.wins,
        losses: stats.losses,
        jackpots: stats.jackpots,
        currentStreak: stats.curStreak,
        bestStreak: stats.bestStreak,
        bigCount: stats.bigs,
        smallCount: stats.smalls,
      },
      records: historyList.map((h, i) => ({
        index: i + 1,
        issueNumber: h.issueNumber,
        actualNumber: Number(h.number),
        actualSize: h.size,
        actualColor: h.color,
        predictedDigit: h.predictedDigit ?? null,
        predictedSize: h.predictedSize,
        result: h.result,
        confidence: h.conf ? `${h.conf}%` : null,
        timestamp: h.time || new Date().toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${APP_CONFIG.name.toLowerCase()}-session-log-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportMessage('JSON Log Exported!');
    setTimeout(() => setExportMessage(null), 3000);
  };

  // Export Text handler
  const handleExportText = () => {
    if (historyList.length === 0) return;
    let txt = `=========================================================================\n`;
    txt += `🔮 ${APP_CONFIG.name} — SESSION AUDIT & HISTORY LOG (DARK PURPLE EDITION)\n`;
    txt += `Export Date: ${new Date().toLocaleString()}\n`;
    txt += `Total Rounds: ${stats.total} | Win Rate: ${stats.winRate}% | Jackpots: ${stats.jackpots}\n`;
    txt += `Wins: ${stats.wins} | Losses: ${stats.losses} | Best Streak: ${stats.bestStreak}\n`;
    txt += `Big: ${stats.bigs} | Small: ${stats.smalls}\n`;
    txt += `=========================================================================\n`;
    txt += `IDX | ISSUE NUMBER    | ACTUAL | SIZE  | COLOR  | PRED DIGIT | PRED SIZE | RESULT   | CONF\n`;
    txt += `-------------------------------------------------------------------------\n`;

    historyList.forEach((h, i) => {
      const idx = String(i + 1).padStart(3, ' ');
      const issue = h.issueNumber.padEnd(15, ' ');
      const actNum = String(h.number).padStart(6, ' ');
      const actSize = h.size.padEnd(5, ' ');
      const actColor = (h.color || '-').padEnd(6, ' ');
      const predDig = (h.predictedDigit === undefined ? '-' : String(h.predictedDigit)).padStart(10, ' ');
      const predSize = h.predictedSize.padEnd(9, ' ');
      const res = h.result.padEnd(8, ' ');
      const conf = (h.conf ? `${h.conf}%` : '-').padStart(5, ' ');
      txt += `${idx} | ${issue} | ${actNum} | ${actSize} | ${actColor} | ${predDig} | ${predSize} | ${res} | ${conf}\n`;
    });
    txt += `=========================================================================\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ansh-ai-session-log-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportMessage('Text Log Exported!');
    setTimeout(() => setExportMessage(null), 3000);
  };

  return (
    <div className="space-y-3.5 pb-24 pt-1 animate-rise text-left">
      {/* History Rounds List */}
      <section className="relative overflow-hidden rounded-3xl p-4 border border-purple-500/35 bg-gradient-to-b from-[#110626]/95 via-[#080214]/95 to-[#04010b] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.9)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="digital text-[13px] font-black tracking-wider text-[#c084fc] glow-purple">
              LIVE ROUNDS AUDIT LOG
            </h2>
            <p className="hud-label text-[#c4b5fd] mt-0.5">{historyList.length} ROUNDS MONITORED IN ACTIVE SESSION</p>
          </div>

          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-purple-950/60 px-3 py-1.5 text-[9.5px] font-black text-[#c084fc] hover:bg-purple-900/40 shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all cursor-pointer"
                  title="Export History Log"
                >
                  <Download className="size-3.5 text-[#c084fc]" />
                  <span>EXPORT</span>
                </button>

                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 z-40 w-52 rounded-2xl border border-purple-400/50 bg-[#120524] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.95)] backdrop-blur-md space-y-1.5 animate-rise">
                    <button
                      type="button"
                      onClick={() => {
                        handleExportJson();
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[9.5px] font-bold text-zinc-200 hover:bg-purple-900/40 hover:text-[#c084fc] transition-colors"
                    >
                      <Download className="size-4 text-[#c084fc] shrink-0" />
                      <div>
                        <div className="text-white font-bold">JSON File (.json)</div>
                        <div className="text-[7.5px] text-[#c4b5fd]">Complete structured session log</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleExportText();
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[9.5px] font-bold text-zinc-200 hover:bg-purple-900/40 hover:text-[#c084fc] transition-colors"
                    >
                      <FileText className="size-4 text-purple-300 shrink-0" />
                      <div>
                        <div className="text-white font-bold">Text Log (.txt)</div>
                        <div className="text-[7.5px] text-[#c4b5fd]">Plain text format for Excel</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className="grid size-8 place-items-center rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle View Mode"
            >
              {viewMode === 'cards' ? <TableIcon className="size-4" /> : <Layers className="size-4" />}
            </button>

            {onClearHistory && historyList.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title="Clear Session History"
                className="grid size-8 place-items-center rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-300 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="size-4" />
              </button>
            )}

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Refresh Live API Data"
                className="grid size-8 place-items-center rounded-xl border border-purple-500/40 bg-purple-950/40 text-[#c084fc] hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {exportMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-950/90 px-3 py-1.5 text-[9px] font-bold text-emerald-300 animate-rise">
            <Check className="size-3.5 text-emerald-400" />
            <span>{exportMessage}</span>
          </div>
        )}

        {/* Filter Tabs */}
        {historyList.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-3 py-1.5 text-[9.5px] font-black tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filter === tab
                    ? 'border border-[#c084fc] bg-purple-900/60 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'border border-purple-500/20 bg-black/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Empty state or list */}
        {historyList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-purple-500/40 bg-[#120626]/70 p-7 text-center space-y-3">
            <div className="mx-auto size-14 rounded-2xl border border-purple-400/50 bg-purple-900/40 grid place-items-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Sparkles className="size-7 text-[#c084fc] animate-pulse" />
            </div>
            <div>
              <p className="digital text-base font-black text-[#c084fc] glow-purple tracking-wide">
                FRESH SESSION INITIALIZED
              </p>
              <p className="hud-label text-[#c4b5fd] mt-1 text-[9px]">LIVE API ACTIVE • AWAITING ROUND COMPLETION</p>
            </div>
            <p className="text-[11px] text-zinc-300 max-w-sm mx-auto leading-relaxed">
              Old history results have been purged. As soon as the ongoing 60-second round finishes, its verified outcome will automatically log here with instant audit!
            </p>
            {currentPeriod && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-black/50 text-[10px] text-zinc-200">
                <Clock className="size-3.5 text-[#fbbf24]" />
                <span>Monitoring Active Draw:</span>
                <span className="digital font-bold text-[#fbbf24]">#{currentPeriod.slice(-5)}</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search issue number, digit or size..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-purple-500/30 bg-black/70 py-2.5 pl-9 pr-4 text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:border-[#c084fc] focus:outline-none shadow-inner"
              />
            </div>

            {viewMode === 'cards' ? (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                {filteredList.map((item, idx) => {
                  const isJackpot = item.result === 'JACKPOT';
                  const isWin = item.result === 'WIN';

                  return (
                    <div
                      key={item.id || `${item.issueNumber}-${idx}`}
                      className={`rounded-2xl border p-3 sm:p-3.5 transition-all duration-300 hover:scale-[1.01] ${
                        isJackpot
                          ? 'border-yellow-400/60 bg-gradient-to-r from-[#201502] via-[#150a28] to-[#0d041e] shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                          : isWin
                          ? 'border-purple-400/40 bg-gradient-to-r from-[#170830] via-[#0f0422] to-[#070114] shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                          : 'border-white/10 bg-[#090315] hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center justify-between sm:justify-start sm:gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="digital text-[14px] font-black text-white tracking-wider">
                              #{item.issueNumber.slice(-5)}
                            </span>
                            <span className="text-[8px] text-zinc-400 font-mono px-1.5 py-0.5 rounded bg-black/60 border border-purple-500/20">
                              {item.time || '1M WinGo'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[9.5px]">
                            <span className="hud-label text-[7.5px] text-[#c4b5fd]">AI PICK:</span>
                            <span className="digital font-black text-[#c084fc] px-2 py-0.5 rounded-md bg-purple-900/50 border border-purple-400/40">
                              {item.predictedSize} [{item.predictedDigit === undefined ? '-' : item.predictedDigit}]
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 border-t border-purple-500/15 sm:border-t-0 sm:pt-0">
                          <div className="flex items-center gap-2">
                            <BallIcon digit={item.number} size="md" className="drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
                            <span
                              className={`font-black rounded-lg px-2.5 py-1 text-[9.5px] border ${
                                item.size === 'BIG'
                                  ? 'border-purple-400/60 bg-purple-900/60 text-[#c084fc]'
                                  : 'border-fuchsia-400/60 bg-fuchsia-900/60 text-[#e879f9]'
                              }`}
                            >
                              {item.size}
                            </span>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[9.5px] font-black tracking-wider border shadow-md shrink-0 ${
                              isJackpot
                                ? 'border-yellow-400 bg-yellow-400/25 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                                : isWin
                                ? 'border-purple-400 bg-purple-500/25 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                                : 'border-rose-500/60 bg-rose-950/60 text-rose-300'
                            }`}
                          >
                            {isJackpot && '★ JACKPOT'}
                            {isWin && '✓ WIN'}
                            {!isJackpot && !isWin && '✗ LOSS'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar rounded-2xl border border-purple-500/25 bg-[#06020e]">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-purple-500/20 bg-[#120626] text-[#c4b5fd]">
                      <th className="py-2.5 px-3 font-bold hud-label text-[9px]">PERIOD</th>
                      <th className="py-2.5 px-2 font-bold hud-label text-[9px] text-center">DRAWN</th>
                      <th className="py-2.5 px-2 font-bold hud-label text-[9px] text-center">SIZE</th>
                      <th className="py-2.5 px-2 font-bold hud-label text-[9px] text-center">AI PICK</th>
                      <th className="py-2.5 px-3 font-bold hud-label text-[9px] text-right">OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-purple-900/15 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="digital font-black text-white text-xs">#{item.issueNumber.slice(-5)}</span>
                          <div className="text-[8.5px] text-[#c4b5fd]">{item.time}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <BallIcon digit={item.number} size="sm" />
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`font-black rounded px-2 py-0.5 text-[9px] border ${
                              item.size === 'BIG'
                                ? 'border-purple-400/50 bg-purple-900/50 text-[#c084fc]'
                                : 'border-fuchsia-400/50 bg-fuchsia-900/50 text-[#e879f9]'
                            }`}
                          >
                            {item.size}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1 font-bold">
                            <span
                              className={`digital text-[10px] ${
                                item.predictedSize === 'BIG' ? 'text-[#c084fc]' : 'text-[#e879f9]'
                              }`}
                            >
                              {item.predictedSize}
                            </span>
                            <span className="text-[9px] text-zinc-400 digital">
                              [{item.predictedDigit === undefined ? '-' : item.predictedDigit}]
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8.5px] font-black tracking-wider border ${
                              item.result === 'JACKPOT'
                                ? 'border-yellow-400 bg-yellow-400/25 text-yellow-300'
                                : item.result === 'WIN'
                                ? 'border-purple-400 bg-purple-500/25 text-[#c084fc]'
                                : 'border-rose-500/60 bg-rose-950/60 text-rose-300'
                            }`}
                          >
                            {item.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

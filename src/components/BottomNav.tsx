import { Target, ChartNoAxesColumn, Gamepad2 } from 'lucide-react';
import { sound } from '../audio';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'PREDICT', icon: Target },
    { id: 'history', label: 'HISTORY', icon: ChartNoAxesColumn },
    { id: 'game', label: 'GAME', icon: Gamepad2 },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[max(env(safe-area-inset-bottom),0.6rem)] pt-1.5 pointer-events-auto">
      <div className="mx-auto flex max-w-md items-stretch justify-around rounded-2xl px-1.5 py-1.5 border border-purple-500/35 bg-[#0e041e]/95 backdrop-blur-xl shadow-[0_0_24px_rgba(0,0,0,0.95),0_0_15px_rgba(168,85,247,0.2)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id);
              }}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Icon
                className={`size-[19px] transition-all duration-200 ${
                  isActive
                    ? 'text-[#c084fc] drop-shadow-[0_0_8px_#c084fc] scale-110'
                    : 'text-zinc-500 hover:text-purple-300'
                }`}
              />
              <span
                className={`hud-label text-[8.5px] transition-colors duration-200 ${
                  isActive ? 'text-[#c084fc] font-black glow-purple' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 h-0.5 w-7 rounded-full bg-[#c084fc] shadow-[0_0_12px_#c084fc]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PerformanceSphere from '@/src/components/3d/PerformanceSphere';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { PulseButton } from '@/src/components/ui/PulseButton';
import { SlotCounter } from '@/src/components/ui/SlotCounter';
import { useUserStore } from '@/src/store/userStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Play, CheckCircle, Settings, LogOut, LayoutDashboard, Database, ShieldCheck, Activity, Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations } from '@/src/lib/translations';

export default function DashboardPage() {
  const { user, progress, logout } = useUserStore();
  const { language } = useSettingsStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const levels = [
    { id: 1, name: "Fundamental Assessment", arName: "أساسيات التمريض", color: "#8A2BE2" },
    { id: 2, name: "Critical Care Protocol", arName: "الرعاية التمريضية للحالات الشائعة", color: "#00F2FE" },
    { id: 3, name: "Emergency Response", arName: "الحالات الحرجة", color: "#FFB302" },
    { id: 4, name: "Pharmacovigilance", arName: "اتخاذ القرار وسلامة المرضى", color: "#FF6321" },
    { id: 5, name: "Pediatric Advanced Life Support", arName: "دعم الحياة المتقدم للأطفال", color: "#FF416C" },
  ];

  const totalScore = Object.values(progress).reduce((acc, curr) => acc + curr.highestScore, 0);
  const avgScore = Math.round(totalScore / (Object.keys(progress).length || 1));

  const SidebarContent = () => (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-[#8A2BE2] to-[#00F2FE] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          {t.appName}
        </h1>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-2 font-semibold">{t.appTagline}</p>
      </div>

      <nav className="space-y-2 flex-1">
        <Link to="/dashboard" className="flex items-center gap-4 px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white shadow-[0_0_20px_rgba(138,43,226,0.15)] transition-all">
          <LayoutDashboard size={20} className="text-[#8A2BE2]" />
          <span className="font-medium tracking-tight">{t.dashboard}</span>
        </Link>
        <div className="px-5 py-4 text-white/40 text-[10px] uppercase tracking-widest font-bold mt-6 mb-2">{t.systems}</div>
        <button className="w-full flex items-center gap-4 px-5 py-4 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
          <Database size={20} className="group-hover:text-[#00F2FE] transition-colors" />
          <span className="font-medium tracking-tight">{t.levelProgress}</span>
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
          <ShieldCheck size={20} className="group-hover:text-[#00F2FE] transition-colors" />
          <span className="font-medium tracking-tight">{t.clinicalSafety}</span>
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4 text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
          <Activity size={20} className="group-hover:text-[#00F2FE] transition-colors" />
          <span className="font-medium tracking-tight">{t.scenarios}</span>
        </button>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/settings')}>
          <div className="w-12 h-12 rounded-full border border-[#00F2FE] p-0.5 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#00F2FE] flex items-center justify-center font-bold text-white">
              {user?.fullName[0]}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{user?.fullName}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{t.operatorState}</p>
          </div>
          <Settings size={16} className="text-white/20 group-hover:text-white transition-colors" />
        </div>
        <button 
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all"
        >
          <LogOut size={14} /> {t.disconnect}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0B0C10] text-[#E0E0E0] font-sans selection:bg-[#8A2BE2] selection:text-white relative">
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden xl:flex w-72 h-full backdrop-blur-2xl bg-white/5 border-r border-white/10 flex-col p-8 shrink-0 relative z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl xl:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside 
              initial={{ x: language === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '100%' : '-100%' }}
              className="w-72 h-full bg-[#0B0C10]/95 border-r border-white/10 p-8 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-white/40"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-full p-6 md:p-8 xl:p-12 flex flex-col gap-6 md:gap-8 overflow-y-auto overflow-x-hidden pb-32 xl:pb-12">
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              className="xl:hidden p-2 bg-white/5 rounded-xl border border-white/10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white flex gap-2 flex-wrap">
                {t.performanceOverview.split(' ')[0]} <span className="font-bold">{t.performanceOverview.split(' ')[1]}</span>
              </h2>
              <p className="text-xs md:text-sm text-white/40 mt-1 uppercase tracking-widest">{t.globalSync}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mb-1">{t.safetyThreshold}</p>
              <p className="text-xl md:text-2xl font-mono text-[#00F2FE] shadow-[#00F2FE]/20 drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]">85.00%</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10 hidden md:block"></div>
            <PulseButton onClick={() => navigate('/levels/1')} className="px-6 md:px-8 py-3 bg-gradient-to-r from-[#8A2BE2] to-[#6a21ad] text-xs md:text-sm font-bold rounded-xl border border-white/10 shadow-xl">
              {t.initializeExam}
            </PulseButton>
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 md:gap-8 min-h-0">
          {/* Center: 3D Sphere Display & Bottom Stats */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <div className="flex-1 bg-white/[0.03] rounded-[32px] md:rounded-[48px] border border-white/10 relative overflow-hidden flex items-center justify-center min-h-[350px] md:min-h-[400px]">
              {/* Atmosphere Background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.1),transparent_70%)]"></div>
              
              {/* Actual 3D Performance Sphere */}
              <div className="relative z-20 w-64 h-64 md:w-96 md:h-96">
                {/* Outer Glows */}
                <div className="absolute inset-0 rounded-full bg-[#8A2BE2]/10 blur-[60px] md:blur-[80px]"></div>
                <div className="absolute inset-0 rounded-full bg-[#00F2FE]/5 blur-[80px] md:blur-[120px] animate-pulse"></div>
                <PerformanceSphere />
                
                {/* Score Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#00F2FE] mb-2 font-black opacity-80">{t.skillMastery}</p>
                  <div className="text-5xl md:text-7xl font-mono font-black tracking-tighter flex items-baseline">
                    <SlotCounter value={avgScore} />
                    <span className="text-xl md:text-2xl ml-1 opacity-50">%</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats Overlay */}
              <div className="absolute top-6 left-6 md:top-10 md:left-10 flex flex-col gap-3 md:gap-5">
                 <div className="backdrop-blur-xl bg-white/5 p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/10 w-40 md:w-52 shadow-2xl">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 md:mb-2 font-bold font-mono">{t.stabilityIndex}</p>
                    <div className="flex items-end justify-between">
                       <span className="text-xl md:text-2xl font-mono tracking-tighter">0.94</span>
                       <span className="text-[9px] md:text-[10px] text-[#00F2FE] font-bold">↑ 0.02</span>
                    </div>
                 </div>
                 <div className="backdrop-blur-xl bg-white/5 p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/10 w-40 md:w-52 shadow-2xl">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 md:mb-2 font-bold font-mono">{t.stressResponse}</p>
                    <div className="flex items-end justify-between">
                       <span className="text-xl md:text-2xl font-mono tracking-tighter uppercase whitespace-nowrap overflow-hidden">LOW</span>
                       <span className="text-[9px] md:text-[10px] text-[#00F2FE] font-bold uppercase">{t.optimal}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              {[
                { label: t.safetyCritical, value: `0 ${t.violations}`, progress: 100, color: '#22c55e' },
                { label: t.clinicalLogic, value: `${avgScore}% ${t.accuracy}`, progress: avgScore, color: '#8A2BE2' },
                { label: t.avgReaction, value: `1.42 ${t.seconds}`, progress: 75, color: '#00F2FE' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] p-5 md:p-6 shadow-xl">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 md:mb-3 font-bold">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold tracking-tight text-white mb-4">{stat.value}</p>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      className="h-full rounded-full" 
                      style={{ 
                        backgroundColor: stat.color,
                        boxShadow: `0 0 15px ${stat.color}40`
                      }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Level Progression Map */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-8 flex-1 flex flex-col shadow-2xl">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/60 mb-6 md:mb-8 md:px-2">{t.progressionMap}</h3>
              
              <div className="space-y-4 md:space-y-5 flex-1 md:px-2">
                {levels.map((level) => {
                  const userLevel = progress[level.id];
                  const isLocked = !userLevel || userLevel.status === 'locked';
                  const isCompleted = userLevel?.status === 'completed';
                  const isActive = !isLocked && !isCompleted;
                  
                  return (
                    <motion.div
                      key={level.id}
                      whileHover={!isLocked ? { scale: 1.02, x: 4 } : {}}
                      onClick={() => !isLocked && navigate(`/levels/${level.id}`)}
                      className={cn(
                        "flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-[20px] md:rounded-[24px] border transition-all cursor-pointer relative",
                        isCompleted ? "bg-white/5 border-white/10" : 
                        isActive ? "bg-[#8A2BE2]/10 border-[#8A2BE2]/50 ring-1 ring-[#8A2BE2]/30 shadow-[0_0_30px_rgba(138,43,226,0.1)]" :
                        "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-xl h-10 md:rounded-2xl flex items-center justify-center font-mono text-base md:text-lg font-bold shrink-0",
                        isCompleted ? "bg-green-500/20 text-green-500" :
                        isActive ? "bg-[#8A2BE2] text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]" :
                        "bg-white/10 text-white/40"
                      )}>
                        {isCompleted ? "✓" : `0${level.id}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-bold truncate leading-tight uppercase tracking-tight",
                          language === 'ar' ? 'text-sm' : 'text-xs md:text-sm'
                        )}>
                          {language === 'ar' ? level.arName : level.name}
                        </p>
                        <p className={cn(
                          "text-[9px] md:text-[10px] uppercase tracking-widest mt-1.5 font-bold",
                          isCompleted ? "text-green-500/60" : isActive ? "text-[#00F2FE]" : "text-white/40"
                        )}>
                          {isCompleted ? `${t.score}: ${userLevel.highestScore}%` : isActive ? t.ready : t.locked}
                        </p>
                      </div>
                      {isLocked && <Lock size={14} className="text-white/20 ml-2" />}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8">
                <div className="bg-gradient-to-br from-[#0B0C10] to-[#1a0b2e] rounded-[24px] md:rounded-3xl p-5 md:p-6 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F2FE]/5 blur-2xl rounded-full"></div>
                  <p className="text-[10px] md:text-[11px] uppercase text-[#00F2FE] mb-2 md:mb-3 font-black tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse"></span>
                    {t.systemFeed}
                  </p>
                  <p className="text-[11px] md:text-xs text-white/60 leading-relaxed font-medium">
                    Safety algorithms updated for v2.4 compatibility. Calculation weights reduced by <span className="text-white">0.3x</span> to improve precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 xl:hidden z-[90] p-4 pb-8">
        <div className="bg-[#0B0C10]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-around shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <Link to="/dashboard" className="p-4 rounded-2xl bg-white/10 text-white shadow-[0_0_20px_rgba(138,43,226,0.2)]">
            <LayoutDashboard size={24} className="text-[#8A2BE2]" />
          </Link>
          <button className="p-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Database size={24} />
          </button>
          <button className="p-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <ShieldCheck size={24} />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings size={24} />
          </button>
        </div>
      </nav>
    </div>
  );
}



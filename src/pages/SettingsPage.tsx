import { motion } from 'motion/react';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useUserStore } from '@/src/store/userStore';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { PulseButton } from '@/src/components/ui/PulseButton';
import { ChevronLeft, Volume2, Monitor, Globe, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { translations } from '@/src/lib/translations';

export default function SettingsPage() {
  const { theme, soundEnabled, reducedMotion, language, setSettings } = useSettingsStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E0E0E0] p-6 md:p-12 xl:p-16 flex flex-col font-sans">
      <div className="max-w-2xl mx-auto w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-10 uppercase tracking-[0.3em] text-[10px] font-black"
        >
          <ChevronLeft size={16} className={language === 'ar' ? "rotate-180" : ""} /> {t.dashboard}
        </button>

        <h1 className="text-3xl md:text-5xl font-black mb-12 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent tracking-tight uppercase">
          {language === 'ar' ? "إعدادات النظام" : "System Configuration"}
        </h1>

        <div className="space-y-6">
          {/* User Info */}
          <GlassCard className="p-6 md:p-8 border-white/10 shadow-xl overflow-hidden">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6 px-1">
              {language === 'ar' ? "ملف المشغل" : "Operator Profile"}
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-20 h-20 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A2BE2] to-[#00F2FE] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                {user?.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl md:text-2xl font-bold text-white">{user?.fullName}</p>
                <p className="text-white/40 text-sm">{user?.email}</p>
                <p className="text-[10px] text-purple-400 mt-3 font-mono uppercase font-black bg-purple-400/10 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 border border-purple-400/20">
                  ID: {user?.id}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Theme Settings */}
          <GlassCard className="p-6 md:p-8 border-white/10 shadow-xl">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6 px-1">
              {language === 'ar' ? "الواجهة البصرية" : "Visual Interface"}
            </h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { id: 'dark', icon: Moon, label: language === 'ar' ? 'داكن' : 'Dark' },
                { id: 'light', icon: Sun, label: language === 'ar' ? 'فاتح' : 'Light' },
                { id: 'system', icon: Monitor, label: language === 'ar' ? 'آلي' : 'Auto' },
              ].map((themeOpt) => (
                <button
                  key={themeOpt.id}
                  onClick={() => setSettings({ theme: themeOpt.id as any })}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 md:p-5 rounded-[20px] md:rounded-[24px] border transition-all",
                    theme === themeOpt.id 
                      ? "bg-[#8A2BE2]/10 border-[#8A2BE2]/50 text-white shadow-[0_0_20px_rgba(138,43,226,0.1)]" 
                      : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <themeOpt.icon size={20} className={theme === themeOpt.id ? "text-purple-400" : ""} />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{themeOpt.label}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Audio & Accessibility */}
          <GlassCard className="p-6 md:p-8 border-white/10 shadow-xl">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6 px-1">
              {language === 'ar' ? "تغذية النظام الراجعة" : "System Feedback"}
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[24px] cursor-pointer hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20 group-hover:bg-cyan-400/20 transition-colors">
                    <Volume2 size={18} className="text-cyan-400" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{language === 'ar' ? "المؤثرات الصوتية" : "Sound Effects"}</span>
                </div>
                <div 
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors cursor-pointer border border-white/10",
                    soundEnabled ? "bg-[#00F2FE]" : "bg-white/5"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setSettings({ soundEnabled: !soundEnabled });
                  }}
                >
                  <motion.div 
                    animate={{ x: soundEnabled ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[24px] cursor-pointer hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center border border-purple-400/20 group-hover:bg-purple-400/20 transition-colors">
                    <Monitor size={18} className="text-purple-400" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{language === 'ar' ? "تقليل الحركة" : "Reduced Motion"}</span>
                </div>
                <div 
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors cursor-pointer border border-white/10",
                    reducedMotion ? "bg-[#8A2BE2]" : "bg-white/5"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setSettings({ reducedMotion: !reducedMotion });
                  }}
                >
                  <motion.div 
                    animate={{ x: reducedMotion ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </div>
              </label>

              <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[24px] group hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20 group-hover:bg-yellow-400/20 transition-colors">
                    <Globe size={18} className="text-yellow-400" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{t.systems.split(' ')[0]} {language === 'ar' ? "اللغة" : "Language"}</span>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setSettings({ language: e.target.value as any })}
                  className="bg-transparent text-white focus:outline-none font-black uppercase text-[10px] tracking-[0.2em] cursor-pointer hover:text-[#00F2FE] transition-colors"
                >
                  <option value="ar" className="bg-[#0B0C10]">العربية (AR)</option>
                  <option value="en" className="bg-[#0B0C10]">English (EN)</option>
                </select>
              </div>
            </div>
          </GlassCard>

          <div className="pt-8">
            <PulseButton onClick={() => navigate('/dashboard')} className="w-full h-14 bg-gradient-to-r from-[#8A2BE2] to-[#6a21ad] text-xs font-black tracking-[0.3em] uppercase">
              {language === 'ar' ? "مزامنة التغييرات" : "SYNC CHANGES"}
            </PulseButton>
          </div>
        </div>
      </div>
    </div>
  );
}



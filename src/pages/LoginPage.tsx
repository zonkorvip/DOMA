import { useState } from 'react';
import { motion } from 'motion/react';
import TorusKnotBackground from '@/src/components/3d/TorusKnotBackground';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { PulseButton } from '@/src/components/ui/PulseButton';
import { useUserStore } from '@/src/store/userStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useNavigate } from 'react-router-dom';
import { translations } from '@/src/lib/translations';
import { cn } from '@/src/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const login = useUserStore((state) => state.login);
  const { language } = useSettingsStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && fullName) {
      login(email, fullName);
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0B0C10]">
      <TorusKnotBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10 flex items-center justify-center h-full px-4"
      >
        <GlassCard className="w-full max-w-md p-8 md:p-10 bg-black/40 border-white/10 shadow-[0_0_50px_rgba(138,43,226,0.1)]">
          <div className="flex justify-center mb-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#8A2BE2] to-[#00F2FE] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(138,43,226,0.4)] tracking-tighter">
                {t.appName}
              </h1>
              <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.4em] mt-3 font-bold">{t.appTagline}</p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] font-bold text-white/40 mb-2 px-1 uppercase tracking-[0.2em] group-focus-within:text-[#8A2BE2] transition-colors">
                  {language === 'ar' ? "هوية المشغل" : "Operator Identity"}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={cn(
                    "w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-[#8A2BE2]/50 focus:ring-4 focus:ring-[#8A2BE2]/10 outline-none transition-all text-white placeholder-white/10 font-medium",
                    language === 'ar' ? 'text-right' : 'text-left'
                  )}
                  placeholder={language === 'ar' ? "الاسم العملياتي" : "Operational Name"}
                />
              </div>
              
              <div className="group">
                <label className="block text-[10px] font-bold text-white/40 mb-2 px-1 uppercase tracking-[0.2em] group-focus-within:text-[#00F2FE] transition-colors">
                  {language === 'ar' ? "بيانات النظام" : "System Credentials"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-[#00F2FE]/50 focus:ring-4 focus:ring-[#00F2FE]/10 outline-none transition-all text-white placeholder-white/10 font-medium",
                    language === 'ar' ? 'text-right' : 'text-left'
                  )}
                  placeholder="operator@system.node"
                />
              </div>
            </div>

            <PulseButton type="submit" className="w-full py-4 bg-gradient-to-r from-[#8A2BE2] to-[#6a21ad] text-xs md:text-sm font-black tracking-[0.2em] uppercase">
              {language === 'ar' ? "بدء الاتصال" : "Initialize Connection"}
            </PulseButton>
          </form>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-white/5"></div>
            <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold whitespace-nowrap">
              {language === 'ar' ? "واجهة عقدة آمنة v2.4" : "Secure Node Interface v2.4"}
            </p>
            <div className="flex-1 h-[1px] bg-white/5"></div>
          </div>
        </GlassCard>

      </motion.div>
    </div>
  );
}


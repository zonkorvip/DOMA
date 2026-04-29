import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { PulseButton } from '@/src/components/ui/PulseButton';
import { SlotCounter } from '@/src/components/ui/SlotCounter';
import { useUserStore } from '@/src/store/userStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { Answer, calculateScore } from '@/src/lib/scoring';
import { AlertCircle, ChevronRight, ShieldAlert, Timer, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { translations } from '@/src/lib/translations';
import { QUESTIONS_DATA } from '@/src/lib/questionsData';

export default function ExamPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useUserStore();
  const { language } = useSettingsStore();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const questions = QUESTIONS_DATA[Number(levelId)] || [];
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers];
    const existingIdx = newAnswers.findIndex(a => a.questionId === questions[currentIdx].id);
    if (existingIdx > -1) {
      newAnswers[existingIdx].selectedOption = option;
    } else {
      newAnswers.push({ questionId: questions[currentIdx].id, selectedOption: option });
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const finalResult = calculateScore(questions, answers);
    setResult(finalResult);
    setIsFinished(true);
    
    // Update store
    const passed = finalResult.percentage >= 85 && !finalResult.safetyViolation;
    updateProgress(Number(levelId), Math.round(finalResult.percentage), passed);
  };

  const currentQuestion = questions[currentIdx];
  const selectedAnswer = answers.find(a => a.questionId === currentQuestion?.id)?.selectedOption;

  if (!currentQuestion && !isFinished) return <div className="p-12 text-center text-white/40 uppercase tracking-widest">Invalid Session Data</div>;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E0E0E0] p-6 md:p-12 xl:p-16 flex flex-col font-sans">
      <div className="max-w-5xl mx-auto w-full">
        {/* Exam Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 shrink-0 gap-6">
          <div className="w-full md:w-auto">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="text-white/30 hover:text-[#8A2BE2] transition-colors uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-2 mb-4"
            >
              <ChevronRight size={14} className={language === 'ar' ? "" : "rotate-180"} /> {t.abortSession}
            </button>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white flex gap-2 flex-wrap">
              {t.clinicalAssessment.split(' ')[0]} <span className="font-bold">{t.clinicalAssessment.split(' ')[1]}</span>
            </h2>
            <p className="text-[10px] md:text-sm text-white/40 mt-1 uppercase tracking-widest">Level 0{levelId} Synchronization</p>
          </div>
          
          <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mb-1">{t.timeRemaining}</p>
              <div className="flex items-center justify-end gap-2 text-xl md:text-2xl font-mono text-[#00F2FE] drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]">
                <Timer size={18} className="md:size-5" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 md:h-12 bg-white/10"></div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mb-1">{t.queueState}</p>
              <p className="text-xl md:text-2xl font-mono text-purple-400">{currentIdx + 1} / {questions.length}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <GlassCard className="p-6 md:p-12 border-purple-500/10 shadow-2xl">
                {currentQuestion.type === 'safety' && (
                  <div className="mb-6 flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] bg-red-400/10 px-4 py-1.5 rounded-full w-fit border border-red-400/20">
                    <ShieldAlert size={14} /> {t.criticalProtocol}
                  </div>
                )}
                
                <h2 className={cn(
                  "font-bold leading-snug mb-10 md:mb-12",
                  language === 'ar' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                )}>
                  {currentQuestion.questionText}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-5">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "w-full p-5 md:p-6 rounded-[20px] md:rounded-[24px] border text-left transition-all relative group overflow-hidden flex items-center gap-4",
                        selectedAnswer === option 
                          ? "bg-[#8A2BE2]/10 border-[#8A2BE2]/40 text-white shadow-[0_0_30px_rgba(138,43,226,0.1)]" 
                          : "bg-white/[0.03] border-white/5 hover:border-white/20 text-white/60 hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                        selectedAnswer === option ? "border-[#8A2BE2] bg-[#8A2BE2]/20" : "border-white/10"
                      )}>
                        {selectedAnswer === option && <div className="w-2.5 h-2.5 rounded-full bg-[#8A2BE2]" />}
                      </div>
                      <span className={cn(
                        "relative z-10 font-medium",
                        language === 'ar' ? 'text-lg' : 'text-sm md:text-base'
                      )}>{option}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-12 md:mt-16 flex justify-end">
                  <PulseButton 
                    disabled={!selectedAnswer}
                    onClick={handleNext}
                    className="w-full md:w-auto min-w-[200px] h-14 bg-gradient-to-r from-[#8A2BE2] to-[#6a21ad] text-sm font-black tracking-widest uppercase rounded-2xl"
                  >
                    {currentIdx === questions.length - 1 ? t.finalSubmit : t.nextStep} <ChevronRight size={18} className={cn("ml-2 inline", language === 'ar' && "rotate-180 mr-2 ml-0")} />
                  </PulseButton>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <GlassCard className="p-8 md:p-16 border-white/10 overflow-visible relative shadow-[0_0_100px_rgba(138,43,226,0.15)]">
                {/* Result Ornament */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                   {result.safetyViolation ? (
                     <div className="w-24 h-24 rounded-[32px] bg-red-600 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)] border-4 border-[#0B0C10] rotate-3">
                       <ShieldAlert size={48} className="text-white" />
                     </div>
                   ) : result.percentage >= 85 ? (
                     <div className="w-24 h-24 rounded-[32px] bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] border-4 border-[#0B0C10] -rotate-3">
                       <CheckCircle2 size={48} className="text-white" />
                     </div>
                   ) : (
                     <div className="w-24 h-24 rounded-[32px] bg-yellow-500 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)] border-4 border-[#0B0C10]">
                       <AlertCircle size={48} className="text-white" />
                     </div>
                   )}
                </div>

                <div className="mt-12">
                  <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-white uppercase">
                    {result.safetyViolation ? t.shutdown : result.percentage >= 85 ? t.clearance : t.insufficient}
                  </h2>
                  <p className="text-white/30 uppercase tracking-[0.4em] text-[10px] md:text-sm mb-12 font-bold">{t.report}</p>
                  
                  <div className="flex justify-center items-baseline gap-2 mb-16">
                    <span className="text-7xl md:text-9xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <SlotCounter value={Math.round(result.percentage)} />
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-white/20">%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
                    <div className="p-6 bg-white/[0.03] rounded-[24px] border border-white/10 shadow-xl">
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-2 font-bold">{t.progressionMap.split(' ')[0]} {t.score}</p>
                      <p className="text-3xl font-mono font-bold tracking-tighter text-[#00F2FE]">{Math.round(result.totalScore)} <span className="text-sm opacity-30 text-white">/ {result.maxPossibleScore}</span></p>
                    </div>
                    <div className="p-6 bg-white/[0.03] rounded-[24px] border border-white/10 shadow-xl">
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-2 font-bold">Status</p>
                      <p className={cn(
                        "text-3xl font-black tracking-tighter uppercase",
                        result.safetyViolation ? "text-red-500" : result.percentage >= 85 ? "text-green-500" : "text-yellow-500"
                      )}>
                        {result.safetyViolation ? t.rejected : result.percentage >= 85 ? t.competent : t.retry}
                      </p>
                    </div>
                  </div>

                  {result.safetyViolation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-16 p-8 bg-red-950/20 border border-red-500/30 rounded-[32px] text-red-200 text-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left max-w-3xl mx-auto"
                    >
                      <ShieldAlert className="shrink-0 text-red-500" size={32} />
                      <div>
                        <p className="font-bold text-base mb-2 uppercase tracking-wide">{t.safetyFailure}</p>
                        <p className="opacity-60 leading-relaxed">{t.safetyFailureDesc}</p>
                      </div>
                    </motion.div>
                  )}

                  <PulseButton 
                    variant={result.percentage >= 85 && !result.safetyViolation ? 'primary' : 'secondary'}
                    onClick={() => navigate('/dashboard')}
                    className="w-full max-w-md h-16 rounded-[24px] text-base font-black tracking-[0.1em]"
                  >
                    {t.return}
                  </PulseButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


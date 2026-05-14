"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, School, GraduationCap, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionsForLevel, Question } from "./questions";
import LocationSelector from "@/components/LocationSelector";

export default function OnboardingWizard() {
  const router = useRouter();
  
  // States
  const [step, setStep] = useState(-1); // -1: Setup, 0-14: Cards, 15: Final
  const [schoolData, setSchoolData] = useState({ 
    id: "", name: "", codigo: "", natureza: "", level: "pre_escolar", childNickname: "",
    distrito: "", concelho: "", localidade: ""
  });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [textReview, setTextReview] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left for animations
  const [startTime, setStartTime] = useState<number>(0);

  const getBgVideo = () => {
    switch (schoolData.level) {
      case "pre_escolar": return "/media/creche.mp4";
      case "1_ciclo": return "/media/primaria.mp4";
      case "2_3_ciclo": return "/media/eb.mp4";
      case "secundario": return "/media/secundaria.mp4";
      default: return "/media/primaria.mp4";
    }
  };

  const bgVideoComponent = (
    <>
      <video 
        key={schoolData.level}
        autoPlay preload="none" 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 mix-blend-screen pointer-events-none"
      >
        <source src={getBgVideo()} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>
    </>
  );

  const startSurvey = () => {
    setQuestions(getQuestionsForLevel(schoolData.level));
    setStep(0);
    setStartTime(Date.now());
  };

  const handleAnswer = (questionId: string, value: number, dir: number) => {
    setDirection(dir);
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => setStep(s => s + 1), 50); // slight delay to allow state batching
  };

  const submitReview = async () => {
    setIsSubmitting(true);
    try {
      const timeTakenMs = Date.now() - startTime;
      const { submitReview: submitAction } = await import('./actions');
      const res = await submitAction({
        ...schoolData,
        answers,
        textReview,
        contactConsent: consent,
        timeTakenMs
      });
      
      if (res?.error) {
        alert("Erro ao submeter: " + res.error);
        setIsSubmitting(false);
        return;
      }
      
      const params = new URLSearchParams();
      if (schoolData.distrito) params.append("distrito", schoolData.distrito);
      if (schoolData.concelho) params.append("concelho", schoolData.concelho);
      if (schoolData.level) params.append("ciclo", schoolData.level);
      
      router.push(`/resultados?${params.toString()}`);
    } catch (err) {
      alert("Ocorreu um erro no servidor.");
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    initial: (dir: number) => ({ x: dir * 300, opacity: 0, rotate: dir * 10 }),
    animate: { x: 0, opacity: 1, rotate: 0 },
    exit: (dir: number) => ({ x: dir * -300, opacity: 0, rotate: dir * -10 })
  };

  // ─── SETUP SCREEN ────────────────────────────────────────────────────────────
  if (step === -1) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {bgVideoComponent}
        <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center text-blue-500 mb-6">
            <School className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold text-white">Sobre a Experiência</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Nível de Escolaridade Atual</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <select 
                  className="w-full pl-12 pr-5 py-4 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500 appearance-none"
                  value={schoolData.level}
                  onChange={(e) => setSchoolData({...schoolData, level: e.target.value, id: "", name: ""})} // Reseta a escola ao mudar o ciclo
                >
                  <option value="pre_escolar">Pré-escolar (Creche / JI)</option>
                  <option value="primeiro_ciclo">1º Ciclo</option>
                  <option value="segundo_terceiro_ciclo">2º e 3º Ciclo</option>
                  <option value="secundario">Secundário</option>
                </select>
              </div>
            </div>

            {!schoolData.id ? (
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                <LocationSelector 
                  ciclo={schoolData.level} 
                  onSchoolSelected={(s: any) => setSchoolData({
                    ...schoolData, id: s.id, name: s.name, codigo: s.codigo, natureza: s.natureza,
                    distrito: s.distrito, concelho: s.concelho, localidade: s.localidade
                  })}
                />
              </div>
            ) : schoolData.id === 'manual' ? (
              <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-amber-400 font-bold text-sm">Adicionar Manualmente</p>
                  <button 
                    onClick={() => setSchoolData({...schoolData, id: "", name: "", codigo: "", natureza: ""})}
                    className="text-slate-400 text-sm underline hover:text-white"
                  >
                    Mudar Localização
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Nome do Estabelecimento..." 
                  className="w-full px-5 py-4 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                  value={schoolData.name === 'Adicionar Manualmente' ? '' : schoolData.name}
                  onChange={(e) => setSchoolData({...schoolData, name: e.target.value})}
                />
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-emerald-400 font-bold text-sm">Escola Selecionada</p>
                  <p className="text-white font-medium">{schoolData.name}</p>
                </div>
                <button 
                  onClick={() => setSchoolData({...schoolData, id: "", name: "", codigo: "", natureza: ""})}
                  className="text-slate-400 text-sm underline hover:text-white"
                >
                  Mudar
                </button>
              </div>
            )}



            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Inicial do Filho/a (Para o caso de ter vários)</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                <input 
                  type="text" 
                  maxLength={10}
                  placeholder="Ex: M" 
                  className="w-full pl-12 pr-5 py-4 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  value={schoolData.childNickname}
                  onChange={(e) => setSchoolData({...schoolData, childNickname: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <button 
            disabled={!schoolData.id || !schoolData.childNickname}
            onClick={startSurvey}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20"
          >
            Começar <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ─── FINAL SCREEN ───────────────────────────────────────────────────────────
  if (step >= questions.length && step > 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {bgVideoComponent}
        <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Opinião Aberta</h2>
          <p className="text-slate-400 mb-8">O que gostaria que a direção lesse e mudasse amanhã?</p>
          
          <textarea 
            className="w-full p-6 text-lg rounded-2xl border border-slate-800 focus:border-blue-500 bg-slate-950 text-white resize-none h-48 mb-8"
            placeholder="A sua resposta é 100% anónima..."
            onChange={(e) => setTextReview(e.target.value)}
            value={textReview}
          ></textarea>

          <label className="flex items-start gap-3 p-4 border border-slate-800 rounded-xl bg-slate-950/50 cursor-pointer hover:border-blue-500/50 transition-colors mb-8">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500 bg-slate-900"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span className="text-sm text-slate-400 leading-relaxed">
              Aceito ser contactado(a) pela plataforma por email para detalhar mais a minha experiência (Opcional, a escola nunca saberá).
            </span>
          </label>
          
          <button 
            onClick={submitReview}
            disabled={isSubmitting}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-2xl transition-all flex justify-center items-center"
          >
            {isSubmitting ? "A gravar..." : <><CheckCircle2 className="mr-2 w-6 h-6" /> Terminar o Inquérito</>}
          </button>
        </div>
      </div>
    );
  }

  // ─── CARD SWIPE SCREEN ──────────────────────────────────────────────────────
  const currentQ = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center px-6 py-12 overflow-hidden relative">
      {bgVideoComponent}
      {/* Header & Progress */}
      <div className="w-full max-w-xl mb-12 flex items-center justify-between z-10">
        <div className="flex-grow mr-8">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-500">{step + 1} de {questions.length}</span>
      </div>

      {/* Card Area */}
      <div className="relative w-full max-w-md h-[500px] flex items-center justify-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQ.id}
            custom={direction}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col h-full"
          >
            <div className="mb-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">
                {Array.isArray(currentQ.sub_dimensao) ? currentQ.sub_dimensao.join(" & ").replace(/_/g, " ") : currentQ.sub_dimensao.replace(/_/g, " ")}
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">{currentQ.texto}</h3>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {currentQ.opcoes.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQ.id, opt.pontos, i === 0 ? 1 : (i === 2 ? -1 : 0))}
                  className="w-full text-left p-4 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-800 transition-all flex items-center group active:scale-95"
                >
                  <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">{opt.emoji}</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{opt.texto}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}

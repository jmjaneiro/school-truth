"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, School, GraduationCap, User, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionsForLevel, LIKERT_OPTIONS, Question } from "./questions";
import LocationSelector from "@/components/LocationSelector";

export default function OnboardingWizard() {
  const router = useRouter();
  
  const [step, setStep] = useState(-1);
  const [schoolData, setSchoolData] = useState({ 
    id: "", name: "", codigo: "", natureza: "", level: "pre_escolar", childNickname: "",
    distrito: "", concelho: "", localidade: ""
  });
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [textReview, setTextReview] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [direction, setDirection] = useState(1);
  const [startTime, setStartTime] = useState<number>(0);
  const [showComment, setShowComment] = useState(false);

  const getBgVideo = () => {
    switch (schoolData.level) {
      case "pre_escolar": return "/media/creche.mp4";
      case "primeiro_ciclo": return "/media/primaria.mp4";
      case "segundo_terceiro_ciclo": return "/media/eb.mp4";
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
    setShowComment(false);
  };

  const handleAnswer = (questionId: string, value: number | null) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goNext = () => {
    const currentQ = questions[step];
    if (answers[currentQ.id] === undefined) return; // obrigar a responder
    setDirection(1);
    setShowComment(false);
    setTimeout(() => setStep(s => s + 1), 50);
  };

  const goPrev = () => {
    if (step === 0) return;
    setDirection(-1);
    setShowComment(false);
    setTimeout(() => setStep(s => s - 1), 50);
  };

  const submitReview = async () => {
    setIsSubmitting(true);
    try {
      const timeTakenMs = Date.now() - startTime;
      // Incluir comentários por pergunta no objeto answers
      const answersWithComments: Record<string, any> = { ...answers };
      Object.entries(comments).forEach(([key, val]) => {
        if (val.trim()) answersWithComments[`${key}_comentario`] = val.trim();
      });

      const { submitReview: submitAction } = await import('./actions');
      const res = await submitAction({
        ...schoolData,
        answers: answersWithComments,
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
    initial: (dir: number) => ({ x: dir * 300, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -300, opacity: 0 })
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
                  onChange={(e) => setSchoolData({...schoolData, level: e.target.value, id: "", name: ""})}
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
          <p className="text-slate-400 mb-8">Há algo que gostaria de acrescentar sobre a experiência do seu filho nesta escola?</p>
          
          <textarea 
            className="w-full p-6 text-base rounded-2xl border border-slate-800 focus:border-blue-500 bg-slate-950 text-white resize-none h-40 mb-8"
            placeholder="A sua resposta é 100% anónima... (opcional)"
            onChange={(e) => setTextReview(e.target.value)}
            value={textReview}
            maxLength={2000}
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

  // ─── QUESTION CARD SCREEN ──────────────────────────────────────────────────
  const currentQ = questions[step];
  const progress = (step / questions.length) * 100;
  const currentAnswer = answers[currentQ.id];
  const hasAnswer = currentAnswer !== undefined;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center px-4 py-8 overflow-hidden relative">
      {bgVideoComponent}

      {/* Progress */}
      <div className="w-full max-w-xl mb-6 flex items-center justify-between z-10">
        <div className="flex-grow mr-6">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-500 shrink-0">{step + 1} / {questions.length}</span>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-xl flex-grow flex flex-col z-10">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQ.id}
            custom={direction}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col"
          >
            {/* Dimensão */}
            <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">
              {Array.isArray(currentQ.sub_dimensao)
                ? currentQ.sub_dimensao.join(" & ").replace(/_/g, " ")
                : currentQ.sub_dimensao.replace(/_/g, " ")}
            </div>

            {/* Pergunta */}
            <h3 className="text-xl font-black text-white leading-snug mb-6">{currentQ.texto}</h3>

            {/* Opções Likert */}
            <div className="flex flex-col gap-2 mb-4">
              {LIKERT_OPTIONS.map((opt, i) => {
                const isSelected = currentAnswer === opt.pontos;
                const isNA = opt.pontos === null;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQ.id, opt.pontos)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? isNA
                          ? "border-slate-500 bg-slate-700 text-slate-200"
                          : "border-blue-500 bg-blue-600/20 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {opt.texto}
                  </button>
                );
              })}
            </div>

            {/* Campo de Comentário (toggle) */}
            <div className="mt-2">
              {!showComment ? (
                <button
                  onClick={() => setShowComment(true)}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Adicionar comentário a esta resposta
                </button>
              ) : (
                <div>
                  <textarea
                    className="w-full p-3 text-sm rounded-xl border border-slate-700 bg-slate-950 text-white resize-none h-20 focus:outline-none focus:border-blue-500 placeholder-slate-600"
                    placeholder={currentQ.comentario_placeholder || "Comentário opcional..."}
                    maxLength={150}
                    value={comments[currentQ.id] || ""}
                    onChange={(e) => setComments(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  />
                  <div className="text-right text-xs text-slate-600 mt-1">
                    {(comments[currentQ.id] || "").length}/150
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação */}
      <div className="w-full max-w-xl flex gap-3 mt-4 z-10">
        <button
          onClick={goPrev}
          disabled={step === 0}
          className="px-5 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 transition-all font-bold text-sm"
        >
          ← Anterior
        </button>
        <button
          onClick={goNext}
          disabled={!hasAnswer}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all text-sm"
        >
          {step === questions.length - 1 ? "Concluir →" : "Seguinte →"}
        </button>
      </div>
    </div>
  );
}

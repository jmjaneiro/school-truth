import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPin, MessageCircle, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const ProgressBar = ({ score, max, label, isContextual }: { score: number, max: number, label: string, isContextual?: boolean }) => {
  const percentage = Math.max(0, Math.min(100, score)); // score is already 0-100%
  
  let colorClass = "bg-rose-500";
  if (percentage >= 66) colorClass = "bg-emerald-500";
  else if (percentage >= 40) colorClass = "bg-amber-400";

  if (isContextual) colorClass = "bg-slate-400";

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-slate-700 flex items-center">
          {label}
          {isContextual && <Info className="w-4 h-4 ml-2 text-slate-400" />}
        </span>
        <span className="font-bold text-slate-900">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      {isContextual && (
        <p className="text-xs text-slate-400 mt-1 flex items-center">ℹ️ Esta dimensão reflete a zona envolvente, não a gestão da escola.</p>
      )}
    </div>
  );
};

// ─── CONFIGURAÇÃO DE ALGORITMO ────────────────────────────────────────────────
const GLOBAL_AVERAGE = 70; // Escala 1-5
const K_FACTOR = 10;
const SPEED_THRESHOLD_MS = 30000;

const BLOCK_WEIGHTS: Record<string, { trans: number, cycle: number }> = {
  "pre_escolar": { trans: 0.25, cycle: 0.75 },
  "primeiro_ciclo": { trans: 0.20, cycle: 0.80 },
  "segundo_terceiro_ciclo": { trans: 0.20, cycle: 0.80 },
  "secundario": { trans: 0.15, cycle: 0.85 },
};

const CONTEXTUAL_DIMS = ["acessos_mobilidade", "seguranca_envolvente"];

// Pesos Normalizados das Sub-dimensões Controláveis
const SUB_WEIGHTS_TRANSVERSAIS: Record<string, number> = {
  "edificio_conforto": 40 / 70,
  "higiene_sanitaria": 30 / 70,
};
const SUB_WEIGHTS_PRE: Record<string, number> = {
  "afeto_vinculo": 0.30, "seguranca_fisica": 0.20, "higiene_saude": 0.20, "qualidade_pedagogica": 0.15, "comunicacao_pais": 0.15
};
const SUB_WEIGHTS_1_CICLO: Record<string, number> = {
  "aprendizagem_progresso": 0.30, "bem_estar_fisico": 0.15, "bem_estar_emocional": 0.10, "seguranca_convivencia": 0.20, "relacao_professor_aluno": 0.15, "capacidade_resposta": 0.10
};
const SUB_WEIGHTS_2_3_CICLO: Record<string, number> = {
  "acompanhamento_vinculo": 0.25, "clima_social": 0.10, "clima_social_seguranca": 0.15, "qualidade_pedagogica": 0.20, "saude_mental_emocional": 0.20, "higiene_sanitaria": 0.10
};
const SUB_WEIGHTS_SECUNDARIO: Record<string, number> = {
  "pressao_academica": 0.20, "orientacao_futuro": 0.20, "qualidade_docente": 0.15, "saude_mental": 0.15, "comunicacao_pais": 0.10, "qualidade_pedagogica": 0.10, "avaliacao_geral": 0.10
};

const mapSubWeights = (level: string) => {
  switch(level) {
    case 'pre_escolar': return SUB_WEIGHTS_PRE;
    case 'primeiro_ciclo': return SUB_WEIGHTS_1_CICLO;
    case 'segundo_terceiro_ciclo': return SUB_WEIGHTS_2_3_CICLO;
    case 'secundario': return SUB_WEIGHTS_SECUNDARIO;
    default: return SUB_WEIGHTS_1_CICLO;
  }
};

// ─── HELPER PARA LABELS ─────────────────────────────────────────────────────
const getQualitativeLabel = (score: number) => {
  if (score >= 85) return { label: "Escola de referência", emoji: "🌟" };
  if (score >= 70) return { label: "Boa experiência geral", emoji: "👍" };
  if (score >= 55) return { label: "Com pontos a melhorar", emoji: "🔧" };
  return { label: "Precisa de atenção", emoji: "⚠️" };
};

// ─── PARSER E ALGORTIMO ──────────────────────────────────────────────────────
function calculateScore(reviews: any[], level: string) {
  let validReviews = [];

  // 1. Filtragem Speed (Anomalias)
  for (const r of reviews) {
    if (r.answers?.metadata_time_taken_ms && r.answers.metadata_time_taken_ms < SPEED_THRESHOLD_MS) {
      continue; // Ignorar review robótica/speed
    }
    validReviews.push(r);
  }

  // Se N for pequeno para aplicar a lógica, usamos todas as passadas do filter.
  // 2. Temporal Decay applied by weight per review
  const scoredReviews = validReviews.map(r => {
    const ageMonths = (Date.now() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
    let decayWeight = 1.0;
    if (ageMonths > 24) decayWeight = 0.3;
    else if (ageMonths > 12) decayWeight = 0.6;
    
    return { ...r, decayWeight };
  });

  // Para o Trimmed Mean (apenas se N > 20), precisamos classificar o peso ou score de cada review.
  // Como o score global é uma média ponderada sub-dimensão, é complexo calcular o "score individual"
  // sem aplicar pesos. Para simplificar e cumprir a regra, o Trimmed Mean pode ser simulado 
  // descartando 10% do array ordenado pela SOMA simples dos pontos.
  let reviewsToProcess = [...scoredReviews];
  if (reviewsToProcess.length > 20) {
    reviewsToProcess.sort((a, b) => {
      const sumA = Object.keys(a.answers).filter(k => k.startsWith('P')).reduce((acc, k) => acc + Number(a.answers[k]), 0);
      const sumB = Object.keys(b.answers).filter(k => k.startsWith('P')).reduce((acc, k) => acc + Number(b.answers[k]), 0);
      return sumA - sumB;
    });
    const p10 = Math.floor(reviewsToProcess.length * 0.1);
    reviewsToProcess = reviewsToProcess.slice(p10, reviewsToProcess.length - p10);
  }

  // Agrupar respostas por sub-dimensão
  const subSums: Record<string, { points: number, maxPoints: number }> = {};
  
  // Mapping Question IDs to Sub-dimensions and checking if inverted/etc is handled by frontend points mapping.
  // We need the mapping to assign answer points to sub-dimensions.
  // Importação estática (P1 a P45) - simulada para a lógica
  const questionMap: Record<string, string[]> = {
    // Transversais
    P1: ["edificio_conforto"], P2: ["edificio_conforto"], P3: ["higiene_sanitaria"], P4: ["acessos_mobilidade"], P5: ["acessos_mobilidade"],
    // Pre-Escolar
    P6: ["afeto_vinculo"], P7: ["afeto_vinculo"], P8: ["qualidade_pedagogica"], P9: ["comunicacao_pais"], P10: ["higiene_saude"], P11: ["higiene_saude"], P12: ["seguranca_fisica"], P13: ["comunicacao_pais"], P14: ["seguranca_fisica"], P15: ["qualidade_pedagogica"],
    // 1 Ciclo
    P16: ["aprendizagem_progresso"], P17: ["aprendizagem_progresso"], P18: ["bem_estar_fisico"], P19: ["bem_estar_fisico"], P20: ["seguranca_convivencia"], P21: ["relacao_professor_aluno"], P22: ["capacidade_resposta"], P23: ["seguranca_convivencia"], P24: ["bem_estar_emocional"], P25: ["aprendizagem_progresso"],
    // 2/3 Ciclo
    P26: ["acompanhamento_vinculo"], P27: ["clima_social"], P28: ["clima_social_seguranca"], P29: ["higiene_sanitaria"], P30: ["clima_social_seguranca"], P31: ["qualidade_pedagogica"], P32: ["saude_mental_emocional"], P33: ["qualidade_pedagogica"], P34: ["saude_mental_emocional"], P35: ["acompanhamento_vinculo"],
    // Secundario
    P36: ["pressao_academica"], P37: ["orientacao_futuro"], P38: ["seguranca_envolvente"], P39: ["qualidade_docente"], P40: ["pressao_academica"], P41: ["comunicacao_pais"], P42: ["orientacao_futuro"], P43: ["saude_mental"], P44: ["qualidade_pedagogica"], P45: ["avaliacao_geral"]
  };

  let npsCounts = { promoters: 0, passives: 0, detractors: 0 };
  let validTextReviews: {text: string, date: string}[] = [];

  for (const r of reviewsToProcess) {
    const weight = r.decayWeight;
    
    Object.entries(r.answers).forEach(([qId, val]) => {
      // Excluir metadata, comentários e valores null (N/A)
      if (qId.includes('_comentario') || val === null || val === undefined) return;

      const pontuacao = Number(val);
      if (isNaN(pontuacao) || pontuacao < 1) return;

      if (qId === 'nps_recomendacao') {
        if (pontuacao === 5) npsCounts.promoters++;
        else if (pontuacao === 4) npsCounts.passives++;
        else if (pontuacao >= 1 && pontuacao <= 3) npsCounts.detractors++;
        return;
      }
      
      const subDims = questionMap[qId];
      if (subDims) {
        for (const sd of subDims) {
          if (!subSums[sd]) subSums[sd] = { points: 0, maxPoints: 0 };
          subSums[sd].points += (pontuacao * weight);
          subSums[sd].maxPoints += (5 * weight); // Max is 5 points per question
        }
      }
    });

    if (r.text_review && r.text_review.trim().length > 0) {
      const date = new Date(r.created_at).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
      validTextReviews.push({ text: r.text_review, date });
    }
  }

  const subScores: Record<string, number> = {};
  for (const sd in subSums) {
    if (subSums[sd].maxPoints > 0) {
      subScores[sd] = (subSums[sd].points / subSums[sd].maxPoints) * 100;
    } else {
      subScores[sd] = 0;
    }
  }

  // Blocos (ignorando contextuais)
  let scoreTransversal = 0;
  let scoreCiclo = 0;

  for (const sd in SUB_WEIGHTS_TRANSVERSAIS) {
    scoreTransversal += (subScores[sd] || 0) * SUB_WEIGHTS_TRANSVERSAIS[sd];
  }

  const cycleWeights = mapSubWeights(level);
  for (const sd in cycleWeights) {
    scoreCiclo += (subScores[sd] || 0) * cycleWeights[sd];
  }

  const w = BLOCK_WEIGHTS[level] || BLOCK_WEIGHTS['primeiro_ciclo'];
  const rawFinalScore = (scoreTransversal * w.trans) + (scoreCiclo * w.cycle);

  // Bayesian Averaging
  const N = validReviews.length;
  const bayesianScore = ((N * rawFinalScore) + (K_FACTOR * GLOBAL_AVERAGE)) / (N + K_FACTOR);

  return {
    rawScore: rawFinalScore,
    bayesianScore,
    subScores,
    npsCounts,
    validTextReviews,
    totalCount: N
  };
}

export default async function SchoolReportPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: Promise<{ demo?: string }> }) {
  const { id } = await params;
  const searchParamsResolved = searchParams ? await searchParams : null;
  const isDemo = searchParamsResolved?.demo === '1';

  const supabase = await createClient();
  const { data: school } = await supabase.from('estabelecimentos').select('*').eq('id', id).single();
  
  if (!school) {
    return <div className="p-12 text-center text-xl">Escola não encontrada.</div>;
  }

  // Get most recent school level from the school's reviews to format logic
  const { data: reviews } = await supabase.from('reviews').select('*').eq('school_id', id);
  const safeReviews = reviews || [];
  const level = safeReviews.length > 0 ? safeReviews[0].school_level : 'primeiro_ciclo';

  const {
    bayesianScore,
    subScores,
    npsCounts,
    validTextReviews,
    totalCount
  } = calculateScore(safeReviews, level);

  const totalNps = npsCounts.promoters + npsCounts.passives + npsCounts.detractors;
  const nps = totalNps > 0 ? {
    promoters: Math.round((npsCounts.promoters / totalNps) * 100),
    passives: Math.round((npsCounts.passives / totalNps) * 100),
    detractors: Math.round((npsCounts.detractors / totalNps) * 100)
  } : { promoters: 0, passives: 0, detractors: 0 };

  const { label: qualLabel, emoji: qualEmoji } = getQualitativeLabel(bayesianScore);

  // Ocultar dados se a amostra for muito baixa (<15), a menos que estejamos em modo demo
  const isHidden = !isDemo && totalCount < 15;
  const isEarly = totalCount >= 15 && totalCount <= 30;

  return (
    <div className="min-h-screen bg-slate-950 font-sans pb-20 relative overflow-hidden">
      {/* Background Video & Overlays (Dark Theme Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale brightness-75"
        >
          <source src="/media/map.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/resultados" className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Voltar aos Resultados
          </Link>
          <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full border ${isHidden ? 'bg-amber-50 text-amber-600 border-amber-100' : isEarly ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <ShieldCheck className="w-4 h-4 mr-1" />
            {isHidden ? 'A recolher opiniões' : isEarly ? `Amostra inicial (${totalCount})` : `Dados Validados (${totalCount})`}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{school.nome}</h1>
              <p className="text-slate-500 flex items-center font-medium text-lg mb-2">
                <MapPin className="w-5 h-5 mr-1" />
                {school.localidade || school.concelho || "Portugal"}
              </p>
              {!isHidden && (
                <div className="inline-flex items-center mt-2 px-4 py-2 bg-slate-100 rounded-xl">
                  <span className="text-2xl mr-2">{qualEmoji}</span>
                  <span className="font-bold text-slate-700">{qualLabel}</span>
                </div>
              )}
            </div>
            
            <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl border border-slate-800 text-center shrink-0 shadow-lg">
              <div className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-400">Score Global</div>
              <div className="text-5xl font-black">
                {isHidden ? (
                  <span className="text-slate-600 text-3xl">⏳</span>
                ) : (
                  <>{bayesianScore.toFixed(0)}<span className="text-2xl text-slate-500">%</span></>
                )}
              </div>
            </div>
          </div>
        </div>

        {isHidden ? (
          <div className="bg-amber-50 rounded-3xl p-10 border border-amber-200 text-center">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">Ainda precisamos de mais respostas</h2>
            <p className="text-amber-700 max-w-lg mx-auto">Esta escola tem atualmente {totalCount} avaliações. Para garantir que os dados são justos e estatisticamente relevantes (evitando BIAS), só publicamos os gráficos a partir das 15 respostas.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">O Raio-X da Escola</h2>
              
              {Object.entries(subScores).map(([key, score]) => {
                const isContext = CONTEXTUAL_DIMS.includes(key);
                return (
                  <ProgressBar 
                    key={key} 
                    score={score} 
                    max={100} 
                    label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} 
                    isContextual={isContext} 
                  />
                );
              })}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Net Promoter Score (NPS)</h2>
                <p className="text-slate-600 font-medium mb-6">Recomendaria esta escola a um amigo ou familiar?</p>
                
                {totalNps === 0 ? (
                  <p className="text-slate-500 italic">Sem recomendações registadas.</p>
                ) : (
                  <>
                    <div className="flex h-6 rounded-full overflow-hidden border border-slate-200">
                      <div style={{width: `${nps.promoters}%`}} className="bg-emerald-500" title="Sem dúvida"></div>
                      <div style={{width: `${nps.passives}%`}} className="bg-amber-400" title="Talvez"></div>
                      <div style={{width: `${nps.detractors}%`}} className="bg-rose-500" title="Nunca"></div>
                    </div>
                    <div className="flex justify-between mt-3 text-sm font-bold">
                      <span className="text-emerald-600">😁 {nps.promoters}% Sim</span>
                      <span className="text-amber-600">🤔 {nps.passives}% Talvez</span>
                      <span className="text-rose-600">😡 {nps.detractors}% Nunca</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center mb-6">
                  <MessageCircle className="w-6 h-6 mr-3 text-slate-400" />
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">O "Microfone Aberto"</h2>
                </div>
                
                <div className="space-y-4">
                  {validTextReviews.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum comentário por escrito até ao momento.</p>
                  ) : (
                    validTextReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-slate-700 italic font-medium leading-relaxed">"{rev.text}"</p>
                        <p className="text-xs font-bold text-slate-400 mt-3 text-right uppercase tracking-wider">{rev.date}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

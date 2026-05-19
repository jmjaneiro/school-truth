import { createClient } from "@/lib/supabase/server";
import ResultsView from "./ResultsView";
import { logout } from "@/app/login/actions";

export const dynamic = "force-dynamic";

// Helper para calcular a classificação
function getClassification(score: number | null) {
  if (score === null) return { class: 'sem_dados', color: 'bg-slate-400', label: '⚪ Sem dados' };
  if (score >= 85) return { class: 'referencia', color: 'bg-emerald-700', label: '🌟 Referência' };
  if (score >= 70) return { class: 'boa', color: 'bg-emerald-500', label: '👍 Boa experiência' };
  if (score >= 55) return { class: 'a_melhorar', color: 'bg-amber-400', label: '🔧 A melhorar' };
  return { class: 'atencao', color: 'bg-rose-500', label: '⚠️ Atenção' };
}

// Limiares
const MIN_RESPONSES: Record<string, number> = {
  "pre_escolar": 8,
  "primeiro_ciclo": 12,
  "segundo_terceiro_ciclo": 15,
  "secundario": 15
};

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: { distrito?: string; concelho?: string; localidade?: string; ciclo?: string; natureza?: string; demo?: string };
}) {
  const supabase = await createClient();
  const isDemo = searchParams.demo === '1';

  // Filtros Base
  const distrito = searchParams.distrito;
  const concelho = searchParams.concelho;
  const ciclo = searchParams.ciclo && searchParams.ciclo !== 'todos' ? searchParams.ciclo : null;

  // Query Estabelecimentos: usamos reviews!inner para forçar que devolva APENAS escolas com avaliações
  let query = supabase
    .from("estabelecimentos")
    .select("id, nome, concelho, localidade, latitude, longitude, natureza, ciclos, reviews!inner(id, school_level, is_approved, answers, created_at)")
    .eq("status", "verified");

  if (distrito) query = query.eq("distrito", distrito);
  if (concelho) query = query.eq("concelho", concelho);
  if (ciclo) query = query.contains("ciclos", [ciclo]);

  const { data: estabs, error } = await query;

  if (error) {
    console.error(error);
    return <div className="p-8 text-white">Erro ao carregar dados.</div>;
  }

  // Constantes para Bayesian Averaging (escala 1-5, max=5)
  const GLOBAL_AVERAGE = 70;
  const K_FACTOR = 10;
  const SPEED_THRESHOLD_MS = 30000;

  const processedData = estabs?.map(e => {
    // Filtrar reviews aprovadas do ciclo pedido
    const relevantReviews = (e.reviews || []).filter((r: any) => 
      r.is_approved && (!ciclo || r.school_level === ciclo)
    );
    
    const count = relevantReviews.length;
    const threshold = isDemo ? 1 : (ciclo ? (MIN_RESPONSES[ciclo] || 15) : 15);
    
    let finalScore: number | null = null;
    if (count >= threshold) {
      // Calcular score real: média ponderada dos pontos das respostas
      let totalPoints = 0;
      let totalMaxPoints = 0;

      for (const r of relevantReviews) {
        // Filtrar reviews demasiado rápidas (speed bots)
        if (r.answers?.metadata_time_taken_ms && r.answers.metadata_time_taken_ms < SPEED_THRESHOLD_MS) {
          continue;
        }

        // Temporal decay
        const ageMonths = (Date.now() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
        let decayWeight = 1.0;
        if (ageMonths > 24) decayWeight = 0.3;
        else if (ageMonths > 12) decayWeight = 0.6;

        // Somar todos os pontos de perguntas (P1 a P45 + NPS), excluindo N/A e comentários
        Object.entries(r.answers || {}).forEach(([key, val]) => {
          // Excluir metadata, comentários por pergunta e valores null (N/A)
          if ((key.startsWith('P') || key === 'nps_recomendacao') && !key.includes('_comentario')) {
            if (val !== null && val !== undefined) {
              const points = Number(val);
              if (!isNaN(points) && points >= 1) {
                totalPoints += points * decayWeight;
                totalMaxPoints += 5 * decayWeight; // Max é 5 por pergunta (escala Likert 1-5)
              }
            }
          }
        });
      }

      if (totalMaxPoints > 0) {
        const rawScore = (totalPoints / totalMaxPoints) * 100;
        // Bayesian Averaging: suaviza escolas com poucas reviews
        finalScore = ((count * rawScore) + (K_FACTOR * GLOBAL_AVERAGE)) / (count + K_FACTOR);
      }
    }

    const classData = getClassification(finalScore);

    return {
      id: e.id,
      nome: e.nome,
      localidade: e.localidade,
      concelho: e.concelho,
      latitude: e.latitude,
      longitude: e.longitude,
      natureza: e.natureza,
      score: finalScore,
      count: count,
      threshold: threshold,
      classLabel: classData.label,
      color: classData.color
    };
  }).sort((a, b) => {
    // Ordenar: Scores primeiro, Sem dados para o fim
    if (a.score !== null && b.score === null) return -1;
    if (a.score === null && b.score !== null) return 1;
    if (a.score !== null && b.score !== null) return b.score - a.score;
    return b.count - a.count; // Desempate por nr de opiniões
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* Background Video & Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50"
        >
          <source src="/media/map.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <header className="px-6 py-8 border-b border-slate-800 bg-slate-900/50 relative z-10 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-white mb-2">✅ Obrigado pelo teu contributo!</h1>
            <p className="text-slate-400">Descobre o panorama das escolas na tua região.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="/onboarding" className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-xl font-bold transition-colors text-sm">
              + Avaliar
            </a>
            <form action={logout}>
              <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 rounded-xl font-bold transition-colors text-sm">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      
      {/* Componente Client-Side que gere o Toggle Lista/Mapa e os Filtros */}
      <ResultsView initialData={processedData || []} />
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpen, AlertTriangle } from "lucide-react";

export default function MotivationPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300 selection:bg-blue-500/30">
      
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay preload="none" 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 mix-blend-screen pointer-events-none"
        >
          <source src="/media/video2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none z-0"></div>

        <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 relative z-10 w-full">
          <Link href="/" className="text-blue-500 hover:text-blue-400 font-bold mb-8 inline-flex items-center text-sm bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-md border border-slate-800">
            ← Voltar ao início
          </Link>
          
          <div className="bg-slate-900/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl">
            
            <div className="p-8 md:p-12">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-inner shadow-blue-500/20">
                <BookOpen className="w-8 h-8" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                Sobre este projeto
              </h1>
              
              <div className="prose prose-invert prose-lg text-slate-300">
                <p className="leading-relaxed">
                  Como pai, já estive exatamente onde você está agora — a tentar escolher a escola certa e a sentir que a informação disponível não chega.
                </p>
                <p className="leading-relaxed">
                  Consultei os rankings nacionais, analisei os dados públicos do Ministério da Educação. São úteis, sem dúvida. Mas medem resultados académicos — não medem o ambiente da turma, o estilo dos professores, a dinâmica do recreio, ou aquilo que o seu filho vai sentir todos os dias ao entrar pela porta.
                </p>
                <p className="leading-relaxed">
                  Percebi que a informação mais valiosa estava noutro sítio: nas conversas com outros pais. Aquelas partilhas honestas que acontecem à porta da escola, e que raramente chegam a quem mais precisa delas — os pais que ainda estão a decidir.
                </p>
                <p className="leading-relaxed font-bold text-white text-xl border-l-4 border-blue-500 pl-6 my-8">
                  Foi com essa convicção, e com a minha experiência em tecnologia, que criei esta plataforma. Um espaço onde as opiniões de pais como você complementam os dados oficiais, para que nenhuma família tenha de depender apenas da sorte na hora de escolher.
                </p>
                <p className="leading-relaxed">
                  Porque a melhor escola para o seu filho não é necessariamente a que está no topo do ranking — é a que melhor se adapta a ele.
                </p>
              </div>
            </div>

            {/* Prominent Legal Disclaimer seamlessly integrated into the card */}
            <div className="bg-slate-950/80 p-8 md:px-12 border-t border-slate-800">
              <div className="flex gap-4 items-start">
                <AlertTriangle className="w-7 h-7 shrink-0 text-amber-500 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-500 mb-2 text-lg tracking-tight">Declaração de Isenção de Responsabilidade Legal</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    A SchoolTruth atua estritamente como um agregador tecnológico independente. Todo o conteúdo gerado por utilizadores reflete exclusivamente as suas opiniões pessoais, anónimas e subjetivas. A SchoolTruth não verifica, valida ou garante a veracidade factual de qualquer afirmação submetida, rejeitando qualquer responsabilidade por danos de reputação ou impacto direto nas instituições de ensino mencionadas. O acesso aos dados providenciados serve meramente como ferramenta de apoio à decisão, não substituindo o escrutínio individual.
                  </p>
                </div>
              </div>
            </div>
            
          </div>

          <div className="mt-12 flex justify-center">
            <Link href="/login" className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-95 w-full md:w-auto">
              <span className="relative flex items-center gap-2">
                Compreendo e Quero Aceder <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

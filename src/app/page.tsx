import Link from "next/link";
import { ArrowRight, Shield, Heart, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-300 selection:bg-blue-500/30">
      <header className="absolute top-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">SchoolTruth<span className="text-blue-500">.</span></h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Modern Background */}
        <video 
          autoPlay preload="none" 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-screen pointer-events-none"
        >
          <source src="/media/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none z-0"></div>

        {/* Hero Section */}
        <div className="flex-grow flex flex-col justify-center items-center px-6 pt-32 pb-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            O modelo "Partilhar para Descobrir" — porque juntos sabemos mais.
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[1.1] max-w-5xl mx-auto mb-8">
            Os rankings <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              não dizem tudo.
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            Descubra o que realmente torna uma escola especial através de avaliações honestas e partilhadas por outros pais como você.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <Link href="/motivacao" className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-95">
              <span className="relative flex items-center gap-2">
                Aceder <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <p className="text-sm font-semibold text-slate-500 mt-2">Porque escolher a escola certa para o seu filho merece mais do que uma lista.</p>
          </div>
        </div>

        {/* Seamless Feature Row */}
        <div className="w-full relative z-10 pb-12 opacity-80 hover:opacity-100 transition-opacity">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            
            <div className="flex flex-col items-center group">
              <Search className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-1">O Fator Humano</h3>
              <p className="text-slate-400 text-sm max-w-xs">A direção ouve os pais? Há bullying silenciado?</p>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/10"></div>
            
            <div className="flex flex-col items-center group">
              <Shield className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-1">100% Anónimo</h3>
              <p className="text-slate-400 text-sm max-w-xs">Ninguém saberá quem é. Avalie com confiança brutal.</p>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-white/10"></div>

            <div className="flex flex-col items-center group">
              <Heart className="w-8 h-8 text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-1">Comunidade Real</h3>
              <p className="text-slate-400 text-sm max-w-xs">Partilhe a sua realidade para aceder às de outros pais.</p>
            </div>
            
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-6 px-6 text-center">
        <Link href="/privacidade" className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  );
}

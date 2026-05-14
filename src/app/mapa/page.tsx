"use client"
import dynamic from 'next/dynamic';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col text-slate-300">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-black text-white tracking-tighter">SchoolTruth<span className="text-blue-500">.</span></h1>
          </Link>
          <div className="flex items-center text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 mr-1" />
            Acesso Verificado
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row relative">
        <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col bg-slate-900 z-10 shadow-2xl border-r border-slate-800">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Obrigado pela coragem.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-lg">
            A sua avaliação foi registada anonimamente com sucesso e já está a ajudar outros pais a tomar decisões mais informadas e seguras sobre o futuro dos seus filhos.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <h3 className="text-blue-400 font-bold mb-3 text-lg">Acesso Exclusivo Desbloqueado</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore o mapa para ver as escolas já avaliadas. Para garantir a fiabilidade estatística, os relatórios completos de escolas específicas apenas serão libertados publicamente quando atingirmos um volume crítico de participações nessa região.
            </p>
          </div>
          
          <p className="mt-auto text-xs font-semibold text-slate-600 uppercase tracking-widest text-center">
            Inteligência Comunitária Ativa
          </p>
        </div>
        
        <div className="w-full md:w-2/3 min-h-[60vh] relative z-0">
          <MapComponent />
        </div>
      </main>
    </div>
  )
}

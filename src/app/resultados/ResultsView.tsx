"use client"

import { useState } from "react"
import { List, Map as MapIcon, GraduationCap, Building2, Search } from "lucide-react"
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Carregamos o mapa de forma dinâmica para não quebrar o SSR do Next.js com o Leaflet
const ResultsMap = dynamic(() => import('./ResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-slate-900 animate-pulse flex items-center justify-center text-slate-500">A carregar mapa...</div>
})

export default function ResultsView({ initialData }: { initialData: any[] }) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [filterNatureza, setFilterNatureza] = useState('todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [correctionMode, setCorrectionMode] = useState<string | null>(null)

  // Aplica filtros locais
  const filteredData = initialData.filter(d => {
    if (filterNatureza !== 'todas' && d.natureza !== filterNatureza) return false
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const matchNome = d.nome.toLowerCase().includes(q)
      const matchLocalidade = (d.localidade || '').toLowerCase().includes(q)
      const matchConcelho = (d.concelho || '').toLowerCase().includes(q)
      if (!matchNome && !matchLocalidade && !matchConcelho) return false
    }
    
    return true
  })

  return (
    <div className="flex flex-col flex-grow relative z-10">
      {/* Barra de Ferramentas / Filtros */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-7xl mx-auto">
          
          {/* Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button 
              onClick={() => setView('list')}
              className={`flex-1 flex justify-center items-center py-2 px-6 rounded-lg font-bold text-sm transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4 mr-2" /> Lista
            </button>
            <button 
              onClick={() => setView('map')}
              className={`flex-1 flex justify-center items-center py-2 px-6 rounded-lg font-bold text-sm transition-all ${view === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              <MapIcon className="w-4 h-4 mr-2" /> Mapa
            </button>
          </div>

          {/* Filtros Rapidos */}
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Barra de Pesquisa */}
            <div className="relative flex-grow sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <input 
                type="text"
                placeholder="Pesquisar escola ou localidade..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="relative flex-shrink-0">
              <Building2 className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <select 
                value={filterNatureza}
                onChange={e => setFilterNatureza(e.target.value)}
                className="pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 font-medium focus:border-blue-500 appearance-none focus:outline-none"
              >
                <option value="todas">Qualquer Natureza</option>
                <option value="publica">Rede Pública</option>
                <option value="privada">Privada</option>
                <option value="ipss">IPSS</option>
                <option value="misericordia">Misericórdia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <main className="flex-grow flex flex-col relative max-w-7xl mx-auto w-full">
        {view === 'list' ? (
          <div className="p-4 sm:p-8 space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhuma escola avaliada nesta área</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">Sê o primeiro pai a partilhar a tua experiência! Avalia a escola do teu filho e desbloqueia o acesso aos resultados da comunidade.</p>
                <a href="/onboarding" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors">
                  Avaliar uma Escola
                </a>
              </div>
            ) : (
              filteredData.map(escola => (
                <div key={escola.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{escola.nome}</h3>
                    <p className="text-slate-400 text-sm mb-3">📍 {escola.localidade || escola.concelho} • <span className="uppercase">{escola.natureza}</span></p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-md font-bold text-xs ${escola.color} text-white shadow-sm`}>
                        {escola.classLabel}
                      </span>
                      {escola.score !== null ? (
                        <span className="text-slate-500 text-xs font-semibold">{escola.count} opiniões</span>
                      ) : (
                        <span className="text-slate-500 text-xs font-semibold">{escola.count}/{escola.threshold} necessárias</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    {escola.score !== null && (
                      <Link href={`/escola/${escola.id}`} className="flex-1 sm:flex-none px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-xl font-bold transition-colors text-sm text-center">
                        Ver Perfil
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-grow min-h-[600px] w-full relative">
            <ResultsMap 
              locations={filteredData} 
              correctionMode={correctionMode}
              onCancelCorrection={() => setCorrectionMode(null)}
              onStartCorrection={(id) => setCorrectionMode(id)}
            />
          </div>
        )}
      </main>
    </div>
  )
}

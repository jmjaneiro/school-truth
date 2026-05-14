"use client"

import { useState, useEffect } from "react"
import { getDistritos, getConcelhos, getLocalidades, getEstabelecimentos } from "@/app/actions/location"

type LocationSelectorProps = {
  ciclo: string;
  onSchoolSelected: (school: { id: string, name: string, codigo: string, natureza: string, distrito: string, concelho: string, localidade: string }) => void;
}

export default function LocationSelector({ ciclo, onSchoolSelected }: LocationSelectorProps) {
  const [distritos, setDistritos] = useState<string[]>([])
  const [concelhos, setConcelhos] = useState<string[]>([])
  const [localidades, setLocalidades] = useState<string[]>([])
  const [estabelecimentos, setEstabelecimentos] = useState<any[]>([])

  const [selectedDistrito, setSelectedDistrito] = useState("")
  const [selectedConcelho, setSelectedConcelho] = useState("")
  const [selectedLocalidade, setSelectedLocalidade] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  // 1. Carregar Distritos ao montar
  useEffect(() => {
    getDistritos().then(data => {
      setDistritos(data)
      setIsLoading(false)
    })
  }, [])

  // 2. Carregar Concelhos ao mudar Distrito
  useEffect(() => {
    setSelectedConcelho("")
    setSelectedLocalidade("")
    setEstabelecimentos([])
    if (selectedDistrito) {
      getConcelhos(selectedDistrito).then(setConcelhos)
    } else {
      setConcelhos([])
    }
  }, [selectedDistrito])

  // 3. Carregar Localidades ao mudar Concelho
  useEffect(() => {
    setSelectedLocalidade("")
    setEstabelecimentos([])
    if (selectedConcelho) {
      getLocalidades(selectedDistrito, selectedConcelho).then(setLocalidades)
    } else {
      setLocalidades([])
    }
  }, [selectedConcelho])

  // 4. Carregar Estabelecimentos ao mudar Localidade
  useEffect(() => {
    if (selectedLocalidade) {
      getEstabelecimentos(selectedDistrito, selectedConcelho, selectedLocalidade, ciclo).then(setEstabelecimentos)
    } else {
      setEstabelecimentos([])
    }
  }, [selectedLocalidade, ciclo])

  return (
    <div className="space-y-4">
      {/* Distrito */}
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Distrito</label>
        <select 
          className="w-full px-5 py-3 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
          value={selectedDistrito}
          onChange={(e) => setSelectedDistrito(e.target.value)}
          disabled={isLoading}
        >
          <option value="">{isLoading ? "A carregar..." : "Selecionar..."}</option>
          {distritos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Concelho */}
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Concelho</label>
        <select 
          className="w-full px-5 py-3 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
          value={selectedConcelho}
          onChange={(e) => setSelectedConcelho(e.target.value)}
          disabled={!selectedDistrito}
        >
          <option value="">{selectedDistrito ? "Selecionar..." : "—"}</option>
          {concelhos.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Localidade */}
      <div>
        <label className="block text-sm font-bold text-slate-400 mb-2">Localidade</label>
        <select 
          className="w-full px-5 py-3 text-lg rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
          value={selectedLocalidade}
          onChange={(e) => setSelectedLocalidade(e.target.value)}
          disabled={!selectedConcelho}
        >
          <option value="">{selectedConcelho ? "Selecionar..." : "—"}</option>
          {localidades.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Resultados de Escolas */}
      {selectedLocalidade && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <label className="block text-sm font-bold text-blue-400 mb-4">Selecione o Estabelecimento</label>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {estabelecimentos.length === 0 ? (
              <p className="text-slate-500 text-sm italic">Nenhum estabelecimento encontrado nesta localidade para este ciclo.</p>
            ) : (
              estabelecimentos.map(es => (
                <button
                  key={es.id}
                  onClick={() => onSchoolSelected({ 
                    id: es.id, name: es.nome, codigo: es.codigo_escola, natureza: es.natureza,
                    distrito: selectedDistrito, concelho: selectedConcelho, localidade: selectedLocalidade
                  })}
                  className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-blue-600/20 hover:border-blue-500 transition-colors flex flex-col group"
                >
                  <span className="text-white font-bold mb-1 group-hover:text-blue-400">{es.nome}</span>
                  <span className="text-slate-400 text-xs uppercase tracking-wider">{es.natureza}</span>
                </button>
              ))
            )}
            
            <button
              onClick={() => onSchoolSelected({ 
                id: 'manual', name: 'Adicionar Manualmente', codigo: '', natureza: 'desconhecido',
                distrito: selectedDistrito, concelho: selectedConcelho, localidade: selectedLocalidade
              })}
              className="w-full text-left p-4 rounded-xl border border-dashed border-slate-600 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-400 transition-colors flex items-center justify-center text-slate-300"
            >
              ➕ A minha escola não está aqui
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

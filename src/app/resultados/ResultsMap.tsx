"use client"

import { useEffect, useState, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { correctSchoolLocation } from "@/app/actions/correction"

// Definir diferentes ícones SVG baseados na cor da classificação
const createColorIcon = (colorCode: string) => {
  const markerHtmlStyles = `
    background-color: ${colorCode};
    width: 24px;
    height: 24px;
    display: block;
    position: relative;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid #ffffff;
    box-shadow: -2px 2px 4px rgba(0,0,0,0.3);
  `;
  
  return L.divIcon({
    className: "bg-transparent border-0", 
    iconSize: [24, 24],
    iconAnchor: [12, 24], // Ponto aguçado no bottom-center
    popupAnchor: [0, -24],
    html: `<div style="${markerHtmlStyles}"></div>`
  });
};

// Mapeamento Tailwind para Hex (Aproximações seguras)
const HEX_COLORS: Record<string, string> = {
  'bg-emerald-700': '#047857',
  'bg-emerald-500': '#10b981',
  'bg-amber-400': '#fbbf24',
  'bg-rose-500': '#f43f5e',
  'bg-slate-400': '#94a3b8',
};

export default function ResultsMap({ 
  locations, 
  correctionMode,
  isDemo = false,
  onCancelCorrection,
  onStartCorrection
}: { 
  locations: any[],
  correctionMode?: string | null,
  isDemo?: boolean,
  onCancelCorrection?: () => void,
  onStartCorrection?: (id: string) => void
}) {
  const [draftCoords, setDraftCoords] = useState<{lat: number, lng: number} | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Corrige os ícones default do Leaflet num ambiente Next.js se algum fallback for usado
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const schoolToCorrect = useMemo(() => 
    correctionMode ? locations.find(l => l.id === correctionMode) : null,
  [correctionMode, locations])

  // Calcular centro do mapa com base nos dados (se existirem)
  const defaultCenter: [number, number] = schoolToCorrect && schoolToCorrect.latitude
    ? [schoolToCorrect.latitude, schoolToCorrect.longitude]
    : locations.length > 0 && locations[0].latitude 
      ? [locations[0].latitude, locations[0].longitude] 
      : [39.3999, -8.2245];

  const handleSave = async () => {
    if (!schoolToCorrect || !draftCoords) return;
    setIsSaving(true);
    const res = await correctSchoolLocation(schoolToCorrect.id, draftCoords.lat, draftCoords.lng);
    setIsSaving(false);
    if (res.error) {
      alert(res.error);
    } else {
      alert("Localização atualizada com sucesso!");
      if (onCancelCorrection) onCancelCorrection();
    }
  }

  const handleCancel = () => {
    setDraftCoords(null);
    if (onCancelCorrection) onCancelCorrection();
  }

  return (
    <>
      <MapContainer 
        key={correctionMode || 'default'} // força re-render para focar
        center={defaultCenter} 
        zoom={correctionMode ? 16 : 11} 
        className="absolute inset-0 w-full h-full z-0 rounded-2xl shadow-inner"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {locations.map(loc => {
          // Se estamos em modo de correção, só mostramos a escola alvo
          if (correctionMode && loc.id !== correctionMode) return null;

          const hexColor = HEX_COLORS[loc.color] || '#94a3b8';
          const icon = createColorIcon(hexColor);
          
          if (!loc.latitude || loc.latitude === 0) return null;

          const isDraggable = correctionMode === loc.id;

          return (
            <Marker 
              key={loc.id} 
              position={[loc.latitude, loc.longitude]} 
              icon={icon}
              draggable={isDraggable}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  setDraftCoords({ lat: position.lat, lng: position.lng });
                }
              }}
            >
              {!isDraggable && (
                <Popup className="rounded-xl overflow-hidden shadow-2xl border-0 custom-popup">
                  <div className="font-sans p-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{loc.nome}</h3>
                    <p className="text-slate-500 text-xs uppercase mb-3 font-semibold">{loc.natureza}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-white text-xs font-bold ${loc.color}`}>
                        {loc.classLabel}
                      </span>
                    </div>
                    
                    <p className="text-blue-600 font-bold text-sm mb-4 bg-blue-50 inline-block px-2 py-1 rounded-md">
                      {loc.count} Avaliações
                    </p>
                    
                    <div className="flex flex-col gap-2">
                      {loc.score !== null && (
                        <a href={`/escola/${loc.id}${isDemo ? '?demo=1' : ''}`} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors block text-center">
                          Ver Relatório Completo
                        </a>
                      )}
                      
                      <button 
                        onClick={() => onStartCorrection && onStartCorrection(loc.id)}
                        className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        Sugere Correção do Pin
                      </button>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      {/* Interface de Edição por cima do Mapa */}
      {correctionMode && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-4 w-11/12 max-w-md">
          <p className="text-amber-400 font-bold text-center mb-1">Modo de Correção Geográfica</p>
          <p className="text-slate-300 text-sm text-center mb-4">
            Arrasta o marcador para a posição exata da escola.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={!draftCoords || isSaving}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors text-sm"
            >
              {isSaving ? "A guardar..." : "Confirmar Nova Posição"}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

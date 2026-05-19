"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Correção para ícones padrão no Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type LocationData = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
};

export default function MapComponent() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    async function fetchLocations() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('estabelecimentos')
        .select('id, nome, latitude, longitude, reviews!inner(id)')
        .eq('status', 'verified');
      
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        if (data.length === 0) setErrorMsg("Nenhuma escola avaliada ainda.");
        const parsedData = data
          .filter((school: any) => school.latitude && school.latitude !== 0)
          .map((school: any) => ({
            id: school.id,
            name: school.nome,
            lat: Number(school.latitude),
            lng: Number(school.longitude),
            count: school.reviews?.length || 0,
          }));
        
        setLocations(parsedData);
      }
    }
    fetchLocations();
  }, []);

  return (
    <>
      <video 
        autoPlay preload="none" loop muted playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-screen pointer-events-none"
      >
        <source src="/media/map.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0 pointer-events-none"></div>

      <MapContainer center={[39.3999, -8.2245]} zoom={6} className="absolute inset-0 w-full h-full z-10" style={{ background: 'transparent' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          className="map-tiles"
          opacity={0.6}
        />
        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl border border-rose-400">
            Erro de Dados: {errorMsg}
          </div>
        )}
        {locations.map(loc => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup className="rounded-xl overflow-hidden shadow-2xl border-0">
              <div className="font-sans p-1">
                <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{loc.name}</h3>
                <p className="text-blue-600 font-bold text-sm mb-4 bg-blue-50 inline-block px-2 py-1 rounded-md">
                  {loc.count} Avaliações de Pais
                </p>
                <button 
                  onClick={() => router.push(`/escola/${loc.id}`)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors">
                  Ver Relatório
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

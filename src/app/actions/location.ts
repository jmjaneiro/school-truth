'use server'

import { createClient } from '@/lib/supabase/server'

// Estes dados são estáticos e não mudam com frequência, o Next.js vai fazer cache natural
export async function getDistritos() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_distinct_distritos')
    
  if (error || !data) return []
  return data.map((d: any) => d.distrito).filter(Boolean)
}

export async function getConcelhos(distrito: string) {
  if (!distrito) return []
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_distinct_concelhos', { p_distrito: distrito })
    
  if (error || !data) return []
  return data.map((d: any) => d.concelho).filter(Boolean)
}

export async function getLocalidades(distrito: string, concelho: string) {
  if (!distrito || !concelho) return []
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_distinct_localidades', { 
    p_distrito: distrito, 
    p_concelho: concelho 
  })
    
  if (error || !data) return []
  return data.map((d: any) => d.localidade).filter(Boolean)
}

export async function getEstabelecimentos(distrito: string, concelho: string, localidade: string, cicloFilter?: string) {
  if (!distrito || !concelho || !localidade) return []
  const supabase = await createClient()
  
  let query = supabase
    .from('estabelecimentos')
    .select('id, codigo_escola, nome, natureza, ciclos')
    .eq('distrito', distrito)
    .eq('concelho', concelho)
    .eq('localidade', localidade)
    .eq('status', 'verified')
    .order('nome', { ascending: true })

  // O Supabase suporta filtro de Arrays usando `cs` (contains)
  if (cicloFilter && cicloFilter !== 'todos') {
    query = query.contains('ciclos', [cicloFilter])
  }

  const { data, error } = await query
  
  if (error) {
    console.error("Erro getEstabelecimentos:", error)
    return []
  }
  return data || []
}

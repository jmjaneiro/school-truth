'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function correctSchoolLocation(schoolId: string, lat: number, lng: number) {
  const supabase = await createClient()

  // Verificar se o utilizador está autenticado
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Tens de ter sessão iniciada para propor correções geográficas." }
  }

  // Chamar o RPC
  const { error } = await supabase.rpc('update_school_location', {
    p_school_id: schoolId,
    p_lat: lat,
    p_lng: lng
  })

  if (error) {
    console.error("Erro a atualizar localização:", error)
    return { error: "Falha ao gravar a nova coordenada." }
  }

  // Força o Next.js a atualizar a cache desta rota
  revalidatePath('/resultados')

  return { success: true }
}

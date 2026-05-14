'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitReview(data: any) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Não autorizado." }
  }

  // Assegurar que o utilizador existe na nossa public.users
  const { data: existingUser } = await supabase.from('users').select('id').eq('id', user.id).maybeSingle()
  if (!existingUser) {
    await supabase.from('users').insert([{ id: user.id, email: user.email }])
  }
  
  let finalSchoolId = data.id

  // Sanitização server-side dos inputs
  const childNickname = (data.childNickname || '').trim().slice(0, 10)
  const textReview = (data.textReview || '').trim().slice(0, 2000)
  const schoolLevel = (data.level || '').trim()

  if (!childNickname) {
    return { error: "A inicial do filho/a é obrigatória." }
  }

  // Se o utilizador tiver escolhido "Adicionar Manualmente"
  if (finalSchoolId === 'manual') {
    if (!data.name || data.name.trim() === '') {
      return { error: "O nome do estabelecimento é obrigatório." }
    }

    const { data: newSchool, error: insertSchoolError } = await supabase.from('estabelecimentos').insert({
      nome: data.name.trim().slice(0, 255),
      distrito: data.distrito || 'Desconhecido',
      concelho: data.concelho || 'Desconhecido',
      localidade: data.localidade || 'Desconhecido',
      latitude: 0,
      longitude: 0,
      ciclos: [schoolLevel],
      natureza: 'desconhecido',
      status: 'pending',
      criada_por: 'utilizador'
    }).select('id').single()

    if (insertSchoolError) {
      console.error("Erro a adicionar escola manual:", insertSchoolError)
      return { error: "Falha ao registar o novo estabelecimento." }
    }
    
    finalSchoolId = newSchool.id
  }

  // Reviews com texto livre entram com is_approved=false para moderação
  const hasTextReview = textReview.length > 0

  // Inserir Review no novo formato JSONB
  const { error: reviewError } = await supabase.from('reviews').insert({
    user_id: user.id,
    school_id: finalSchoolId,
    school_level: schoolLevel,
    child_nickname: childNickname,
    answers: {
      ...data.answers,
      metadata_time_taken_ms: data.timeTakenMs
    },
    text_review: hasTextReview ? textReview : null,
    contact_consent: data.contactConsent,
    is_approved: !hasTextReview  // Respostas numéricas auto-aprovadas, texto requer moderação
  })

  if (reviewError) {
    if (reviewError.code === '23505') {
      return { error: "Já submeteu uma avaliação para este filho neste ciclo de ensino." }
    }
    return { error: reviewError.message }
  }

  // Atualizar utilizador para has_reviewed = true
  const { error: updateError } = await supabase
    .from('users')
    .update({ has_reviewed: true })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Verificar se o utilizador já tem avaliações (has_reviewed)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('has_reviewed')
      .eq('id', user.id)
      .maybeSingle()
    
    if (profile?.has_reviewed) {
      return { success: true, redirect: '/resultados' }
    }
  }

  return { success: true, redirect: '/onboarding' }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Tenta iniciar sessão logo a seguir (caso o Supabase esteja configurado para auto-confirm)
  const { error: signInError } = await supabase.auth.signInWithPassword(data)
  
  if (signInError) {
    return { success: true, message: "Conta criada! Por favor, verifique a sua caixa de entrada (incluindo o Spam) para confirmar o seu email." }
  }

  // Asseguramos que o registo na auth.users também cria o registo na nossa tabela public.users
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: existingUser } = await supabase.from('users').select('id').eq('id', user.id).maybeSingle()
    if (!existingUser) {
      await supabase.from('users').insert([{ 
        id: user.id, 
        email: user.email,
        honor_compromise: formData.get('honor') === 'on' 
      }])
    }
  }

  return { success: true, redirect: '/onboarding' }
}

import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

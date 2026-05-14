import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Criação de 5 escolas fictícias e avaliações emocionais (Agente 4)
const seedData = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Faltam as variáveis de ambiente do Supabase (NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY).")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("🌱 A iniciar o Seed Data...")

  // 1. Inserir Escolas Fictícias
  const schools = [
    { name: "Escola Básica da Alegria", location: "Lisboa", average_rating: 4.5 },
    { name: "Colégio do Futuro", location: "Porto", average_rating: 3.8 },
    { name: "Escola Secundária dos Navegantes", location: "Cascais", average_rating: 2.5 },
    { name: "Externato Raio de Luz", location: "Coimbra", average_rating: 4.8 },
    { name: "Instituto Tecnológico Jovem", location: "Braga", average_rating: 4.1 },
  ]

  const { data: insertedSchools, error: schoolsError } = await supabase
    .from('schools')
    .insert(schools)
    .select()

  if (schoolsError) {
    console.error("❌ Erro a inserir escolas:", schoolsError.message)
    return
  }

  console.log(`✅ ${insertedSchools.length} Escolas inseridas.`)

  // Nota: Num cenário real com RLS, precisaríamos de utilizadores (users) reais no auth.users
  // Para o Seed, assumimos que as tabelas estão prontas ou testamos sem restrições FK severas.
  
  console.log("🌱 Seed concluído com sucesso. (As reviews requerem users autenticados)")
}

seedData()

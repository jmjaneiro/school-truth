-- SchoolTruth Final Architecture Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Tabela: Users (Estende a auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'parent',
    has_reviewed BOOLEAN DEFAULT FALSE,
    honor_compromise BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Destruir tabela de escolas antiga e reviews se existirem
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;
DROP TABLE IF EXISTS public.estabelecimentos CASCADE;

-- Tabela: Estabelecimentos (Baseado na RedeEscolar DGEEC)
CREATE TABLE public.estabelecimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_escola VARCHAR(20) UNIQUE,           -- CODESCME (chave estável)
  codigo_agrupamento VARCHAR(20),             -- CODUOME
  nome VARCHAR(255) NOT NULL,                 -- NOME
  agrupamento VARCHAR(255),                   -- NOMEUO
  sede BOOLEAN DEFAULT FALSE,                 -- SEDE = 'S'
  morada VARCHAR(500),
  localidade VARCHAR(150),
  freguesia VARCHAR(150),                     -- opcional
  concelho VARCHAR(100) NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  ciclos TEXT[] NOT NULL,                     -- ['pre_escolar', 'primeiro_ciclo', ...]
  natureza VARCHAR(30) NOT NULL,              -- 'publica', 'privada', 'ipss', 'misericordia', 'desconhecido'
  email_contacto VARCHAR(255),
  telefone VARCHAR(50),
  url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'verified',      -- 'verified', 'pending', 'rejected'
  criada_por VARCHAR(20) DEFAULT 'system',    -- 'system', 'utilizador'
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX idx_estab_localizacao ON estabelecimentos (distrito, concelho, localidade);
CREATE INDEX idx_estab_coordenadas ON estabelecimentos (latitude, longitude);
CREATE INDEX idx_estab_ciclos ON estabelecimentos USING gin (ciclos);
CREATE INDEX idx_estab_codigo ON estabelecimentos (codigo_escola);
CREATE INDEX idx_estab_status ON estabelecimentos (status);

-- Tabela: Reviews
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.estabelecimentos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    school_level TEXT NOT NULL, 
    child_nickname TEXT NOT NULL, 
    
    answers JSONB NOT NULL,
    text_review TEXT, 
    contact_consent BOOLEAN DEFAULT FALSE, 
    
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, user_id, school_level, child_nickname)
);

-- RPC: Atualizar a localização (lat/lng) com segurança
CREATE OR REPLACE FUNCTION update_school_location(p_school_id UUID, p_lat DECIMAL, p_lng DECIMAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validar que coordenadas estão dentro de Portugal (continente + Açores + Madeira)
  IF p_lat < 32.0 OR p_lat > 42.5 OR p_lng < -31.5 OR p_lng > -6.0 THEN
    RAISE EXCEPTION 'Coordenadas fora do território português.';
  END IF;

  -- Apenas atualiza lat e lng, e regista que foi alterado pela comunidade
  UPDATE public.estabelecimentos
  SET latitude = p_lat, longitude = p_lng, data_atualizacao = NOW()
  WHERE id = p_school_id;
END;
$$;

-- Recarregar cache da API do Supabase
NOTIFY pgrst, 'reload schema';

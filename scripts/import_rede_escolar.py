import json
import os
import sys
from pyproj import Transformer
import psycopg2
from psycopg2.extras import execute_batch

# --- Configuração ---

CICLO_MAP = {
    "Pré-escolar": "pre_escolar",
    "1º Ciclo": "primeiro_ciclo",
    "2º Ciclo": "segundo_terceiro_ciclo",
    "3º Ciclo": "segundo_terceiro_ciclo",
    "Secundário": "secundario",
}

# Ciclos ignorados no MVP (mantidos no log para referência futura)
CICLOS_IGNORADOS = {"Profissional", "Artistico", "Especial", "Extra-escolar"}

NATUREZA_MAP = {
    "Redes dos ministérios": "publica",
    "Particular": "privada",
    "IPSS ou equiparada": "ipss",
    "Misericórdia de Lisboa": "misericordia",
}

def parse_ciclos(ciclo_str):
    """Converte 'Pré-escolar;1º Ciclo' em ['pre_escolar', 'primeiro_ciclo'] (sem duplicados)."""
    if not ciclo_str:
        return []
    partes = [c.strip() for c in ciclo_str.split(";")]
    ciclos_normalizados = []
    for p in partes:
        if p in CICLO_MAP:
            normalizado = CICLO_MAP[p]
            if normalizado not in ciclos_normalizados:
                ciclos_normalizados.append(normalizado)
    return ciclos_normalizados

def parse_natureza(valor):
    if not valor:
        return "desconhecido"
    return NATUREZA_MAP.get(valor, "desconhecido")

def carregar_geojson(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["features"]

def transformar_features(features):
    """Converte coordenadas e normaliza dados. Devolve lista de tuples para insert."""
    transformer = Transformer.from_crs("EPSG:3763", "EPSG:4326", always_xy=True)
    
    registos = []
    descartados_sem_coords = 0
    descartados_sem_ciclos_relevantes = 0
    
    for feat in features:
        props = feat.get("properties", {})
        geom = feat.get("geometry", {})
        coords = geom.get("coordinates") if geom else None
        
        if not coords or len(coords) != 2:
            descartados_sem_coords += 1
            continue
        
        # Conversão de coordenadas
        lng_wgs, lat_wgs = transformer.transform(coords[0], coords[1])
        
        # Normalização de ciclos
        ciclos = parse_ciclos(props.get("CICLO"))
        if not ciclos:
            descartados_sem_ciclos_relevantes += 1
            continue
        
        codigo_escola = props.get("CODESCME")
        if not codigo_escola:
            continue  # sem chave única não importamos
        
        registos.append((
            str(codigo_escola).strip(),
            (props.get("CODUOME") or "").strip() or None,
            (props.get("NOME") or "").strip(),
            (props.get("NOMEUO") or "").strip() or None,
            (props.get("SEDE") or "").strip().upper() == "S",
            (props.get("MORADA") or "").strip() or None,
            (props.get("LOCALIDADE") or "").strip() or None,
            (props.get("CONCELHO") or "").strip(),
            (props.get("DISTRITO") or "").strip(),
            round(lat_wgs, 7),
            round(lng_wgs, 7),
            ciclos,
            parse_natureza(props.get("NATUREZAINSTITUCIONAL_DESC")),
            (props.get("EMAIL") or "").strip() or None,
            (props.get("TELEFONE") or "").strip() or None,
            (props.get("URL") or "").strip() or None,
        ))
    
    print(f"  ↳ Registos válidos:                {len(registos)}")
    print(f"  ↳ Descartados (sem coordenadas):   {descartados_sem_coords}")
    print(f"  ↳ Descartados (ciclos irrelevantes): {descartados_sem_ciclos_relevantes}")
    
    return registos

def inserir_em_lote(conn, registos):
    """Insert idempotente com ON CONFLICT no codigo_escola."""
    sql = """
        INSERT INTO estabelecimentos (
            codigo_escola, codigo_agrupamento, nome, agrupamento, sede,
            morada, localidade, concelho, distrito,
            latitude, longitude, ciclos, natureza,
            email_contacto, telefone, url,
            status, criada_por
        ) VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s,
            'verified', 'system'
        )
        ON CONFLICT (codigo_escola) DO UPDATE SET
            codigo_agrupamento = EXCLUDED.codigo_agrupamento,
            nome = EXCLUDED.nome,
            agrupamento = EXCLUDED.agrupamento,
            sede = EXCLUDED.sede,
            morada = EXCLUDED.morada,
            localidade = EXCLUDED.localidade,
            concelho = EXCLUDED.concelho,
            distrito = EXCLUDED.distrito,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            ciclos = EXCLUDED.ciclos,
            natureza = EXCLUDED.natureza,
            email_contacto = EXCLUDED.email_contacto,
            telefone = EXCLUDED.telefone,
            url = EXCLUDED.url,
            data_atualizacao = NOW();
    """
    
    with conn.cursor() as cur:
        execute_batch(cur, sql, registos, page_size=500)
    conn.commit()

def main():
    if len(sys.argv) < 2:
        print("Uso: python import_rede_escolar.py <caminho_para_geojson>")
        sys.exit(1)
    
    geojson_path = sys.argv[1]
    database_url = os.environ.get("DATABASE_URL")
    
    if not database_url:
        print("ERRO: variável de ambiente DATABASE_URL não definida")
        sys.exit(1)
    
    print(f"📂 A carregar GeoJSON: {geojson_path}")
    features = carregar_geojson(geojson_path)
    print(f"  ↳ Total de features no ficheiro: {len(features)}")
    
    print("\n🔄 A transformar coordenadas e a normalizar dados...")
    registos = transformar_features(features)
    
    print(f"\n💾 A inserir/atualizar {len(registos)} registos na BD...")
    conn = psycopg2.connect(database_url)
    try:
        inserir_em_lote(conn, registos)
        print("✅ Import concluído com sucesso.")
    finally:
        conn.close()

if __name__ == "__main__":
    main()

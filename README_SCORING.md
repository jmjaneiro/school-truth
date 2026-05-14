# SchoolTruth - Algoritmo de Scoring & Mitigação de BIAS

Este documento detalha as fórmulas, mecanismos e estruturas de dados por trás do modelo de pontuação (scoring) do SchoolTruth, desenvolvido para recolher a opinião real das famílias minimizando enviesamentos estatísticos e manipulação das métricas das escolas.

---

## 1. Identificação de Bias e Abordagens de Mitigação

1. **Bias de Seleção**: Tendência de apenas famílias muito insatisfeitas ou muito militantes deixarem avaliações.
   - *Mitigação*: Fluxos simplificados e gamificados ("Tinder-style swipe") reduzem o atrito. Implementação do **Bayesian Averaging** para empurrar escolas com poucas respostas para a média global.
2. **Bias de Recência**: Eventos recentes (bons ou maus) influenciam a avaliação geral de uma escola.
   - *Mitigação*: **Decaimento Temporal**. O peso da review diminui conforme a sua idade (100% até 12m, 60% até 24m, 30% a partir dos 24m).
3. **Bias de Amostra Pequena**: 2 pais furiosos num universo de mil pais dão pontuação negativa a uma escola inteira.
   - *Mitigação*: **Lock Visuais**. Até 15 respostas, a escola aparece como "A recolher opiniões". O cálculo Bayesian protege escolas com N pequenos.
4. **Respostas Automáticas/Robóticas**: Pessoas que clicam sempre na primeira opção para despachar.
   - *Mitigação*: **Randomização** de opções no frontend (opção 1 nunca é sempre a positiva) + Injeção de uma **Pergunta Invertida** por bloco (aonde "Sim" é negativo, testando a atenção do pai). Filtro de **Speed** rejeitando submits com `< 30 segundos`.

---

## 2. Metodologia de Pontuação (Scoring Base)

### 2.1 Ponderação por Opção
O JSON mapeia `tipo` ("positiva", "neutra", "negativa") e atríbui uma pontuação linear:
- Positiva = 3 pontos
- Neutra = 2 pontos
- Negativa = 1 ponto

*(Nota: Na pergunta invertida, a lógica inverte mas a entrega de pontos pelo backend garante integridade matemática).*

### 2.2 Fórmulas
Para garantir que as pontuações não são afetadas por questões não preenchidas ou "Não aplicável" futuramente, usamos o ratio dos máximos possíveis:

**Score da Sub-dimensão**:
`Score_sub = (Σ pontos respostas / Σ max_possível_pontos) × 100`

**Score dos Blocos (Transversal e Ciclo)**:
`Score_bloco = Σ (Score_sub × Peso_sub)`

**Score Global**:
`Score_raw = (Score_transversais × Peso_transversais) + (Score_ciclo × Peso_ciclo)`

#### Pesos dos Blocos:
- **Pré-escolar**: Transversais 25% | Ciclo 75%
- **1º Ciclo**: Transversais 20% | Ciclo 80%
- **2º/3º Ciclo**: Transversais 20% | Ciclo 80%
- **Secundário**: Transversais 15% | Ciclo 85%

### 2.3 Dimensões Contextuais
Algumas perguntas (ex: Acessos pedonais, Envolvente segura) são marcadas como *Contextuais*. O frontend apresenta a sub-dimensão com um ícone (`ℹ️`), isolando estas respostas da fórmula final (pois referem-se à localização física, algo que o agrupamento não controla).

---

## 3. Algoritmos de Anti-Manipulação

### 3.1 Filtro de Speed
A variável `metadata_time_taken_ms` capta o tempo entre o render das perguntas e o submit.
- **Regra**: Respostas com duração inferior a 30.000 ms são desconsideradas no cálculo do relatório dinâmico.

### 3.2 Trimmed Mean
De forma a mitigar ataques concertados por extremistas (campanhas de difamação), aplicamos uma média aparada.
- **Regra**: Se existirem mais de 20 avaliações para uma escola, o sistema ordena as avaliações pelo total de pontos distribuídos. Elimina do cálculo as 10% mais altas e as 10% mais baixas (Top/Bottom Tail Trim).

### 3.3 Bayesian Averaging
Para impedir que 1 review de 100% dê um score perfeito a uma escola:
- **Fórmula**: `Score_Bayes = ((N * Score_raw) + (K * Score_global)) / (N + K)`
- `N` = Total de respostas elegíveis após filtragem (Speed, Trim).
- `K` = Factor Constante de Confiança (definido em 10). Representa o peso que a média global tem.
- `Score_global` = 65% (definido fixo).
*Ou seja, uma escola com poucas avaliações é puxada para 65%. Quantas mais avaliações reais e validadas a escola angariar (N cresce), menos impacto a constante K tem.*

---

## 4. Apresentação Qualitativa (Labels)

Com o objectivo de evitar rankings competitivos e "tabelas classificativas de jornal", as percentagens geram *labels* comportamentais para rápida digestão dos pais:
- **[85 - 100%]** Escola de referência 🌟
- **[70 - 84%]** Boa experiência geral 👍
- **[55 - 69%]** Com pontos a melhorar 🔧
- **[0 - 54%]** Precisa de atenção ⚠️

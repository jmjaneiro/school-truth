export type Option = {
  texto: string;
  pontos: number | null; // null = "Não sei / N/A" — excluído do score
};

export type Question = {
  id: string;
  sub_dimensao: string | string[];
  texto: string;
  comentario_placeholder?: string; // Sugestão de contexto para o campo de comentário
  opcoes_custom?: Option[]; // Opções personalizadas (se undefined, usa a escala Likert padrão)
};

// Opções Likert padronizadas (sem emojis)
export const LIKERT_OPTIONS: Option[] = [
  { texto: "Muito satisfeito/a", pontos: 5 },
  { texto: "Satisfeito/a", pontos: 4 },
  { texto: "Neutro/a", pontos: 3 },
  { texto: "Pouco satisfeito/a", pontos: 2 },
  { texto: "Insatisfeito/a", pontos: 1 },
  { texto: "Não sei / Não se aplica", pontos: null },
];

export const transversalQuestions: Question[] = [
  {
    id: "P1",
    sub_dimensao: "edificio_conforto",
    texto: "Como avalia o estado geral do edifício escolar?",
    comentario_placeholder: "Ex: Fachada deteriorada, obras frequentes..."
  },
  {
    id: "P2",
    sub_dimensao: "edificio_conforto",
    texto: "Como avalia as condições físicas das instalações (iluminação, ventilação, espaço)?",
    comentario_placeholder: "Ex: Salas muito frias no inverno, falta de luz natural..."
  },
  {
    id: "P3",
    sub_dimensao: "higiene_sanitaria",
    texto: "Como avalia o estado de limpeza e conservação das casas de banho?",
    comentario_placeholder: "Ex: Falta de papel, portas partidas..."
  },
  {
    id: "P4",
    sub_dimensao: "acessos_mobilidade",
    texto: "Como avalia a organização do acesso de entrada e saída de carro?",
    comentario_placeholder: "Ex: Caos no horário de ponta, falta de sinalização..."
  },
  {
    id: "P5",
    sub_dimensao: "acessos_mobilidade",
    texto: "Como avalia a segurança e acessibilidade dos percursos a pé ou de bicicleta?",
    comentario_placeholder: "Ex: Passeios estreitos, falta de passadeiras..."
  }
];

export const preEscolarQuestions: Question[] = [
  {
    id: "P6",
    sub_dimensao: "afeto_vinculo",
    texto: "Como avalia a forma como os educadores recebem o seu filho de manhã?",
    comentario_placeholder: "Ex: Chamam pelo nome, fazem perguntas sobre o fim de semana..."
  },
  {
    id: "P7",
    sub_dimensao: "afeto_vinculo",
    texto: "Como avalia a forma como os educadores gerem o momento de separação quando a criança chora?",
    comentario_placeholder: "Ex: Acalmam com paciência, ou apressam o processo..."
  },
  {
    id: "P8",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Como avalia o respeito pelo ritmo individual de desenvolvimento do seu filho?",
    comentario_placeholder: "Ex: Comunicam adaptações, ou aplicam regras rígidas para todos..."
  },
  {
    id: "P9",
    sub_dimensao: "comunicacao_pais",
    texto: "Com que regularidade a escola comunica sobre a rotina diária do seu filho?",
    comentario_placeholder: "Ex: Relatório diário, caderneta, app escolar..."
  },
  {
    id: "P10",
    sub_dimensao: "higiene_saude",
    texto: "Como avalia a higiene geral das instalações da escola?",
    comentario_placeholder: "Ex: Chão limpo, brinquedos desinfetados, cheiro a limpo..."
  },
  {
    id: "P11",
    sub_dimensao: "higiene_saude",
    texto: "Com que clareza recebe informação sobre a ementa e a qualidade da alimentação?",
    comentario_placeholder: "Ex: Ementa afixada, alternativas para alergias comunicadas..."
  },
  {
    id: "P12",
    sub_dimensao: "seguranca_fisica",
    texto: "Qual o nível de confiança que tem na supervisão do seu filho durante os momentos de recreio?",
    comentario_placeholder: "Ex: Número de adultos visível, resposta rápida a incidentes..."
  },
  {
    id: "P13",
    sub_dimensao: "comunicacao_pais",
    texto: "Com que detalhe a escola comunica sobre o dia do seu filho?",
    comentario_placeholder: "Ex: O que comeu, como dormiu, o que fez..."
  },
  {
    id: "P14",
    sub_dimensao: "seguranca_fisica",
    texto: "Como avalia a segurança das instalações para prevenir saídas não autorizadas?",
    comentario_placeholder: "Ex: Portão sempre fechado, controlo de entradas e saídas..."
  },
  {
    id: "P15",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Com que clareza recebe informação sobre as atividades pedagógicas realizadas?",
    comentario_placeholder: "Ex: Projeto educativo comunicado, trabalhos enviados para casa..."
  }
];

export const primeiroCicloQuestions: Question[] = [
  {
    id: "P16",
    sub_dimensao: "aprendizagem_progresso",
    texto: "Com que clareza a escola comunica o progresso escolar do seu filho?",
    comentario_placeholder: "Ex: Reuniões regulares, fichas de avaliação detalhadas..."
  },
  {
    id: "P17",
    sub_dimensao: "aprendizagem_progresso",
    texto: "Como avalia o volume de trabalhos de casa relativamente à idade do seu filho?",
    comentario_placeholder: "Ex: Demasiados TPC, ou volume adequado para a idade..."
  },
  {
    id: "P18",
    sub_dimensao: "bem_estar_fisico",
    texto: "Como avalia a oferta de atividades físicas regulares na escola (educação física, recreio ativo)?",
    comentario_placeholder: "Ex: Educação física frequente, espaço de recreio adequado..."
  },
  {
    id: "P19",
    sub_dimensao: "bem_estar_fisico",
    texto: "Como avalia o volume de material escolar que o seu filho transporta diariamente?",
    comentario_placeholder: "Ex: Mochila muito pesada, sistema de cacifos disponível..."
  },
  {
    id: "P20",
    sub_dimensao: "seguranca_convivencia",
    texto: "Quando surgem conflitos entre alunos, como avalia a resposta da escola?",
    comentario_placeholder: "Ex: Chamam os pais, mediam o conflito, ou ignoram..."
  },
  {
    id: "P21",
    sub_dimensao: "relacao_professor_aluno",
    texto: "O professor demonstra conhecer o seu filho individualmente (dificuldades, interesses)?",
    comentario_placeholder: "Ex: Referiu situações específicas em reunião, ou trata todos de forma genérica..."
  },
  {
    id: "P22",
    sub_dimensao: "capacidade_resposta",
    texto: "Quando reporta um problema à escola, como avalia a capacidade de resposta?",
    comentario_placeholder: "Ex: Responderam rapidamente, ou ficaram sem feedback..."
  },
  {
    id: "P23",
    sub_dimensao: "seguranca_convivencia",
    texto: "Com que regularidade recebe informação sobre as condições e segurança do espaço de recreio?",
    comentario_placeholder: "Ex: Comunicam melhorias, relatam incidentes, ou silêncio total..."
  },
  {
    id: "P24",
    sub_dimensao: "bem_estar_emocional",
    texto: "A escola transmite-lhe confiança em relação ao bem-estar do seu filho durante o dia?",
    comentario_placeholder: "Ex: Comunicam proativamente, ou só contactam em problemas graves..."
  },
  {
    id: "P25",
    sub_dimensao: "aprendizagem_progresso",
    texto: "Quando o seu filho tem dificuldades, como avalia o apoio prestado pela escola?",
    comentario_placeholder: "Ex: Apoio pedagógico disponível, ou remetem tudo para explicações externas..."
  }
];

export const segundoTerceiroCicloQuestions: Question[] = [
  {
    id: "P26",
    sub_dimensao: "acompanhamento_vinculo",
    texto: "Como avalia o acompanhamento do Diretor de Turma ao seu filho?",
    comentario_placeholder: "Ex: Contacta proativamente, conhece o aluno, ou apenas envia notas..."
  },
  {
    id: "P27",
    sub_dimensao: "clima_social",
    texto: "Como avalia os esforços da escola para promover a socialização saudável entre alunos?",
    comentario_placeholder: "Ex: Atividades de grupo, projetos colaborativos, eventos de turma..."
  },
  {
    id: "P28",
    sub_dimensao: "clima_social_seguranca",
    texto: "Como avalia os procedimentos da escola para lidar com situações de bullying ou exclusão?",
    comentario_placeholder: "Ex: Política clara comunicada, psicólogo disponível, ou inexistente..."
  },
  {
    id: "P29",
    sub_dimensao: "higiene_sanitaria",
    texto: "Como avalia o estado de limpeza e conservação dos balneários e casas de banho?",
    comentario_placeholder: "Ex: Evita usá-los, ou estão em bom estado de conservação..."
  },
  {
    id: "P30",
    sub_dimensao: "clima_social_seguranca",
    texto: "Como avalia a clareza com que as regras de conduta da escola são comunicadas?",
    comentario_placeholder: "Ex: Regulamento entregue e explicado, ou desconhecido pelos alunos..."
  },
  {
    id: "P31",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Como avalia a disponibilidade de recursos de apoio ao estudo (fichas, plataformas, aulas de apoio)?",
    comentario_placeholder: "Ex: Plataforma digital atualizada, aulas de apoio acessíveis..."
  },
  {
    id: "P32",
    sub_dimensao: "saude_mental_emocional",
    texto: "Como avalia a sensibilidade da escola para os desafios emocionais típicos desta faixa etária?",
    comentario_placeholder: "Ex: Abordagem do tema em aula, psicólogo acessível..."
  },
  {
    id: "P33",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Como avalia a oferta de atividades extracurriculares (clubes, desporto, projetos)?",
    comentario_placeholder: "Ex: Clube de teatro, desporto escolar, projetos de cidadania..."
  },
  {
    id: "P34",
    sub_dimensao: "saude_mental_emocional",
    texto: "Como avalia o acesso a apoio psicológico e iniciativas de saúde mental na escola?",
    comentario_placeholder: "Ex: Psicólogo disponível e acessível, ou apenas em situações de crise..."
  },
  {
    id: "P35",
    sub_dimensao: "acompanhamento_vinculo",
    texto: "Quando o seu filho falta ou demonstra isolamento, com que prontidão a escola o contacta?",
    comentario_placeholder: "Ex: Contactaram no próprio dia, ou nunca foram proativos..."
  }
];

export const secundarioQuestions: Question[] = [
  {
    id: "P36",
    sub_dimensao: "pressao_academica",
    texto: "Como avalia o volume de avaliações e trabalhos em termos de gestão para o seu filho?",
    comentario_placeholder: "Ex: Testes acumulados na mesma semana, ou distribuídos de forma equilibrada..."
  },
  {
    id: "P37",
    sub_dimensao: "orientacao_futuro",
    texto: "Como avalia o apoio à orientação vocacional e escolha de percurso?",
    comentario_placeholder: "Ex: Sessões de orientação, visitas a universidades, ou inexistentes..."
  },
  {
    id: "P38",
    sub_dimensao: "seguranca_envolvente",
    texto: "Como avalia a segurança dos arredores da escola?",
    comentario_placeholder: "Ex: Zona tranquila, ou situações preocupantes à porta da escola..."
  },
  {
    id: "P39",
    sub_dimensao: "qualidade_docente",
    texto: "Como avalia a disponibilidade dos professores para esclarecer dúvidas fora do horário de aula?",
    comentario_placeholder: "Ex: Hora de atendimento disponível, email respondido, ou inacessíveis..."
  },
  {
    id: "P40",
    sub_dimensao: "pressao_academica",
    texto: "Como avalia a preparação estruturada que a escola oferece para os exames nacionais?",
    comentario_placeholder: "Ex: Simulações realizadas, revisões organizadas, ou entregue à iniciativa do aluno..."
  },
  {
    id: "P41",
    sub_dimensao: "comunicacao_pais",
    texto: "Com que clareza a escola comunica o calendário de avaliações e a planificação anual?",
    comentario_placeholder: "Ex: Calendário disponível online, ou descoberto à última hora..."
  },
  {
    id: "P42",
    sub_dimensao: "orientacao_futuro",
    texto: "Como avalia a abertura da escola para percursos alternativos à universidade?",
    comentario_placeholder: "Ex: Falam de cursos profissionais, ensino artístico, ou só da faculdade..."
  },
  {
    id: "P43",
    sub_dimensao: "saude_mental",
    texto: "Como avalia o acesso e a qualidade do apoio psicológico disponível na escola?",
    comentario_placeholder: "Ex: Psicólogo presente e acessível, ou apenas em situações extremas..."
  },
  {
    id: "P44",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Como avalia a promoção de práticas de entreajuda e trabalho colaborativo entre alunos?",
    comentario_placeholder: "Ex: Trabalhos de grupo frequentes, projetos interdisciplinares..."
  },
  {
    id: "P45",
    sub_dimensao: "avaliacao_geral",
    texto: "No geral, como avalia a experiência do seu filho nesta escola?",
    comentario_placeholder: "O que destacaria como ponto forte ou fraco mais relevante?"
  }
];

// Helper: baralhar array
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export const getQuestionsForLevel = (level: string): Question[] => {
  let specific: Question[] = [];
  switch (level) {
    case "pre_escolar": specific = preEscolarQuestions; break;
    case "primeiro_ciclo": specific = primeiroCicloQuestions; break;
    case "segundo_terceiro_ciclo": specific = segundoTerceiroCicloQuestions; break;
    case "secundario": specific = secundarioQuestions; break;
    default: specific = primeiroCicloQuestions;
  }

  // NPS final — sempre a última pergunta
  const npsQuestion: Question = {
    id: "nps_recomendacao",
    sub_dimensao: "nps",
    texto: "Recomendaria esta escola a um familiar ou amigo?",
    comentario_placeholder: "O que mais influenciou a sua resposta?",
    opcoes_custom: [
      { texto: "Recomendo", pontos: 5 },
      { texto: "Neutro", pontos: 4 },
      { texto: "Não recomendo", pontos: 1 },
      { texto: "Não sei / Não se aplica", pontos: null },
    ]
  };

  // Baralhar os blocos mas manter o NPS no final e os transversais no início
  const blockTransversal = shuffleArray(transversalQuestions);
  const blockSpecific = shuffleArray(specific);

  return [...blockTransversal, ...blockSpecific, npsQuestion];
};

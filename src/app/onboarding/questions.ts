export type Option = {
  emoji: string;
  texto: string;
  tipo: "positiva" | "neutra" | "negativa";
  pontos: number;
};

export type Question = {
  id: string;
  sub_dimensao: string | string[];
  texto: string;
  invertida: boolean;
  opcoes: Option[];
};

export const transversalQuestions: Question[] = [
  {
    id: "P1",
    sub_dimensao: "edificio_conforto",
    texto: "Como descreves o estado geral do edifício?",
    invertida: false,
    opcoes: [
      { emoji: "🏛️", texto: "Bem cuidado, dá gosto entrar", tipo: "positiva", pontos: 3 },
      { emoji: "🧱", texto: "Velhote, mas funcional", tipo: "neutra", pontos: 2 },
      { emoji: "🚧", texto: "Precisa de obras urgentes", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P2",
    sub_dimensao: "edificio_conforto",
    texto: "A temperatura nas salas é confortável?",
    invertida: false,
    opcoes: [
      { emoji: "☀️", texto: "Sim, tanto no Inverno como no Verão", tipo: "positiva", pontos: 3 },
      { emoji: "🌡️", texto: "Há dias melhores que outros", tipo: "neutra", pontos: 2 },
      { emoji: "🥶", texto: "É um problema constante", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P3",
    sub_dimensao: ["edificio_conforto", "higiene_sanitaria"],
    texto: "Em que estado estão as casas de banho?",
    invertida: false,
    opcoes: [
      { emoji: "✨", texto: "Limpas, com material, sem queixas", tipo: "positiva", pontos: 3 },
      { emoji: "🧻", texto: "Básicas, mas utilizáveis", tipo: "neutra", pontos: 2 },
      { emoji: "🚫", texto: "Ele evita usá-las", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P4",
    sub_dimensao: "acessos_mobilidade",
    texto: "Como é a experiência de levar e buscar de carro?",
    invertida: false,
    opcoes: [
      { emoji: "🅿️", texto: "Fluido, há espaço e organização", tipo: "positiva", pontos: 3 },
      { emoji: "🚗", texto: "Algum stress nas horas de ponta", tipo: "neutra", pontos: 2 },
      { emoji: "😤", texto: "Caos diário, uma dor de cabeça", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P5",
    sub_dimensao: "acessos_mobilidade",
    texto: "Os acessos a pé, bicicleta ou trotinete são um problema?",
    invertida: true,
    opcoes: [
      { emoji: "🚧", texto: "Sim, é perigoso e mal sinalizado", tipo: "negativa", pontos: 1 },
      { emoji: "🤷", texto: "Mais ou menos, requer atenção", tipo: "neutra", pontos: 2 },
      { emoji: "🚴", texto: "Não, é seguro e acessível", tipo: "positiva", pontos: 3 }
    ]
  }
];

export const preEscolarQuestions: Question[] = [
  {
    id: "P6",
    sub_dimensao: "afeto_vinculo",
    texto: "Como é que os educadores recebem o teu filho de manhã?",
    invertida: false,
    opcoes: [
      { emoji: "🤗", texto: "Com colo, sorriso e atenção", tipo: "positiva", pontos: 3 },
      { emoji: "🙂", texto: "Simpáticos, mas sem grande afeto", tipo: "neutra", pontos: 2 },
      { emoji: "😶", texto: "Frios, despacham rápido", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P7",
    sub_dimensao: "afeto_vinculo",
    texto: "Quando ele chora na separação, como reagem?",
    invertida: false,
    opcoes: [
      { emoji: "💛", texto: "Acalmam-no com paciência até passar", tipo: "positiva", pontos: 3 },
      { emoji: "🤷", texto: "Distraem-no e segue-se", tipo: "neutra", pontos: 2 },
      { emoji: "🙄", texto: "Minimizam, \"já passa\"", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P8",
    sub_dimensao: "afeto_vinculo",
    texto: "Como foi gerido o desfralde?",
    invertida: false,
    opcoes: [
      { emoji: "🌟", texto: "Ao ritmo dele, sem pressão", tipo: "positiva", pontos: 3 },
      { emoji: "⏳", texto: "Apressado, mas correu", tipo: "neutra", pontos: 2 },
      { emoji: "😣", texto: "Forçado, gerou ansiedade", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P9",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Como é o ambiente na hora da sesta?",
    invertida: false,
    opcoes: [
      { emoji: "😴", texto: "Calmo, escurinho, dorme bem", tipo: "positiva", pontos: 3 },
      { emoji: "🛏️", texto: "Razoável, nem sempre descansa", tipo: "neutra", pontos: 2 },
      { emoji: "📢", texto: "Agitado, acorda cansado", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P10",
    sub_dimensao: "higiene_saude",
    texto: "Que confiança tens na higiene das instalações?",
    invertida: false,
    opcoes: [
      { emoji: "✨", texto: "Total, vê-se o cuidado", tipo: "positiva", pontos: 3 },
      { emoji: "🧹", texto: "Aceitável no geral", tipo: "neutra", pontos: 2 },
      { emoji: "😬", texto: "Pouca, noto falta de limpeza", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P11",
    sub_dimensao: "higiene_saude",
    texto: "O que achas da alimentação que lhe dão?",
    invertida: false,
    opcoes: [
      { emoji: "🥦", texto: "Variada, fresca, equilibrada", tipo: "positiva", pontos: 3 },
      { emoji: "🍝", texto: "Básica, mas come", tipo: "neutra", pontos: 2 },
      { emoji: "🍟", texto: "Pobre, muito processada", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P12",
    sub_dimensao: "seguranca_fisica",
    texto: "Sentes que a vigilância no recreio é excessiva?",
    invertida: true,
    opcoes: [
      { emoji: "🔒", texto: "Sim, quase não os deixam mexer", tipo: "negativa", pontos: 1 },
      { emoji: "⚖️", texto: "Equilibrada, vigiam sem sufocar", tipo: "neutra", pontos: 2 },
      { emoji: "👻", texto: "Pelo contrário, falta vigilância", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P13",
    sub_dimensao: "comunicacao_pais",
    texto: "Recebes informação sobre como correu o dia?",
    invertida: false,
    opcoes: [
      { emoji: "📱", texto: "Sim, com detalhe — fotos, recados, notas", tipo: "positiva", pontos: 3 },
      { emoji: "💬", texto: "O básico, \"correu bem\"", tipo: "neutra", pontos: 2 },
      { emoji: "🤐", texto: "Quase nada, tenho de perguntar sempre", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P14",
    sub_dimensao: "seguranca_fisica",
    texto: "Quão seguro é o recinto contra fugas?",
    invertida: false,
    opcoes: [
      { emoji: "🔒", texto: "Totalmente vedado e controlado", tipo: "positiva", pontos: 3 },
      { emoji: "👀", texto: "Razoável, mas já pensei nisso", tipo: "neutra", pontos: 2 },
      { emoji: "😰", texto: "Frágil, já houve situações", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P15",
    sub_dimensao: "qualidade_pedagogica",
    texto: "As atividades diárias estimulam o desenvolvimento dele?",
    invertida: false,
    opcoes: [
      { emoji: "🎨", texto: "Sim, há criatividade e exploração", tipo: "positiva", pontos: 3 },
      { emoji: "📋", texto: "Fazem coisas, mas rotineiras", tipo: "neutra", pontos: 2 },
      { emoji: "📺", texto: "Pouco estímulo, parece \"depósito\"", tipo: "negativa", pontos: 1 }
    ]
  }
];

export const primeiroCicloQuestions: Question[] = [
  {
    id: "P16",
    sub_dimensao: "aprendizagem_progresso",
    texto: "Como está a correr a aprendizagem da leitura e escrita?",
    invertida: false,
    opcoes: [
      { emoji: "📚", texto: "Muito bem, nota-se evolução", tipo: "positiva", pontos: 3 },
      { emoji: "✏️", texto: "No ritmo esperado", tipo: "neutra", pontos: 2 },
      { emoji: "😟", texto: "Com dificuldades e pouco apoio", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P17",
    sub_dimensao: "aprendizagem_progresso",
    texto: "O volume de trabalhos de casa é razoável?",
    invertida: false,
    opcoes: [
      { emoji: "👍", texto: "Adequado, faz sozinho", tipo: "positiva", pontos: 3 },
      { emoji: "📝", texto: "Puxado, precisa de ajuda", tipo: "neutra", pontos: 2 },
      { emoji: "😩", texto: "Excessivo, sobra tudo para os pais", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P18",
    sub_dimensao: "bem_estar_fisico_emocional",
    texto: "Há equilíbrio entre brincar e estar sentado?",
    invertida: false,
    opcoes: [
      { emoji: "🤸", texto: "Sim, corre e brinca bastante", tipo: "positiva", pontos: 3 },
      { emoji: "⚖️", texto: "Mais ou menos", tipo: "neutra", pontos: 2 },
      { emoji: "🪑", texto: "Passa tempo demais sentado", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P19",
    sub_dimensao: "bem_estar_fisico_emocional",
    texto: "O peso da mochila é adequado?",
    invertida: false,
    opcoes: [
      { emoji: "🎒", texto: "Leve, só o necessário", tipo: "positiva", pontos: 3 },
      { emoji: "📦", texto: "Pesada, mas gere-se", tipo: "neutra", pontos: 2 },
      { emoji: "🧱", texto: "Absurdo, vai carregadíssimo", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P20",
    sub_dimensao: "seguranca_convivencia",
    texto: "Como é o ambiente entre os colegas?",
    invertida: false,
    opcoes: [
      { emoji: "💛", texto: "Saudável, dão-se bem", tipo: "positiva", pontos: 3 },
      { emoji: "😐", texto: "Normal, com picardias da idade", tipo: "neutra", pontos: 2 },
      { emoji: "😢", texto: "Há agressividade e ele sofre com isso", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P21",
    sub_dimensao: "relacao_professor_aluno",
    texto: "Sentes que o professor dá atenção a mais ao teu filho?",
    invertida: true,
    opcoes: [
      { emoji: "😅", texto: "Sim, quase em excesso", tipo: "negativa", pontos: 1 },
      { emoji: "🙂", texto: "Na medida certa, conhece-o bem", tipo: "neutra", pontos: 2 },
      { emoji: "🤖", texto: "Pelo contrário, nem sabe quem ele é", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P22",
    sub_dimensao: "capacidade_resposta",
    texto: "Quando levantas um problema, a escola age?",
    invertida: false,
    opcoes: [
      { emoji: "🤝", texto: "Sim, ouvem e resolvem", tipo: "positiva", pontos: 3 },
      { emoji: "📞", texto: "Demoram, mas lá tratam", tipo: "neutra", pontos: 2 },
      { emoji: "🙉", texto: "Ignoram ou desvalorizam", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P23",
    sub_dimensao: "seguranca_convivencia",
    texto: "O recreio é um espaço seguro e divertido?",
    invertida: false,
    opcoes: [
      { emoji: "🌳", texto: "Sim, bom espaço e boa vigilância", tipo: "positiva", pontos: 3 },
      { emoji: "🏀", texto: "Serve, mas podia ser melhor", tipo: "neutra", pontos: 2 },
      { emoji: "💥", texto: "Confuso e mal vigiado", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P24",
    sub_dimensao: "bem_estar_fisico_emocional",
    texto: "Como é que ele chega a casa depois da escola?",
    invertida: false,
    opcoes: [
      { emoji: "🌈", texto: "Com energia e entusiasmado", tipo: "positiva", pontos: 3 },
      { emoji: "😶", texto: "Cansado, mas normal", tipo: "neutra", pontos: 2 },
      { emoji: "😵", texto: "Estourado e irritável todos os dias", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P25",
    sub_dimensao: "aprendizagem_progresso",
    texto: "Quando tem dificuldades, há apoio na escola?",
    invertida: false,
    opcoes: [
      { emoji: "🎯", texto: "Sim, identificam e acompanham", tipo: "positiva", pontos: 3 },
      { emoji: "📋", texto: "Fazem o mínimo", tipo: "neutra", pontos: 2 },
      { emoji: "🤷", texto: "Dizem para resolver em casa", tipo: "negativa", pontos: 1 }
    ]
  }
];

export const segundoTerceiroCicloQuestions: Question[] = [
  {
    id: "P26",
    sub_dimensao: "acompanhamento_vinculo",
    texto: "Com tantos professores, há alguém que o conheça bem?",
    invertida: false,
    opcoes: [
      { emoji: "🤲", texto: "Sim, o DT está presente e atento", tipo: "positiva", pontos: 3 },
      { emoji: "📝", texto: "Mais ou menos, conhecem-no de vista", tipo: "neutra", pontos: 2 },
      { emoji: "👻", texto: "Ninguém faz ideia de quem ele é", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P27",
    sub_dimensao: "clima_social_seguranca",
    texto: "No recreio, como é a socialização?",
    invertida: false,
    opcoes: [
      { emoji: "⚽", texto: "Convivem, jogam, falam entre si", tipo: "positiva", pontos: 3 },
      { emoji: "📱", texto: "Misturam conversa com ecrãs", tipo: "neutra", pontos: 2 },
      { emoji: "🧟", texto: "Cada um no seu telemóvel", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P28",
    sub_dimensao: "clima_social_seguranca",
    texto: "Há situações de exclusão social ou cyberbullying?",
    invertida: false,
    opcoes: [
      { emoji: "🛡️", texto: "Não que eu saiba, ambiente tranquilo", tipo: "positiva", pontos: 3 },
      { emoji: "👀", texto: "Coisas pontuais, mas resolvidas", tipo: "neutra", pontos: 2 },
      { emoji: "💔", texto: "Sim, e afeta-o emocionalmente", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P29",
    sub_dimensao: "condicoes_fisicas",
    texto: "Em que estado estão os balneários e casas de banho?",
    invertida: false,
    opcoes: [
      { emoji: "🚿", texto: "Limpos e funcionais", tipo: "positiva", pontos: 3 },
      { emoji: "😬", texto: "Usáveis, mas pouco cuidados", tipo: "neutra", pontos: 2 },
      { emoji: "🤮", texto: "Evita-os a todo o custo", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P30",
    sub_dimensao: "clima_social_seguranca",
    texto: "Achas que a escola é demasiado controladora com os alunos?",
    invertida: true,
    opcoes: [
      { emoji: "🔐", texto: "Sim, sufoca-os com regras", tipo: "negativa", pontos: 1 },
      { emoji: "⚖️", texto: "Equilibrada, regras justas", tipo: "neutra", pontos: 2 },
      { emoji: "🚩", texto: "Pelo contrário, falta controlo e há más influências", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P31",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Os professores conseguem captar a atenção na aula?",
    invertida: false,
    opcoes: [
      { emoji: "🎓", texto: "Sim, explicam bem e motivam", tipo: "positiva", pontos: 3 },
      { emoji: "📖", texto: "Cumprem, mas sem brilho", tipo: "neutra", pontos: 2 },
      { emoji: "😴", texto: "Despejam matéria e pronto", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P32",
    sub_dimensao: "saude_mental_emocional",
    texto: "A escola compreende a fase da pré-adolescência?",
    invertida: false,
    opcoes: [
      { emoji: "🧠", texto: "Sim, há sensibilidade e diálogo", tipo: "positiva", pontos: 3 },
      { emoji: "😐", texto: "Nem por isso, tratam-nos como crianças", tipo: "neutra", pontos: 2 },
      { emoji: "🚪", texto: "Só castigos e punições", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P33",
    sub_dimensao: "qualidade_pedagogica",
    texto: "Há oferta de atividades fora da sala de aula?",
    invertida: false,
    opcoes: [
      { emoji: "🎭", texto: "Sim, clubes, desporto, projetos", tipo: "positiva", pontos: 3 },
      { emoji: "🏃", texto: "Umas coisas básicas", tipo: "neutra", pontos: 2 },
      { emoji: "🚫", texto: "Praticamente nada", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P34",
    sub_dimensao: "saude_mental_emocional",
    texto: "Fala-se de saúde mental e emoções na escola?",
    invertida: false,
    opcoes: [
      { emoji: "💚", texto: "Sim, há psicólogo e abertura", tipo: "positiva", pontos: 3 },
      { emoji: "🤐", texto: "Raramente, só em crise", tipo: "neutra", pontos: 2 },
      { emoji: "❌", texto: "Tabu, ninguém toca no assunto", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P35",
    sub_dimensao: "acompanhamento_vinculo",
    texto: "Se ele faltar ou se isolar, a escola reage?",
    invertida: false,
    opcoes: [
      { emoji: "👁️", texto: "Sim, contactam-me rapidamente", tipo: "positiva", pontos: 3 },
      { emoji: "📩", texto: "Às vezes, depende do professor", tipo: "neutra", pontos: 2 },
      { emoji: "🦗", texto: "Silêncio total", tipo: "negativa", pontos: 1 }
    ]
  }
];

export const secundarioQuestions: Question[] = [
  {
    id: "P36",
    sub_dimensao: "pressao_academica_burnout",
    texto: "Como descreves a pressão académica que ele sente?",
    invertida: false,
    opcoes: [
      { emoji: "🧘", texto: "Exigente mas saudável", tipo: "positiva", pontos: 3 },
      { emoji: "😬", texto: "Forte, mas gere", tipo: "neutra", pontos: 2 },
      { emoji: "🔥", texto: "Esmagadora, está a afetá-lo", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P37",
    sub_dimensao: "orientacao_futuro",
    texto: "A orientação vocacional ajuda-o a decidir o futuro?",
    invertida: false,
    opcoes: [
      { emoji: "🧭", texto: "Sim, sente-se orientado e informado", tipo: "positiva", pontos: 3 },
      { emoji: "🤔", texto: "Vaga, umas conversas genéricas", tipo: "neutra", pontos: 2 },
      { emoji: "🌫️", texto: "Inexistente, está completamente perdido", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P38",
    sub_dimensao: "seguranca_envolvente",
    texto: "Os arredores da escola são seguros?",
    invertida: false,
    opcoes: [
      { emoji: "🏘️", texto: "Sim, zona tranquila", tipo: "positiva", pontos: 3 },
      { emoji: "👮", texto: "Há episódios, mas pontuais", tipo: "neutra", pontos: 2 },
      { emoji: "🚬", texto: "Problemas sérios à porta da escola", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P39",
    sub_dimensao: "qualidade_docente",
    texto: "Há professores que o inspiram?",
    invertida: false,
    opcoes: [
      { emoji: "🌟", texto: "Sim, fala deles com entusiasmo", tipo: "positiva", pontos: 3 },
      { emoji: "🙂", texto: "Um ou outro, no geral são neutros", tipo: "neutra", pontos: 2 },
      { emoji: "😤", texto: "Nenhum, só debita matéria", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P40",
    sub_dimensao: "pressao_academica_burnout",
    texto: "A preparação para os Exames Nacionais é sólida?",
    invertida: false,
    opcoes: [
      { emoji: "💪", texto: "Sim, sente-se preparado pela escola", tipo: "positiva", pontos: 3 },
      { emoji: "📚", texto: "Razoável, complementa com estudo extra", tipo: "neutra", pontos: 2 },
      { emoji: "😰", texto: "Fraca, tive de recorrer a explicações", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P41",
    sub_dimensao: "pressao_academica_burnout",
    texto: "Achas que a escola lhe dá tempo livre a mais?",
    invertida: true,
    opcoes: [
      { emoji: "🎮", texto: "Sim, podia puxar mais por ele", tipo: "negativa", pontos: 1 },
      { emoji: "⚖️", texto: "Equilíbrio certo entre estudo e descanso", tipo: "neutra", pontos: 2 },
      { emoji: "💀", texto: "Pelo contrário, não tem tempo para respirar", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P42",
    sub_dimensao: "orientacao_futuro",
    texto: "Mostram-lhe caminhos para além da universidade?",
    invertida: false,
    opcoes: [
      { emoji: "🛤️", texto: "Sim, falam de várias opções", tipo: "positiva", pontos: 3 },
      { emoji: "🎓", texto: "Focam-se sobretudo na faculdade", tipo: "neutra", pontos: 2 },
      { emoji: "🤐", texto: "Só existe um caminho: universidade ou nada", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P43",
    sub_dimensao: "saude_mental",
    texto: "Como é que a escola lida com a ansiedade dos alunos?",
    invertida: false,
    opcoes: [
      { emoji: "🤗", texto: "Há apoio real e acessível", tipo: "positiva", pontos: 3 },
      { emoji: "💊", texto: "Reconhecem, mas fazem pouco", tipo: "neutra", pontos: 2 },
      { emoji: "🙈", texto: "Ignoram completamente", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P44",
    sub_dimensao: "qualidade_docente",
    texto: "A turma é um ambiente que puxa para cima?",
    invertida: false,
    opcoes: [
      { emoji: "🚀", texto: "Sim, entreajuda e motivação", tipo: "positiva", pontos: 3 },
      { emoji: "⚖️", texto: "Misto, tem de tudo", tipo: "neutra", pontos: 2 },
      { emoji: "⬇️", texto: "Desmotivação generalizada", tipo: "negativa", pontos: 1 }
    ]
  },
  {
    id: "P45",
    sub_dimensao: "saude_mental",
    texto: "No geral, ele gosta de andar nesta escola?",
    invertida: false,
    opcoes: [
      { emoji: "❤️", texto: "Sim, fala bem e vai com gosto", tipo: "positiva", pontos: 3 },
      { emoji: "😐", texto: "Vai porque tem de ir", tipo: "neutra", pontos: 2 },
      { emoji: "😞", texto: "Conta os dias para sair", tipo: "negativa", pontos: 1 }
    ]
  }
];

// Helper functions para randomização
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function randomizeBlock(questions: Question[]): Question[] {
  // Baralhar as opções de cada pergunta
  const qWithOptionsShuffled = questions.map(q => ({
    ...q,
    opcoes: shuffleArray(q.opcoes)
  }));
  
  // Baralhar a ordem das perguntas
  let shuffledQ = shuffleArray(qWithOptionsShuffled);
  
  // Garantir que a primeira não é invertida
  if (shuffledQ.length > 0 && shuffledQ[0].invertida) {
    // Procurar uma não invertida
    const nonInvertedIdx = shuffledQ.findIndex(q => !q.invertida);
    if (nonInvertedIdx > 0) {
      [shuffledQ[0], shuffledQ[nonInvertedIdx]] = [shuffledQ[nonInvertedIdx], shuffledQ[0]];
    }
  }
  
  return shuffledQ;
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
  
  const npsQuestion: Question = {
    id: "nps_recomendacao",
    sub_dimensao: "nps",
    texto: "Recomendaria esta escola a um familiar ou amigo?",
    invertida: false,
    opcoes: [
      { emoji: "😁", texto: "Sem dúvida, recomendo!", tipo: "positiva", pontos: 3 },
      { emoji: "🤔", texto: "Talvez, depende do que procuram", tipo: "neutra", pontos: 2 },
      { emoji: "😡", texto: "Nunca, não recomendo de todo", tipo: "negativa", pontos: 1 }
    ]
  };

  const blockTransversal = randomizeBlock(transversalQuestions);
  const blockSpecific = randomizeBlock(specific);

  return [...blockTransversal, ...blockSpecific, npsQuestion];
}

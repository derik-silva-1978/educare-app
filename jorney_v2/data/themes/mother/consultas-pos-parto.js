/**
 * @type {{
 *  trail: "mother",
 *  microcard: {
 *      titulo: string,
 *      itens: string[]
 *  },
 *  acaoTexto: string,
 *  acaoAudio: string,
 *  audioIllustration: string,
 *  badge: { id: string, nome: string, icone: string },
 *  extraContent: { titulo: string, url: string }[]
 * }}
 */
export const consultasPosParto = {
    trail: "mother",
    microcard: {
        titulo: "🩺 Preparando-se para a Consulta",
        itens: [
            "Consulta puerperal: 7 a 42 dias pós-parto",
            "Leve uma lista de dúvidas",
            "Fale sobre sua saúde mental (como se sente?)",
            "Discuta a recuperação física (cicatrização, sangramento)",
            "Pergunte sobre amamentação",
            "Converse sobre contracepção e vida sexual",
            "Verifique sua vacinação (dTpa)"
        ]
    },
    acaoTexto: "O acompanhamento pós-parto é essencial para a sua saúde. A **consulta puerperal** (geralmente entre 7 e 42 dias após o parto) é a sua oportunidade de tirar todas as dúvidas. Para otimizar o tempo, **prepare-se levando uma lista de perguntas**. Anote tudo o que te preocupa. O checklist deve incluir: **Saúde Mental:** Como você está se sentindo emocionalmente? Fale sobre qualquer sintoma de tristeza ou ansiedade. **Recuperação Física:** Como está a cicatrização? O sangramento (lóquios)? Sente alguma dor? **Amamentação:** Está com alguma dificuldade? Dor? Preocupação com a produção de leite? **Contracepção:** Quais são as opções seguras para você agora? **Vacinação:** Você tomou a vacina dTpa? Outras vacinas estão em dia? Ser uma parceira ativa no seu cuidado é fundamental. Não saia do consultório com dúvidas.",
    acaoAudio: "TitiNauta agendando sua saúde, mãe! A consulta pós-parto é o seu momento. E pra aproveitar ao máximo, faça uma colinha. Anote suas dúvidas. O que perguntar? Primeiro, como você está se sentindo? De verdade. Sem medo de falar sobre tristeza. Segundo, seu corpo. Como está a cicatrização? O sangramento? Terceiro, amamentação. Alguma dor ou problema? Quarto, futuro. Converse sobre métodos para evitar outra gravidez agora. E quinto, vacinas. Veja se está tudo em dia. Chegue na consulta preparada. Você é a maior especialista em você mesma.",
    audioIllustration: "📝",
    badge: { id: "agenda-saude", nome: "Agenda da Saúde", icone: "🩺" },
    extraContent: [{ titulo: "A Importância do Cuidado Pós-Parto (OMS)", url: "https://www.paho.org/pt/noticias/30-3-2022-oms-pede-atencao-qualidade-para-mulheres-e-recem-nascidos-nas-primeiras-semanas" }, { titulo: "Checklist para a Consulta Pós-Parto", url: "https://www.acog.org/womens-health/faqs/postpartum-checklist" }]
};
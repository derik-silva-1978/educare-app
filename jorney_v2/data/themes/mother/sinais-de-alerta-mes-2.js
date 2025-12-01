
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
export const sinaisDeAlertaMes2 = {
    trail: "mother",
    microcard: {
        titulo: "🔍 Alertas de Saúde Mental Pós-Parto",
        itens: [
            "Tristeza persistente que não melhora",
            "Perda de interesse em coisas que gostava",
            "Sentimentos intensos de culpa ou inutilidade",
            "Ansiedade extrema ou ataques de pânico",
            "Dificuldade de se conectar com o bebê",
            "Pensamentos assustadores ou indesejados"
        ]
    },
    acaoTexto: "Conforme as semanas passam, é importante continuar monitorando sua saúde emocional. O 'Baby Blues' já deveria ter passado. Se você ainda se sente **persistentemente triste, ansiosa ou 'no limite'**, pode ser um sinal de **Depressão ou Ansiedade Pós-Parto**. Preste atenção se você **perdeu o prazer** nas coisas que antes gostava, se sente uma **culpa avassaladora**, ou tem dificuldade de se **conectar com {nome}**. Pensamentos assustadores sobre você ou o bebê, mesmo que você não queira tê-los, também são um sinal de alerta importante. **Isso não é um sinal de fraqueza e não é sua culpa.** São condições médicas tratáveis. O passo mais corajoso é **pedir ajuda** ao seu médico ou a um profissional de saúde mental.",
    acaoAudio: "TitiNauta, vigilante da sua saúde mental. O 'baby blues' já foi. Se a tristeza profunda continua, se a ansiedade te paralisa, se você não sente alegria em nada, isso é um sinal de alerta. Se você se sente culpada por tudo ou tem dificuldade em se conectar com {nome}, preste atenção. E se surgirem pensamentos ruins, que te assustam, não guarde para você. Isso tem nome, não é frescura e tem tratamento. Fale com alguém. Peça ajuda. Cuidar da sua mente é essencial.",
    audioIllustration: "🧠",
    badge: { id: "radar-emocional", nome: "Radar Emocional", icone: "📡" },
    extraContent: [{ titulo: "Mapeamento da Saúde Mental Materna no Brasil", url: "https://exame.com/brasil/pesquisa-inedita-traca-o-mapa-da-saude-mental-materna-no-brasil/" }, { titulo: "Onde Buscar Ajuda Psicológica", url: "https://www.psicologiaviva.com.br/blog/psicologo-gratuito/" }]
};

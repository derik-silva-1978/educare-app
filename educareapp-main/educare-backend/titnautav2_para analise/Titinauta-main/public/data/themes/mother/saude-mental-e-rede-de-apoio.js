
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
export const saudeMentalERedeDeApoio = {
    trail: "mother",
    microcard: {
        titulo: "🧠 Você Importa",
        itens: [
            "Baby blues x depressão",
            "Sinais: tristeza persistente, culpa",
            "Converse com profissionais",
            "Apoio de familiares/amigos",
            "Peça ajuda prática"
        ]
    },
    acaoTexto: "Oscilações são comuns, mas sintomas persistentes exigem avaliação. Fale com a equipe de saúde, compartilhe tarefas e aceite ajuda.",
    acaoAudio: "Pedir ajuda é força. Sua saúde emocional é prioridade para você e para {nome}.",
    audioIllustration: "💜",
    badge: { "id": "equilibrio-mente", "nome": "Equilíbrio da Mente", "icone": "💜" },
    extraContent: [
        { "titulo": "Cuidados em Saúde Mental Pós-parto", "url": "https://example.org/mental2" }
    ]
};

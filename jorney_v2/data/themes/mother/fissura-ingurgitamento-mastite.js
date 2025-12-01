
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
export const fissuraIngurgitamentoMastite = {
    trail: "mother",
    microcard: {
        titulo: "🧊 Protocolo Atual",
        itens: [
            "Pega correta é base",
            "Leite materno para fissuras",
            "Compressa fria para inflamação",
            "Evite massagens vigorosas e calor",
            "Sinais de mastite = avaliação"
        ]
    },
    acaoTexto: "Ajuste de pega resolve a maioria das fissuras. Ingurgitamento melhora com compressas frias e mamadas regulares. Sinais de mastite (dor, vermelhidão, febre) exigem avaliação médica.",
    acaoAudio: "Se doer, revise a pega. Para inchaço, frio ajuda. Febre e área vermelha? Procure atendimento.",
    audioIllustration: "🧊",
    badge: { "id": "amiga-do-peito2", "nome": "Amiga do Peito (Mês 2)", "icone": "🤱" },
    extraContent: [
        { "titulo": "Manejo de Mastite: pontos-chave", "url": "https://example.org/mastite2" }
    ]
};

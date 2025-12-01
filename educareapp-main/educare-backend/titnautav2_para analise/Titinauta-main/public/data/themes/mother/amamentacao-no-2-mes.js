
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
export const amamentacaoNo2Mes = {
    trail: "mother",
    microcard: {
        titulo: "🤱 Ritmo & Conforto",
        itens: [
            "Livre demanda observando sinais",
            "Ajuste de pega se houver dor",
            "Pausa para arrotar",
            "Evite bicos/mamadeiras sem orientação",
            "Rede de apoio ativa"
        ]
    },
    acaoTexto: "Com picos de crescimento, a demanda pode aumentar. Se houver dor, revise pega/posição. Hidrate-se, descanse quando puder e ative sua rede de apoio.",
    acaoAudio: "Sinais de fome, pega confortável e pausas. Se doer, ajuste. Você não está sozinha.",
    audioIllustration: "🤱",
    badge: { "id": "ritmo-de-ouro", "nome": "Ritmo de Ouro", "icone": "🤱" },
    extraContent: [
        { "titulo": "Guia de Amamentação", "url": "https://example.org/amamentacao2" }
    ]
};

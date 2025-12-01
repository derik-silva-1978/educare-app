
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
export const alimentacaoEHidratacao = {
    trail: "mother",
    microcard: {
        titulo: "🥗 Energia que Sustenta",
        itens: [
            "Lanches rápidos (frutas, oleaginosas)",
            "Pratos simples com proteínas",
            "Garrafa de água por perto",
            "Evite dietas restritivas",
            "Planeje compras/quentinhas"
        ]
    },
    acaoTexto: "Nutrientes sustentam energia e a amamentação. Prefira refeições simples e frequentes. Água à mão e planejamento reduzem estresse.",
    acaoAudio: "Nutra-se de forma prática. O simples e constante funciona melhor agora.",
    audioIllustration: "🥤",
    badge: { "id": "combustivel-bom", "nome": "Combustível Bom", "icone": "🥗" },
    extraContent: [
        { "titulo": "Dieta Prática para o Puerpério", "url": "https://example.org/dieta2" }
    ]
};

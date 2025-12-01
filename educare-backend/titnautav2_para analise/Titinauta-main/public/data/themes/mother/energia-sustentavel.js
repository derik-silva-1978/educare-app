
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
export const energiaSustentavel = {
    trail: "mother",
    microcard: {
        titulo: "⚙️ Energia no Dia a Dia",
        itens: [
            "Sonecas curtas quando possível",
            "Garrafa de água por perto",
            "Lanches simples e nutritivos",
            "Caminhada leve (se liberada)",
            "Delegue sem culpa"
        ]
    },
    acaoTexto: "Pequenos hábitos repetidos aumentam a energia: hidratação, lanches fáceis e movimento leve com liberação médica. Delegar é saúde.",
    acaoAudio: "Hidratar, nutrir, mover. O básico bem feito gera energia real.",
    audioIllustration: "⚡",
    badge: { "id": "energia-on", "nome": "Energia ON", "icone": "⚡" },
    extraContent: [
        { "titulo": "Autocuidado no Puerpério", "url": "https://example.org/autocuidado2" }
    ]
};

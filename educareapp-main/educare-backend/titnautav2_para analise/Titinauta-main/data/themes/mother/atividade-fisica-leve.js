
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
export const atividadeFisicaLeve = {
    trail: "mother",
    microcard: {
        titulo: "🚶‍♀️ Volta com Calma",
        itens: [
            "Liberada pelo profissional? Sim",
            "Caminhadas curtas e regulares",
            "Alongamentos leves",
            "Atenção a dor/excesso de sangramento",
            "Evolução progressiva"
        ]
    },
    acaoTexto: "Após liberação, comece com caminhadas curtas e alongamentos. Observe sinais do corpo (dor, sangramento) e evolua devagar.",
    acaoAudio: "Devagar é avançar. Comece leve, ouça seu corpo, aumente aos poucos.",
    audioIllustration: "👟",
    badge: { "id": "movimento-seguro", "nome": "Movimento Seguro", "icone": "👟" },
    extraContent: [
        { "titulo": "Exercícios no Puerpério", "url": "https://example.org/exercicio2" }
    ]
};


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
export const contracepcaoPosParto = {
    trail: "mother",
    microcard: {
        titulo: "🛡️ Planejar com Segurança",
        itens: [
            "Métodos compatíveis com amamentação",
            "Condom, DIU, progestagênicos",
            "Evitar estrogênio inicial",
            "Decida com seu profissional",
            "Combinar método + rotina"
        ]
    },
    acaoTexto: "Avalie métodos seguros na amamentação (barreira, DIU, progestagênicos). O melhor método é o que você consegue usar com regularidade e orientação profissional.",
    acaoAudio: "Planeje com calma. Escolha um método que caiba na sua rotina e combine com seu profissional.",
    audioIllustration: "🛡️",
    badge: { "id": "planejamento-ok", "nome": "Planejamento OK", "icone": "🗓️" },
    extraContent: [
        { "titulo": "Opções Seguras na Amamentação", "url": "https://example.org/contracepcao2" }
    ]
};

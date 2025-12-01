
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
export const sonoDaMae = {
    trail: "mother",
    microcard: {
        titulo: "😴 Recuperar é Cuidar",
        itens: [
            "Sonecas sincronizadas com o bebê",
            "Reduza luz à noite",
            "Tarefas não essenciais podem esperar",
            "Peça revezamento com a rede de apoio",
            "Evite estimulantes à noite"
        ]
    },
    acaoTexto: "Sono em blocos curtos ainda ajuda. Sincronize cochilos com {nome}, reduza estímulos noturnos e aceite ajuda prática.",
    acaoAudio: "Descansar é parte do cuidado. Planeje cochilos e proteja suas noites do excesso de estímulos.",
    audioIllustration: "🌙",
    badge: { "id": "sono-em-dia", "nome": "Sono em Dia", "icone": "😴" },
    extraContent: [
        { "titulo": "Higiene do Sono Pós-parto", "url": "https://example.org/sono_mae2" }
    ]
};

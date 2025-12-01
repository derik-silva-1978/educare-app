/**
 * @type {{
 *  trail: "baby",
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
export const choroEConsolo = {
    trail: "baby",
    microcard: {
        titulo: "🤲 Acolher é Cuidar",
        itens: [
            "Observe sinais de fome e sono",
            "Contato pele a pele",
            "Embalos suaves e voz calma",
            "Pausa para arrotar",
            "Cheque fralda/temperatura"
        ]
    },
    acaoTexto: "O choro comunica necessidades. Verifique fome, sono, fralda, temperatura e desconfortos. Contato pele a pele e embalos suaves ajudam a regular {nome}.",
    acaoAudio: "Respire junto com {nome}. Cheque necessidades básicas e acolha. Consolo é cuidado ativo.",
    audioIllustration: "🤗",
    badge: { "id": "mestre-consolo", "nome": "Mestre do Consolo", "icone": "🤲" },
    extraContent: [
        { "titulo": "Regulação Emocional do RN", "url": "https://example.org/chororegula" }
    ]
};

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
export const estimulosVisuaisEAuditivos = {
    trail: "baby",
    microcard: {
        titulo: "👁️👂 Ver & Ouvir Melhor",
        itens: [
            "Mostre contrastes (preto/branco)",
            "Fale pausadamente e cante",
            "Sons do lar como estímulo",
            "Brinque de acompanhar com o olhar",
            "Evite telas"
        ]
    },
    acaoTexto: "Apresente padrões de alto contraste e mova lentamente para {nome} acompanhar com o olhar. Narre atividades diárias em voz calma e cante. Estímulos naturais do lar já bastam — sem telas.",
    acaoAudio: "Mostre, narre, cante. Olhar segue, ouvido descobre. A casa é um grande laboratório para {nome}.",
    audioIllustration: "🎵",
    badge: { "id": "explorador-sensorial", "nome": "Explorador Sensorial", "icone": "🎵" },
    extraContent: [
        { "titulo": "Estimulação Precoce sem Excesso", "url": "https://example.org/estimulo" }
    ]
};

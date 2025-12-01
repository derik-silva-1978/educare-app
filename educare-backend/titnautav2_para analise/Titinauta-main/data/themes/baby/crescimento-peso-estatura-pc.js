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
export const crescimentoPesoEstaturaPc = {
    trail: "baby",
    microcard: {
        titulo: "📈 Acompanhamento Básico",
        itens: [
            "Registre peso/estatura/PC",
            "Use sempre a mesma balança",
            "Compare com a curva oficial",
            "Olhe a tendência, não um valor isolado",
            "Leve dúvidas ao pediatra"
        ]
    },
    acaoTexto: "Anote medidas e acompanhe tendência nas curvas (peso, estatura, perímetro cefálico). Consistência na medição ajuda na comparação. Discuta dúvidas com o pediatra.",
    acaoAudio: "Curvas contam histórias: registre e observe a linha ao longo do tempo. Qualquer desvio, converse na consulta.",
    audioIllustration: "📊",
    badge: { "id": "guardiao-crescimento", "nome": "Guardião do Crescimento", "icone": "📊" },
    extraContent: [
        { "titulo": "Curvas de Crescimento 0–2 anos", "url": "https://example.org/curvas" }
    ]
};

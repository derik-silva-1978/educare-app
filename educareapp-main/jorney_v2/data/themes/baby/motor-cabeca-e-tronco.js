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
export const motorCabecaETronco = {
    trail: "baby",
    microcard: {
        titulo: "💪 Controle em Progresso",
        itens: [
            "Levantar a cabeça por mais tempo",
            "Sustentar mais no colo vertical",
            "Tummy time com incentivo",
            "Evitar excesso de tempo no bebê-conforto",
            "Reparar simetrias de movimento"
        ]
    },
    acaoTexto: "A sustentação cervical melhora. Dê oportunidades seguras: colo vertical curto, tummy time com brinquedo/voz. Evite longos períodos restritos.",
    acaoAudio: "Mais tempo olhando o mundo erguendo a cabeça! Pratique com segurança e pausas.",
    audioIllustration: "🧠",
    badge: { "id": "tronquinho-forte", "nome": "Tronquinho Forte", "icone": "🧠" },
    extraContent: [
        { "titulo": "Estimulação Motora Segura", "url": "https://example.org/motor2" }
    ]
};

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
export const vacinasDo2Mes = {
    trail: "baby",
    microcard: {
        titulo: "💉 Proteção que Cresce",
        itens: [
            "Pentavalente",
            "VIP (pólio inativada)",
            "Pneumocócica 10",
            "Rotavírus",
            "Leve a Caderneta"
        ]
    },
    acaoTexto: "Mantenha o calendário em dia: Pentavalente, VIP, Pneumocócica 10 e Rotavírus. Reações leves (dor local, febre baixa) são esperadas. Em dúvida ou febre alta persistente, procure orientação.",
    acaoAudio: "É dia de proteção! Caderneta na mão, vacinas em dia. Qualquer reação fora do comum? Fale com o pediatra.",
    audioIllustration: "💉",
    badge: { "id": "escudo-imunidade", "nome": "Escudo da Imunidade", "icone": "🛡️" },
    extraContent: [
        { "titulo": "Calendário Vacinal do 2º Mês", "url": "https://example.org/calendario2" }
    ]
};

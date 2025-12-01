
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
export const redeDeApoioEAlertas = {
    trail: "mother",
    microcard: {
        titulo: "🤝 Quem Te Sustenta",
        itens: [
            "Mapeie quem pode ajudar",
            "Peça tarefas específicas",
            "Sinais de alerta: não adie",
            "Contato do serviço de saúde salvo",
            "Combine plano de cuidado"
        ]
    },
    acaoTexto: "Defina papéis práticos na sua rede (compras, comida, ficar com o bebê). Revise alertas e tenha contatos salvos para agir cedo quando necessário.",
    acaoAudio: "Ajuda combinada vira rotina leve. E alerta reconhecido vira cuidado rápido.",
    audioIllustration: "📞",
    badge: { "id": "time-apoio", "nome": "Time de Apoio", "icone": "🤝" },
    extraContent: [
        { "titulo": "Ativando sua Rede de Apoio", "url": "https://example.org/apoio2" }
    ]
};

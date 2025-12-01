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
export const checklistParaConsulta = {
    trail: "baby",
    microcard: {
        titulo: "🗂️ Pronto para a Consulta",
        itens: [
            "Caderneta da Criança",
            "Registros de peso/estatura/PC",
            "Vacinas do mês 2",
            "Dúvidas anotadas",
            "Relato de rotina (sono, mamadas)"
        ]
    },
    acaoTexto: "Leve a caderneta, os registros e as dúvidas anotadas. Relate como estão sono, mamadas e estímulos. Informação organizada melhora a consulta.",
    acaoAudio: "Caderneta, medidas, vacinas e perguntas. Tudo pronto para um atendimento mais objetivo!",
    audioIllustration: "🩺",
    badge: { "id": "agente-de-saude-familia", "nome": "Agente de Saúde da Família", "icone": "🗂️" },
    extraContent: [
        { "titulo": "Como se Preparar para a Consulta", "url": "https://example.org/consulta2" }
    ]
};

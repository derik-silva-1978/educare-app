
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
export const checklistParaAConsultaMae = {
    trail: "mother",
    microcard: {
        titulo: "🗂️ Organização que Ajuda",
        itens: [
            "Descrever rotina (sono, alimentação, humor)",
            "Relatar dúvidas objetivas",
            "Anotar reações a vacinas do bebê",
            "Discutir contracepção e retorno ao exercício",
            "Sinais de alerta: quando procurar antes"
        ]
    },
    acaoTexto: "Leve anotações sobre rotina, humor, dúvidas e reações do bebê. Alinhe contracepção e atividade física. Revise sinais de alerta (hemorragia intensa, febre alta, dor no peito/falta de ar, dor e inchaço em uma perna).",
    acaoAudio: "Caderneta, anotações e perguntas. Informação organizada torna a consulta mais objetiva e resolutiva.",
    audioIllustration: "🩺",
    badge: { "id": "gestora-saude", "nome": "Gestora da Saúde", "icone": "🗂️" },
    extraContent: [
        { "titulo": "Como se Preparar para a Consulta", "url": "https://example.org/consulta_mae2" }
    ]
};

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
export const rotinaDeSonoDo2Mes = {
    trail: "baby",
    microcard: {
        titulo: "🌙 Rotina Sem Pressa",
        itens: [
            "Ritual noturno breve e previsível",
            "Ambiente escuro e calmo",
            "Sonecas curtas e frequentes",
            "Sempre dormir de barriga para cima",
            "Berço vazio (sem objetos soltos)"
        ]
    },
    acaoTexto: "O sono ainda é irregular, mas já cabe um ritual noturno: banho morno, canção suave, luz baixa e berço. Mantenha as regras do sono seguro e evite associações difíceis (ninar no colo até dormir, por exemplo). Consistência é o superpoder.",
    acaoAudio: "Hora de desacelerar! Repita um pequeno ritual todas as noites. Berço vazio, {nome} de barriga para cima e ambiente calminho. A rotina ensina o corpo a dormir.",
    audioIllustration: "🛌",
    badge: { "id": "guardiao-sono2", "nome": "Guardião do Sono (Mês 2)", "icone": "🌙" },
    extraContent: [
        { "titulo": "Sono Seguro — lembretes essenciais", "url": "https://example.org/sono2" }
    ]
};

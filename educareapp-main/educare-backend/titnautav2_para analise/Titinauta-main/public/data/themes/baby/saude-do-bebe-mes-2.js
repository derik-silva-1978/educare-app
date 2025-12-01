
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
export const saudeDoBebeMes2 = {
    trail: "baby",
    microcard: {
        titulo: "⚕️ Saúde em Foco: Mês 2",
        itens: [
            "Consulta de puericultura de 2 meses",
            "Aplicação das vacinas de 2 meses (Pentavalente, etc.)",
            "Refluxo fisiológico é comum e normal",
            "Cólicas podem atingir o pico nesta fase",
            "Observe o cocô: a cor e consistência podem variar",
            "Continue atento aos sinais de alerta"
        ]
    },
    acaoTexto: "O segundo mês traz marcos importantes na saúde de {nome}. A **consulta de 2 meses** com o pediatra é fundamental para avaliar o ganho de peso, o desenvolvimento e tirar dúvidas. É também o momento da primeira grande rodada de **vacinas**, que protegerão {nome} de doenças graves. Prepare-se, pois elas podem causar reações leves. Dois temas comuns nesta fase são **refluxo e cólicas**. O refluxo fisiológico (pequenas golfadas) é normal. Já as cólicas podem ser intensas; massagens e paciência ajudam. A aparência das **fezes** em bebês amamentados pode variar muito (amarelo, verde, líquido), o que geralmente é normal. Continue sempre de olho nos **sinais de alerta** que você já aprendeu.",
    acaoAudio: "TitiNauta no check-up de 2 meses! Prepare a caderneta! Temos consulta com o pediatra para ver o crescimento e o desenvolvimento. E temos vacinas! Elas são um escudo poderoso, mas podem dar uma reaçãozinha. Fique tranquila. Cólicas e golfadas? Super comuns nessa fase. Massagens na barriguinha de {nome} podem ajudar. E não se assuste com a cor do cocô, ela pode mudar bastante. O mais importante é manter a rotina de cuidados e ficar de olho em qualquer sinal diferente. Saúde em primeiro lugar!",
    audioIllustration: "💉",
    badge: { id: "guardiao-da-saude", nome: "Guardião da Saúde", icone: "⚕️" },
    extraContent: [{ titulo: "Calendário de Vacinação da Criança (SBP)", url: "https://www.sbp.com.br/fileadmin/user_upload/23223c-DocCient-Calendario_Vacinacao_2024.pdf" }, { titulo: "Cólicas do Lactente", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/desenvolvimento/colicas-do-lactente/" }]
};

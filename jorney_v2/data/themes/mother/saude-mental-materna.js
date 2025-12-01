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
export const saudeMentalMaterna = {
    trail: "mother",
    microcard: {
        titulo: "💜 Saúde Mental no Puerpério",
        itens: [
            "**Baby Blues:** comum, transitório (até 2 sem), choro fácil.",
            "**Depressão Pós-Parto (DPP):** tristeza profunda, persistente (>2 sem), apatia.",
            "**Psicose Pós-Parto:** emergência rara, confusão, delírios.",
            "Não é sua culpa!",
            "Converse sobre seus sentimentos",
            "DPP tem tratamento eficaz"
        ]
    },
    acaoTexto: "Sua saúde mental é tão importante quanto a física. É crucial entender o espectro dos transtornos de humor no pós-parto. O **'Baby Blues'** é uma reação emocional comum, afetando até 85% das mulheres. Caracteriza-se por choro fácil e sensibilidade, mas **resolve-se sozinho em até duas semanas**. Já a **Depressão Pós-Parto (DPP)** é uma condição clínica mais grave e persistente. Os sinais de alerta são tristeza profunda que **não passa após duas semanas**, perda de prazer nas atividades, culpa excessiva e, em casos graves, pensamentos sobre se machucar. **DPP não é frescura e tem tratamento**. A forma mais rara e grave é a **Psicose Pós-Parto**, uma emergência médica com início súbito, confusão mental e delírios. Se você se sentir persistentemente triste, **converse com sua rede de apoio e procure ajuda profissional**. Cuidar de você é o melhor presente que você pode dar a {nome}.",
    acaoAudio: "TitiNauta aqui para um papo sério e necessário sobre sua saúde mental. Vamos diferenciar. 'Baby Blues': chorar por tudo, se sentir super sensível. É normal, passa em até duas semanas. Depressão Pós-Parto: a tristeza não vai embora, você perde o interesse nas coisas, se sente culpada. Se isso durar mais de duas semanas, não é mais 'Baby Blues'. É hora de procurar ajuda. E existe tratamento! Psicose Pós-Parto: é raro, mas é uma emergência. Confusão, ver ou ouvir coisas. Nesse caso, é hospital na hora. O mais importante: não é sua culpa. Fale sobre o que sente. Peça ajuda. Você não está sozinha.",
    audioIllustration: "💬",
    badge: { id: "autocuidado", nome: "Mestre do Autocuidado", icone: "💜" },
    extraContent: [{ titulo: "Entendendo a Depressão Pós-Parto (MS)", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/depressao-pos-parto" }, { titulo: "CVV - Centro de Valorização da Vida (Ligue 188)", url: "https://www.cvv.org.br/" }]
};
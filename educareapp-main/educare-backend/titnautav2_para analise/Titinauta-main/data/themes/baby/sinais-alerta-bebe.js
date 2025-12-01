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
export const sinaisAlertaBebe = {
    trail: "baby",
    microcard: {
        titulo: "⚠️ Sinais de Alerta no Bebê: Ação Rápida!",
        itens: ["Febre (>37.8°C) ou hipotermia (<36°C)", "Respiração rápida ou com esforço", "Pele amarelada que piora", "Recusa persistente para mamar", "Menos de 6 fraldas de xixi em 24h", "Choro inconsolável ou muito fraco", "Moleira funda (afundada) ou estufada (abaulada)", "Vômitos em jato ou convulsões"]
    },
    acaoTexto: "**Confie na sua intuição.** Se algo parece errado com {nome}, é melhor pecar pelo excesso de cuidado. No recém-nascido, quadros podem evoluir rapidamente. **Procure um serviço de emergência imediatamente** se notar: **Temperatura:** febre acima de 37.8°C ou hipotermia abaixo de 36°C. **Respiração:** rápida demais (mais de 60 por minuto), com esforço (afundando a costela) ou pausas longas. **Hidratação:** recusa persistente para mamar, vômitos em jato ou menos de 6 fraldas molhadas em 24 horas. **Estado geral:** muito irritado e inconsolável, ou muito 'molinho' e sonolento, difícil de acordar. **Pele:** cor amarelada que piora e se espalha para a barriga e pernas, ou pele pálida/azulada. **Moleira:** visivelmente funda (sinal de desidratação) ou estufada e tensa. Conhecer esses sinais é uma ferramenta poderosa para proteger {nome}.",
    acaoAudio: "TitiNauta em modo de alerta máximo! Sua intuição de mãe é poderosa, confie nela. Se {nome} tiver febre acima de 37.8 ou temperatura abaixo de 36, é emergência. Se a respiração estiver muito rápida ou com esforço, é emergência. Se a pele amarelinha chegar na barriga, ou se {pronome} recusar o peito várias vezes e fizer pouco xixi, procure ajuda. Se {nome} estiver muito, muito irritado ou molinho demais, difícil de acordar, também é um alerta. E a moleira, se estiver funda ou estufada, corra para o hospital. Na dúvida, sempre procure um médico. Não hesite!",
    audioIllustration: "🚨",
    badge: { id: "vigilante-bebe", nome: "Vigilante do Bebê", icone: "👁️" },
    extraContent: [{ titulo: "Quando Procurar o Pediatra (SBP)", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/cuidados-com-o-bebe/quando-procurar-o-pediatra/" }, { titulo: "Entendendo a Icterícia Neonatal", url: "https://www.msdmanuals.com/pt/casa/problemas-de-sa%C3%BAde-infantil/dist%C3%BArbios-hep%C3%A1ticos-e-da-ves%C3%ADcula-biliar-em-rec%C3%A9m-nascidos/icter%C3%ADcia-no-rec%C3%A9m-nascido" }]
};
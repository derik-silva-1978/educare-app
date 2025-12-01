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
export const prevencaoInfeccoes = {
    trail: "baby",
    microcard: { titulo: "🦠 Escudo Contra Germes", itens: ["Lavar as mãos é a regra nº 1", "Álcool em gel 70% na falta de água", "Visitas: poucas, rápidas e saudáveis", "Sem beijos no rosto ou nas mãos", "Evitar locais fechados e aglomerados", "Manter vacinas em dia (bebê e cuidadores)", "Limpar superfícies e brinquedos", "Animais de estimação supervisionados"] },
    acaoTexto: "O sistema imunológico de {nome} é novo e precisa da sua proteção. A medida **mais importante e eficaz** para prevenir infecções é a **higienização das mãos**. Lave com água e sabão antes de pegar o bebê, após trocar fraldas e sempre que chegar da rua. Nas primeiras semanas, **limite o número de visitas**. Peça que os visitantes estejam saudáveis, lavem as mãos ao chegar e **evitem beijar o rosto ou as mãos de {nome}**. Evite levar {pronome} a locais fechados e com muita gente, como shoppings ou supermercados. Manter o **calendário vacinal em dia** é crucial. Além das vacinas de {nome}, os cuidadores próximos devem estar com as suas atualizadas (gripe, coqueluche). Com essas camadas de proteção, você cria um ambiente muito mais seguro para {nome} se desenvolver.",
    acaoAudio: "TitiNauta ativando o escudo protetor {preposicao} {nome}! Sua arma mais poderosa? Água e sabão! Lave as mãos o tempo todo. Antes de pegar o bebê, depois de ir ao banheiro, sempre. Visitas? No primeiro mês, quanto menos, melhor. E quem vier, tem que estar 100% saudável e lavar as mãos na hora. Beijos? Só no pezinho! Rosto e mãos são proibidos. Evite lugares com muita gente. O sistema de defesa de {nome} ainda está aprendendo. E a lição de casa mais importante: vacinas em dia! As suas e as {preposicao} {nome}. Pronto! Bebê protegido.",
    audioIllustration: "🛡️",
    badge: { id: "escudo-imunologico", nome: "Escudo Imunológico", icone: "🦠" },
    extraContent: [{ titulo: "Calendário Vacinal SBP", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/vacinacao/" }, { titulo: "Técnica de Lavagem das Mãos (Anvisa)", url: "https://www.youtube.com/watch?v=k3k-_a-p44I" }]
};
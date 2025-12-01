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
export const cotoUmbilical = {
    trail: "baby",
    microcard: {
        titulo: "🛡️ Cuidados com o Coto Umbilical",
        itens: ["Limpar com álcool 70% a cada troca", "Levante o coto para limpar a base", "Manter a área seca e arejada", "Dobre a fralda para baixo", "Não usar faixas ou moedas", "Sinais de infecção: vermelhidão, pus", "Cai naturalmente em 7-21 dias", "Não tenha medo de limpar!"]
    },
    acaoTexto: "O coto umbilical é a porta de entrada para o umbigo de {nome} e precisa de cuidados para prevenir infecções até cair. A recomendação é simples e eficaz: **limpe a base do coto com álcool a 70%** a cada troca de fralda. Use uma haste de algodão, levante delicadamente o coto e limpe bem a junção com a pele da barriga. **Não tenha medo de limpar**, o procedimento não dói. O objetivo é remover qualquer secreção e acelerar a secagem. Para manter a área arejada, **dobre a parte da frente da fralda para baixo**, deixando o coto exposto. **Nunca use faixas, moedas ou qualquer curativo fechado**. Fique de olho em sinais de alerta como **vermelhidão na pele ao redor, inchaço, secreção com mau cheiro (pus) ou febre**. Se notar algum desses, procure o pediatra. Com esses cuidados, o coto cairá sozinho e de forma segura.",
    acaoAudio: "TitiNauta na missão Coto Seguro! É mais simples do que parece. A cada troca de fralda, pegue uma haste de algodão com álcool 70%. Levante o coto com cuidado e limpe bem lá na base, onde ele gruda na barriguinha. Pode limpar sem medo, não dói! A fralda? Dobre a parte da frente pra baixo, deixando o coto pra fora, respirando. Nada de faixa, moeda ou curativo, ok? Se a pele em volta ficar vermelha, inchada ou sair pus, fale com o pediatra. Seguindo esses passos, o umbigo de {nome} vai cicatrizar direitinho.",
    audioIllustration: "👶",
    badge: { id: "defensor-coto", nome: "Defensor do Coto", icone: "🛡️" },
    extraContent: [{ titulo: "Cuidados com o Recém-Nascido (MS)", url: "https://bvsms.saude.gov.br/bvs/publicacoes/atencao_saude_recem_nascido_v1.pdf" }, { titulo: "Onfalite: Sinais de Infecção Umbilical", url: "https://www.msdmanuals.com/pt/casa/problemas-de-sa%C3%BAde-infantil/problemas-do-trato-digestivo-em-rec%C3%A9m-nascidos/onfalite" }]
};
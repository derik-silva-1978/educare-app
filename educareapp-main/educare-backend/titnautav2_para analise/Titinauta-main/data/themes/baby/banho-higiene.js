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
export const banhoHigiene = {
    trail: "baby",
    microcard: {
        titulo: "🛁 Banho Seguro e Confortável",
        itens: ["Prepare tudo ANTES de começar", "Água morna (36-37°C)", "Ambiente sem corrente de ar", "Segure o bebê com firmeza", "Comece pelo rosto, sem sabão", "Limpe da frente para trás (meninas)", "Banho rápido (5-10min)", "Seque bem todas as dobrinhas"]
    },
    acaoTexto: "O banho de {nome} pode ser um ritual relaxante. A chave é a **preparação**. Separe toalha, fralda, roupa e sabonete neutro **ANTES** de pegar o bebê. A água deve estar **morna (entre 36-37°C)**, teste com o cotovelo ou a parte interna do pulso. O ambiente deve ser aquecido e **sem correntes de ar**. Durante todo o banho, segure {nome} com **firmeza**, apoiando a cabeça e o pescoço com seu antebraço e mão. Comece lavando o rosto apenas com água. Use sabonete líquido neutro 'da cabeça aos pés' no corpo, deixando a área genital por último. Em meninas, limpe sempre **da frente para trás**. O banho deve ser **rápido (5-10 minutos)** para evitar que {nome} perca calor. **NUNCA deixe o bebê sozinho na banheira**, nem por um instante. Ao terminar, enrole-o na toalha e seque cuidadosamente cada dobrinha para prevenir assaduras.",
    acaoAudio: "TitiNauta aqui para o banho perfeito {preposicao} {nome}! Segurança em primeiro lugar. A regra de ouro: separe TUDO antes. Toalha, fralda, roupa, sabonete. Depois, a água: morninha, entre 36 e 37 graus. Teste com o cotovelo. Feche portas e janelas. Segure o bebê com firmeza, apoiando bem a cabeça. Lave o rostinho só com água. Depois o corpo, com sabonete neutro. Deixe os genitais por último. E o mais importante: seus olhos não saem {preposicao} {nome} por nenhum segundo. O banho é rápido, 5 minutinhos. Depois, seque bem cada dobrinha. Pronto! Bebê limpo, seguro e relaxado.",
    audioIllustration: "🛁",
    badge: { id: "banho-seguro", nome: "Mestre do Banho", icone: "🛁" },
    extraContent: [{ titulo: "Passo a Passo do Banho (SBP)", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/cuidados-com-o-bebe/higiene-oral-e-corporal/" }, { titulo: "Cuidados com a Pele do Bebê", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/cuidados-com-o-bebe/cuidados-com-a-pele/" }]
};
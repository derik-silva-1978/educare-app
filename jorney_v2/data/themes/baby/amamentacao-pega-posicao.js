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
export const amamentacaoPegaPosicao = {
    trail: "baby",
    microcard: {
        titulo: "🍼 Pega e Posição Correta",
        itens: ["Bebê de frente para a mãe", "Barriga com barriga", "Boca bem aberta (bocejo)", "Lábios virados para fora", "Queixo tocando a mama", "Nariz livre para respirar", "Mais aréola visível acima", "Sucção lenta e profunda, sem dor"]
    },
    acaoTexto: "A **pega correta** é o segredo para uma amamentação de sucesso, sem dor e com ótima transferência de leite. A posição **'barriga com barriga'** é fundamental: o corpo de {nome} deve estar totalmente virado para o seu. Espere {pronome} abrir uma **boca bem grande**, como se fosse bocejar, para então trazê-lo à mama. {nome} precisa abocanhar **grande parte da aréola**, não apenas o mamilo. Observe os lábios: eles devem estar **virados para fora**, como uma 'boca de peixinho'. O queixo de {nome} deve tocar a mama, e o nariz deve ficar livre. Uma amamentação correta **não dói**. Se sentir dor, é um sinal de que a pega precisa ser ajustada. Interrompa suavemente a sucção com o dedo mínimo no canto da boca do bebê e recomece. Lembre-se: paciência e prática fazem a perfeição.",
    acaoAudio: "TitiNauta na área para o sucesso da amamentação! A dica de ouro é a pega correta. Posição: barriga com barriga, o corpinho {preposicao} {nome} todo virado pra você. Ação: espere aquela boca de leão, bem aberta, e só então leve o bebê ao peito. Verificação: {nome} tem que pegar mais aréola do que bico. Os lábios ficam virados pra fora, tipo peixinho. O queixo toca a mama. O mais importante: não pode doer! Se doer, a pega está errada. Respire fundo, use o dedinho mindinho para soltar e tente de novo. Vocês vão encontrar o jeito certo juntos. Quer ver posições diferentes? Confira o conteúdo extra!",
    audioIllustration: "🤱",
    badge: { id: "pega-perfeita", nome: "Pega Perfeita", icone: "🍼" },
    extraContent: [{ titulo: "Posições para Amamentar (Vídeo)", url: "https://www.youtube.com/watch?v=f4a_3-d-p-4" }, { titulo: "Guia de Amamentação (MS)", url: "https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_crianca_brasileira_menor_2_anos.pdf" }]
};

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
export const retornoAoTrabalhoPlanejamento = {
    trail: "mother",
    microcard: {
        titulo: "💼 Planejando o Retorno ao Trabalho",
        itens: [
            "Comece a pensar no retorno com antecedência",
            "Converse com seu empregador sobre seus direitos",
            "Se for amamentar, planeje a ordenha e o armazenamento",
            "Pesquise opções de cuidadores ou creches",
            "Comece a adaptação do bebê aos poucos",
            "Planejar reduz a ansiedade da separação"
        ]
    },
    acaoTexto: "Embora ainda pareça distante, começar a pensar no **retorno ao trabalho** agora pode aliviar muito a ansiedade futura. **Conheça seus direitos:** informe-se sobre a duração da sua licença-maternidade e os direitos de pausas para amamentação. **Amamentação:** se deseja continuar amamentando, comece a pesquisar sobre bombas de extração de leite e técnicas de armazenamento. Você pode começar a criar um pequeno estoque de leite congelado. **Cuidadores:** comece a pesquisar e visitar opções de creches ou a conversar com possíveis cuidadores. **Adaptação:** quando estiver mais perto da data, comece a deixar {nome} com o futuro cuidador por curtos períodos. Planejar com calma permite que você tome as melhores decisões para você e sua família.",
    acaoAudio: "TitiNauta, seu consultor de carreira! A volta ao trabalho parece longe, mas planejar agora evita o estresse depois. Primeiro passo: conheça seus direitos, como a licença e pausas para amamentar. Quer continuar amamentando? Comece a pesquisar sobre bombinhas e como guardar o leite. Segundo passo: quem vai cuidar de {nome}? Pesquise creches, converse com a família. Sem pressa. Planejar essa transição com calma deixa tudo mais leve para você e para o bebê.",
    audioIllustration: "🏢",
    badge: { id: "planejadora-chefe", nome: "Planejadora Chefe", icone: "💼" },
    extraContent: [{ titulo: "Direitos da Mãe Trabalhadora (Lei)", url: "https://www.tst.jus.br/web/guest/noticias/-/asset_publisher/89Dk/content/mae-trabalhadora-conheca-seus-direitos" }, { titulo: "Como armazenar o leite materno", url: "https://www.prematuridade.com/tudo-sobre-o-armazenamento-de-leite-materno" }]
};

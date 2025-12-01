
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
export const brincadeirasEEstimulos = {
    trail: "baby",
    microcard: {
        titulo: "🎲 Brincar é Aprender",
        itens: [
            "O melhor brinquedo é o seu rosto",
            "Use objetos com cores contrastantes (preto e branco)",
            "Móbiles coloridos para estimular a visão",
            "Chocalhos leves para a audição",
            "Cante e dance com o bebê no colo",
            "A simplicidade é a chave nesta fase"
        ]
    },
    acaoTexto: "Brincar com {nome} é a forma mais poderosa de estimular o desenvolvimento. Nesta fase, **o brinquedo favorito de {nome} é você!** Seu rosto, suas expressões e sua voz são os estímulos mais ricos. **Visão:** a visão de {nome} ainda está se desenvolvendo. {pronome} enxerga melhor objetos a 20-30 cm de distância e é atraído por **alto contraste**. Mostre livros e cartões em preto e branco. Um móbile colorido sobre o berço também é um ótimo estímulo. **Audição:** Chocalhos leves e com sons suaves são ideais. Cante músicas, mude o tom da sua voz. **Tato:** Ofereça brinquedos com diferentes texturas para {pronome} sentir. Brincar não precisa ser complicado. Alguns minutos de interação focada valem mais que qualquer brinquedo caro.",
    acaoAudio: "TitiNauta na brinquedoteca! Qual o melhor brinquedo para {nome} agora? Você! Seu rosto, sua voz. Mas se quiser variar, aqui vão umas dicas. Para os olhos: coisas em preto e branco chamam mais atenção. Um móbile colorido também é show! Para os ouvidos: chocalhos com som suave e muita música. Para o tato: paninhos com texturas diferentes. Mas lembre-se, a melhor brincadeira é a sua interação. Cantar, conversar e fazer careta é o que mais ensina e diverte.",
    audioIllustration: "🎨",
    badge: { id: "mestre-brincante", nome: "Mestre Brincante", icone: "🎲" },
    extraContent: [{ titulo: "Brincar: o alimento do cérebro", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/desenvolvimento/brincar-o-alimento-do-cerebro/" }]
};

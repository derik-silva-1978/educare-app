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
export const prevencaoDeEngasgos = {
    trail: "baby",
    microcard: {
        titulo: "👼 Prevenção e Ação: Engasgos",
        itens: [
            "Alimente o bebê em posição semi-inclinada",
            "NUNCA alimente com o bebê deitado",
            "Faça pausas e ajude a arrotar",
            "Sinais de engasgo: tosse fraca, chiado, pele azulada",
            "Manobra: 5 tapas nas costas + 5 compressões no peito",
            "Mantenha a calma e peça ajuda (ligue 192)"
        ]
    },
    acaoTexto: "Saber como prevenir e agir em caso de engasgo é uma das habilidades mais importantes que você pode ter. **Prevenção:** Sempre alimente {nome} em uma **posição semi-inclinada**, nunca completamente deitado. Faça pausas durante a mamada para que {pronome} possa arrotar. **Reconhecendo os Sinais:** O bebê engasgado não consegue chorar ou tossir direito, pode fazer um chiado e a pele pode ficar avermelhada ou azulada. **Ação Rápida (Manobra de Desengasgo):** 1. Coloque o bebê de bruços sobre seu antebraço, com a cabeça mais baixa que o corpo. 2. Com a base da sua outra mão, dê **5 tapas firmes** no meio das costas, entre as escápulas. 3. Vire o bebê de barriga para cima, ainda no seu antebraço. 4. Com dois dedos, faça **5 compressões rápidas** no centro do peito, na linha dos mamilos. 5. Alterne entre os 5 tapas e as 5 compressões até o objeto sair. Enquanto faz a manobra, peça para alguém **ligar para a emergência (192)**.",
    acaoAudio: "TitiNauta aqui para uma lição que salva vidas: engasgo. Primeiro, a prevenção: sempre alimente {nome} sentadinho, nunca deitado. E ajude a arrotar. Agora, se o engasgo acontecer, o que fazer? Se o bebê não consegue tossir, você age. Coloque o bebê de bruços no seu braço, cabeça para baixo. Dê 5 tapas firmes no meio das costas. Vire o bebê de barriga pra cima no outro braço. Faça 5 compressões no meio do peito com dois dedos. Repita: 5 tapas nas costas, 5 compressões no peito. E peça pra alguém ligar para o 192. Mantenha a calma. Você consegue.",
    audioIllustration: "🙏",
    badge: { id: "anjo-guarda", nome: "Anjo da Guarda", icone: "👼" },
    extraContent: [{ titulo: "Manobra de Desengasgo em Bebês (Vídeo)", url: "https://www.youtube.com/watch?v=lJ72S2a4YkI" }, { titulo: "Primeiros Socorros (Cruz Vermelha)", url: "https://www.cruzvermelha.org.br/primeiros-socorros/" }]
};
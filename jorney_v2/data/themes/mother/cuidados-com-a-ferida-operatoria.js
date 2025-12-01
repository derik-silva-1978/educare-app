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
export const cuidadosComAFeridaOperatoria = {
    trail: "mother",
    microcard: { titulo: "🩹 Cuidado com a Cicatrização", itens: ["Lavar com água e sabão neutro", "Secar bem, sem esfregar", "Manter a área limpa e seca", "Usar roupas folgadas e de algodão", "Observar sinais de infecção", "Vermelhidão, pus ou dor piorando = médico", "Evitar esforço físico pesado", "Para dor perineal: banho de assento"] },
    acaoTexto: "Sua recuperação física é uma prioridade. **Se você fez cesariana:** lave a incisão delicadamente com água e sabão no banho, seque com uma toalha limpa dando batidinhas, sem esfregar. Mantenha a área seca e arejada. **Se teve parto vaginal com laceração:** a higiene é a mesma. Lave a região com água após urinar e evacuar. Banhos de assento com água morna podem aliviar o desconforto. Para ambos os casos, fique atenta a **sinais de infecção:** vermelhidão que se espalha, calor excessivo no local, inchaço, secreção amarelada (pus) ou dor que piora com o tempo. Se notar algo, **fale com seu médico**. **Evite carregar peso** (qualquer coisa mais pesada que o bebê) e fazer esforço abdominal. Respeite os limites do seu corpo.",
    acaoAudio: "TitiNauta cuidando de você agora. Vamos falar da sua cicatrização. Seja cesárea ou parto normal, a regra é: limpeza e secura. Lave o local dos pontos com água e sabão neutro, todo dia no banho. Depois, seque muito bem, com batidinhas leves. Deixe a área respirar, use roupas folgadas. Fique de olho: se ficar vermelho, inchado, quente ou sair secreção, ligue para o seu médico. Nada de pegar peso, hein? Só o bebê! Respeite seu tempo. Cuidar de você é cuidar {preposicao} {nome} também.",
    audioIllustration: "🩹",
    badge: { id: "recuperacao-ativa", nome: "Recuperação Ativa", icone: "🩹" },
    extraContent: [{ titulo: "Recuperação Pós-Cesárea", url: "https://www.msdmanuals.com/pt/casa/problemas-de-sa%C3%BAde-feminina/o-per%C3%ADodo-p%C3%B3s-parto/cesariana" }, { titulo: "Cuidados com Laceração Perineal", url: "https://www.msdmanuals.com/pt/profissional/ginecologia-e-obstetr%C3%ADcia/anormalidades-e-complica%C3%A7%C3%B5es-do-trabalho-de-parto-e-parto/lacera%C3%A7%C3%A3o-perineal" }]
};
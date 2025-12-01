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
export const ambienteSeguro = {
    trail: "baby",
    microcard: {
        titulo: "🏠 Casa Segura: Missão Zero Acidentes",
        itens: [
            "Nunca deixe o bebê sozinho em locais altos",
            "Use o 'teste do rolo de papel' para objetos pequenos",
            "Verifique a temperatura da água do banho (36-37°C)",
            "Nunca segure o bebê enquanto cozinha",
            "Supervisão constante perto de água",
            "Medicamentos e produtos de limpeza trancados"
        ]
    },
    acaoTexto: "Sua casa é o primeiro universo de {nome}, e torná-lo seguro é a maior prova de amor. **Quedas:** A regra de ouro é **nunca, nem por um segundo, deixar {nome} sozinho** em trocadores, camas ou sofás. A capacidade de rolar surge de repente. **Asfixia:** Mantenha objetos pequenos (moedas, botões, tampas) fora do alcance. Use a regra do **'teste do rolo de papel higiênico'**: se um objeto passa por dentro, é perigoso. **Queimaduras:** A pele de {nome} é muito sensível. Verifique sempre a temperatura da água do banho (36-37°C) com o cotovelo ou termômetro. Na cozinha, use as bocas de trás do fogão e **nunca segure o bebê no colo** ao manusear líquidos quentes. **Afogamento:** O afogamento é rápido e silencioso. **Nunca deixe {nome} sozinho na banheira**, nem para pegar uma toalha. Baldes e bacias devem estar sempre vazios. **Intoxicação:** Guarde **todos os medicamentos e produtos de limpeza** em armários altos e trancados. Uma casa segura permite que {nome} explore e se desenvolva livre de perigos.",
    acaoAudio: "TitiNauta aqui com a missão Casa Segura para {nome}. Quedas: nunca deixe o bebê sozinho em lugares altos, como a cama ou o trocador. Nem por um segundo! Asfixia: objetos pequenos, longe! Se passar no rolo de papel higiênico, é um risco. Queimaduras: água do banho sempre morna, teste com o cotovelo. E jamais segure o bebê enquanto mexe com coisas quentes na cozinha. Afogamento: na banheira, sua atenção é 100%. Nada de celular ou sair de perto. Intoxicação: remédios e produtos de limpeza bem trancados e no alto. Com essas regras, a casa se torna um porto seguro para a exploração {preposicao} {nome}.",
    audioIllustration: "🛡️",
    badge: { id: "ambiente-protetor", nome: "Ambiente Protetor", icone: "🏠" },
    extraContent: [{ titulo: "ONG Criança Segura Brasil", url: "https://criancasegura.org.br/" }, { titulo: "Guia de Prevenção de Acidentes (SBP)", url: "https://www.sbp.com.br/especiais/pediatria-para-familias/prevencao-de-acidentes/" }]
};
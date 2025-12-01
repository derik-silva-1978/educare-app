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
export const saudeSexualEContracepcao = {
    trail: "mother",
    microcard: {
        titulo: "🗓️ Saúde Sexual e Planejamento",
        itens: [
            "Retomada da vida sexual: sem prazo fixo, decisão pessoal",
            "É normal sentir desconforto ou falta de desejo",
            "Lubrificantes à base de água podem ajudar",
            "Planejamento contraceptivo é crucial",
            "Opções seguras na amamentação: minipílula, DIU, implante",
            "Vacina dTpa no puerpério é URGENTE se não tomou na gestação"
        ]
    },
    acaoTexto: "O puerpério é um momento de grandes mudanças, inclusive na sua vida sexual e reprodutiva. **Retomada da Vida Sexual:** Não existe um 'prazo' fixo. A decisão é pessoal e deve ser baseada em três fatores: cicatrização física completa, conforto emocional e desejo. É normal a libido estar diminuída. Converse abertamente com seu parceiro(a). **Contracepção:** O retorno da fertilidade é imprevisível. É crucial discutir métodos contraceptivos com seu médico. Durante a amamentação, são seguras as opções **apenas com progestagênio** (minipílula, implante, injeção trimestral) e os **DIUs** (hormonal ou de cobre). Métodos com estrogênio devem ser evitados nas primeiras 4 a 6 semanas. **Vacinação:** O puerpério é uma janela de oportunidade para se proteger e proteger {nome}. Se você não tomou a **vacina dTpa (tríplice bacteriana)** durante a gestação, deve tomá-la o mais rápido possível.",
    acaoAudio: "TitiNauta falando sobre intimidade e planejamento. Retomar a vida sexual? Só quando você se sentir pronta. Física e emocionalmente. Sem pressão. E é normal o desejo demorar a voltar. Converse com seu parceiro. Sobre o futuro: evitar uma nova gravidez agora é importante. Existem pílulas, DIUs e outros métodos seguros para quem amamenta. Fale com seu médico para escolher o melhor pra você. E por último, vacinas! Se não tomou a vacina da coqueluche na gravidez, tome agora. É uma proteção extra para {nome} que passa pelo seu leite.",
    audioIllustration: "💞",
    badge: { id: "planejamento-consciente", nome: "Planejamento Consciente", icone: "🗓️" },
    extraContent: [{ titulo: "Contracepção no Pós-Parto (FEBRASGO)", url: "https://www.febrasgo.org.br/pt/noticias/item/130-anticoncepcao-no-puerperio" }, { titulo: "Vacinação da Puérpera (SBIm)", url: "https://sbim.org.br/images/calendarios/calend-sbim-gestante.pdf" }]
};
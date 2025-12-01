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
export const consultasETestesDoBebe = {
    trail: "baby",
    microcard: {
        titulo: "🛂 Saúde em Dia: Consultas e Testes",
        itens: [
            "Primeira consulta: 3º ao 5º dia de vida",
            "Teste do Pezinho: entre o 3º e 5º dia",
            "Teste do Olhinho (reflexo vermelho)",
            "Teste do Coraçãozinho (oximetria)",
            "Teste da Orelhinha (audição)",
            "Teste da Linguinha",
            "Leve a Caderneta da Criança em TODAS as consultas"
        ]
    },
    acaoTexto: "O acompanhamento da saúde de {nome} começa logo nos primeiros dias. A **primeira consulta com o pediatra** deve ocorrer idealmente entre o 3º e o 5º dia de vida, para avaliar o peso, a amamentação e a icterícia. Além disso, uma série de **testes de triagem neonatal** são fundamentais para detectar doenças precocemente. O **Teste do Pezinho** coleta gotinhas de sangue para identificar diversas condições. O **Teste do Olhinho**, do **Coraçãozinho**, da **Orelhinha** e da **Linguinha** são exames rápidos e indolores que previnem sequelas graves. A **Caderneta da Criança**, que você recebe na maternidade, é o documento mais importante da saúde de {nome}. Leve-a em todas as consultas e vacinas. Ela é o passaporte para uma infância saudável.",
    acaoAudio: "TitiNauta conferindo a agenda de saúde {preposicao} {nome}! Anote aí. Primeira consulta com o pediatra: até o quinto dia de vida. É super importante! Testes de triagem: tem que fazer todos! O do Pezinho, para ver doencas raras. O do Olhinho, pra visão. O do Coraçãozinho, pra evitar sustos. O da Orelhinha, pra audição. E o da Linguinha, pra ajudar na mamada. E o documento oficial {preposicao} {nome}? A Caderneta da Criança! Leve ela em TODO lugar: consulta, vacina, emergência. É o histórico de saúde que vai proteger {nome} por anos.",
    audioIllustration: "🩺",
    badge: { id: "passaporte-cidadania", nome: "Passaporte da Cidadania", icone: "🛂" },
    extraContent: [{ titulo: "A Importância da Triagem Neonatal (MS)", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/t/triagem-neonatal" }, { titulo: "Conheça a Caderneta da Criança", url: "https://bvsms.saude.gov.br/bvs/publicacoes/caderneta_crianca_menina_12ed.pdf" }]
};
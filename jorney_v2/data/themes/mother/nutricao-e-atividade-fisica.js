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
export const nutricaoEAtividadeFisica = {
    trail: "mother",
    microcard: { 
        titulo: "💪 Energia e Força no Pós-Parto", 
        itens: [
            "Beba muita água, especialmente ao amamentar", 
            "Qualidade sobre quantidade: coma comida de verdade", 
            "Tenha lanches saudáveis sempre à mão", 
            "Evite alimentos ultraprocessados",
            "Retorno à atividade física deve ser gradual",
            "Comece com caminhadas leves",
            "Foco na reabilitação do core e assoalho pélvico"
        ] 
    },
    acaoTexto: "Recuperar sua energia depende de dois pilares: nutrição e movimento. **Nutrição:** Amamentar exige um acréscimo de 300-400 calorias por dia. Foque na **qualidade dos alimentos**: frutas, verduras, grãos integrais e proteínas. Tenha uma **garrafa de água** sempre com você. Deixe lanches saudáveis (castanhas, frutas) à mão para não pular refeições. Evite ultraprocessados. **Atividade Física:** O retorno deve ser **lento e gradual**, respeitando seu corpo. Comece com **caminhadas leves**, que melhoram o humor e o estresse. O foco inicial não é perder peso, mas a **reabilitação**. Exercícios para o **core (músculos abdominais profundos) e assoalho pélvico** são fundamentais para recuperar a estabilidade e prevenir dores nas costas e incontinência urinária. Converse com seu médico antes de retomar atividades mais intensas.",
    acaoAudio: "TitiNauta abastecendo sua energia, mãe! Seu corpo é uma máquina poderosa e precisa do combustível certo. Regra 1: Água, muita água! Especialmente quando for amamentar. Regra 2: Coma comida de verdade. Frutas, legumes, proteínas. Isso te dá força e enriquece o leite. E o corpo em movimento? Comece devagar. Caminhadas leves são ótimas. O objetivo agora não é virar atleta, é reabilitar. Foque em fortalecer a barriga e o assoalho pélvico. Isso previne problemas no futuro. Comida boa e movimento gentil: a dupla perfeita para sua recuperação.",
    audioIllustration: "🏋️‍♀️",
    badge: { id: "maquina-nutrientes", nome: "Máquina de Nutrientes", icone: "💪" },
    extraContent: [{ titulo: "Guia Alimentar para a População Brasileira", url: "https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_populacao_brasileira_2ed.pdf" }, { titulo: "Exercícios para o Assoalho Pélvico", url: "https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/kegel-exercises/art-20045283" }]
};
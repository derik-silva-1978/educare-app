
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
export const lidandoComPrivacaoDeSono = {
    trail: "mother",
    microcard: {
        titulo: "☕ Sobrevivendo à Privação de Sono",
        itens: [
            "A exaustão é real e esperada",
            "O sono continua fragmentado",
            "Turnos com o(a) parceiro(a) são essenciais",
            "Aceite TODA a ajuda oferecida",
            "Hidrate-se e coma lanches nutritivos",
            "Reduza as expectativas sobre produtividade"
        ]
    },
    acaoTexto: "No segundo mês, a exaustão acumulada pela privação de sono pode atingir seu pico. É fundamental ter estratégias para lidar com isso. **Dividir para conquistar:** se você tem um(a) parceiro(a), organizar turnos de sono é a estratégia mais eficaz. Por exemplo, um dorme das 21h à 1h, enquanto o outro cuida do bebê, e depois trocam. **Aceite ajuda:** quando alguém oferecer ajuda, diga 'sim' e vá dormir, nem que seja por 30 minutos. **Reduza as expectativas:** a casa não precisa estar perfeita. Sua única prioridade é cuidar de {nome} e de você. Mantenha-se hidratada e tenha lanches saudáveis por perto para manter a energia. Lembre-se, esta fase é intensa, mas temporária.",
    acaoAudio: "TitiNauta com o kit de sobrevivência para mães exaustas! A privação de sono é o seu maior inimigo agora. Como lutar? Com trabalho em equipe! Faça turnos com seu parceiro para cada um ter um bloco de sono. A ajuda da sua rede de apoio? Aceite! 'Pode olhar o bebê? Vou dormir'. E baixe a régua da perfeição. A louça pode esperar. A sua saúde, não. Beba água, coma bem. Você precisa de combustível pra essa maratona. Força, essa fase vai passar!",
    audioIllustration: "😩",
    badge: { id: "sobrevivente-do-sono", nome: "Sobrevivente do Sono", icone: "☕" },
    extraContent: [{ titulo: "Como o sono afeta a saúde mental de novas mães", url: "https://www.sleepfoundation.org/mental-health/how-sleep-deprivation-affects-the-mental-health-of-new-moms" }]
};

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
export const sinaisAlertaMae = {
    trail: "mother",
    microcard: { 
        titulo: "⚠️ Sinais de Alerta Urgentes na Mãe", 
        itens: [
            "**Sangramento intenso:** enche >1 absorvente/hora",
            "**Dor de cabeça forte** que não melhora, com visão turva",
            "**Febre** >38°C com calafrios",
            "**Dor no peito** ou falta de ar súbita",
            "**Dor e inchaço** em apenas uma das pernas",
            "**Convulsões**",
            "Pensamentos de se machucar ou machucar o bebê"
        ] 
    },
    acaoTexto: "O pós-parto é um período de alto risco para complicações graves. Conhecer os sinais de alerta pode salvar sua vida. **Procure um serviço de emergência imediatamente** se apresentar qualquer um destes sintomas: **Hemorragia:** sangramento vaginal que encharca mais de um absorvente noturno por hora ou eliminação de coágulos grandes. **Pré-eclâmpsia pós-parto:** dor de cabeça forte e persistente que não alivia com remédios, alterações na visão (pontos brilhantes, visão turva) ou dor intensa na parte superior do abdômen. **Infecção:** febre acima de 38°C, calafrios ou secreção com mau cheiro. **Tromboembolismo:** dor, inchaço e vermelhidão em apenas uma das pernas (pode ser Trombose) ou dor súbita no peito e falta de ar intensa (pode ser Embolia Pulmonar). **Não minimize seus sintomas**. Na dúvida, sempre procure ajuda.",
    acaoAudio: "Alerta máximo do TitiNauta para a sua saúde, mãe! Estes são sinais de emergência, procure um hospital IMEDIATAMENTE se tiver: sangramento muito intenso. Dor de cabeça fortíssima com visão embaçada. Febre alta com calafrios. Dor forte no peito ou falta de ar que veio do nada. Dor e inchaço em uma perna só. Qualquer um desses sinais não é normal. Não espere para ver se melhora. Sua vida é a prioridade. Vá para a emergência.",
    audioIllustration: "🚑",
    badge: { id: "vigilante-mae", nome: "Vigilante da Mãe", icone: "⚠️" },
    extraContent: [{ titulo: "Checklist de Sinais de Alerta Pós-Parto (CDC)", url: "https://www.cdc.gov/hearher/resources/download-share/docs/pdf/Warning-Signs-Poster_LTR_whitebkg_Portuguese-BR.pdf" }, { titulo: "Entendendo a Pré-eclâmpsia Pós-Parto", url: "https://www.preeclampsia.org/postpartum-preeclampsia" }]
};
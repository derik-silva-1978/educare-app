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
export const sonoSeguro = {
    trail: "baby",
    microcard: {
        titulo: "🌙 Sono Seguro: A Regra de Ouro",
        itens: [
            "SEMPRE de barriga para cima",
            "Berço VAZIO: sem protetores, cobertores, brinquedos",
            "Colchão firme e plano",
            "Compartilhar o quarto, NUNCA a cama",
            "Evitar superaquecimento (roupa leve)",
            "Amamentar é um fator de proteção",
            "Oferecer chupeta na hora de dormir"
        ]
    },
    acaoTexto: "A segurança do sono é o pilar mais crítico para prevenir a morte súbita. A recomendação de ouro é: **dormir de barriga para cima (posição supina)**, em todas as ocasiões de sono. O ambiente deve seguir o conceito do **'Berço Vazio'**: um colchão firme, com lençol bem ajustado, e mais nada. Remova protetores de berço, cobertores soltos, travesseiros, almofadas e brinquedos. Esses itens aumentam drasticamente o risco de sufocamento. **Compartilhe o quarto** com {nome}, mantendo o berço próximo à sua cama, mas **nunca compartilhe a cama**. Evite o **superaquecimento**; vista {nome} com uma camada a mais de roupa que você e não cubra a cabeça. Dois fatores de proteção importantes são a **amamentação** e o uso da **chupeta** (ofereça na hora de dormir, após a amamentação estar bem estabelecida). Com essas práticas, você cria múltiplas camadas de segurança.",
    acaoAudio: "TitiNauta aqui para a missão mais importante: o sono seguro de {nome}. Memorize estas regras. Posição: sempre de barriga para cima. Sempre! Ambiente: o berço deve ser um santuário minimalista. Colchão firme e nada mais. Isso mesmo, NADA. Fora travesseiros, protetores, cobertores e bichinhos. Local: o berço fica no seu quarto, pertinho de você. Mas o bebê dorme no espaço dele, nunca na sua cama. Temperatura: sem exagerar na roupa. Bebês não devem sentir calor para dormir. Fatores que ajudam: amamentar e oferecer a chupeta na hora do sono. Simples, baseado em ciência e salva vidas.",
    audioIllustration: "🌙",
    badge: { id: "mestre-sono", nome: "Mestre do Sono", icone: "🌙" },
    extraContent: [{ titulo: "Sono Seguro (SBP)", url: "https://www.sbp.com.br/fileadmin/user_upload/20226d-DocCient_-_Sindrome_Morte_Subita_do_Lactente.pdf" }, { titulo: "Campanha Safe to Sleep (AAP - em inglês)", url: "https://safetosleep.nichd.nih.gov/" }]
};
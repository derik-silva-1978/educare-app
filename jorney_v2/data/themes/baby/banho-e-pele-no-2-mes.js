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
export const banhoEPeleNo2Mes = {
    trail: "baby",
    microcard: {
        titulo: "🛁 Rotina Gentil",
        itens: [
            "Banho curto (5–10 min)",
            "Água 36–37°C",
            "Sabonete neutro 2–3x/semana",
            "Secar bem dobrinhas",
            "Hidratar se pele ressecada"
        ]
    },
    acaoTexto: "No segundo mês, mantenha o banho curto, com água morninha. Sabonete neutro em dias alternados protege a barreira cutânea. Seque dobrinhas e hidrate se houver ressecamento.",
    acaoAudio: "Banho simples, pele feliz. Pouco sabão, água morna e carinho nas dobrinhas!",
    audioIllustration: "🛁",
    badge: { "id": "guardiao-da-pele", "nome": "Guardião da Pele", "icone": "🧴" },
    extraContent: [
        { "titulo": "Cuidados com a Pele do Bebê", "url": "https://example.org/pele" }
    ]
};

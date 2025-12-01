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
export const ambienteSeguro2Mes = {
    trail: "baby",
    microcard: {
        titulo: "🏠 Zero Acidentes",
        itens: [
            "Nunca deixar sozinho em locais altos",
            "Objetos pequenos fora de alcance",
            "Água do banho sempre 36–37°C",
            "Supervisão com água (banheira/balde)",
            "Produtos de limpeza trancados"
        ]
    },
    acaoTexto: "Reforce a segurança em casa: quedas, asfixia, queimaduras, afogamento e intoxicação. A supervisão atenta previne a maioria dos acidentes.",
    acaoAudio: "Porto seguro começa em casa. Checagem diária de riscos e atenção total perto da água.",
    audioIllustration: "🛡️",
    badge: { "id": "casa-segura2", "nome": "Casa Segura (Mês 2)", "icone": "🏠" },
    extraContent: [
        { "titulo": "Checklist de Segurança Doméstica", "url": "https://example.org/seguranca2" }
    ]
};

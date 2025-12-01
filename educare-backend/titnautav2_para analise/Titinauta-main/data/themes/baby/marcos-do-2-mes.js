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
export const marcosDo2Mes = {
    trail: "baby",
    microcard: {
        titulo: "🧩 O que Esperar",
        itens: [
            "Sorri socialmente",
            "Segue objetos com os olhos",
            "Levanta a cabeça durante tummy time",
            "Vozes chamam atenção",
            "Choro com variações"
        ]
    },
    acaoTexto: "Marcos são referências e variam entre bebês. Observe tendências: atenção a rostos/vozes, sorriso social, levantar a cabeça. Se houver preocupação persistente, converse com o pediatra.",
    acaoAudio: "Marcos guiam, não prendem. Compare {nome} consigo mesmo(a) e leve dúvidas à equipe de saúde.",
    audioIllustration: "🧩",
    badge: { "id": "explorador-m2", "nome": "Explorador do 2º Mês", "icone": "🧩" },
    extraContent: [
        { "titulo": "Marcos 0–2 meses", "url": "https://example.org/marcos2" }
    ]
};

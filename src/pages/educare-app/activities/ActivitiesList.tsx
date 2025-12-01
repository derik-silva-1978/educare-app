
import React from "react";
// For now, static activities—can later fetch from backend!
const demoActivities = [
  {
    id: 1,
    title: "Brincar com blocos coloridos",
    ageGroup: "12-24 meses",
    domain: "Coordenação motora fina",
    description: "Deixe a criança manipular blocos de diferentes tamanhos e cores, incentivando empilhar e identificar cores.",
  },
  {
    id: 2,
    title: "Música e movimentos",
    ageGroup: "24-36 meses",
    domain: "Linguagem e socialização",
    description: "Coloque músicas infantis e convide a criança para dançar e imitar gestos, promovendo interação e expressão.",
  },
  {
    id: 3,
    title: "Jogo da Memória com Cartas",
    ageGroup: "36-48 meses",
    domain: "Atenção e memória",
    description: "Mostre cartas por alguns segundos e peça à criança para encontrar os pares, estimulando a memória visual.",
  },
];

export const ActivitiesList: React.FC = () => (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {demoActivities.map(activity => (
      <div key={activity.id} className="bg-white rounded-xl border shadow-sm p-5 transition hover:shadow-md">
        <h3 className="text-base font-bold mb-1 text-blue-700">{activity.title}</h3>
        <div className="text-xs mb-2 text-gray-500">{activity.ageGroup} • {activity.domain}</div>
        <p className="text-gray-700 text-sm">{activity.description}</p>
      </div>
    ))}
  </section>
);

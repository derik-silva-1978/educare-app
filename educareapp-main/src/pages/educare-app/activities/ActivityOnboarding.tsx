
import React from "react";
import { BookOpen, Play } from "lucide-react";

export const ActivityOnboarding: React.FC = () => (
  <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
    <div className="flex items-center mb-4">
      <Play className="mr-2 h-6 w-6 text-blue-500" />
      <h2 className="text-lg font-semibold">Como usar esta seção?</h2>
    </div>
    <ul className="list-disc space-y-2 pl-8 text-gray-700">
      <li>
        Navegue pelas atividades e filtre por faixa etária ou área de desenvolvimento.
      </li>
      <li>
        Clique em uma atividade para ver instruções detalhadas, objetivos e dicas de adaptação.
      </li>
      <li>
        Use estas sugestões para brincar, aprender e fortalecer vínculos familiares!
      </li>
      <li>
        Compartilhe ou salve suas favoritas para revisitar sempre que desejar.
      </li>
    </ul>
  </section>
);

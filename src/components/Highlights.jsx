import { useEffect, useState } from "react";
import { contarProjetos } from "../services/posts"; // Importa a função que criamos no posts.js

export default function Highlights() {
  const [numeroProjetos, setNumeroProjetos] = useState(0);

  useEffect(() => {
    // Função interna para buscar o número real do Supabase
    async function carregarContagem() {
      const total = await contarProjetos();
      setNumeroProjetos(total);
    }

    carregarContagem();
  }, []); // Executa assim que o componente aparece na tela

  const items = [
    {
      titulo: "Conscientização",
      texto:
        "Promovemos ideias, campanhas e ações que incentivam atitudes mais sustentáveis no dia a dia.",
    },
    {
      titulo: "Projetos Práticos",
      // Aqui inserimos o número dinâmico
      texto: `Atualmente contamos com ${numeroProjetos} projetos registrados em nossa plataforma, focados em soluções ecológicas.`,
    },
    {
      titulo: "Participação Estudantil",
      texto:
        "Valorizamos o protagonismo dos estudantes na construção de uma escola mais verde e responsável.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-green-900">{item.titulo}</h3>
              <p className="text-gray-600 mt-3 leading-7">{item.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
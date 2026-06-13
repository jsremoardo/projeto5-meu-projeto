
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [registros, setRegistros] = useState(() => {
    const dados = localStorage.getItem("controleHorario");
    return dados ? JSON.parse(dados) : [];
  });

  const [manual, setManual] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "controleHorario",
      JSON.stringify(registros)
    );
  }, [registros]);

  const formatarHora = () => {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dataHoje = () => {
    return new Date().toLocaleDateString("pt-BR");
  };

  const registrar = (tipo) => {
    const novoRegistro = {
      id: Date.now(),
      data: dataHoje(),
      horario: formatarHora(),
      tipo,
    };

    setRegistros((prev) => [...prev, novoRegistro]);
  };

  const adicionarManual = (tipo) => {
    if (!manual) return;

    const novoRegistro = {
      id: Date.now(),
      data: dataHoje(),
      horario: manual,
      tipo,
    };

    setRegistros((prev) => [...prev, novoRegistro]);
    setManual("");
  };

  const excluirRegistro = (id) => {
    setRegistros((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const calcularHoras = () => {
    const entradas = registros.filter(
      (r) => r.tipo === "Entrada"
    );

    const saidas = registros.filter(
      (r) => r.tipo === "Saída"
    );

    let minutosTotal = 0;

    for (let i = 0; i < entradas.length; i++) {
      if (saidas[i]) {
        const [h1, m1] = entradas[i].horario.split(":");
        const [h2, m2] = saidas[i].horario.split(":");

        const entradaMin =
          Number(h1) * 60 + Number(m1);

        const saidaMin =
          Number(h2) * 60 + Number(m2);

        minutosTotal += saidaMin - entradaMin;
      }
    }

    const horas = Math.floor(minutosTotal / 60);
    const minutos = minutosTotal % 60;

    return `${horas}h ${minutos}min`;
  };

  return (
    <div className="container">
      <h1>Controle de Horário</h1>

      <div className="botoes">
        <button
          className="entrada"
          onClick={() => registrar("Entrada")}
        >
          Entrar
        </button>

        <button
          className="saida"
          onClick={() => registrar("Saída")}
        >
          Sair
        </button>
      </div>

      <div className="manual">
        <input
          type="time"
          value={manual}
          onChange={(e) =>
            setManual(e.target.value)
          }
        />

        <button
          onClick={() =>
            adicionarManual("Entrada")
          }
        >
          Entrada Manual
        </button>

        <button
          onClick={() =>
            adicionarManual("Saída")
          }
        >
          Saída Manual
        </button>
      </div>

      <h2>Registros do Dia</h2>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Tipo</th>
            <th>Ação</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((item) => (
            <tr key={item.id}>
              <td>{item.data}</td>
              <td>{item.horario}</td>
              <td>{item.tipo}</td>
              <td>
                <button
                  className="delete"
                  onClick={() =>
                    excluirRegistro(item.id)
                  }
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total">
        <h2>Total Trabalhado</h2>
        <p>{calcularHoras()}</p>
      </div>
    </div>
  );
}
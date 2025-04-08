const especialidades = ["Pediatria", "Dermatologia", "Ortopedia", "Neurologia"];

const medicos = [
  { especialidade: "Pediatria", nome: "Maria de Lourdes", dias: [1, 2], horarios: ["08:00", "10:00"], pacientes: {} },
  { especialidade: "Pediatria", nome: "Fernanda Lima", dias: [2, 4], horarios: ["09:00", "13:00"], pacientes: {} },
  { especialidade: "Pediatria", nome: "João Pedro", dias: [1, 3], horarios: ["07:30", "11:30"], pacientes: {} },
  { especialidade: "Pediatria", nome: "Tatiane Rocha", dias: [2, 5], horarios: ["08:30", "14:30"], pacientes: {} },
  { especialidade: "Dermatologia", nome: "Cláudio Ramos", dias: [2, 4], horarios: ["09:00", "11:00"], pacientes: {} },
  { especialidade: "Dermatologia", nome: "Patrícia Gomes", dias: [1, 5], horarios: ["08:00", "13:00"], pacientes: {} },
  { especialidade: "Ortopedia", nome: "Paulo César", dias: [2, 5], horarios: ["08:00", "12:00"], pacientes: {} },
  { especialidade: "Neurologia", nome: "Eduardo Almeida", dias: [1, 3], horarios: ["08:00", "13:00"], pacientes: {} },
  { especialidade: "Neurologia", nome: "Helena Costa", dias: [2, 4], horarios: ["09:00", "15:00"], pacientes: {} }
];

const especialidadesContainer = document.getElementById("especialidadesContainer");
const medicosContainer = document.getElementById("medicosContainer");

especialidades.forEach(especialidade => {
  const btn = document.createElement("button");
  btn.textContent = especialidade;
  btn.addEventListener("click", () => exibirMedicos(especialidade));
  especialidadesContainer.appendChild(btn);
});

function exibirMedicos(especialidadeSelecionada) {
  medicosContainer.innerHTML = "";
  const filtrados = medicos.filter(m => m.especialidade === especialidadeSelecionada);

  filtrados.forEach(medico => {
    const card = document.createElement("div");
    card.className = "medico-card";

    const titulo = document.createElement("h3");
    titulo.textContent = medico.nome;

    const detalhes = document.createElement("div");
    detalhes.className = "medico-detalhes";

    const calendarioDiv = document.createElement("div");
    calendarioDiv.className = "calendario";
    const calendarioEl = document.createElement("div");
    calendarioDiv.appendChild(calendarioEl);

    const horariosDiv = document.createElement("div");
    horariosDiv.className = "horarios";
    horariosDiv.innerHTML = "<strong>Horários:</strong>";

    const pacientesDiv = document.createElement("div");
    pacientesDiv.className = "pacientes";
    pacientesDiv.innerHTML = "<strong>Agendados:</strong> Nenhum";

    flatpickr(calendarioEl, {
      locale: "pt",
      inline: true,
      minDate: "today",
      onChange: function (_, dateStr) {
        horariosDiv.innerHTML = "<strong>Horários:</strong>";
        pacientesDiv.innerHTML = "<strong>Agendados:</strong>";

        const ocupados = medico.pacientes[dateStr] || [];

        medico.horarios.forEach(hora => {
          const botao = document.createElement("button");
          botao.className = "horario";
          botao.textContent = hora;

          if (ocupados.some(p => p.startsWith(hora))) {
            botao.classList.add("ocupado");
            botao.disabled = true;
          }

          botao.addEventListener("click", () => {
            abrirModal(medico, dateStr, hora, botao, pacientesDiv);
          });

          horariosDiv.appendChild(botao);
        });

        atualizarPacientes(pacientesDiv, ocupados, dateStr);
      }
    });

    detalhes.appendChild(calendarioDiv);
    detalhes.appendChild(horariosDiv);
    detalhes.appendChild(pacientesDiv);

    card.appendChild(titulo);
    card.appendChild(detalhes);
    medicosContainer.appendChild(card);
  });
}

function atualizarPacientes(container, lista, data = "") {
  if (!lista.length) {
    container.innerHTML = `
      <div class="pacientes-titulo">📅 Agendamentos:<br><em>Nenhum</em></div>
    `;
    return;
  }

  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const objData = new Date(data);
  const dataFormatada = objData.toLocaleDateString("pt-BR");
  const diaSemana = diasSemana[objData.getDay()];

  let html = `
    <div class="pacientes-titulo">
      📅 <strong>Agendados em: ${dataFormatada}</strong>
      <div class="pacientes-dia">${diaSemana}</div>
    </div>
    <ul class="pacientes-lista">
      ${lista.map(item => `<li>🕒 ${item}</li>`).join("")}
    </ul>
  `;

  container.innerHTML = html;
}



function abrirModal(medico, data, hora, botao, pacientesDiv) {
  const modal = document.getElementById("modalAgendamento");
  const fechar = modal.querySelector(".close");
  const input = document.getElementById("nomePaciente");
  const confirmar = document.getElementById("confirmarAgendamento");
  const infoHorario = document.getElementById("infoHorario");

  input.value = "";
  infoHorario.textContent = `Data: ${data} | Hora: ${hora}`;

  modal.style.display = "block";

  fechar.onclick = () => modal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  confirmar.onclick = () => {
    const nome = input.value.trim();
    if (!nome) return alert("Digite o nome do paciente.");

    if (!medico.pacientes[data]) {
      medico.pacientes[data] = [];
    }

    const entrada = `${hora} - ${nome}`;
    medico.pacientes[data].push(entrada);
    botao.classList.add("ocupado");
    botao.disabled = true;
    atualizarPacientes(pacientesDiv, medico.pacientes[data], data);
    modal.style.display = "none";
  };
}

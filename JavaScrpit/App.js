let records = [];
let currentEditIndex = null;

const form = document.querySelector("form");
const recordsTable = document.getElementById("recordsTable");
const searchInput = document.getElementById("search");

// Evento de submit do formulário
form.addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura dos campos incluindo CPF e Telefone
  const name = document.getElementById("nome").value;
  const entryDate = document.getElementById("data-entrada").value;
  const exitDate = document.getElementById("data-saida").value;
  const description = document.getElementById("descricao").value;
  const attendant = document.getElementById("atendido-por").value;
  const needsFollowUp = document.getElementById("precisa-atendimento").value;
  const cpf = document.getElementById("cpf").value;
  const phone = document.getElementById("telefone").value;

  const record = { name, entryDate, exitDate, description, attendant, needsFollowUp, cpf, phone };

  if (currentEditIndex !== null) {
    // Atualiza o registro existente
    records[currentEditIndex] = record;
    currentEditIndex = null;
  } else {
    // Adiciona um novo registro
    records.push(record);
  }

  form.reset(); // Limpa o formulário
  renderTable(); // Re-renderiza a tabela
});

// Função para renderizar a tabela
function renderTable() {
  if (records.length === 0) {
    recordsTable.innerHTML = "<tr><td colspan='8'>Nenhum registro encontrado.</td></tr>";
  } else {
    recordsTable.innerHTML = records
      .map((record, index) => `
        <tr>
          <td>${record.name}</td>
          <td>${record.entryDate}</td>
          <td>${record.description}</td>
          <td>${record.attendant}</td>
          <td>${record.needsFollowUp}</td>
          <td>${record.cpf}</td> <!-- Exibe CPF -->
          <td>${record.phone}</td> <!-- Exibe Telefone -->
          <td>
            <button onclick="editRecord(${index})">Editar</button>
            <button onclick="deleteRecord(${index})" style="background-color: #f44336;">Excluir</button>
          </td>
        </tr>
      `)
      .join("");
  }
}

// Função para editar um registro
function editRecord(index) {
  const record = records[index];
  document.getElementById("nome").value = record.name;
  document.getElementById("data-entrada").value = record.entryDate;
  document.getElementById("data-saida").value = record.exitDate;
  document.getElementById("descricao").value = record.description;
  document.getElementById("atendido-por").value = record.attendant;
  document.getElementById("precisa-atendimento").value = record.needsFollowUp;
  document.getElementById("cpf").value = record.cpf;
  document.getElementById("telefone").value = record.phone;

  currentEditIndex = index; // Atualiza o índice para edição
}

// Função para excluir um registro
function deleteRecord(index) {
  records.splice(index, 1); // Remove o registro da lista
  renderTable(); // Re-renderiza a tabela
}

// Função de pesquisa
function searchRecords() {
  const filter = searchInput.value.toLowerCase();  // Obtém o valor da pesquisa e converte para minúsculas
  const rows = recordsTable.getElementsByTagName('tr');

  // Percorre todas as linhas da tabela (exceto o cabeçalho)
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    let matchFound = false;

    // Verifica cada célula (coluna) da linha em busca de correspondência
    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent || cells[j].innerText;
      if (cellText.toLowerCase().includes(filter)) {
        matchFound = true; // Se houver uma correspondência, marca como verdadeira
        break; // Não precisa verificar outras células da linha
      }
    }

    // Exibe ou oculta a linha com base na correspondência
    if (matchFound) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}

// Função para ocultar o formulário durante a pesquisa
function hideForm() {
  const searchInputValue = searchInput.value;
  const form = document.getElementById('formulario');
  
  if (searchInputValue.length > 0) {
    form.style.display = 'none'; // Oculta o formulário
  } else {
    form.style.display = ''; // Exibe o formulário novamente quando a pesquisa estiver vazia
  }
}

// Adiciona o evento de input no campo de pesquisa
searchInput.addEventListener("input", function() {
  searchRecords();  // Realiza a pesquisa ao digitar
  hideForm();  // Esconde o formulário durante a pesquisa
});

const matrixGrid = document.getElementById('matrix-grid');
const form = document.getElementById('risk-form');

const LEVELS = ['alto', 'medio', 'basso'];

const risks = [];

function createMatrixCells() {
  LEVELS.forEach(probability => {
    LEVELS.forEach(impact => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.probability = probability;
      cell.dataset.impact = impact;
      cell.innerHTML = `
        <div class="cell-header">
          <span>${capitalize(probability)} × ${capitalize(impact)}</span>
          <span class="badge ${badgeClass(probability, impact)}">${cellLabel(probability, impact)}</span>
        </div>
        <div class="risk-list" aria-live="polite"></div>
      `;
      matrixGrid.appendChild(cell);
    });
  });
}

function badgeClass(probability, impact) {
  if (probability === 'alto' || impact === 'alto') return 'risk-high';
  if (probability === 'medio' || impact === 'medio') return 'risk-medium';
  return 'risk-low';
}

function cellLabel(probability, impact) {
  if (probability === 'alto' && impact === 'alto') return 'Critico';
  if (probability === 'basso' && impact === 'basso') return 'Minimo';
  if (probability === 'alto' && impact === 'basso') return 'Monitorare';
  if (probability === 'basso' && impact === 'alto') return 'Contenere';
  return 'Attenzione';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderMatrix() {
  const cells = matrixGrid.querySelectorAll('.cell');
  cells.forEach(cell => {
    const list = cell.querySelector('.risk-list');
    list.innerHTML = '';
    const cellRisks = risks.filter(
      risk => risk.probability === cell.dataset.probability && risk.impact === cell.dataset.impact
    );

    if (cellRisks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Nessun rischio';
      list.appendChild(empty);
      return;
    }

    cellRisks.forEach(risk => {
      const item = document.createElement('article');
      item.className = 'risk-card';
      const heading = document.createElement('h3');
      heading.textContent = risk.title;
      const description = document.createElement('p');
      description.textContent = risk.description || 'Nessuna descrizione';
      if (!risk.description) {
        description.classList.add('muted');
      }
      item.append(heading, description);
      list.appendChild(item);
    });
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get('title').trim();
  const description = (formData.get('description') || '').trim();
  const probability = formData.get('probability');
  const impact = formData.get('impact');

  if (!title || !probability || !impact) {
    return;
  }

  risks.push({ title, description, probability, impact });
  form.reset();
  renderMatrix();
  form.title.focus();
});

createMatrixCells();
renderMatrix();

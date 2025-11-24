// Paginação simples para tabela
const rowsPerPage = 3;
const table = document.querySelector('#pontosColeta table');
const rows = Array.from(table.querySelectorAll('tr')).slice(1); // ignora header
const pagination = document.querySelector('.pagination');


function renderPage(page) {
const start = (page - 1) * rowsPerPage;
const end = start + rowsPerPage;


rows.forEach((row, index) => {
row.style.display = index >= start && index < end ? '' : 'none';
});
}


function setupPagination() {
const totalPages = Math.ceil(rows.length / rowsPerPage);
pagination.innerHTML = '';


for (let i = 1; i <= totalPages; i++) {
const btn = document.createElement('button');
btn.textContent = i;
btn.onclick = () => renderPage(i);
pagination.appendChild(btn);
}


renderPage(1);
}


setupPagination();

// const rows = Array.from(document.querySelectorAll('#pontosColeta table tr')).slice(1);
// const rowsPerPage = 4;
// const totalPages = Math.ceil(rows.length / rowsPerPage);
// const paginationContainer = document.querySelector('.pagination');


function renderPagination() {
paginationContainer.innerHTML = '';
for (let i = 1; i <= totalPages; i++) {
const span = document.createElement('span');
span.classList.add('page-number');
span.dataset.page = i;
span.textContent = i;
if (i === 1) span.classList.add('active');
span.addEventListener('click', () => changePage(i));
paginationContainer.appendChild(span);
}
}


function changePage(page) {
const start = (page - 1) * rowsPerPage;
const end = start + rowsPerPage;


rows.forEach((row, index) => {
row.style.display = index >= start && index < end ? '' : 'none';
});


document.querySelectorAll('.page-number').forEach(num => num.classList.remove('active'));
document.querySelector(`.page-number[data-page="${page}"]`).classList.add('active');
}


renderPagination();
changePage(1);
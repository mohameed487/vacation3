const nameSelect = document.getElementById('nameSelect');
const newNameInput = document.getElementById('newName');
const addNameButton = document.getElementById('addNameButton');
const initialBalanceInput = document.getElementById('initialBalance');
const updateBalanceButton = document.getElementById('updateBalanceButton');
const vacationTypeInput = document.getElementById('vacationType');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const vacationDaysInput = document.getElementById('vacationDays');
const addVacationButton = document.getElementById('addVacationButton');
const filterNameInput = document.getElementById('filterName');
const filterButton = document.getElementById('filterButton');
const vacationList = document.getElementById('vacationList');
const exportToExcelButton = document.getElementById('exportToExcel');

const users = JSON.parse(localStorage.getItem('users')) || {};

function updateNameSelect() {
    nameSelect.innerHTML = '<option value="" disabled selected>Choose a name or add a new one</option>';
    Object.keys(users).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });
}

addNameButton.addEventListener('click', () => {
    const name = newNameInput.value.trim();
    const balance = parseInt(initialBalanceInput.value.trim());

    if (name && !users[name]) {
        users[name] = { balance: balance || 0, vacations: [] };
        localStorage.setItem('users', JSON.stringify(users));
        updateNameSelect();
        newNameInput.value = '';
        initialBalanceInput.value = '';
    }
});

updateBalanceButton.addEventListener('click', () => {
    const name = nameSelect.value;
    const balance = parseInt(initialBalanceInput.value.trim());

    if (name && balance >= 0) {
        users[name].balance = balance;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Balance updated!');
    }
});

addVacationButton.addEventListener('click', () => {
    const name = nameSelect.value;
    const type = vacationTypeInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const days = parseInt(vacationDaysInput.value.trim());

    if (name && type && startDate && endDate && days > 0) {
        if (users[name].balance >= days) {
            users[name].vacations.push({ type, startDate, endDate, days });
            users[name].balance -= days;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Vacation added!');
            vacationTypeInput.value = '';
            startDateInput.value = '';
            endDateInput.value = '';
            vacationDaysInput.value = '';
        } else {
            alert('Not enough balance!');
        }
    }
});

filterButton.addEventListener('click', () => {
    const name = filterNameInput.value.trim();
    vacationList.innerHTML = '';

    if (name && users[name]) {
        users[name].vacations.forEach(vacation => {
            const li = document.createElement('li');
            li.textContent = `${vacation.type} from ${vacation.startDate} to ${vacation.endDate} (${vacation.days} days)`;
            vacationList.appendChild(li);
        });
    }
});

exportToExcelButton.addEventListener('click', () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
        Object.entries(users).map(([name, data]) =>
            `${name},${data.balance},"${data.vacations.map(v => `${v.type} (${v.days} days)`).join('; ')}"`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vacations_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

updateNameSelect();
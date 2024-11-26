// بيانات الموظفين والإجازات
const employees = JSON.parse(localStorage.getItem('employees')) || [];
const vacations = JSON.parse(localStorage.getItem('vacations')) || [];

// تحديث قائمة الموظفين
function updateEmployeeList() {
    const selectElement = document.getElementById('employeeName');
    selectElement.innerHTML = '<option value="">اختر الموظف</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        selectElement.appendChild(option);
    });
}

// تحميل بيانات الموظف المحدد
function loadEmployeeData() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        const employee = employees.find(emp => emp.name === employeeName);
        if (employee) {
            document.getElementById('remainingBalance').textContent = employee.vacationBalance;
        }
    } else {
        document.getElementById('remainingBalance').textContent = '-';
    }
}

// إضافة موظف جديد
function addNewEmployee() {
    const newEmployeeName = document.getElementById('newEmployeeName').value.trim();
    if (newEmployeeName && !employees.find(emp => emp.name === newEmployeeName)) {
        employees.push({ name: newEmployeeName, vacationBalance: 30 });
        localStorage.setItem('employees', JSON.stringify(employees));
        updateEmployeeList();
        document.getElementById('newEmployeeName').value = '';
    }
}

// إضافة إجازة
function addVacation() {
    const employeeName = document.getElementById('employeeName').value;
    const days = parseFloat(document.getElementById('vacationDays').value);
    const type = document.getElementById('vacationType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!employeeName || !days || !type || !startDate || !endDate) {
        alert('يرجى تعبئة جميع الحقول');
        return;
    }

    const employee = employees.find(emp => emp.name === employeeName);
    if (employee && employee.vacationBalance >= days) {
        employee.vacationBalance -= days;
        vacations.push({ employeeName, days, type, startDate, endDate });
        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.setItem('vacations', JSON.stringify(vacations));
        loadEmployeeData();
        updateVacationTable();
    } else {
        alert('رصيد الإجازات غير كافٍ');
    }
}

// تحديث جدول الإجازات
function updateVacationTable(filteredVacations = vacations) {
    const tbody = document.querySelector('#vacationTable tbody');
    tbody.innerHTML = '';
    filteredVacations.forEach((vacation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vacation.employeeName}</td>
            <td>${vacation.days}</td>
            <td>${vacation.type}</td>
            <td>${vacation.startDate}</td>
            <td>${vacation.endDate}</td>
            <td><button onclick="deleteVacation(${index})">حذف</button></td>
        `;
        tbody.appendChild(row);
    });
}

// حذف إجازة
function deleteVacation(index) {
    vacations.splice(index, 1);
    localStorage.setItem('vacations', JSON.stringify(vacations));
    updateVacationTable();
}

// تصفية الإجازات
function filterVacations() {
    const filterName = document.getElementById('filterName').value.trim();
    if (filterName) {
        const filteredVacations = vacations.filter(vac => vac.employeeName === filterName);
        updateVacationTable(filteredVacations);
    } else {
        updateVacationTable();
    }
}

// عند تحميل الصفحة
window.onload = () => {
    updateEmployeeList();
    updateVacationTable();
};

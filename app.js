// البيانات المخزنة للموظفين والإجازات
const employees = JSON.parse(localStorage.getItem('employees')) || [];
const vacations = JSON.parse(localStorage.getItem('vacations')) || [];

// تحديث قائمة الموظفين في الـ select
function loadEmployeeData() {
    const selectElement = document.getElementById('employeeName');
    const employeeName = selectElement.value;

    if (employeeName) {
        // إذا تم اختيار اسم، قم بتحميل الرصيد
        const employee = employees.find(emp => emp.name === employeeName);
        if (employee) {
            document.getElementById('vacationBalance').value = employee.vacationBalance;
        }
    } else {
        document.getElementById('vacationBalance').value = '';
    }
}

// إضافة اسم موظف جديد
function addNewEmployee() {
    const newEmployeeName = document.getElementById('newEmployeeName').value;
    if (newEmployeeName) {
        if (!employees.find(emp => emp.name === newEmployeeName)) {
            employees.push({ name: newEmployeeName, vacationBalance: 0 });
            localStorage.setItem('employees', JSON.stringify(employees));
            updateEmployeeList();
            document.getElementById('newEmployeeName').style.display = 'none';
            document.getElementById('employeeName').value = newEmployeeName;
        }
    }
}

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

// إضافة إجازة جديدة
function addVacation() {
    const employeeName = document.getElementById('employeeName').value;
    const days = parseInt(document.getElementById('vacationDays').value);
    const type = document.getElementById('vacationType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const balanceInput = document.getElementById('vacationBalance');
    const balance = parseInt(balanceInput.value);

    if (!employeeName || !days || !type || !startDate || !endDate || isNaN(balance)) {
        alert('يرجى تعبئة جميع الحقول');
        return;
    }

    // إضافة الإجازة
    const vacation = { employeeName, days, type, startDate, endDate };
    vacations.push(vacation);
    localStorage.setItem('vacations', JSON.stringify(vacations));

    // تحديث رصيد الإجازات
    const employee = employees.find(emp => emp.name === employeeName);
    employee.vacationBalance -= days;
    localStorage.setItem('employees', JSON.stringify(employees));

    updateVacationTable();
}

// تحديث جدول الإجازات
function updateVacationTable() {
    const tbody = document.querySelector('#vacationTable tbody');
    tbody.innerHTML = '';
    vacations.forEach((vacation, index) => {
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

// عرض جميع الإجازات
function showAllVacations() {
    const vacationReport = document.getElementById('vacationReport');
    vacationReport.innerHTML = '';
    vacations.forEach(vacation => {
        const reportItem = document.createElement('p');
        reportItem.textContent = `الاسم: ${vacation.employeeName}, الأيام: ${vacation.days}, النوع: ${vacation.type}, من: ${vacation.startDate} إلى: ${vacation.endDate}`;
        vacationReport.appendChild(reportItem);
    });
}

// حذف موظف
function deleteEmployee(employeeName) {
    const employeeIndex = employees.findIndex(emp => emp.name === employeeName);
    if (employeeIndex !== -1) {
        employees.splice(employeeIndex, 1);  // حذف الموظف
        localStorage.setItem('employees', JSON.stringify(employees));
        updateEmployeeList();
    }
}

// تعديل رصيد الإجازات للموظف
function updateVacationBalance() {
    const employeeName = document.getElementById('employeeName').value;
    const newBalance = parseInt(document.getElementById('vacationBalance').value);
    if (employeeName && !isNaN(newBalance)) {
        const employee = employees.find(emp => emp.name === employeeName);
        if (employee) {
            employee.vacationBalance = newBalance;
            localStorage.setItem('employees', JSON.stringify(employees));
        }
    }
}

// عند تحميل الصفحة، تحديث قائمة الموظفين والجدول
window.onload = () => {
    updateEmployeeList();
    updateVacationTable();
};

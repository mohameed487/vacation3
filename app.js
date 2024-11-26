const employees = JSON.parse(localStorage.getItem('employees')) || [];
const vacations = JSON.parse(localStorage.getItem('vacations')) || [];

// تحديث قائمة الموظفين في select
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

// إضافة موظف جديد
function addNewEmployee() {
    const newEmployeeName = document.getElementById('newEmployeeName').value;
    const balance = parseFloat(document.getElementById('vacationBalance').value);
    if (newEmployeeName && !employees.find(emp => emp.name === newEmployeeName)) {
        employees.push({ name: newEmployeeName, vacationBalance: balance || 0 });
        localStorage.setItem('employees', JSON.stringify(employees));
        updateEmployeeList();
        document.getElementById('newEmployeeName').value = '';
    }
}

// حذف موظف
function deleteEmployee() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        const index = employees.findIndex(emp => emp.name === employeeName);
        if (index !== -1) {
            employees.splice(index, 1);
            localStorage.setItem('employees', JSON.stringify(employees));
            updateEmployeeList();
            alert('تم حذف الموظف بنجاح');
        }
    } else {
        alert('يرجى اختيار اسم موظف لحذفه');
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
    if (!employee) {
        alert('اسم الموظف غير موجود');
        return;
    }

    if (employee.vacationBalance < days) {
        alert('رصيد الإجازات غير كافٍ');
        return;
    }

    vacations.push({ employeeName, days, type, startDate, endDate });
    localStorage.setItem('vacations', JSON.stringify(vacations));

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

// عند تحميل الصفحة، تحديث القائمة والجدول
window.onload = () => {
    updateEmployeeList();
    updateVacationTable();
};

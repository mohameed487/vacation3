// البيانات المخزنة
const employees = JSON.parse(localStorage.getItem('employees')) || [];
const vacations = JSON.parse(localStorage.getItem('vacations')) || [];

// تحديث قائمة الموظفين
function updateEmployeeList() {
    const select = document.getElementById('employeeName');
    select.innerHTML = '<option value="">اختر الموظف</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.name;
        option.textContent = emp.name;
        select.appendChild(option);
    });
}

// إضافة موظف جديد
function addNewEmployee() {
    const name = document.getElementById('newEmployeeName').value.trim();
    const balance = parseInt(document.getElementById('newVacationBalance').value);
    
    if (!name || isNaN(balance) || balance < 0) {
        alert('يرجى إدخال اسم ورصيد صحيح.');
        return;
    }
    
    if (employees.some(emp => emp.name === name)) {
        alert('الموظف موجود بالفعل.');
        return;
    }
    
    employees.push({ name, vacationBalance: balance });
    localStorage.setItem('employees', JSON.stringify(employees));
    updateEmployeeList();
    document.getElementById('newEmployeeName').value = '';
    document.getElementById('newVacationBalance').value = '';
}

function loadEmployeeData() {
    const employeeName = document.getElementById('employeeName').value;
    const balance = employees[employeeName]?.balance || 0;
    document.getElementById('employeeBalance').textContent = `رصيد الإجازات المتبقي: ${balance} يوم`;
}

// حذف موظف
function deleteEmployee() {
    const name = document.getElementById('employeeName').value;
    if (!name) {
        alert('يرجى اختيار موظف للحذف.');
        return;
    }

    const index = employees.findIndex(emp => emp.name === name);
    if (index !== -1) {
        employees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(employees));
        updateEmployeeList();
        alert('تم حذف الموظف.');
    }
}

// تعديل رصيد الإجازات
function updateEmployeeBalance() {
    const name = document.getElementById('employeeName').value;
    const newBalance = parseInt(document.getElementById('vacationBalance').value);
    
    if (!name || isNaN(newBalance) || newBalance < 0) {
        alert('يرجى اختيار موظف وإدخال رصيد صحيح.');
        return;
    }
    
    const employee = employees.find(emp => emp.name === name);
    if (employee) {
        employee.vacationBalance = newBalance;
        localStorage.setItem('employees', JSON.stringify(employees));
        alert('تم تعديل الرصيد.');
    }
}

// إضافة إجازة
function addVacation() {
    const name = document.getElementById('employeeName').value;
    const days = parseFloat(document.getElementById('vacationDays').value);
    const type = document.getElementById('vacationType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!name || isNaN(days) || days <= 0 || !type || !startDate || !endDate) {
        alert('يرجى ملء جميع الحقول.');
        return;
    }
    
    const employee = employees.find(emp => emp.name === name);
    if (employee && employee.vacationBalance >= days) {
        employee.vacationBalance -= days;
        vacations.push({ name, days, type, startDate, endDate });
        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.setItem('vacations', JSON.stringify(vacations));
        updateEmployeeList();
        updateVacationTable();
    } else {
        alert('رصيد الإجازات غير كافٍ.');
    }
}

// تحديث جدول الإجازات
function updateVacationTable() {
    const tbody = document.getElementById('vacationTableBody');
    tbody.innerHTML = '';
    vacations.forEach((vacation, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vacation.name}</td>
            <td>${vacation.type}</td>
            <td>${vacation.days}</td>
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
    const reportDiv = document.getElementById('vacationReport');
    reportDiv.innerHTML = vacations.map(vac => `
        <p>${vac.name} - ${vac.type} - ${vac.days} أيام (${vac.startDate} إلى ${vac.endDate})</p>
    `).join('');
}

// تحميل البيانات عند بدء التشغيل
window.onload = () => {
    updateEmployeeList();
    updateVacationTable();
};

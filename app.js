// البيانات المخزنة
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

// تحميل بيانات الموظف
function loadEmployeeData() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        const employee = employees.find(emp => emp.name === employeeName);
        if (employee) {
            document.getElementById('vacationBalance').value = employee.vacationBalance;
        }
    } else {
        document.getElementById('vacationBalance').value = '';
    }
}

// إضافة موظف جديد
function addNewEmployee() {
    const newEmployeeName = document.getElementById('newEmployeeName').value;
    if (newEmployeeName) {
        if (!employees.find(emp => emp.name === newEmployeeName)) {
            employees.push({ name: newEmployeeName, vacationBalance: 0 });
            localStorage.setItem('employees', JSON.stringify(employees));
            updateEmployeeList();
            document.getElementById('newEmployeeName').value = '';
        } else {
            alert('الموظف موجود بالفعل');
        }
    } else {
        alert('يرجى إدخال اسم الموظف');
    }
}

// تعديل رصيد الإجازات
function updateVacationBalance() {
    const employeeName = document.getElementById('employeeName').value;
    const newBalance = parseInt(document.getElementById('vacationBalance').value);

    if (!employeeName || isNaN(newBalance)) {
        alert('يرجى اختيار موظف وإدخال رصيد صحيح');
        return;
    }

    const employee = employees.find(emp => emp.name === employeeName);
    if (employee) {
        employee.vacationBalance = newBalance;
        localStorage.setItem('employees', JSON.stringify(employees));
        alert('تم تعديل الرصيد بنجاح');
    }
}

// حذف موظف
function deleteEmployee() {
    const employeeName = document.getElementById('employeeName').value;
    if (!employeeName) {
        alert('يرجى اختيار موظف لحذفه');
        return;
    }

    const employeeIndex = employees.findIndex(emp => emp.name === employeeName);
    if (employeeIndex > -1) {
        employees.splice(employeeIndex, 1);
        localStorage.setItem('employees', JSON.stringify(employees));
        updateEmployeeList();
        document.getElementById('vacationBalance').value = '';
        alert('تم حذف الموظف بنجاح');
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
    if (employee) {
        if (employee.vacationBalance >= days) {
            employee.vacationBalance -= days;
            vacations.push({ employeeName, days, type, startDate, endDate });
            localStorage.setItem('employees', JSON.stringify(employees));
            localStorage.setItem('vacations', JSON.stringify(vacations));
            updateVacationTable();
        } else {
            alert('رصيد الإجازات غير كافٍ');
        }
    }
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

// عند التحميل
window.onload = () => {
    updateEmployeeList();
    updateVacationTable();
};

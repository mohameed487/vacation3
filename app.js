// كائن الموظفين
const employees = {
    "محمد": { balance: 20, vacations: [] },
    "أحمد": { balance: 15, vacations: [] }
};

// تحديث قائمة الموظفين
function updateEmployeeList() {
    const employeeSelect = document.getElementById('employeeName');
    employeeSelect.innerHTML = '<option value="">اختر الموظف</option>';
    for (const name in employees) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        employeeSelect.appendChild(option);
    }
}

// تحميل بيانات الموظف
function loadEmployeeData() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName) {
        const balance = employees[employeeName]?.balance || 0;
        document.getElementById('employeeBalance').textContent = `رصيد الإجازات المتبقي: ${balance} يوم`;
    } else {
        document.getElementById('employeeBalance').textContent = `رصيد الإجازات المتبقي: 0 يوم`;
    }
}

// إضافة موظف جديد
function addNewEmployee() {
    const name = document.getElementById('newEmployeeName').value.trim();
    const balance = parseFloat(document.getElementById('newVacationBalance').value);

    if (name && !isNaN(balance)) {
        if (employees[name]) {
            alert('الموظف موجود بالفعل.');
        } else {
            employees[name] = { balance, vacations: [] };
            updateEmployeeList();
            document.getElementById('newEmployeeName').value = '';
            document.getElementById('newVacationBalance').value = '';
            alert('تمت إضافة الموظف بنجاح!');
        }
    } else {
        alert('يرجى إدخال بيانات صالحة.');
    }
}

// حذف موظف
function deleteEmployee() {
    const employeeName = document.getElementById('employeeName').value;
    if (employeeName && employees[employeeName]) {
        delete employees[employeeName];
        updateEmployeeList();
        document.getElementById('employeeBalance').textContent = `رصيد الإجازات المتبقي: 0 يوم`;
        alert('تم حذف الموظف بنجاح.');
    } else {
        alert('يرجى اختيار موظف صالح.');
    }
}

// تعديل الرصيد
function updateBalance() {
    const employeeName = document.getElementById('employeeName').value;
    const newBalance = parseFloat(prompt('أدخل الرصيد الجديد:'));

    if (employeeName && !isNaN(newBalance) && newBalance >= 0) {
        employees[employeeName].balance = newBalance;
        loadEmployeeData();
        alert('تم تعديل الرصيد بنجاح!');
    } else {
        alert('يرجى إدخال رصيد صالح.');
    }
}

// إضافة إجازة
function addVacation() {
    const employeeName = document.getElementById('employeeName').value;
    const vacationDays = parseFloat(document.getElementById('vacationDays').value);
    const vacationType = document.getElementById('vacationType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (employeeName && !isNaN(vacationDays) && vacationDays > 0) {
        if (employees[employeeName].balance >= vacationDays) {
            employees[employeeName].balance -= vacationDays;
            employees[employeeName].vacations.push({
                type: vacationType,
                days: vacationDays,
                start: startDate,
                end: endDate
            });
            loadEmployeeData();
            updateVacationTable();
            alert('تمت إضافة الإجازة بنجاح!');
        } else {
            alert('رصيد الإجازات غير كافٍ.');
        }
    } else {
        alert('يرجى إدخال بيانات صالحة.');
    }
}

// تحديث جدول الإجازات
function updateVacationTable() {
    const tableBody = document.getElementById('vacationTableBody');
    tableBody.innerHTML = '';

    for (const employeeName in employees) {
        const vacations = employees[employeeName].vacations;
        vacations.forEach((vacation, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employeeName}</td>
                <td>${vacation.type}</td>
                <td>${vacation.days}</td>
                <td>${vacation.start}</td>
                <td>${vacation.end}</td>
                <td><button onclick="deleteVacation('${employeeName}', ${index})">حذف</button></td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// حذف إجازة
function deleteVacation(employeeName, index) {
    const vacationDays = employees[employeeName].vacations[index].days;
    employees[employeeName].balance += vacationDays; // إعادة الرصيد
    employees[employeeName].vacations.splice(index, 1); // حذف الإجازة
    loadEmployeeData();
    updateVacationTable();
    alert('تم حذف الإجازة بنجاح!');
}

// عرض كل الإجازات
function showAllVacations() {
    const reportDiv = document.getElementById('vacationReport');
    reportDiv.innerHTML = '';

    for (const employeeName in employees) {
        const vacations = employees[employeeName].vacations;
        if (vacations.length > 0) {
            const employeeSection = document.createElement('div');
            employeeSection.innerHTML = `<h3>${employeeName}</h3>`;
            vacations.forEach(vacation => {
                const vacationDetails = document.createElement('p');
                vacationDetails.textContent = `
                    نوع الإجازة: ${vacation.type}, 
                    عدد الأيام: ${vacation.days}, 
                    البداية: ${vacation.start}, 
                    النهاية: ${vacation.end}
                `;
                employeeSection.appendChild(vacationDetails);
            });
            reportDiv.appendChild(employeeSection);
        }
    }
}

// تهيئة التطبيق
function initializeApp() {
    updateEmployeeList();
    loadEmployeeData();
    updateVacationTable();
}

document.addEventListener('DOMContentLoaded', initializeApp);

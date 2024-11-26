// تخزين البيانات في LocalStorage
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

// إضافة اسم موظف جديد
function addNewEmployee() {
  const newEmployeeName = document.getElementById('newEmployeeName').value;
  const balance = parseInt(document.getElementById('vacationBalance').value);

  if (newEmployeeName && !isNaN(balance)) {
    if (!employees.find(emp => emp.name === newEmployeeName)) {
      employees.push({ name: newEmployeeName, vacationBalance: balance });
      localStorage.setItem('employees', JSON.stringify(employees));
      updateEmployeeList();
      alert('تم إضافة الموظف بنجاح!');
    } else {
      alert('الموظف موجود بالفعل.');
    }
  } else {
    alert('يرجى إدخال اسم ورصيد صحيحين.');
  }
}

// إضافة إجازة جديدة
function addVacation() {
  const employeeName = document.getElementById('employeeName').value;
  const days = parseInt(document.getElementById('vacationDays').value);
  const type = document.getElementById('vacationType').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!employeeName || isNaN(days) || !type || !startDate || !endDate) {
    alert('يرجى تعبئة جميع الحقول.');
    return;
  }

  const employee = employees.find(emp => emp.name === employeeName);
  if (employee.vacationBalance < days) {
    alert('رصيد الإجازات غير كافٍ.');
    return;
  }

  employee.vacationBalance -= days;
  vacations.push({ employeeName, days, type, startDate, endDate });
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('vacations', JSON.stringify(vacations));
  updateVacationTable();
  alert('تمت إضافة الإجازة بنجاح.');
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

// عند تحميل الصفحة
window.onload = () => {
  updateEmployeeList();
  updateVacationTable();
};
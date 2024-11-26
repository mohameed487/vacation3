// تعريف المتغيرات الأساسية
const employees = JSON.parse(localStorage.getItem('employees')) || {};

// حفظ البيانات إلى Local Storage
function saveToLocalStorage() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

// تحديث واجهة الإجازات
function displayVacations() {
  const list = document.getElementById('vacation-list');
  list.innerHTML = "";

  for (const name in employees) {
    const employee = employees[name];
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${name}</strong> | رصيد الإجازات: ${employee.totalVacation} يوم
      <button onclick="modifyVacationBalance('${name}')">تعديل الرصيد</button>
      <button onclick="deleteEmployee('${name}')">حذف</button>
    `;

    const vacationsList = document.createElement('ul');
    employee.vacations.forEach((vacation, index) => {
      const vacationLi = document.createElement('li');
      vacationLi.innerHTML = `
        ${vacation.type} من ${vacation.startDate} إلى ${vacation.endDate} | ${vacation.days} أيام
        <button onclick="deleteVacation('${name}', ${index})">حذف الإجازة</button>
      `;
      vacationsList.appendChild(vacationLi);
    });

    li.appendChild(vacationsList);
    list.appendChild(li);
  }
}

// إضافة موظف جديد
document.getElementById('add-employee-btn').addEventListener('click', function () {
  const name = document.getElementById('employee-name').value.trim();
  const totalVacation = parseInt(document.getElementById('total-vacation').value);

  if (!name || isNaN(totalVacation) || totalVacation < 0) {
    alert("يرجى إدخال اسم صحيح ورصيد إجازات صالح.");
    return;
  }

  if (!employees[name]) {
    employees[name] = { totalVacation, vacations: [] };
    saveToLocalStorage();
    displayVacations();
    alert("تمت إضافة الموظف بنجاح!");
  } else {
    alert("الموظف موجود بالفعل.");
  }

  document.getElementById('employee-name').value = "";
  document.getElementById('total-vacation').value = "";
});

// إضافة إجازة جديدة
document.getElementById('add-vacation-btn').addEventListener('click', function () {
  const name = document.getElementById('vacation-name').value.trim();
  const type = document.getElementById('vacation-type').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const days = parseInt(document.getElementById('vacation-days').value);

  if (!name || !employees[name]) {
    alert("يرجى اختيار اسم صحيح.");
    return;
  }

  if (!type || !startDate || !endDate || isNaN(days) || days <= 0) {
    alert("يرجى إدخال جميع تفاصيل الإجازة بشكل صحيح.");
    return;
  }

  if (employees[name].totalVacation < days) {
    alert("الرصيد غير كافٍ لهذه الإجازة.");
    return;
  }

  // إضافة الإجازة وخصم عدد الأيام
  employees[name].vacations.push({ type, startDate, endDate, days });
  employees[name].totalVacation -= days;
  saveToLocalStorage();
  displayVacations();
  alert("تمت إضافة الإجازة بنجاح!");

  // إعادة تعيين الحقول
  document.getElementById('vacation-name').value = "";
  document.getElementById('vacation-type').value = "";
  document.getElementById('start-date').value = "";
  document.getElementById('end-date').value = "";
  document.getElementById('vacation-days').value = "";
});

// تعديل رصيد الإجازات
function modifyVacationBalance(name) {
  const newBalance = prompt("أدخل الرصيد الجديد للإجازات:", employees[name].totalVacation);
  if (newBalance !== null && !isNaN(newBalance) && newBalance >= 0) {
    employees[name].totalVacation = parseInt(newBalance);
    saveToLocalStorage();
    alert("تم تعديل الرصيد بنجاح!");
    displayVacations();
  } else {
    alert("يرجى إدخال قيمة صحيحة.");
  }
}

// حذف موظف
function deleteEmployee(name) {
  if (confirm(`هل تريد حذف الموظف ${name}؟`)) {
    delete employees[name];
    saveToLocalStorage();
    alert("تم حذف الموظف بنجاح!");
    displayVacations();
  }
}

// حذف إجازة
function deleteVacation(name, index) {
  if (confirm("هل تريد حذف هذه الإجازة؟")) {
    const vacation = employees[name].vacations[index];
    employees[name].totalVacation += vacation.days;
    employees[name].vacations.splice(index, 1);
    saveToLocalStorage();
    alert("تم حذف الإجازة بنجاح!");
    displayVacations();
  }
}

// عرض البيانات عند التحميل
window.onload = displayVacations;
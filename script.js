let employees = {}; // لتخزين بيانات الموظفين

// عند إضافة إجازة
function addVacation() {
  const name = document.getElementById('name').value;
  const vacationCredit = parseInt(document.getElementById('vacation-credit').value);
  const vacationDays = parseInt(document.getElementById('vacation-days').value);
  const vacationType = document.getElementById('vacation-type').value;

  // التحقق من صحة البيانات
  if (!name || !vacationDays || vacationDays <= 0) {
    alert('الرجاء إدخال كافة البيانات بشكل صحيح');
    return;
  }

  if (!employees[name]) {
    // إذا كان الموظف غير مسجل، نضيفه
    employees[name] = { credit: vacationCredit, vacations: [] };
  }

  if (employees[name].credit >= vacationDays) {
    // خصم الإجازة من الرصيد
    employees[name].credit -= vacationDays;

    // إضافة الإجازة إلى سجل الإجازات
    employees[name].vacations.push({ type: vacationType, days: vacationDays });

    // تحديث واجهة المستخدم
    displayVacations();
  } else {
    alert('لا يوجد رصيد كافٍ للإجازة');
  }
}

// حذف اسم موظف
function deleteName() {
  const name = document.getElementById('name').value;
  if (employees[name]) {
    delete employees[name];
    alert('تم حذف الموظف بنجاح');
    displayVacations();
  } else {
    alert('اسم الموظف غير موجود');
  }
}

// عرض سجل الإجازات
function displayVacations() {
  const vacationList = document.getElementById('vacation-list');
  vacationList.innerHTML = ''; // مسح القائمة الحالية

  for (let name in employees) {
    const employee = employees[name];
    const li = document.createElement('li');
    li.textContent = `${name} - رصيد الإجازات: ${employee.credit} أيام`;

    const vacationDetails = document.createElement('ul');
    employee.vacations.forEach(vacation => {
      const vacationItem = document.createElement('li');
      vacationItem.textContent = `${vacation.type}: ${vacation.days} أيام`;
      vacationDetails.appendChild(vacationItem);
    });
    li.appendChild(vacationDetails);
    vacationList.appendChild(li);
  }
}

// تصفية الإجازات حسب الاسم
function filterVacations() {
  const searchName = document.getElementById('search-name').value.toLowerCase();
  const vacationList = document.getElementById('vacation-list');
  vacationList.innerHTML = '';

  for (let name in employees) {
    if (name.toLowerCase().includes(searchName)) {
      const employee = employees[name];
      const li = document.createElement('li');
      li.textContent = `${name} - رصيد الإجازات: ${employee.credit} أيام`;

      const vacationDetails = document.createElement('ul');
      employee.vacations.forEach(vacation => {
        const vacationItem = document.createElement('li');
        vacationItem.textContent = `${vacation.type}: ${vacation.days} أيام`;
        vacationDetails.appendChild(vacationItem);
      });
      li.appendChild(vacationDetails);
      vacationList.appendChild(li);
    }
  }
}

// تصدير البيانات إلى Excel
function exportToExcel() {
  let csvContent = "اسم الموظف, نوع الإجازة, عدد الأيام, الرصيد المتبقي\n";
  for (let name in employees) {
    const employee = employees[name];
    employee.vacations.forEach(vacation => {
      csvContent += `${name}, ${vacation.type}, ${vacation.days}, ${employee.credit}\n`;
    });
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'vacations.csv');
  link.click();
}

// حفظ الأسماء في الذاكرة
function updateNames() {
  const nameInput = document.getElementById('name').value;
  if (nameInput && !employees[nameInput]) {
    document.getElementById('vacation-credit').value = ''; // إعادة ضبط رصيد الإجازات
  }
}
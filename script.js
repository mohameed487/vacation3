// تخزين البيانات باستخدام LocalStorage لضمان استمرار البيانات عند إغلاق التطبيق
let vacationsData = JSON.parse(localStorage.getItem('vacationsData')) || {};
let vacationList = document.getElementById('vacation-list');

// إضافة إجازة جديدة
function addVacation() {
  let name = document.getElementById('name').value;
  let vacationDays = parseInt(document.getElementById('vacation-days').value);
  let vacationType = document.getElementById('vacation-type').value;

  if (!name || !vacationDays || vacationDays <= 0) {
    alert("من فضلك أدخل جميع البيانات");
    return;
  }

  // تحقق من وجود الشخص في البيانات
  if (!vacationsData[name]) {
    // أول مرة يتم إدخال الإجازة لهذا الشخص، إضافة رصيد الإجازات
    let initialBalance = prompt(`أدخل رصيد الإجازات المتاح لـ ${name}`);
    vacationsData[name] = { balance: parseInt(initialBalance), vacations: [] };
  }

  let person = vacationsData[name];
  if (person.balance >= vacationDays) {
    // إضافة الإجازة
    person.vacations.push({
      days: vacationDays,
      type: vacationType,
      date: new Date().toLocaleDateString()
    });

    // خصم الأيام من الرصيد
    person.balance -= vacationDays;

    // حفظ البيانات في localStorage
    localStorage.setItem('vacationsData', JSON.stringify(vacationsData));

    // تحديث عرض الإجازات
    renderVacations();
  } else {
    alert("رصيد الإجازات غير كافي");
  }
}

// عرض جميع الإجازات
function renderVacations() {
  vacationList.innerHTML = ''; // مسح المحتوى القديم

  for (let name in vacationsData) {
    let person = vacationsData[name];
    let personDiv = document.createElement('div');
    personDiv.classList.add('person-vacation');
    personDiv.innerHTML = `
      <h3>${name}</h3>
      <p>رصيد الإجازات: ${person.balance} يوم</p>
      <ul>
        ${person.vacations.map(vacation => `<li>${vacation.type}: ${vacation.days} يوم (تاريخ الإجازة: ${vacation.date})</li>`).join('')}
      </ul>
      <button onclick="deletePerson('${name}')">حذف الشخص</button>
    `;
    vacationList.appendChild(personDiv);
  }
}

// حذف شخص بالكامل (مع إجازاته)
function deletePerson(name) {
  if (confirm(`هل أنت متأكد من حذف جميع بيانات ${name}?`)) {
    delete vacationsData[name];
    localStorage.setItem('vacationsData', JSON.stringify(vacationsData));
    renderVacations();
  }
}

// البحث عن إجازات شخص معين
function searchVacations() {
  let searchName = document.getElementById('search-name').value;
  let person = vacationsData[searchName];

  vacationList.innerHTML = ''; // مسح المحتوى القديم
  if (person) {
    let personDiv = document.createElement('div');
    personDiv.classList.add('person-vacation');
    personDiv.innerHTML = `
      <h3>${searchName}</h3>
      <p>رصيد الإجازات: ${person.balance} يوم</p>
      <ul>
        ${person.vacations.map(vacation => `<li>${vacation.type}: ${vacation.days} يوم (تاريخ الإجازة: ${vacation.date})</li>`).join('')}
      </ul>
    `;
    vacationList.appendChild(personDiv);
  } else {
    vacationList.innerHTML = `<p>لا يوجد شخص بهذا الاسم.</p>`;
  }
}

// عرض جميع الإجازات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', renderVacations);
let vacationData = {}; // لتخزين البيانات حسب اسم الشخص
let vacationList = document.getElementById("vacation-list").getElementsByTagName("tbody")[0];

function addVacation() {
    let name = document.getElementById("name").value;
    let vacationDays = parseInt(document.getElementById("vacation-days").value);
    let vacationType = document.getElementById("vacation-type").value;
    let vacationStart = document.getElementById("vacation-start").value;
    let vacationEnd = document.getElementById("vacation-end").value;

    if (!vacationData[name]) {
        let vacationCredit = parseInt(document.getElementById("vacation-credit").value);
        vacationData[name] = { credit: vacationCredit };
        document.getElementById("initial-vacation-container").style.display = 'none'; // إخفاء حقل الرصيد بعد إدخاله لأول مرة
    }

    if (vacationDays <= vacationData[name].credit) {
        vacationData[name].credit -= vacationDays; // خصم الأيام من الرصيد المتبقي
        let row = vacationList.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).textContent = vacationType;
        row.insertCell(2).textContent = vacationStart;
        row.insertCell(3).textContent = vacationEnd;
        row.insertCell(4).textContent = vacationDays;
        let deleteButton = document.createElement('button');
        deleteButton.textContent = "حذف";
        deleteButton.onclick = function() { deleteVacation(row, name, vacationDays); };
        row.insertCell(5).appendChild(deleteButton);
    } else {
        alert("رصيد الإجازات غير كافٍ.");
    }

    document.getElementById("vacation-days").value = '';
    document.getElementById("vacation-start").value = '';
    document.getElementById("vacation-end").value = '';
}

function deleteVacation(row, name, vacationDays) {
    vacationData[name].credit += vacationDays; // إضافة الأيام مرة أخرى إلى الرصيد
    vacationList.deleteRow(row.rowIndex - 1); // حذف الصف من الجدول
}

function updateVacationCredit() {
    let name = document.getElementById("name").value;
    let newCredit = parseInt(document.getElementById("vacation-credit-update").value);
    
    if (vacationData[name]) {
        vacationData[name].credit = newCredit; // تحديث رصيد الإجازات
        alert(`تم تعديل رصيد الإجازات لـ ${name} إلى ${newCredit} يوم.`);
    } else {
        alert("الاسم غير موجود.");
    }
}

// وظيفة البحث
function searchVacations() {
    let searchName = document.getElementById("search-name").value.toLowerCase();
    let rows = vacationList.getElementsByTagName("tr");

    // التصفية حسب الاسم المدخل
    for (let row of rows) {
        let nameCell = row.cells[0].textContent.toLowerCase();
        if (nameCell.includes(searchName)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}
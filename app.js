// تعريف الموظفين
let employees = [
    { name: "أحمد", balance: 20, vacations: [] },
    { name: "محمد", balance: 15, vacations: [] }
];

// تحميل بيانات الموظف عند التغيير
function loadEmployeeData() {
    const employeeName = document.getElementById("employeeName").value;
    const remainingBalanceElement = document.getElementById("remainingBalance");

    if (employeeName === "") {
        remainingBalanceElement.textContent = "رصيد الإجازات المتبقي: -";
        return;
    }

    // البحث عن الموظف وعرض الرصيد
    const employee = employees.find(emp => emp.name === employeeName);
    if (employee) {
        const usedDays = employee.vacations.reduce((sum, vac) => sum + vac.days, 0);
        const remainingBalance = employee.balance - usedDays;
        remainingBalanceElement.textContent = `رصيد الإجازات المتبقي: ${remainingBalance}`;
    }
}

// تعديل الرصيد
function updateBalance() {
    const employeeName = document.getElementById("employeeName").value;
    if (!employeeName) {
        alert("يرجى اختيار موظف لتعديل رصيده.");
        return;
    }

    const newBalance = prompt("أدخل الرصيد الجديد:");
    if (newBalance !== null && !isNaN(newBalance)) {
        const employee = employees.find(emp => emp.name === employeeName);
        if (employee) {
            employee.balance = parseFloat(newBalance);
            loadEmployeeData(); // تحديث الرصيد المتبقي
            alert("تم تحديث الرصيد بنجاح.");
        }
    }
}

// حذف الموظف
function deleteEmployee() {
    const employeeName = document.getElementById("employeeName").value;
    if (!employeeName) {
        alert("يرجى اختيار موظف للحذف.");
        return;
    }

    if (confirm(`هل تريد حذف الموظف ${employeeName}؟`)) {
        employees = employees.filter(emp => emp.name !== employeeName);
        updateEmployeeDropdown();
        document.getElementById("remainingBalance").textContent = "رصيد الإجازات المتبقي: -";
        alert("تم حذف الموظف بنجاح.");
    }
}

// تحديث القائمة المنسدلة للموظفين
function updateEmployeeDropdown() {
    const employeeDropdown = document.getElementById("employeeName");
    employeeDropdown.innerHTML = `<option value="">اختر الموظف</option>`;
    employees.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.name;
        option.textContent = emp.name;
        employeeDropdown.appendChild(option);
    });
}

// إضافة موظف جديد
function addNewEmployee() {
    const newEmployeeName = document.getElementById("newEmployeeName").value.trim();
    const newVacationBalance = parseFloat(document.getElementById("newVacationBalance").value);

    if (!newEmployeeName || isNaN(newVacationBalance)) {
        alert("يرجى إدخال اسم الموظف ورصيد صحيح.");
        return;
    }

    employees.push({ name: newEmployeeName, balance: newVacationBalance, vacations: [] });
    updateEmployeeDropdown();
    alert("تمت إضافة الموظف بنجاح.");
    document.getElementById("newEmployeeName").value = "";
    document.getElementById("newVacationBalance").value = "";
}
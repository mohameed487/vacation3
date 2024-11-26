const leaveForm = document.getElementById('leaveForm');
const leaveList = document.getElementById('leaveList');
const nameSelect = document.getElementById('name');
const newNameInput = document.getElementById('newName');

// بيانات الإجازات
let leaves = JSON.parse(localStorage.getItem('leaves')) || [];

// تحديث الأسماء في القائمة
function updateNameOptions() {
    const names = [...new Set(leaves.map(leave => leave.name))];
    nameSelect.innerHTML = '<option value="">-- اختر أو أدخل اسمًا --</option>';
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });
}

// تحديث قائمة الإجازات
function updateLeaveList() {
    leaveList.innerHTML = '';
    leaves.forEach((leave, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${leave.name}</strong> - ${leave.type} - ${leave.days} يوم (${leave.startDate} إلى ${leave.endDate})
        `;
        leaveList.appendChild(li);
    });
}

// حفظ البيانات
function saveData() {
    localStorage.setItem('leaves', JSON.stringify(leaves));
}

// إضافة إجازة جديدة
leaveForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = newNameInput.value.trim() || nameSelect.value.trim();
    const days = Number(document.getElementById('days').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const type = document.getElementById('type').value;

    if (!name || !days || !startDate || !endDate) {
        alert('الرجاء تعبئة جميع الحقول!');
        return;
    }

    leaves.push({ name, days, startDate, endDate, type });
    saveData();
    updateLeaveList();
    updateNameOptions();
    leaveForm.reset();
});

// تحميل البيانات عند بدء التشغيل
updateLeaveList();
updateNameOptions();
document.getElementById('addRow').addEventListener('click', function () {
    var table = document.getElementById('collectionTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td class="slNo"></td>
        <td><input type="text" name="studentName" placeholder="Enter name" class="input"></td>
        <td>
            <div class="contribution-row">
                <input type="number" name="contribution" placeholder="Enter amount" class="input">
                <input type="date" name="date" class="input">
            </div>
            <button class="btn addContributionRow"><i class="fas fa-plus"></i> Add Contribution</button>
        </td>
        <td class="rowTotal">₹0</td>
    `;

    updateSerialNumbers();
});

document.getElementById('reset').addEventListener('click', function () {
    document.querySelector('#collectionTable tbody').innerHTML = '';
    document.getElementById('totalAmount').innerText = '';
    localStorage.removeItem('moneyCollectionData');
    updateSerialNumbers();
});

document.getElementById('calculateTotal').addEventListener('click', function () {
    var rows = document.querySelectorAll('#collectionTable tbody tr');
    var total = 0;

    rows.forEach(row => {
        var contributions = row.querySelectorAll('input[name="contribution"]');
        var rowTotal = 0;
        
        contributions.forEach(input => {
            rowTotal += parseFloat(input.value) || 0;
        });

        row.querySelector('.rowTotal').innerText = '₹' + rowTotal;
        total += rowTotal;
    });

    document.getElementById('totalAmount').innerText = 'Total Amount: ₹' + total;
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('addContributionRow')) {
        var div = document.createElement('div');
        div.classList.add('contribution-row');
        div.innerHTML = `
            <input type="number" name="contribution" placeholder="Enter amount" class="input">
            <input type="date" name="date" class="input">
        `;
        event.target.parentNode.insertBefore(div, event.target);
    }
});

document.getElementById('exportExcel').addEventListener('click', function () {
    var table = document.getElementById('collectionTable');
    var wb = XLSX.utils.book_new();
    var wsData = [];

    // Add header row
    wsData.push(["Sl. No.", "Student Name", "Contribution Amount", "Date"]);

    // Get all rows from table
    var rows = document.querySelectorAll("#collectionTable tbody tr");

    rows.forEach((row, index) => {
        var studentName = row.querySelector('input[name="studentName"]').value || "N/A";

        var contributionRows = row.querySelectorAll('.contribution-row');
        contributionRows.forEach((contributionRow, i) => {
            var contribution = contributionRow.querySelector('input[name="contribution"]').value || "0";
            var date = contributionRow.querySelector('input[name="date"]').value || "N/A";
            
            // Add row with student name only for the first contribution row
            wsData.push([i === 0 ? index + 1 : "", i === 0 ? studentName : "", contribution, date]);
        });
    });

    // Convert to worksheet
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "TotalMoneyCollection");

    // Export as Excel file
    XLSX.writeFile(wb, "TotalMoneyCollection.xlsx");
});


document.getElementById('save').addEventListener('click', function () {
    var rows = document.querySelectorAll('#collectionTable tbody tr');
    var data = [];

    rows.forEach(row => {
        var studentName = row.querySelector('input[name="studentName"]').value;
        var contributions = [];
        var inputs = row.querySelectorAll('input[name="contribution"], input[name="date"]');

        for (let i = 0; i < inputs.length; i += 2) {
            contributions.push({ amount: inputs[i].value, date: inputs[i + 1].value });
        }

        data.push({ studentName: studentName, contributions: contributions });
    });

    localStorage.setItem('moneyCollectionData', JSON.stringify(data));
    alert('Data saved successfully.');
});

function loadData() {
    var data = JSON.parse(localStorage.getItem('moneyCollectionData'));
    if (!data) return;
    
    var table = document.getElementById('collectionTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    data.forEach(rowData => {
        var newRow = table.insertRow();
        newRow.innerHTML = `
            <td class="slNo"></td>
            <td><input type="text" name="studentName" value="${rowData.studentName}" class="input"></td>
            <td>
                ${rowData.contributions.map(contribution => `
                    <div class="contribution-row">
                        <input type="number" name="contribution" value="${contribution.amount}" class="input">
                        <input type="date" name="date" value="${contribution.date}" class="input">
                    </div>
                `).join('')}
                <button class="btn addContributionRow"><i class="fas fa-plus"></i> Add Contribution</button>
            </td>
            <td class="rowTotal">₹0</td>
        `;
    });

    updateSerialNumbers();
}

function updateSerialNumbers() {
    document.querySelectorAll(".slNo").forEach((el, index) => {
        el.innerText = index + 1;
    });
}

setInterval(() => {
    document.getElementById('currentDateTime').innerText = new Date().toLocaleString();
}, 1000);

window.onload = loadData;
    
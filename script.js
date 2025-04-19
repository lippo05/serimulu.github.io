let parcels = [];

window.onload = function () {
  const stored = localStorage.getItem("parcelData");
  if (stored) {
    parcels = JSON.parse(stored);
    parcels.forEach((p, i) => addRowToTable(p, i));
  }
};

function saveToStorage() {
  localStorage.setItem("parcelData", JSON.stringify(parcels));
}

function addParcel() {
  const name = document.getElementById('customerName').value.trim();
  const id = document.getElementById('parcelID').value.trim();

  if (!name || !id) {
    alert('Please fill in all fields.');
    return;
  }

  const newParcel = { name, id, status: 'Pending' };
  parcels.push(newParcel);
  fetch('save_parcel.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newParcel)
  })
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
      console.error('Server error:', data.message);
    }
  });
  
  saveToStorage();
  addRowToTable(newParcel, parcels.length - 1);

  document.getElementById('customerName').value = '';
  document.getElementById('parcelID').value = '';
}

function addRowToTable(parcel, index) {
  const table = document.getElementById('parcelTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  newRow.insertCell(0).textContent = parcel.name;
  newRow.insertCell(1).textContent = parcel.id;
  newRow.insertCell(2).textContent = parcel.status;
  const actionCell = newRow.insertCell(3);

  if (parcel.status === 'Taken') {
    newRow.classList.add('taken');
  } else {
    actionCell.innerHTML = `<button onclick="markTaken(${index}, this)">Mark as Taken</button>`;
  }
}

function markTaken(index, btn) {
  parcels[index].status = 'Taken';
  saveToStorage();

  const row = btn.parentNode.parentNode;
  row.cells[2].textContent = 'Taken';
  row.classList.add('taken');
  btn.remove();
}
function downloadCSV() {
    const headers = ['Customer Name', 'Parcel ID', 'Status'];
    const rows = parcels.map(p => [p.name, p.id, p.status]);
  
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parcel_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
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
  const name = document.getElementById("customerName").value.trim();
  const parcelID = document.getElementById("parcelID").value.trim();

  if (!name || !parcelID) return alert("Please fill in all fields");

  const newParcel = { name, id: parcelID, status: "Waiting" };

  // Add new at the beginning
  parcels.unshift(newParcel);

  saveToStorage();
  reloadTable();

  // Optional: Save to backend
  saveToPHP(newParcel);
  saveToFirebase(newParcel);

  // Reset form
  document.getElementById("parcelForm").reset();
  reloadTable();
  applyFilter();


}

function addRowToTable(parcel, index) {
  const table = document.getElementById('parcelTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();

  newRow.insertCell(0).textContent = index + 1; // Numbering
  newRow.insertCell(1).textContent = parcel.name;
  newRow.insertCell(2).textContent = parcel.id;
  newRow.insertCell(3).textContent = parcel.status;

  const actionCell = newRow.insertCell(4);
  actionCell.innerHTML = `
    ${parcel.status === 'Taken' ? '' : `<button onclick="markTaken(${index}, this)">Mark as Taken</button>`}
    <button onclick="editParcel(${index})">Edit</button>
    <button onclick="deleteParcel(${index})">Delete</button>
  `;

  if (parcel.status === 'Taken') {
    newRow.classList.add('taken');
  }
}




function markTaken(index, btn) {
  parcels[index].status = 'Taken';
  saveToStorage();

  const row = btn.parentNode.parentNode;
  row.cells[2].textContent = 'Taken';
  row.classList.add('taken');
  btn.remove();
  reloadTable();
  applyFilter();


}
function downloadCSV() {
    const headers = ['Customer Name', 'Parcel ID', 'Status'];
    const newParcel = { name, id: parcelID, status: "Waiting", time: Date.now() };
    const rows = parcels.map(p => [p.name, p.id, p.status]);
    parcels.sort((a, b) => b.time - a.time);


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
  
function deleteParcel(index) {
  if (!confirm("Are you sure you want to delete this parcel?")) return;

  const removed = parcels.splice(index, 1)[0];
  saveToStorage();
  reloadTable();

  // 🔄 Optional: Delete from backend
  deleteFromPHP(removed);
  deleteFromFirebase(removed.id);
  reloadTable();
  applyFilter();


}
function reloadTable() {
  const tableBody = document.getElementById('parcelTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';
  parcels.forEach((p, i) => addRowToTable(p, i));
}

function deleteFromPHP(parcel) {
  fetch('delete_parcel.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parcel.id })
  });
}
function editParcel(index) {
  const parcel = parcels[index];

  const newName = prompt("Edit customer name:", parcel.name);
  if (newName === null) return; // cancelled

  const newID = prompt("Edit parcel ID:", parcel.id);
  if (newID === null) return; // cancelled

  parcel.name = newName.trim();
  parcel.id = newID.trim();

  parcels[index] = parcel;
  saveToStorage();
  reloadTable();

  // Optional: update in backend
  updateParcelInPHP(parcel);
  updateParcelInFirebase(parcel);
}
function updateParcelInPHP(parcel) {
  fetch('update_parcel.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalID: parcel.id,  // or store originalID before editing
      name: parcel.name,
      id: parcel.id
    })
  }).then(res => res.json()).then(data => {
    if (!data.success) console.error("PHP update failed:", data.message);
  });
}
function applyFilter() {
  const filterStatus = document.getElementById("statusFilter").value.toLowerCase();
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  const tableBody = document.getElementById('parcelTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  let filteredParcels = parcels.filter(p => {
    const matchStatus = filterStatus === "all" || p.status.toLowerCase() === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(searchQuery) || p.id.toLowerCase().includes(searchQuery);
    return matchStatus && matchSearch;
  });

  filteredParcels.forEach((p, i) => addRowToTable(p, i));
}


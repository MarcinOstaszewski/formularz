function createBottomTable() {
  
  function appendTableHeader(tableId, addNotes) {
    const headerTemplate = document.getElementById('bottom-table-header');
    const tablesContainer = document.getElementById('bottom-tables-container');
    const tableHeader = headerTemplate.content.cloneNode(true);
    tableHeader.querySelector('.bottom-table').id = tableId;
    if (addNotes) {
      const warningTextCell = tableHeader.getElementById('warning-text');
      console.log(warningTextCell);
      warningTextCell.innerHTML = '';
    }
    tablesContainer.appendChild(tableHeader);
  }
  
  function createTableRows(tableId, startNumber, rowsNumber, addNotes) {
    const rowTemplate = document.getElementById('bottom-table-row');
    const tableBottom = document.getElementById(tableId);
    for (let i = startNumber; i < startNumber + rowsNumber; i++) {
      const row = rowTemplate.content.cloneNode(true);
      row.querySelector('.row-number-cell').textContent = i + ".";
      tableBottom.appendChild(row);
    }
    if (addNotes) {
      const notesTextareaTemplate = document.getElementById('notes-textarea');
      const notesTextarea = notesTextareaTemplate.content.cloneNode(true);
      tableBottom.appendChild(notesTextarea);
    }
  }

  function createTable(tableId, startNumber, rowsNumber, addNotes) {
    appendTableHeader(tableId, addNotes);
    createTableRows(tableId, startNumber, rowsNumber, addNotes);
  }

  createTable('bottom-table-left', 1, 15, false);
  createTable('bottom-table-right', 16, 5, true);
}

if ("content" in document.createElement("template")) {
  createBottomTable();
} else {
  console.error('Your browser does not support templates');
}
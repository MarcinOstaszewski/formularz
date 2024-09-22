function createBottomTable() {
    const tablesContainer = document.getElementById('bottom-tables-container');
    const headerTemplate = document.getElementById('bottom-table-header');
    const rowTemplate = document.getElementById('bottom-table-row');

    function appendTableHeader(tableId) {
      const tableHeader = headerTemplate.content.cloneNode(true);
      tableHeader.querySelector('.bottom-table').id = tableId;
      tablesContainer.appendChild(tableHeader);
    }
    
    function createTableRows(tableId, rowsNumber, addNotes) {
      const tableBottom = document.getElementById(tableId);
      for (let i = 1; i <= rowsNumber; i++) {
        const row = rowTemplate.content.cloneNode(true);
        row.querySelector('.row-number-cell').textContent = i + ".";
        tableBottom.appendChild(row);
      }
      if (addNotes) {
        console.log('Adding notes');
      }
    }

    function createTable(tableId, rowsNumber, addNotes) {
      appendTableHeader(tableId);
      createTableRows(tableId, rowsNumber, addNotes);
    }

    createTable('bottom-table-left', 15, false);
    createTable('bottom-table-right', 5, true);
    
}

if ("content" in document.createElement("template")) {
  createBottomTable();
} else {
  console.error('Your browser does not support templates');
}
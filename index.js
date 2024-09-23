function printForm(e) {
  e.preventDefault();
  window.print();
}

function validateAndSubmitForm(e) {
  e.preventDefault();
  const form = document.getElementById("furniture-fronts-order");
  console.log(form);
  console.log(new FormData(form));
}

function createBottomTable() {

  function appendTableHeader(tableId, addNotes) {
    const headerTemplate = document.getElementById("bottom-table-header");
    const tablesContainer = document.getElementById("bottom-tables-container");
    const tableHeader = headerTemplate.content.cloneNode(true);
    tableHeader.querySelector(".bottom-table").id = tableId;

    if (addNotes) {
      const warningTextCell = tableHeader.getElementById("warning-text");
      warningTextCell.innerHTML = "";
    }
    tablesContainer.appendChild(tableHeader);
  }
  
  function createTableRows(tableId, startNumber, rowsNumber, addNotes) {
    const rowTemplate = document.getElementById("bottom-table-row");
    const tableBottom = document.getElementById(tableId);

    for (let i = startNumber; i < startNumber + rowsNumber; i++) {
      const row = rowTemplate.content.cloneNode(true);
      row.querySelector(".row-number-cell").textContent = i + ".";
      const heightColumn = row.querySelector("#height-column");
      heightColumn.id = "row" + i + "-height";
      heightColumn.name = "row" + i + "-height";
      heightColumn.setAttribute("aria-labelledby", "height-label");
      const widthColumn = row.querySelector("#width-column");
      widthColumn.id = "row" + i + "-width";
      widthColumn.name = "row" + i + "-width";
      widthColumn.setAttribute("aria-labelledby","width-label");
      const quantityColumn = row.querySelector("#quantity-column")
      quantityColumn.id = "row" + i + "-quantity";
      quantityColumn.name = "row" + i + "-quantity";
      quantityColumn.setAttribute("aria-labelledby", "quantity-label");
      const kindColumn = row.querySelector("#kind-column");
      kindColumn.id = "row" + i + "-kind";
      kindColumn.name = "row" + i + "-kind";
      kindColumn.setAttribute("aria-labelledby", "kind-label");
      const displayColumn = row.querySelector("#display-column");
      displayColumn.id = "row" + i + "-display";
      displayColumn.name = "row" + i + "-display";
      displayColumn.setAttribute("aria-labelledby", "display-label");

      const radioVertical = row.querySelector("#vertical-column")
      const radioHorizontal = row.querySelector("#horizontal-column")
      radioVertical.id = "row" + i + "-vertical";
      radioHorizontal.id = "row" + i + "-horizontal";
      radioVertical.name = "row" + i + "-direction";
      radioHorizontal.name = "row" + i + "-direction";
      tableBottom.appendChild(row);
    }
    if (addNotes) {
      const notesTextareaTemplate = document.getElementById("notes-textarea");
      const notesTextarea = notesTextareaTemplate.content.cloneNode(true);
      tableBottom.appendChild(notesTextarea);
    }
  }

  function createTable(tableId, startNumber, rowsNumber, addNotes) {
    appendTableHeader(tableId, addNotes);
    createTableRows(tableId, startNumber, rowsNumber, addNotes);
  }

  createTable("bottom-table-left", 1, 15, false);
  createTable("bottom-table-right", 16, 5, true);
}

if ("content" in document.createElement("template")) {
  createBottomTable();
} else {
  console.error("Your browser does not support templates");
}

const printPageButton = document.getElementById("print-page");
printPageButton.addEventListener("click", printForm);

const sendOrderButton = document.getElementById("send-order");
sendOrderButton.addEventListener("click", validateAndSubmitForm);
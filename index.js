(function init() {
  
  const requiredFieldIds = ["name-surname", "email", "nip", "address", "phone", 
    "article", "thickness", "color", "delivery", "patine", "veneer", "lacquer"];

  function removeWarningOnClick(e) {
    const element = e.target;
    element.classList.remove("required-field-error");
  }

  function getFormData() {
    const form = document.querySelector("form");
    const data = new FormData(form);
    return data;
  }
  
  function getFormEntries(data) {
    const entries = {};
    Array.from(data.entries()).forEach(entry => entries[entry[0]] = entry[1]);
    return entries;
  }

  function getMissingRequiredFieldsList(data) {
    const missingFieldsList = requiredFieldIds.filter(entry => {
      return data.get(entry) === "";
    }) || [];
    return missingFieldsList;
  }

  function validateForm(data) {
    const missingFieldsList = getMissingRequiredFieldsList(data);
    missingFieldsList.forEach(field => {
      const fieldElement = document.getElementById(field);
      fieldElement.classList.add("required-field-error");
    });
    return missingFieldsList.length === 0;
  }

  function printForm(e) {
    e.preventDefault();
    const data = getFormData();
    if (validateForm(data)) {
      window.print();
    } else {
      document.getElementById("invalid-form-warning").showModal();
    }
  }

  function submitForm(e) {
    e.preventDefault();
    const data = getFormData();
    if (validateForm(data)) {
      const entries = getFormEntries(data);
      let queriesString = "?";
      for (entry in entries) {
        if (entries[entry] !== "") {
          queriesString += entry + "=" + entries[entry] + "&";
        }
      }
      window.location.href = "mailto:marketing@kobex.[pl]?subject=zlecenie&body=" + window.location.href + queriesString;
      console.log(window.location.href + queriesString);
      console.log(queriesString);
    } else {
      document.getElementById("invalid-form-warning").showModal();
    }
  }

  function deselectSameRowCheckbox(checkbox) {
    const row = checkbox.closest("tr");
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });
  }

  function createBottomTable() {

    function appendTableHeader(tableId, addNotes) {
      const headerTemplate = document.getElementById("bottom-table-header");
      const tablesContainer = document.getElementById("bottom-tables-container");
      const tableHeader = headerTemplate.content.cloneNode(true);
      tableHeader.querySelector(".bottom-table").id = tableId;

      if (addNotes) {
        const warningTextCell = tableHeader.getElementById("warning-text");
        warningTextCell.innerHTML = '<small class="visible-when-locked">! FORMULARZ ZABLOKOWANY DO EDYCJI !</small>';
      }
      tablesContainer.appendChild(tableHeader);
    }
    
    function createTableRows(tableId, startNumber, rowsNumber, addNotes) {
      const rowTemplate = document.getElementById("bottom-table-row");
      const tableBottom = document.getElementById(tableId);

      for (let i = startNumber; i < startNumber + rowsNumber; i++) {
        const row = rowTemplate.content.cloneNode(true);
        row.querySelector(".row-number-cell").textContent = i + ".";
        ["height", "width", "quantity", "kind", "display"].forEach((name) => {
          const cell = row.querySelector("#" + name + "-column");
          cell.id = "row" + i + "-" + name;
          cell.name = "row" + i + "-" + name;
          cell.setAttribute("aria-labelledby", name + "-label");
        });

        const radioVertical = row.querySelector("#vertical-column")
        const radioHorizontal = row.querySelector("#horizontal-column")
        radioVertical.id = "row" + i + "-vertical";
        radioHorizontal.id = "row" + i + "-horizontal";
        radioVertical.name = "row" + i + "-direction";
        radioHorizontal.name = "row" + i + "-direction";

        radioHorizontal.addEventListener("change", () => deselectSameRowCheckbox(radioHorizontal));
        radioVertical.addEventListener("change", () => deselectSameRowCheckbox(radioVertical));

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

  function recoverQueriesParams() {
    const queries = new URLSearchParams(window.location.search);
    if (queries.size) {
      const form = document.querySelector("form");
      queries.forEach((value, key) => {
        const element = form.querySelector("[name=" + key + "]");
        if (element) {
          if (element.type === "checkbox") {
            element.checked = true;
          } else {
            element.value = value;
          }
        }
      });
      document.querySelector("form").classList.add("locked");
    }
  }

  function setEventListeners() {
    requiredFieldIds.forEach(entry => {
      const element = document.querySelector("[name=" + entry + "]");
      element.addEventListener("click", removeWarningOnClick);
    });
    const printPageButton = document.getElementById("print-page");
    printPageButton.addEventListener("click", printForm);
    const sendOrderButton = document.getElementById("send-order");
    sendOrderButton.addEventListener("click", submitForm);
    const dialog = document.getElementById("invalid-form-warning");
    dialog.addEventListener("click", () => dialog.close());
  }

  function start() {
    createBottomTable();
    recoverQueriesParams();
    setEventListeners();
  }

  start();
})();
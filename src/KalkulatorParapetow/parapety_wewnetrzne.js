(function init() {
  const DELIVERY = "delivery";
  const requiredFieldIds = ["name-surname", "address", "email", "phone", 
    "corner", "border-finish", "color", "color-symbol", "kind", "thickness", DELIVERY];

  function buildLeftTable() {
    const leftContainer = document.querySelector('.central-table-left-container');
    const leftTableHeader = document.getElementById('central-table-header').content.cloneNode(true);
    leftContainer.appendChild(leftTableHeader);
    const centralTable = leftContainer.querySelector('#central-table');
    const leftTableRow = document.getElementById('central-table-row')
    for (let i = 1; i <= 20; i++) {
      const row = leftTableRow.content.cloneNode(true);
      row.querySelector('.row-number-cell').textContent = i + '.';
      ["length", "width", "quantity", "shape"].forEach((name) => {
        const cell = row.querySelector("#" + name + "-column");
        cell.id = "row" + i + "-" + name;
        cell.name = "row" + i + "-" + name;
        cell.setAttribute("aria-labelledby", name + "-label");
      });
      centralTable.appendChild(row);
    }
  }

  function getFormElement() {
    return document.getElementById("parapety-mdf-order");
  }

  function getFormData() {
    return new FormData(form);
  }

  function getFormEntries(data) {
    const entries = {};
    Array.from(data.entries()).forEach(function(entry) { entries[entry[0]] = entry[1] });
    return entries;
  }

  function getMissingRequiredFieldsList(data) {
    const missingFieldsList = requiredFieldIds.filter(function(entry) {
      return (data.get(entry) === "" || data.get(entry) === null);
    }) || [];
    return missingFieldsList;
  }

  function removeRadiosErrorWarning() {
    const deliveryRadioButtons = document.querySelectorAll("[name=delivery]");
    deliveryRadioButtons.forEach(function(radio) {
      radio.classList.remove("required-field-error");
    });
  }

  function validateForm(data) {
    const missingFieldsList = getMissingRequiredFieldsList(data);
    missingFieldsList.forEach(function(field) {
      if (field === DELIVERY) {
        const deliveryRadioButtons = document.querySelectorAll('[name="' + DELIVERY + '"]');
        deliveryRadioButtons.forEach(function(radio) {
          radio.classList.add("required-field-error");
          radio.addEventListener("click", function() {
            removeRadiosErrorWarning();
          });
        });
      } else {
        const fieldElement = document.querySelector("[name=" + field + "]");
        fieldElement.classList.add("required-field-error");
      }
    });
    return missingFieldsList.length === 0;
  }

  function switchToLockedForm(form) {
    form.classList.add("locked");
    const resetButton = document.getElementById("reset-form-button");
    resetButton.outerHTML = '<strong class="text-lg visible-when-locked text-warning">! FORMULARZ ZABLOKOWANY DO EDYCJI !</strong>';
    document.querySelectorAll(".pointer-events-none").forEach(function(el) {
      el.classList.remove("pointer-events-none");
    });
  }

  function recoverFromQueryParams() {
    const queries = new URLSearchParams(window.location.search);
    if (queries.size) {
      queries.forEach(function(value, key) {
        const element = form.querySelector("[name=" + key + "]");
        if (element) {
          if (element.type === "checkbox") {
            element.checked = true;
          } else {
            element.value = value;
          }
        }
      });
      switchToLockedForm(form);
      return true;
    }
    return false;
  }

  function saveFormInLocalStorage() {
    const data = getFormData();
    const entries = getFormEntries(data);
    const notEmptyEntries = {};
    for (entry in entries) {
      if (entries[entry] !== "") {
        notEmptyEntries[entry] = entries[entry];
      }
    }
    localStorage.setItem("parapety-mdf", JSON.stringify(notEmptyEntries));
  }

  function removeWarningOnClick(e) {
    const element = e.target;
    element.classList.remove("required-field-error");
  }

  function printForm(e) {
    e.preventDefault();
    const data = getFormData();
    if (validateForm(data)) {
      window.print();
    } else {
      showModal("invalid-form-warning");
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
      window.location.href = "mailto:marketing@kobax.pl?subject=zlecenie&body=" + window.location.href + queriesString;
    } else {
      showModal("invalid-form-warning");
    }
  }

  function showModal(id) {
    document.getElementById(id).showModal();
  }

  function closeModal(id) {
    document.getElementById(id).close();
  }

  function resetForm() {
    form.reset();
    localStorage.removeItem("parapety-mdf");
    closeModal("reset-form-warning");
  }

  function addZoomButtons() {
    document.body.style.zoom = localStorage.getItem("zoom") || "1";
    document.getElementById("zoom-in").addEventListener("click", function() {
      const zoomLevel = (parseFloat(document.body.style.zoom) + 0.1).toString();
      localStorage.setItem("zoom", zoomLevel);
      document.body.style.zoom = zoomLevel;
    });
    document.getElementById("zoom-out").addEventListener("click", function() {
      const zoomLevel = (parseFloat(document.body.style.zoom) - 0.1).toString();
      localStorage.setItem("zoom", zoomLevel);
      document.body.style.zoom = zoomLevel;
    });
  }
  
  function checkForDataInLocalStorage() {
    const entries = JSON.parse(localStorage.getItem("parapety-mdf"));
    if (entries) {
      for (entry in entries) {
        const element = form.querySelector("[name=" + entry + "]");
        if (element) {
          if (element.type === "checkbox") {
            element.checked = true;
          } else {
            element.value = entries[entry];
          }
        }
      }
    }
  }

  function changeThicknessOptions(optionSelected) {
    const thicknessSelect = document.getElementById("thickness");
    thicknessSelect.value = "";
    const thicknessOptions = thicknessSelect.querySelectorAll("option");
    thicknessOptions.forEach(function(option) {
      if (option.classList.contains(optionSelected)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    });
  }

  function setEventListeners() {
    const kindSelect = document.getElementById("kind");
    kindSelect.addEventListener("change", function(event) { changeThicknessOptions(event.target.value) });
    requiredFieldIds.forEach(function(entry) {
      const element = document.querySelector("[name=" + entry + "]");
      element.addEventListener("click", removeWarningOnClick);
    });
    const printPageButton = document.getElementById("print-page");
    printPageButton.addEventListener("click", printForm);
    const sendOrderButton = document.getElementById("send-order");
    sendOrderButton.addEventListener("click", submitForm);
    document.querySelectorAll("dialog").forEach(function(dialog) {
      dialog.addEventListener("click", function() { closeModal(dialog.id) });
    });
    form.addEventListener("change", saveFormInLocalStorage);
    const resetFormButton = document.getElementById("reset-form-button");
    resetFormButton.addEventListener("click", function(e) {
      e.preventDefault();
      showModal("reset-form-warning")
    });
    const confirmResetFormButton = document.getElementById("confirm-form-reset");
    confirmResetFormButton.addEventListener("click", resetForm);
  }

  const form = getFormElement();

  (function start() {
    buildLeftTable();
    const isRecoveredFromQueryParams = recoverFromQueryParams();
    !isRecoveredFromQueryParams && checkForDataInLocalStorage();
    setEventListeners();
    addZoomButtons();
  })();
})();

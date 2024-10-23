(function init() {
  const formId = "parapety-wewnetrzne";
  const DOSTAWA = "dostawa";
  const requiredFieldIds = ["nazwa", "adres", "email", "telefon", "naroznik", "krawedz", "kolor", "kolor-symbol", "rodzaj", "grubosc", DOSTAWA];
  const form = document.getElementById(formId);
  
  function buildLeftTable() {
    const leftContainer = document.querySelector('.central-table-left-container');
    const leftTableHeader = document.getElementById('central-table-header').content.cloneNode(true);
    leftContainer.appendChild(leftTableHeader);
    const centralTable = leftContainer.querySelector('#central-table');
    const leftTableRow = document.getElementById('central-table-row')
    for (let i = 1; i <= 20; i++) {
      const row = leftTableRow.content.cloneNode(true);
      row.querySelector('.row-number-cell').textContent = i + '.';
      ["dlugosc", "szerokosc", "ilosc", "ksztalt"].forEach((name) => {
        const cell = row.querySelector("#" + name + "-column");
        cell.id =  name  + "-row" + "-" + i;
        cell.name =  name  + "-row" + "-" + i;
        cell.setAttribute("aria-labelledby", name + "-label");
      });
      centralTable.appendChild(row);
    }
  }

  function getFormData() {
    return new FormData(form);
  }

  function getFormEntries(data) {
    const entries = {};
    const dataEntries = data.entries();
    let entry;
    while (!(entry = dataEntries.next()).done) {
      entries[entry.value[0]] = entry.value[1];
    }
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
      if (field === DOSTAWA) {
        const deliveryRadioButtons = document.querySelectorAll('[name="' + DOSTAWA + '"]');
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
    let isFromCalculator = false;
    if (queries.size) {
      queries.forEach(function(value, key) {
        if (key === "kalkulator" && value === "true") {
          isFromCalculator = true;
        }
        if (key === "rodzaj") {
         changeThicknessOptions(value, "grubosc");
        }
        if (key === "rabat" && !isNaN(value) && value > 0) {
          key = "dodatkowe";
          value = "rabat: " + value + "%";
        }
        const element = form.querySelector("[name=" + key + "]");
        if (element) {
          if (element.type === "radio") {
            const radio = form.querySelector('[name="' + key + '"][value="' + value + '"]');
            radio.checked = true;
          } else {
            element.value = value;
          }
        }
      });
      !isFromCalculator && switchToLockedForm(form);
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
    localStorage.setItem("parapety-wewnetrzne", JSON.stringify(notEmptyEntries));
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
    localStorage.removeItem("parapety-wewnetrzne");
    closeModal("reset-form-warning");
  }

  function addZoomButtons() {
    document.body.style.zoom = localStorage.getItem("parapety-wewnetrzne-zoom") || "1";
    document.getElementById("zoom-in").addEventListener("click", function() {
      const zoomLevel = (parseFloat(document.body.style.zoom) + 0.1).toString();
      localStorage.setItem("zoom", zoomLevel);
      document.body.style.zoom = zoomLevel;
    });
    document.getElementById("zoom-out").addEventListener("click", function() {
      const zoomLevel = (parseFloat(document.body.style.zoom) - 0.1).toString();
      localStorage.setItem("parapety-wewnetrzne-zoom", zoomLevel);
      document.body.style.zoom = zoomLevel;
    });
  }
  
  function checkForDataInLocalStorage() {
    if (!localStorage) return;
    const data = localStorage.getItem(formId);
    if (data) {
      const entries = JSON.parse(data);
      for (const key in entries) {
        const element = form.querySelector("[name=" + key + "]");
        if (element) {
          if (element.type === "radio") {
            const radio = form.querySelector('[name="' + key + '"][value="' + entries[key] + '"]');
            radio.checked = true;
          } else {
            element.value = entries[key];
          }
        }
      }
    }
  }

  function flashElementBackground(id) {
    const element = document.getElementById(id);
    element.classList.add("changed");
    setTimeout(function() {
      element.classList.remove("changed");
    }, 1500);
  }

  function changeThicknessOptions(optionSelected, id) {
    const thicknessSelect = document.getElementById(id);
    thicknessSelect.value = "";
    const thicknessOptions = thicknessSelect.querySelectorAll("option");
    thicknessOptions.forEach(function(option) {
      if (option.classList.contains(optionSelected)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    });
    flashElementBackground(id);
  }

  function setElementToValueAndFlash(id, value) {
    const borderFinish = document.getElementById(id);
    borderFinish.value = value;
    flashElementBackground(id);
  }

  function setEventListeners() {
    const kindSelect = document.getElementById("rodzaj");
    kindSelect.addEventListener("change", function(event) {
      changeThicknessOptions(event.target.value, "grubosc");
      flashElementBackground("grubosc");
    });
    const cornerSelect = document.getElementById("naroznik");
    cornerSelect.addEventListener("change", function(event) {
      if (event.target.value === "STONE") { setElementToValueAndFlash("krawedz", "faza")};
    });
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
    resetFormButton && resetFormButton.addEventListener("click", function(e) {
      e.preventDefault();
      showModal("reset-form-warning")
    });
    const confirmResetFormButton = document.getElementById("confirm-form-reset");
    confirmResetFormButton.addEventListener("click", resetForm);
  }

  (function start() {
    buildLeftTable();
    const isRecoveredFromQueryParams = recoverFromQueryParams();
    !isRecoveredFromQueryParams && checkForDataInLocalStorage();
    setEventListeners();
    addZoomButtons();
  })();
})();

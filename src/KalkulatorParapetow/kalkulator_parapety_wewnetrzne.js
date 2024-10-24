function init() {
  function getNetto(cenaBrutto) {
    return cenaBrutto / 1.23;
  }

  const cenyZa1m2 = {
    hurtowy: {
      folia: {
        standard: {
          18: 260.2,
          22: 274.8,
          28: 302.4
        },
        wilgociouodporniony: {
          19: 311.4,
          25: 362.6,
          30: 399.2
        }
      },
      lakier: {
        standard: {
          18: 345.5,
          22: 369.1,
          28: 392.7
        },
        wilgociouodporniony: {
          19: 375.6,
          25: 411.4,
          30: 469.9
        }
      }
    },
    detaliczny: {
      folia: {
        standard: {
          18: getNetto(365),
          22: getNetto(433),
          28: getNetto(480)
        },
        wilgociouodporniony: {
          19: getNetto(499),
          25: getNetto(580),
          30: getNetto(641)
        }
      },
      lakier: {
        standard: {
          18: getNetto(776),
          22: getNetto(1542),
          28: getNetto(893)
        },
        wilgociouodporniony: {
          19: getNetto(803),
          25: getNetto(878),
          30: getNetto(953)
        }
      }
    }
  };
  const ksztaltMapping = {
    "standard": "standard",
    "prawy-do-laczenia": "prawy do łączenia",
    "lewy-do-laczenia": "lewy do łączenia",
    "srodkowy": "środkowy",
    "sciety-prawy": "ścięty prawy",
    "sciety-lewy": "ścięty lewy",
    "sciety-srodkowy": "ścięty środkowy",
    "prawy-z-lacznikami": "prawy z łącznikami",
    "lewy-z-lacznikami": "lewy z łącznikami",
    "srodkowy-z-lacznikami": "środkowy z łącznikami"
  };
  const entriesToAddRowNumber = ['szerokosc', 'dlugosc', 'ilosc', 'ksztalt'];

  const POWIERZCHNIA = 'powierzchnia';
  const CENA_NETTO = 'cena-netto';
  const CENA_BRUTTO = 'cena-brutto';
  const AKTUALNE_ZAMOWIENIE = 'Aktualne zamówienie: ';
  const formId = 'kalkulator-parapetow';
  const form = document.getElementById(formId);
  const klientDetalHurt = document.querySelectorAll('[name="klient"]');
  const hurtRabat = document.getElementById('hurt-rabat');
  const rabatInput = document.getElementById('rabat');
  const rodzaj = document.querySelectorAll('[name="rodzaj"]');
  const gruboscStandard = document.querySelectorAll('[name="standard"]');
  const gruboscWilgoc = document.querySelectorAll('[name="wilgociouodporniony"]');
  const kolor = document.querySelectorAll('[name="kolor"]');
  const naroznik = document.querySelectorAll('[name="naroznik"]');
  const krawedz = document.querySelectorAll('[name="krawedz"]');
  const zamowienie = document.querySelectorAll('[name="zamowienie"]');
  const szerokoscInput = document.getElementById('szerokosc');
  const dlugoscInput = document.getElementById('dlugosc');
  const iloscInput = document.getElementById('ilosc');
  const ksztalt = document.querySelectorAll('[name="ksztalt"]');
  const currentOrderDescription = document.querySelector('.current-order-description');
  const addOrderButton = document.querySelector('.add-order-button');
  const addElementButton = document.querySelector('.add-element-button');
  const ordersListSection = document.querySelector('.orders-list');
  const topPanelFields = [klientDetalHurt, rabatInput, rodzaj, gruboscStandard, gruboscWilgoc, kolor, naroznik, krawedz];
  let rabat = 1;
  let currentNewRowNumber = 1;
  let queriesString = '';
  
  function getRodzajValue() {
    const rodzaj = document.querySelector('[name="rodzaj"]:checked');
    return rodzaj ? rodzaj.value : null;
  }

  function isSameKindOrder() {
    return document.querySelector('[name="zamowienie"]:checked').value === 'jednego-rodzaju';
  }

  function flashChangedRadioGroup(namesList) {
    namesList.forEach(function(name) {
      const radio = document.querySelector('[name="' + name + '"]');
      radio.closest('.radio-group').classList.add('changed');
      setTimeout(function() {
        radio.closest('.radio-group').classList.remove('changed');
      }, 1500);
    });
  }

  function showHideGruboscOptions(value) {
    const isStandard = value ? value === 'standard' : getRodzajValue() === 'standard';
    const show = isStandard ? gruboscStandard : gruboscWilgoc;
    const hide = isStandard ? gruboscWilgoc : gruboscStandard;
    show.forEach(function(radio, i) {
      radio.checked = i === 0;
      radio.parentElement.classList.remove('hidden');
    });
    hide.forEach(function(radio) {
      radio.checked = false;
      radio.parentElement.classList.add('hidden');
    });
    if (value) { // when called from change event
      flashChangedRadioGroup(['standard', 'wilgociouodporniony']);
      saveToLocalStorageAndUpdateDisplay();
    }
  }

  function setTextWhenSizesNotSet() {
    [POWIERZCHNIA, CENA_NETTO, CENA_BRUTTO].forEach(function(id) {
      const element = document.getElementById(id);
      element.innerText = "[wprowadź wymiary]";
    });
  }

  function getKlientKind() {
    const klientKind = document.querySelector('[name="klient"]:checked');
    return klientKind ? klientKind.value : null;
  }

  function getGruboscValue(rodzajValue) {
    if (rodzajValue) {
      return (rodzajValue === 'standard' ?
        (document.querySelector('[name="standard"]:checked') ? document.querySelector('[name="standard"]:checked').value : null) : 
        (document.querySelector('[name="wilgociouodporniony"]:checked') ? document.querySelector('[name="wilgociouodporniony"]:checked').value : null)); 
    } else {
      return null;
    }
  }

  function updatePrice() {
    const klientKind = getKlientKind();
    const rodzajValue = getRodzajValue();
    const gruboscValue = getGruboscValue(rodzajValue);
    const kolor = document.querySelector('[name="kolor"]:checked');
    const kolorValue = kolor ? kolor.value : null;

    if (klientKind && rodzajValue && gruboscValue && kolorValue) {
      const cenaZa1m2 = cenyZa1m2[klientKind][kolorValue][rodzajValue][gruboscValue];
      document.getElementById('cena-m2-netto').innerText = cenaZa1m2.toFixed(2) + ' zł';
      document.getElementById('cena-m2-brutto').innerText = (cenaZa1m2 * 1.23).toFixed(2) + ' zł';
      return cenaZa1m2;
    } else {
      return null;
    }
  }

  function obliczCene() {
    const cena = updatePrice();
    const szerokosc = parseFloat(szerokoscInput.value);
    const dlugosc = parseFloat(dlugoscInput.value);
    const ilosc = parseInt(iloscInput.value);
    
    if (!isNaN(cena) && !isNaN(szerokosc) && !isNaN(dlugosc) && !isNaN(ilosc)) {
      try {
        const powierzchnia = szerokosc * dlugosc;
        document.getElementById(POWIERZCHNIA).innerText = Math.round(powierzchnia) + ' cm²' + ' (' + (powierzchnia / 10000).toFixed(3) + ' m²)';
        document.getElementById(CENA_NETTO).innerText = (cena * (powierzchnia / 10000) * ilosc * rabat).toFixed(2) + ' zł';
        document.getElementById(CENA_BRUTTO).innerText = (cena * (powierzchnia / 10000) * 1.23 * ilosc * rabat).toFixed(2) + ' zł';
      } catch (error) {
        console.error(error);
      }
    } else {
      setTextWhenSizesNotSet();
    }
  }

  function addListenerToRadios(radios, type, callback) {
    radios.forEach(function(radio) {
      radio.addEventListener(type, callback);
    });
  }

  function getFormData() {
    var formData = new FormData(form);
    var data = {};
    formData.forEach(function(value, key) {
      data[key] = value;
    });
    return data;
  }

  function updateCurrentOrderDescription(data) {
    const klient = data["klient"];
    const rabat = data["rabat"];
    const rodzaj = data["rodzaj"];
    const standard = data["standard"];
    const wilgociouodporniony = data["wilgociouodporniony"];
    const kolor = data["kolor"];
    const naroznik = data["naroznik"];
    const krawedz = data["krawedz"];
    const ksztalt = data["ksztalt"];
    const szerokosc = data["szerokosc"];
    const dlugosc = data["dlugosc"];
    const ilosc = data["ilosc"];
    const wlasciwosci = klient && rodzaj && (standard || wilgociouodporniony) && kolor && naroznik && krawedz;
    let orderDescription = AKTUALNE_ZAMOWIENIE;
    klient && (orderDescription += "Typ klienta: " + klient + ", ");
    if (klient === "hurtowy" && rabat && !isNaN(rabat) && rabat > 0) {
      orderDescription += "rabat: " + rabat + "%, ";
    }
    rodzaj && (orderDescription += "rodzaj parapetu: " + rodzaj + ", ");
    standard && (orderDescription += "grubość: " + standard + " mm, ");
    wilgociouodporniony && (orderDescription += "grubość: " + wilgociouodporniony + " mm, ");
    kolor && (orderDescription += "wykończenie: " + kolor + ", ");
    naroznik && (orderDescription += "narożnik: " + naroznik + ", ");
    krawedz && (orderDescription += "krawędź: " + krawedz + ", ");
    ksztalt && (orderDescription += "kształt: " + ksztaltMapping[ksztalt] + ", ");
    szerokosc && (orderDescription += "szerokość: " + szerokosc + " mm, ");
    dlugosc && (orderDescription += "długość: " + dlugosc + " mm, ");
    ilosc && (orderDescription += "ilość sztuk: " + ilosc);
    orderDescription += ".";
    orderDescription += ' Powierzchnia: ' + document.getElementById(POWIERZCHNIA).innerText + ", ";
    orderDescription += "cena brutto: " + document.getElementById(CENA_BRUTTO).innerText + ".";
    orderDescription += "(netto: " + document.getElementById(CENA_NETTO).innerText + ").";
    currentOrderDescription.innerText = orderDescription;
    zamowienie[0].closest('.form-group').classList.toggle('locked', !wlasciwosci); // disabled when all required fields are not checked
    if (wlasciwosci && ksztalt && szerokosc && dlugosc && ilosc) {
      toggleOrderButtons(true);
      currentOrderDescription.classList.remove('data-not-full');
      currentOrderDescription.parentElement.querySelector('button').innerText = 'Dodaj nowe zamówienie';
    } else {
      toggleOrderButtons(false);
      currentOrderDescription.classList.add('data-not-full');
      currentOrderDescription.parentElement.querySelector('button').innerText = 'Uzupełnij dane zamówienia';
    }
  }

  function saveToLocalStorageAndUpdateDisplay(event) {
    const data = getFormData();
    localStorage.setItem(formId, JSON.stringify(data));
    obliczCene();
    updateCurrentOrderDescription(data);
    toggleTopPanelLock();
  }

  function checkForDataInLocalStorage() {
    if (!localStorage) return;
    const data = localStorage.getItem(formId);
    if (data) {
      const entries = JSON.parse(data);
      for (const key in entries) {
        const element = form.querySelector('[name="' + key + '"]');
        if (!element) continue;
        if (element.type === 'radio') {
          const radio = form.querySelector('[name="' + key + '"][value="' + entries[key] + '"]');
          radio.checked = true;
        } else {
          element.value = entries[key];
        }
      }
      updatePrice();
    }
  }

  function isDiscountValid(clientKind) {
    return clientKind === 'hurtowy' && parseFloat(rabatInput.value) > 0;
  }

  function setDiscountValue() {
    const clientKind = getKlientKind();
    if (!isDiscountValid(clientKind)) {
      rabatInput.value = 0;
      rabat = 1;
    } else {
      rabat = 1 - parseFloat(rabatInput.value) / 100;
    }
    saveToLocalStorageAndUpdateDisplay();
  }

  function showHideHurtRabat() {
    const clientKind = getKlientKind();
    hurtRabat.classList.toggle('hidden', clientKind !== 'hurtowy');
    setDiscountValue();
  }

  function verifyMaxValue() {
    if (parseInt(this.value) > this.max) this.value = this.max;
    if (parseInt(this.value) < this.min) this.value = this.min;
    saveToLocalStorageAndUpdateDisplay();
  }

  function checkIfStoneSelected(event) {
    if (event.target.value === 'STONE') {
      krawedz.forEach(function(radio) { radio.checked = radio.value === 'faza' });
      flashChangedRadioGroup(['krawedz']);
    }
    saveToLocalStorageAndUpdateDisplay();
  }

  function getOrderURL(queriesString) {
    const lastSlashIndex = window.location.href.lastIndexOf('/');
    return window.location.href.substring(0, lastSlashIndex) + '/parapety_wewnetrzne.html' + queriesString
  }

  function getOrdersFromLocalStorage() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }

  function addOrderToLocalStorage(textContent, url) {
    textContent = textContent.replace(AKTUALNE_ZAMOWIENIE, '');
    const orders = getOrdersFromLocalStorage();
    ['wilgocioudporniony=', 'standard='].forEach(function(entry) {
      url = url.replace(entry, 'grubosc=');
    });
    const newOrder = { textContent: textContent, url: url };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  function removeOrderFromLocalStorage(index) {
    const orders = getOrdersFromLocalStorage();
    orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(orders));
    showOrdersListFromLocalStorage();
  }

  function confirmRemoveOrder(index) {
    const dialog = document.getElementById('potwierdz-usuniecie');
    dialog.showModal();
    dialog.querySelector('button').addEventListener('click', function() {
      removeOrderFromLocalStorage(index);
      dialog.close();
    });
    dialog.addEventListener('click', function() { dialog.close() });
  }

  function showOrdersListFromLocalStorage() {
    const orders = getOrdersFromLocalStorage();
    if (orders.length > 0) {
      ordersListSection.classList.remove('hidden');
      ordersListSection.querySelector('ul').innerHTML = '';
      orders.forEach(function(order) {
        const open = '<a class="make-order" href="' + order.url + '" target="_blank">Zamów</a>';
        const remove = '<button class="remove-order" type="button">Usuń</button>';
        const summaryText = '<div>' + order.textContent + '</div>';
        const buttonsColumn = '<div class="buttons-column">' + open + remove + '</div>';
        const li = document.createElement('li');
        li.innerHTML = summaryText + buttonsColumn;
        ordersListSection.querySelector('ul').appendChild(li);
      });
      ordersListSection.querySelectorAll('.remove-order').forEach(function(button, index) {
        button.addEventListener('click', function() { confirmRemoveOrder(index); });
      });
    } else {
      ordersListSection.classList.add('hidden');
    }
  }

  function resetForm() {
    form.reset();
    localStorage.removeItem(formId);
    setTextWhenSizesNotSet();
    showHideHurtRabat();
    showHideGruboscOptions();
    saveToLocalStorageAndUpdateDisplay();
  }

  function addOrderToList() {
    const data = getFormData();
    if (!isSameKindOrder()) {
      queriesString = "?kalkulator=true&";
    }
    for (entry in data) {
      if (data[entry] !== "") {
        let value = entry ;
        if (entriesToAddRowNumber.includes(entry)) {
          value += '-row-' + currentNewRowNumber;
        } 
        queriesString += value + "=" + data[entry] + "&";
      }
    }
    const url = getOrderURL(queriesString);
    addOrderToLocalStorage(currentOrderDescription.innerText, url);
    resetForm();
    showOrdersListFromLocalStorage();
  }

  function toggleOrderButtons(isValid) {
    const isSameKind = isSameKindOrder();
    addOrderButton.disabled = !isValid || isSameKind;
    addElementButton.disabled = !isValid || !isSameKind;
  };

  function toggleTopPanelLock() {
    const isSameKind = isSameKindOrder();
    topPanelFields.forEach(function(fieldOrList) {
      const field = fieldOrList[0] || fieldOrList;
      const formGroup = field.closest('.form-group');
      formGroup && formGroup.classList.toggle('locked', isSameKind);
    });
  }

  function addEventListeners() {
    addListenerToRadios(klientDetalHurt, 'change', showHideHurtRabat);
    rabatInput.addEventListener('input', function() { setDiscountValue(); });
    addListenerToRadios(rodzaj, 'change', function(event) { showHideGruboscOptions(event.target.value); });
    addListenerToRadios(naroznik, 'change', function(event) { checkIfStoneSelected(event); }); // chyba można usunąć Funtion(e) ???
    [gruboscStandard, gruboscWilgoc, kolor, zamowienie, krawedz, ksztalt].forEach(function(radios) { addListenerToRadios(radios, 'change', function(event) { saveToLocalStorageAndUpdateDisplay(event) }) });
    ['szerokosc', 'dlugosc', 'ilosc'].forEach(function(id) { document.getElementById(id).addEventListener('change', function() { verifyMaxValue.call(this); }); });
    addOrderButton.addEventListener('click', addOrderToList);
  }

  addEventListeners();
  setTextWhenSizesNotSet();
  checkForDataInLocalStorage();
  showOrdersListFromLocalStorage();
  showHideHurtRabat();
  showHideGruboscOptions();
}

init();
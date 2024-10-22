function init() {
  function getNetto(cenaBrutto) {
    return cenaBrutto / 1.23;
  }

  const cenyZa1m2 = {
    Hurtowy: {
      folia: {
        standard: {
          18: 260.2,
          22: 274.8,
          28: 302.4
        },
        wilgoc: {
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
        wilgoc: {
          19: 375.6,
          25: 411.4,
          30: 469.9
        }
      }
    },
    Detaliczny: {
      folia: {
        standard: {
          18: getNetto(365),
          22: getNetto(433),
          28: getNetto(480)
        },
        wilgoc: {
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
        wilgoc: {
          19: getNetto(803),
          25: getNetto(878),
          30: getNetto(953)
        }
      }
    }
  };

  const formId = 'kalkulator-parapetow';
  const form = document.getElementById(formId);
  const klientDetalHurt = document.querySelectorAll('[name="klient-detal-hurt"]');
  const hurtRabat = document.getElementById('hurt-rabat');
  const rabatInput = document.getElementById('rabat-value');
  const rodzaj = document.querySelectorAll('[name="rodzaj"]');
  const gruboscStandard = document.querySelectorAll('[name="standard"]');
  const gruboscWilgoc = document.querySelectorAll('[name="wilgoc"]');
  const wykonczenie = document.querySelectorAll('[name="wykonczenie"]');
  const szerokoscInput = document.getElementById('szerokosc');
  const dlugoscInput = document.getElementById('dlugosc');
  const iloscInput = document.getElementById('ilosc');
  const naroznik = document.querySelectorAll('[name="naroznik"]');
  const krawedz = document.querySelectorAll('[name="krawedz"]');
  const ksztalt = document.querySelectorAll('[name="ksztalt"]');
  let rabat = 1;
  
  function getRodzajValue() {
    const rodzaj = document.querySelector('[name="rodzaj"]:checked');
    return rodzaj ? rodzaj.value : null;
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

  function showHideGruboscOptions(event) {
    const isStandard = event ? event.target.value === 'standard' : getRodzajValue() === 'standard';
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
    event && flashChangedRadioGroup(['standard', 'wilgoc']);
    saveToLocalStorageAndUpdateDisplay();
  }

  function setTextWhenSizesNotSet() {
    ["cena-brutto", "powierzchnia", "cena-netto"].forEach(function(id) {
      const element = document.getElementById(id);
      element.innerText = "Wprowadź wymiary";
    });
  }

  function getKlientKind() {
    const klientKind = document.querySelector('[name="klient-detal-hurt"]:checked');
    return klientKind ? klientKind.value : null;
  }

  function updatePrice() {
    const klientKind = getKlientKind();
    const rodzajValue = getRodzajValue();
    const gruboscValue = rodzajValue ?
      (rodzajValue === 'standard' ?
        document.querySelector('[name="standard"]:checked').value : 
        document.querySelector('[name="wilgoc"]:checked').value) :
      null;
    const wykonczenie = document.querySelector('[name="wykonczenie"]:checked');
    const wykonczenieValue = wykonczenie ? wykonczenie.value : null;

    if (klientKind && rodzajValue && gruboscValue && wykonczenieValue) {
      const cenaZa1m2 = cenyZa1m2[klientKind][wykonczenieValue][rodzajValue][gruboscValue];
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
        document.getElementById('powierzchnia').innerText = Math.round(powierzchnia) + ' cm²' + ' (' + (powierzchnia / 10000).toFixed(3) + ' m²)';
        document.getElementById('cena-brutto').innerText = (cena * (powierzchnia / 10000) * 1.23 * ilosc * rabat).toFixed(2) + ' zł';
        document.getElementById('cena-netto').innerText = (cena * (powierzchnia / 10000) * ilosc * rabat).toFixed(2) + ' zł';
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
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  }

  function saveToLocalStorageAndUpdatePrice() {
    const data = getFormData(formId);
    console.log('set data', data);
  function saveToLocalStorageAndUpdateDisplay() {
    const data = getFormData();
    localStorage.setItem(formId, JSON.stringify(data));
    obliczCene();
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

  function isDiscountValid(value) {
    value === 'hurt' && rabatInput.value > 0;
  }

  function setDiscountValue(value) {
    rabat = isDiscountValid(value) ? 1 - parseFloat(rabatInput.value) / 100 : 1;
    saveToLocalStorageAndUpdateDisplay();
  }

  function showHideHurtRabat() {
    const value = getKlientKind();
    hurtRabat.classList.toggle('hidden', value !== 'Hurtowy');
    setDiscountValue(value);
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

  function addEventListeners() {
    addListenerToRadios(klientDetalHurt, 'change', showHideHurtRabat);
    rabatInput.addEventListener('input', setDiscountValue);
    addListenerToRadios(rodzaj, 'change', function(event) { showHideGruboscOptions(event); });
    addListenerToRadios(naroznik, 'change', function(event) { checkIfStoneSelected(event); });
    [gruboscStandard, gruboscWilgoc, wykonczenie,  krawedz, ksztalt].forEach(function(radios) { addListenerToRadios(radios, 'change', saveToLocalStorageAndUpdateDisplay) });
    ['szerokosc', 'dlugosc', 'ilosc'].forEach(function(id) { document.getElementById(id).addEventListener('change', function() { verifyMaxValue.call(this); }); });
  }

  addEventListeners();
  setTextWhenSizesNotSet();
  checkForDataInLocalStorage();
  showHideHurtRabat();
  showHideGruboscOptions();
}

init();
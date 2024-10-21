function init() {
  function getNetto(cenaBrutto) {
    return cenaBrutto / 1.23;
  }

  const cenyZa1m2 = {
    hurt: {
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
    detal: {
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
  let rabat = 1;
  
  function getRodzajValue() {
    return document.querySelector('[name="rodzaj"]:checked').value;
  }

  function showHideGruboscOptions(event) {
    const isStandard = event ? event.target.value === 'standard' : getRodzajValue() === 'standard';
    const show = isStandard ? gruboscStandard : gruboscWilgoc;
    const hide = isStandard ? gruboscWilgoc : gruboscStandard;
    show.forEach((radio, i) => {
      radio.checked = i === 0;
      radio.parentElement.classList.remove('hidden');
    });
    hide.forEach(radio => {
      radio.checked = false;
      radio.parentElement.classList.add('hidden');
    });
    saveToLocalStorageAndUpdatePrice();
  }

  function setTextWhenSizesNotSet() {
    ["cena-brutto", "powierzchnia", "cena-netto"].forEach(id => {
      const element = document.getElementById(id);
      element.innerText = "Wprowadź wymiary";
      // element.classList.add('text-warning');
    });
  }

  function getDetalHurtValue() {
    return document.querySelector('[name="klient-detal-hurt"]:checked').value;
  }

  function updatePrice() {
    const klientDetalHurtValue = getDetalHurtValue();
    const rodzajValue = getRodzajValue();
    const gruboscValue = rodzajValue === 'standard' ?
      document.querySelector('[name="standard"]:checked').value : 
      document.querySelector('[name="wilgoc"]:checked').value;
    const wykonczenieValue = document.querySelector('[name="wykonczenie"]:checked').value;
    console.log(klientDetalHurtValue, wykonczenieValue, rodzajValue, gruboscValue);
    const cenaZa1m2 = cenyZa1m2[klientDetalHurtValue][wykonczenieValue][rodzajValue][gruboscValue];
    document.getElementById('cena-m2-netto').innerText = cenaZa1m2.toFixed(2) + ' zł';
    document.getElementById('cena-m2-brutto').innerText = (cenaZa1m2 * 1.23).toFixed(2) + ' zł';
    return cenaZa1m2;
  }

  function obliczCene() {
    const cena = updatePrice();
    const szerokosc = parseFloat(szerokoscInput.value);
    const dlugosc = parseFloat(dlugoscInput.value);
    const ilosc = parseInt(iloscInput.value);
    
    if (!isNaN(szerokosc) && !isNaN(dlugosc) && !isNaN(ilosc)) {
      try {
        const powierzchnia = szerokosc * dlugosc;
        console.log('powierzchnia', powierzchnia, cena, ilosc, rabat);
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
    radios.forEach(radio => radio.addEventListener(type, callback));
  }

  function getFormData(id) {
    const form = document.getElementById(id);
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
    localStorage.setItem(formId, JSON.stringify(data));
    obliczCene();
  }

  function checkForDataInLocalStorage() {
    if (!localStorage) return;
    const data = localStorage.getItem(formId);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('get parsedData', parsedData);
      for (const key in parsedData) {
        console.log('key', key, parsedData[key]);        
        var element = document.querySelector('[name="' + key + '"][value="' + parsedData[key] + '"]');
        console.log('element', element);
        
        if (!element) continue;
        if (element.type === 'radio') {
          element.checked = true;
        } else if (element.type === 'number') {
          element.value = parsedData[key];
        }
      }
    }
  }

  function isDiscountValid(value) {
    value === 'hurt' && rabatInput.value > 0;
  }

  function setDiscountValue(value) {
    rabat = isDiscountValid(value) ? 1 - parseFloat(rabatInput.value) / 100 : 1;
    saveToLocalStorageAndUpdatePrice();
  }

  function showHideHurtRabat() {
    const value = getDetalHurtValue();
    hurtRabat.classList.toggle('hidden', value !== 'hurt');
    setDiscountValue(value);
  }

  function verifyMaxValue() {
    console.log('this.max', this, this.max);
    if (parseInt(this.value) > this.max) this.value = this.max;
    if (parseInt(this.value) < this.min) this.value = this.min;
    saveToLocalStorageAndUpdatePrice();
  }

  addListenerToRadios(klientDetalHurt, 'change', showHideHurtRabat);
  rabatInput.addEventListener('input', setDiscountValue);
  addListenerToRadios(rodzaj, 'change', function(event) { showHideGruboscOptions(event); });
  [gruboscStandard, gruboscWilgoc, wykonczenie].forEach(radios => addListenerToRadios(radios, 'change', saveToLocalStorageAndUpdatePrice));
  ['szerokosc', 'dlugosc', 'ilosc'].forEach(id => document.getElementById(id).addEventListener('change', function() { verifyMaxValue.call(this); }));

  setTextWhenSizesNotSet();
  checkForDataInLocalStorage();
  showHideHurtRabat();
  showHideGruboscOptions();
}

init();
const cenaZaCm2Standard = 0.05935;
const cenaZaCm2Wilgoc = 0.06935;
const mnoznikFolia = 1.2;
const mnoznikLakier = 1;
const grubosciStandard = document.getElementById('grubosci-standard');
const grubosciWilgoc = document.getElementById('grubosci-wilgoc');
const gruboscSelectWilgoc = document.getElementById('grubosc-wilgoc');
const gruboscSelectStandard = document.getElementById('grubosc-standard');
let cenaZaCm2 = cenaZaCm2Standard;
let mnoznikWykonczenie = mnoznikFolia;
let gruboscSelect = gruboscSelectStandard;
let mnoznikGrubosc = 1;

function updatePriceFor1m2() {
  document.getElementById('cena-m2').innerText = (cenaZaCm2 * 10000 * mnoznikWykonczenie * mnoznikGrubosc * 1.23).toFixed(2) + ' zł';
  document.getElementById('cena-m2-netto').innerText = (cenaZaCm2 * 10000 * mnoznikWykonczenie * mnoznikGrubosc).toFixed(2) + ' zł';
}
function setTextWhenSizesNotSet() {
  document.getElementById('cena').innerText = "Wprowadź wymiary";
  document.getElementById('powierzchnia').innerText = "Wprowadź wymiary";
  document.getElementById('cena-netto').innerText = "Wprowadź wymiary";
  updatePriceFor1m2();
}
function obliczCene() {
  updatePriceFor1m2();
  const szerokosc = parseFloat(document.getElementById('szerokosc').value);
  const dlugosc = parseFloat(document.getElementById('dlugosc').value);
  const ilosc = parseInt(document.getElementById('ilosc').value);
  const powierzchnia = szerokosc * dlugosc;
  const cena = powierzchnia * cenaZaCm2 * gruboscSelect.value * mnoznikWykonczenie * mnoznikGrubosc * ilosc;

  if (isNaN(szerokosc) || isNaN(dlugosc)) {
    setTextWhenSizesNotSet();
  } else {
    document.getElementById('powierzchnia').innerText = powierzchnia.toFixed(1) + ' cm²' + ' (' + (powierzchnia / 10000).toFixed(2) + ' m²)';
    document.getElementById('cena').innerText = (cena * 1.23).toFixed(2) + ' zł';
    document.getElementById('cena-netto').innerText = cena.toFixed(2) + ' zł';
  }
}

document.getElementById('rodzajParapetu').addEventListener('change', function (event) {
  if (event.target.value === 'wilgoc') {
    cenaZaCm2 = cenaZaCm2Wilgoc * mnoznikWykonczenie;
    gruboscSelect = gruboscSelectWilgoc;
    grubosciStandard.classList.add('hidden');
    grubosciWilgoc.classList.remove('hidden');
  } else if (event.target.value === 'standard') {
    cenaZaCm2 = cenaZaCm2Standard * mnoznikWykonczenie;
    gruboscSelect = gruboscSelectStandard;
    grubosciStandard.classList.remove('hidden');
    grubosciWilgoc.classList.add('hidden');
  }
  mnoznikGrubosc = parseFloat(gruboscSelect.value);
  obliczCene();
});

function changeWykonczenie(event) {
  mnoznikWykonczenie = parseFloat(event.target.value);
  obliczCene();
}

function changeGrubosc(event) {
  mnoznikGrubosc = parseFloat(event.target.value);
  obliczCene();
}

gruboscSelectWilgoc.addEventListener('change', changeGrubosc);
gruboscSelectStandard.addEventListener('change', changeGrubosc);
document.getElementById('szerokosc').addEventListener('input', obliczCene);
document.getElementById('dlugosc').addEventListener('input', obliczCene);
document.getElementById('ilosc').addEventListener('input', obliczCene);
document.getElementById('wykonczenieKrawedzi').addEventListener('change', obliczCene);
document.querySelectorAll('[name="wykonczenie"]').forEach(radio => {
  radio.addEventListener('change', changeWykonczenie);
});

setTextWhenSizesNotSet();


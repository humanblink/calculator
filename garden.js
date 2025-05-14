// Geneva Garden Irrigation Calculator JS script
// Author: HUMANBLINK Innovation
// JS Version: 3.0.0 (Added total line in table footer)

const ET0 = {
  Janvier: 0.5, Février: 0.75, Mars: 1.41, Avril: 2.37,
  Mai: 3.31, Juin: 4.27, Juillet: 4.75, Août: 4.29,
  Septembre: 2.85, Octobre: 1.9, Novembre: 0.95, Décembre: 0.5
};

const averageMonthlyRain = {
  Janvier: 60, Février: 55, Mars: 65, Avril: 70,
  Mai: 80, Juin: 90, Juillet: 75, Août: 70,
  Septembre: 65, Octobre: 80, Novembre: 75, Décembre: 65
};

const kcValues = {
  "Gazon": 0.95,
  "Plantes ornementales": 0.90,
  "Jardin mixte": 0.85,
  "Légumes": 0.90
};

const irrigationEfficiency = {
  "Goutte-à-goutte": 0.90,
  "Sprinkler": 0.75,
  "Arrosage manuel": 0.60
};

const soilLossFactor = {
  "Argileux": 0.85,
  "Limoneux": 1.00,
  "Sableux": 1.20,
  "Tourbeux": 1.10
};

const frequencyToEvents = {
  "Chaque jour": 30,
  "Chaque 2 jours": 15,
  "Chaque 3 jours": 10,
  "1 fois par semaine": 4
};

const monthDays = {
  Janvier: 31, Février: 28, Mars: 31, Avril: 30,
  Mai: 31, Juin: 30, Juillet: 31, Août: 31,
  Septembre: 30, Octobre: 31, Novembre: 30, Décembre: 31
};

function getSelectedMonths() {
  const checkboxes = document.querySelectorAll('input[name="month"]:checked');
  return Array.from(checkboxes).map(cb => cb.labels[0].innerText);
}

function formatSwiss(val) {
  const rounded = Math.ceil(val);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function calculateIrrigation() {
  const area = parseFloat(document.getElementById('area').value);
  const plantType = document.getElementById('plantType').value;
  const soilType = document.getElementById('soilType').value;
  const irrigationType = document.getElementById('irrigationType').value;
  const frequency = document.getElementById('frequency').value;
  const months = getSelectedMonths();

  if (isNaN(area) || months.length === 0) {
    alert("Veuillez entrer une surface valide et sélectionner au moins un mois.");
    return;
  }

  const Kc = kcValues[plantType];
  const efficiency = irrigationEfficiency[irrigationType];
  const soilFactor = soilLossFactor[soilType];
  const eventsPerMonth = frequencyToEvents[frequency];

  let resultHTML = '<table class="result-table">';
  resultHTML += '<thead><tr><th>Mois</th><th>Pluie</th><th>ET₀</th><th>Pertes</th><th>Besoin</th><th>Fréq.</th><th>par arrosage</th></tr></thead>';
  resultHTML += '<tbody>';

  let totalNeed = 0;

  months.forEach(month => {
    const days = monthDays[month];
    const et0 = ET0[month];
    const rain = averageMonthlyRain[month];

    const grossNeed = (et0 * Kc * area * days) / 1000 / efficiency;
    const effectiveRain = 0.85 * rain * area / 1000;
    const rainLoss = effectiveRain * 0.15;
    let adjustedNetNeed = Math.max(0, (grossNeed - (effectiveRain - rainLoss)) * soilFactor);
    if (document.getElementById('sensorAdjustment').checked) {
      adjustedNetNeed *= 0.65;
    }

    totalNeed += adjustedNetNeed;
    const perEvent = adjustedNetNeed / eventsPerMonth;

    resultHTML += `<tr>
      <td>${month}</td>
      <td>${formatSwiss(effectiveRain)}</td>
      <td>${formatSwiss(grossNeed)}</td>
      <td>${formatSwiss(rainLoss)}</td>
      <td>${formatSwiss(adjustedNetNeed)}</td>
      <td>${frequency}</td>
      <td>${formatSwiss(perEvent)}</td>
    </tr>`;
  });

  resultHTML += '</tbody>';
  resultHTML += `<tfoot><tr>
    <th scope="row" colspan="4" style="text-align:left;">Total</th>
    <td style="font-weight:bold;color:#2a7f62;">${formatSwiss(totalNeed)}</td>
    <td colspan="2"></td>
  </tr></tfoot>`;
  resultHTML += '</table>';

  document.getElementById('results').innerHTML = '<h3>📊 Résultats</h3>' + resultHTML;
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('irrigationType').addEventListener('change', () => {
    const type = document.getElementById('irrigationType').value;
    const defaultEff = Math.round(irrigationEfficiency[type] * 100);
    document.getElementById('efficiency').value = defaultEff.toString();
  });
  document.querySelector('.btn-calculate').addEventListener('click', calculateIrrigation);
});

// Version JS 2.8.2 - Auteur : HUMANBLINK Innovation - Date : 2025-05-16
// Changes in v2.1: Reorganized output order - moved "Coût total après réduction" to appear after "Consommation totale"
// Changes in v2.2: Reorganized output into "État Actuel" and "État Futur" sections, moved variable/fixed costs to a footnote
// Changes in v2.3: Changed "Économies Réalisées" to "C. Économies Réalisées" for consistency; Set section headers to blue color
// Changes in v2.4: Added wrapper divs around section content for better spacing control and visual grouping
// Changes in v2.5: Consolidated footnote sections to eliminate redundancy, improved organization of calculation details
// Changes in v2.6: Restored detailed calculation breakdown text in the footnote for transparency
// Changes in v2.7: Standardized styling of result tables across calculators
// Changes in v2.8: Enhanced sources in footnote with links and improved formatting
// Changes in v2.8.1: Version increment for cache busting, fixed function declaration
// Changes in v2.8.2: Added auto-load of garden and building calculation values

// Définition des tranches tarifaires SIG 2025 (particulier)
const tiers = [
  { upTo: 100, unitPrice: 0.00, fixed: 579 },
  { upTo: 500, unitPrice: 5.00, fixed: 579 },
  { upTo: 5000, unitPrice: 3.89, fixed: 2579 },
  { upTo: 20000, unitPrice: 3.24, fixed: 19634 },
  { upTo: Infinity, unitPrice: 2.87, fixed: 68234 }
];

// Formateur suisse : 1 décimale + apostrophe
function formatSwiss(val) {
  return val.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// Fonction principale de calcul des coûts
function calculateCost() {
  const irrigationInput = parseFloat(document.getElementById('irrigation').value) || 0;
  const reduction = parseFloat(document.getElementById('reduction').value) || 0;
  const building = parseFloat(document.getElementById('building').value) || 0;

  // Application de la réduction sur la consommation d'irrigation
  const reducedIrrigation = irrigationInput * (1 + reduction / 100);
  const total = reducedIrrigation + building;

  let cost = 0;
  let fixed = 0;
  let explanation = [];

  // Calcul du coût en fonction de la tranche tarifaire applicable
  for (let i = 0, prev = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    if (total <= tier.upTo) {
      const m3 = total - prev;
      cost += m3 * tier.unitPrice;
      fixed = tier.fixed;
      explanation.push(
        `Tranche ${formatSwiss(prev + 1)} à ${formatSwiss(tier.upTo)} m³ → ` +
        `${formatSwiss(m3)} m³ × CHF ${formatSwiss(tier.unitPrice)} = CHF ${formatSwiss(m3 * tier.unitPrice)} (fixe: CHF ${formatSwiss(tier.fixed)})`
      );
      break;
    } else {
      prev = tier.upTo;
    }
  }

  const totalCost = cost + fixed;
  const monthlyCost = totalCost / 12;

  const irrigationBefore = irrigationInput;
  const irrigationAfter = reducedIrrigation;
  const savedWater = irrigationBefore - irrigationAfter;
  const tierUsed = tiers.find(t => total <= t.upTo) || tiers[tiers.length - 1];
  const savedCHF = savedWater * tierUsed.unitPrice;

  const totalInitial = irrigationBefore + building;
  const totalInitialCost = totalCost + savedCHF;
  const savingsPct = (100 * savedCHF / totalInitialCost);

  // Construction du bloc de sortie HTML avec les résultats
  // CHANGED: Consolidated footnote sections to eliminate redundancy
  const outputHTML = `
    <h2>Résultats détaillés</h2>
    
    <h3 style="color: #0288d1;">A. État Actuel</h3>
    <div class="section-content">
      <p>Consommation espaces verts initiale : ${formatSwiss(irrigationBefore)} m³/an</p>
      <p>Consommation bâtiments : ${formatSwiss(building)} m³/an</p>
      <p><strong>Consommation totale initial (espaces verts + bâtiment) :</strong> <span style="color: red;">${formatSwiss(totalInitial)} m³/an</span></p>
      <p><strong>Cout total initial :</strong> <span style="color: red;">CHF ${formatSwiss(totalInitialCost)}</span></p>
    </div>

    <h3 style="color: #0288d1;">B. État Futur</h3>
    <div class="section-content">
      <p>Réduction appliquée à la consommation d'espaces verts : ${formatSwiss(Math.abs(reduction))}%</p>
      <p>Consommation espaces verts après réduction : ${formatSwiss(irrigationAfter)} m³/an</p>
      <p><strong>Consommation totale (espaces verts + bâtiment) après réduction :</strong> <span style="color: green;">${formatSwiss(total)} m³/an</span></p>
      <p><strong>Coût total après réduction :</strong> <span style="color: green;">CHF ${formatSwiss(totalCost)}</span></p>
      <p>Consommation mensuelle moyenne : ${formatSwiss(total / 12)} m³/mois</p>
      <p>Coût mensuel : CHF ${formatSwiss(monthlyCost)}</p>
    </div>

    <h3 style="color: #0288d1;">C. Économies Réalisées</h3>
    <div class="section-content">
      <p><strong>Économie totale (Cout total initial - Cout total après réduction) :</strong> <span style="color: green;">CHF ${formatSwiss(savedCHF)}</span></p>
      <p>Économie totale en % du Cout total initial : ${formatSwiss(savingsPct)}%</p>
    </div>

    <div class="calculation-base">
      <h4>Base de Calcul :</h4>
      
      <p>
      annuel fixe : CHF ${formatSwiss(fixed)}<br>
      Tranche tarifaire appliquée : ${tierUsed.upTo === Infinity ? ">" + formatSwiss(tiers[tiers.length-2].upTo) : "≤" + formatSwiss(tierUsed.upTo)} m³<br>
      Prix unitaire : CHF ${formatSwiss(tierUsed.unitPrice)}/m³<br>
      Détails du calcul : ${explanation.join(', ')}
      </p>
      
      <p>
      <strong>Détails du coût :</strong><br>
      Coût variable (eau utilisée) : CHF ${formatSwiss(cost)}<br>
      Abonnement annuel fixe : CHF ${formatSwiss(fixed)}
      </p>
      
      <p>
      <strong>Sources :</strong><br>
      <span class="source-link"><a href="https://ww2.sig-ge.ch/particuliers/offres/eau" target="_blank">SIG Genève</a></span> - Données tarifaires 2025<br>
      <span class="source-link"><a href="https://www.ge.ch/document/eau-tarifs" target="_blank">Canton de Genève</a></span> - Règlements sur les eaux<br>
      <span class="source-link"><a href="https://www.bafu.admin.ch/bafu/fr/home/themes/eaux.html" target="_blank">OFEV</a></span> - Office fédéral de l'environnement<br>
      TVA non incluse.<br>
      Prix/m³ inclut : eau potable, traitement eaux usées, réseau secondaire, redevance fédérale.
      </p>
      
      <p>
      <strong>Remarques :</strong><br>
      Ce calcul suppose un profil "particulier". Pour les entreprises ou collectivités, les tarifs peuvent varier.<br>
      La première tranche (0–100 m³) est incluse dans l'abonnement fixe sans surcoût.<br>
      Les réductions simulées sont indicatives et doivent être validées par des données réelles de capteurs.
      </p>
    </div>
  `;

  document.getElementById('output').innerHTML = outputHTML;
}

// Function to auto-load values from garden and building calculators
function autoLoadValues() {
  // Check if garden total is available
  if (window.gardenTotalNeed && document.getElementById('irrigation')) {
    document.getElementById('irrigation').value = window.gardenTotalNeed;
    document.getElementById('irrigation').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('irrigation').classList.remove('auto-populated');
    }, 2000);
  }
  
  // Check if building total is available
  if (window.buildingTotalConsumption && document.getElementById('building')) {
    document.getElementById('building').value = window.buildingTotalConsumption;
    document.getElementById('building').classList.add('auto-populated');
    setTimeout(() => {
      document.getElementById('building').classList.remove('auto-populated');
    }, 2000);
  }
}

// Set up event listeners when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  // Auto-load values when the page loads
  autoLoadValues();
  
  // Add event listeners for calculate button
  const calculateButton = document.querySelector('#cost-section button');
  if (calculateButton) {
    calculateButton.addEventListener('click', calculateCost);
  }
});
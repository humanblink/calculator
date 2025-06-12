// Version JS 1.0.0 - Auteur : HUMANBLINK Innovation - Date : 2025-06-11 16:15
// PDF Download Functionality using Print-to-PDF
// Features:
// - Professional PDF generation with HUMANBLINK branding
// - Includes all calculation results and parameters
// - Clean, print-optimized layout
// - Contact information and disclaimer
// - Date stamping for report tracking

/**
 * Main function to generate PDF download
 * Uses browser's native print-to-PDF functionality
 */
function downloadPDF() {
  // Check if any calculations have been performed
  if (!hasCalculationResults()) {
    alert('Veuillez d\'abord effectuer au moins un calcul avant de télécharger le rapport.');
    return;
  }
  
  // Set the current date for the report
  updatePrintDate();
  
  // Prepare the page for printing
  preparePrintLayout();
  
  // Small delay to ensure layout is ready
  setTimeout(() => {
    // Trigger browser print dialog
    window.print();
    
    // Restore normal layout after print dialog
    setTimeout(() => {
      restoreNormalLayout();
    }, 1000);
  }, 100);
}

/**
 * Check if user has performed any calculations
 * @returns {boolean} True if results exist
 */
function hasCalculationResults() {
  // Check for garden results
  const gardenResults = document.getElementById('results');
  const hasGardenResults = gardenResults && gardenResults.innerHTML.trim() !== '';
  
  // Check for building results
  const buildingResults = document.getElementById('buildingResults');
  const hasBuildingResults = buildingResults && buildingResults.innerHTML.trim() !== '';
  
  // Check for cost results
  const costResults = document.getElementById('output');
  const hasCostResults = costResults && costResults.innerHTML.trim() !== '';
  
  return hasGardenResults || hasBuildingResults || hasCostResults;
}

/**
 * Update the print date in the header
 */
function updatePrintDate() {
  const printDateElement = document.getElementById('print-date');
  if (printDateElement) {
    const now = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    printDateElement.textContent = now.toLocaleDateString('fr-FR', options);
  }
}

/**
 * Prepare the page layout for printing
 */
function preparePrintLayout() {
  // Expand all collapsed footnotes for print
  const collapsedFootnotes = document.querySelectorAll('.calculation-base.collapsed');
  collapsedFootnotes.forEach(footnote => {
    footnote.classList.remove('collapsed');
    footnote.classList.add('expanded');
    footnote.dataset.wasCollapsed = 'true'; // Remember state for restoration
  });
  
  // Ensure all results sections are visible
  const resultsSections = document.querySelectorAll('#results, #buildingResults, #output');
  resultsSections.forEach(section => {
    if (section) {
      section.style.display = 'block';
    }
  });
  
  // Add print-ready class to body
  document.body.classList.add('print-ready');
}

/**
 * Restore normal layout after printing
 */
function restoreNormalLayout() {
  // Restore collapsed state of footnotes
  const expandedFootnotes = document.querySelectorAll('.calculation-base[data-was-collapsed="true"]');
  expandedFootnotes.forEach(footnote => {
    footnote.classList.remove('expanded');
    footnote.classList.add('collapsed');
    footnote.removeAttribute('data-was-collapsed');
  });
  
  // Remove print-ready class
  document.body.classList.remove('print-ready');
}

/**
 * Enhanced print functionality with user guidance
 */
function downloadPDFWithInstructions() {
  // Show instructions modal (optional enhancement)
  const showInstructions = confirm(
    'Instructions pour télécharger le PDF:\n\n' +
    '1. Cliquez sur "OK" pour ouvrir la boîte de dialogue d\'impression\n' +
    '2. Sélectionnez "Enregistrer au format PDF" comme destination\n' +
    '3. Choisissez l\'emplacement de sauvegarde\n' +
    '4. Cliquez sur "Enregistrer"\n\n' +
    'Continuer?'
  );
  
  if (showInstructions) {
    downloadPDF();
  }
}

/**
 * Check browser print capability
 * @returns {boolean} True if browser supports printing
 */
function checkPrintSupport() {
  return typeof window.print === 'function';
}

/**
 * Initialize download functionality when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
  // Check if print is supported
  if (!checkPrintSupport()) {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.style.display = 'none';
      console.warn('Print functionality not supported in this browser');
    }
  }
  
  // Add keyboard shortcut (Ctrl+P) for download
  document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      event.preventDefault();
      if (hasCalculationResults()) {
        downloadPDF();
      }
    }
  });
  
  console.log('PDF Download functionality loaded - Version 1.0.0');
});

/**
 * Alternative download function with more user guidance
 * Can be used instead of downloadPDF() if needed
 */
function downloadPDFGuided() {
  if (!hasCalculationResults()) {
    alert('Aucun calcul détecté. Veuillez utiliser au moins un des calculateurs avant de générer le rapport.');
    return;
  }
  
  // Create custom instructions overlay
  const overlay = document.createElement('div');
  overlay.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
                align-items: center; justify-content: center;">
      <div style="background: white; padding: 30px; border-radius: 10px; 
                  max-width: 500px; text-align: center;">
        <h3>📄 Génération du Rapport PDF</h3>
        <p>Dans la boîte de dialogue qui va s'ouvrir:</p>
        <ol style="text-align: left; margin: 20px 0;">
          <li>Sélectionnez <strong>"Enregistrer au format PDF"</strong></li>
          <li>Vérifiez que l'orientation est en <strong>Portrait</strong></li>
          <li>Cliquez sur <strong>"Enregistrer"</strong></li>
        </ol>
        <button onclick="this.parentElement.parentElement.remove(); downloadPDF();" 
                style="background: #014eeb; color: white; border: none; 
                       padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Continuer
        </button>
        <button onclick="this.parentElement.parentElement.remove();" 
                style="background: #ccc; color: black; border: none; 
                       padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
          Annuler
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}
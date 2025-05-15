// Version JS 1.0.2 - Auteur : HUMANBLINK Innovation - Date : 2025-05-16
// Collapsible footnotes functionality - Complete rewrite
// Changes in v1.0.2: Entirely new approach with direct visibility toggle instead of DOM restructuring

document.addEventListener("DOMContentLoaded", function() {
  // Define a MutationObserver to watch for dynamically created footnotes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            const footnotes = node.querySelectorAll ? node.querySelectorAll('.calculation-base') : [];
            if (footnotes.length > 0) {
              console.log("Found new footnotes:", footnotes.length);
              setupFootnotes(footnotes);
            } else if (node.classList && node.classList.contains('calculation-base')) {
              console.log("Found a single new footnote");
              setupFootnotes([node]);
            }
          }
        });
      }
    });
  });

  // Start observing the entire document for calculation-base sections
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initial setup for any existing footnotes
  setupFootnotes(document.querySelectorAll('.calculation-base'));
  
  // Function to set up footnotes
  function setupFootnotes(footnotes) {
    footnotes.forEach((footnote, index) => {
      // Skip if already processed
      if (footnote.dataset.processed === 'true') {
        return;
      }
      
      console.log(`Setting up footnote ${index + 1}`);
      
      // Get the heading element
      const heading = footnote.querySelector('h4');
      
      // Skip if no heading found
      if (!heading) {
        console.log(`Footnote ${index + 1} has no h4 heading, skipping`);
        return;
      }
      
      // Create toggle indicator if it doesn't exist
      if (!heading.querySelector('.toggle-indicator')) {
        const toggleIndicator = document.createElement('span');
        toggleIndicator.className = 'toggle-indicator';
        toggleIndicator.innerHTML = '▼';
        heading.appendChild(toggleIndicator);
      }
      
      // Mark non-heading elements as content
      Array.from(footnote.children).forEach(child => {
        if (child !== heading) {
          child.classList.add('calculation-content-item');
        }
      });
      
      // Set initial state (collapsed by default)
      footnote.classList.add('collapsed');
      
      // Add click event to toggle if not already added
      if (!heading.dataset.hasClickListener) {
        heading.addEventListener('click', () => {
          console.log(`Toggling footnote ${index + 1}`);
          if (footnote.classList.contains('collapsed')) {
            footnote.classList.remove('collapsed');
            footnote.classList.add('expanded');
          } else {
            footnote.classList.remove('expanded');
            footnote.classList.add('collapsed');
          }
        });
        
        heading.dataset.hasClickListener = 'true';
      }
      
      // Mark as processed to avoid duplicate processing
      footnote.dataset.processed = 'true';
    });
  }
});

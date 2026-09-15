document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('tabs-container');
  const sendBtn = document.getElementById('send-btn');
  const destinationSelect = document.getElementById('destination-select');
  const statusBadge = document.getElementById('status-badge');
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  
  let currentTabs = [];

  // Helper to extract clean domain name
  function getDomain(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch (e) {
      return 'Other';
    }
  }

  // Request tabs from background script
  chrome.runtime.sendMessage({ action: 'getTabs' }, (response) => {
    if (response && response.tabs) {
      currentTabs = response.tabs;
      renderTabs(currentTabs);
    }
  });

  function renderTabs(tabs) {
    tabsContainer.innerHTML = '';
    
    if (tabs.length === 0) {
      tabsContainer.innerHTML = '<div style="text-align:center; padding:20px; opacity:0.5;">No tabs found</div>';
      return;
    }

    // Group tabs by domain
    const groupedTabs = {};

    tabs.forEach(tab => {
      const domain = getDomain(tab.url);
      if (!groupedTabs[domain]) {
        groupedTabs[domain] = [];
      }
      groupedTabs[domain].push(tab);
    });

    // Helper to render a single tab item
    const createTabElement = (tab) => {
      const label = document.createElement('label');
      label.className = 'tab-pill selected';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'circular-checkbox';
      checkbox.checked = true;
      checkbox.value = tab.id;
      
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
      
      const faviconCircle = document.createElement('div');
      faviconCircle.className = 'favicon-circle';
      const img = document.createElement('img');
      img.src = tab.favIconUrl || 'icons/icon16.png';
      img.onerror = () => { img.src = 'icons/icon16.png'; };
      faviconCircle.appendChild(img);
      
      const titleDiv = document.createElement('div');
      titleDiv.className = 'tab-title';
      titleDiv.textContent = tab.title;
      titleDiv.title = tab.title;
      
      label.appendChild(checkbox);
      label.appendChild(faviconCircle);
      label.appendChild(titleDiv);
      
      return label;
    };

    // Render grouped tabs
    // Sort domains to put 'Other' at the bottom
    const domains = Object.keys(groupedTabs).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    });

    domains.forEach(domain => {
      // Only show header if there are multiple tabs or multiple domains, to keep it clean
      // Actually, let's always show it to be organized
      const header = document.createElement('div');
      header.className = 'group-header-pill';
      header.textContent = domain;
      tabsContainer.appendChild(header);

      groupedTabs[domain].forEach(tab => {
        tabsContainer.appendChild(createTabElement(tab));
      });
    });
  }

  // Update button text based on mode
  modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'report') {
        sendBtn.textContent = 'Generate Report';
      } else {
        sendBtn.textContent = 'Send Context';
      }
    });
  });

  sendBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.circular-checkbox:checked');
    const selectedTabIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedTabIds.length === 0) return;
    
    const selectedTabs = currentTabs.filter(tab => selectedTabIds.includes(tab.id));
    const destination = destinationSelect.value;
    
    // Determine selected mode
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    
    sendBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      sendBtn.style.transform = 'translateY(0)';
    }, 150);

    chrome.runtime.sendMessage({
      action: 'sendContext',
      tabs: selectedTabs,
      destination: destination,
      mode: selectedMode
    }, (response) => {
      if (response && response.success) {
        statusBadge.classList.remove('hidden');
        setTimeout(() => {
          statusBadge.classList.add('hidden');
        }, 2500);
      }
    });
  });
});

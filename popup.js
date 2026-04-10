const toggle = document.getElementById('toggle');
const stats = document.getElementById('stats');

// Charge l'état actuel
chrome.storage.local.get(['enabled', 'hiddenCount'], (data) => {
  const enabled = data.enabled !== false; // true par défaut
  toggle.checked = enabled;
  updateStats(data.hiddenCount || 0);
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });

  // Notifie le content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_ENABLED', enabled });
    }
  });

  // Met à jour l'icône
  const icon = enabled ? 'icons/icon48.png' : 'icons/icon48_off.png';
  chrome.action.setIcon({
    path: {
      16: enabled ? 'icons/icon16.png' : 'icons/icon16_off.png',
      48: enabled ? 'icons/icon48.png' : 'icons/icon48_off.png',
      128: enabled ? 'icons/icon128.png' : 'icons/icon128_off.png'
    }
  });
});

function updateStats(count) {
  stats.innerHTML = count > 0
    ? `<b>${count}</b> tweet${count > 1 ? 's' : ''} masqué${count > 1 ? 's' : ''} sur cette page`
    : `Aucun tweet masqué pour l'instant`;
}

// Écoute les mises à jour du compteur depuis le content script
chrome.storage.onChanged.addListener((changes) => {
  if (changes.hiddenCount) {
    updateStats(changes.hiddenCount.newValue || 0);
  }
});

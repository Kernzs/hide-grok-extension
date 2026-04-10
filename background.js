// Initialise l'état par défaut à l'installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, hiddenCount: 0 });
});

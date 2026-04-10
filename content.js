// Hide @Grok Tweets - content script

let extensionEnabled = true;
let hiddenCount = 0;

// Charge l'état initial
chrome.storage.local.get(['enabled'], (data) => {
  extensionEnabled = data.enabled !== false;
  processTweets();
});

// Écoute les messages du popup (toggle on/off)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_ENABLED') {
    extensionEnabled = msg.enabled;
    if (extensionEnabled) {
      // Réactive : retraite tous les tweets
      document.querySelectorAll('article[data-testid="tweet"]').forEach(t => {
        delete t.dataset.grokProcessed;
      });
      hiddenCount = 0;
      processTweets();
    } else {
      // Désactive : affiche tout
      document.querySelectorAll('.grok-hidden-wrapper').forEach(wrapper => {
        const cell = wrapper.closest('[data-testid="cellInnerDiv"]') || wrapper.parentElement;
        cell.style.display = '';
        wrapper.remove();
      });
      // Remet les tweets visibles
      document.querySelectorAll('[data-grok-hidden="true"]').forEach(el => {
        el.style.display = '';
        el.removeAttribute('data-grok-hidden');
      });
      hiddenCount = 0;
      chrome.storage.local.set({ hiddenCount: 0 });
    }
  }
});

function hasBlueVerifiedBadge(tweetEl) {
  const userBlock = tweetEl.querySelector('[data-testid="User-Name"]');
  if (!userBlock) return false;

  // Badge vérifié officiel X
  const verifiedBadge = userBlock.querySelector('svg[aria-label="Verified account"]');
  if (verifiedBadge) return true;

  // Fallback : cherche le SVG du badge bleu X Premium par son path caractéristique
  const svgs = userBlock.querySelectorAll('svg');
  for (const svg of svgs) {
    const paths = svg.querySelectorAll('path');
    for (const path of paths) {
      const d = path.getAttribute('d') || '';
      if (
        d.includes('M20.396 11c-.018-.646-.215-1.275-.57-1.816') ||
        d.includes('M22.25 12c0 5.385-4.365 9.75-9.75 9.75')
      ) {
        return true;
      }
    }
  }
  return false;
}

function mentionsGrok(tweetEl) {
  const tweetText = tweetEl.querySelector('[data-testid="tweetText"]');
  if (!tweetText) return false;
  const text = tweetText.innerText || tweetText.textContent || '';
  return text.toLowerCase().includes('@grok');
}

function createPlaceholder(authorName) {
  const placeholder = document.createElement('div');
  placeholder.className = 'grok-hidden-wrapper';
  placeholder.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid #2f3336;
    background: #15202b;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  const label = document.createElement('span');
  label.style.cssText = `font-size: 13px; color: #536471;`;
  label.textContent = `🙈 Tweet @Grok masqué${authorName ? ' — ' + authorName : ''}`;

  const btn = document.createElement('button');
  btn.textContent = 'Afficher';
  btn.style.cssText = `
    font-size: 12px;
    color: #1d9bf0;
    background: transparent;
    border: 1px solid #1d9bf0;
    border-radius: 20px;
    padding: 3px 12px;
    cursor: pointer;
    transition: background 0.15s;
  `;
  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'rgba(29,155,240,0.1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'transparent';
  });

  placeholder.appendChild(label);
  placeholder.appendChild(btn);

  return { placeholder, btn };
}

function processTweets() {
  if (!extensionEnabled) return;

  const tweets = document.querySelectorAll('article[data-testid="tweet"]');

  tweets.forEach(tweet => {
    if (tweet.dataset.grokProcessed) return;
    tweet.dataset.grokProcessed = 'true';

    if (!mentionsGrok(tweet)) return;
    if (hasBlueVerifiedBadge(tweet)) return;

    // Récupère le nom de l'auteur
    const authorEl = tweet.querySelector('[data-testid="User-Name"] span');
    const authorName = authorEl ? authorEl.textContent.trim() : '';

    // Cellule parente dans le feed
    const cell = tweet.closest('[data-testid="cellInnerDiv"]') || tweet.parentElement;

    // Crée le placeholder avec bouton
    const { placeholder, btn } = createPlaceholder(authorName);

    // Insère le placeholder avant la cellule
    cell.parentElement.insertBefore(placeholder, cell);

    // Cache la cellule originale
    cell.style.display = 'none';
    cell.setAttribute('data-grok-hidden', 'true');

    // Bouton "Afficher" : révèle le tweet et enlève le placeholder
    btn.addEventListener('click', () => {
      cell.style.display = '';
      cell.removeAttribute('data-grok-hidden');
      placeholder.remove();
      hiddenCount = Math.max(0, hiddenCount - 1);
      chrome.storage.local.set({ hiddenCount });
    });

    hiddenCount++;
    chrome.storage.local.set({ hiddenCount });
  });
}

// Observer pour scroll infini
const observer = new MutationObserver((mutations) => {
  let hasNew = false;
  for (const m of mutations) {
    if (m.addedNodes.length > 0) { hasNew = true; break; }
  }
  if (hasNew) setTimeout(processTweets, 300);
});

observer.observe(document.body, { childList: true, subtree: true });

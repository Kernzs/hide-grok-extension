# 🙈 Hide @Grok Tweets

Une extension Chrome qui masque automatiquement les tweets mentionnant **@grok** provenant de comptes **sans badge bleu vérifié** sur X/Twitter.

Les comptes avec le ✅ badge bleu ne sont pas affectés.

---

## ✨ Fonctionnalités

- 🔇 Masque les tweets @grok des comptes non vérifiés
- 👁️ Affiche un placeholder discret avec un bouton **"Afficher"** pour révéler un tweet à la demande
- 🔛 Toggle on/off depuis l'icône de l'extension dans Chrome
- 📊 Compteur de tweets masqués sur la page en cours
- ⚡ Fonctionne en temps réel au scroll (chargement dynamique)

---

## 📦 Installation

> ⚠️ L'extension n'est pas sur le Chrome Web Store. L'installation se fait en mode développeur.

1. **Télécharge** ce repo → bouton `Code` → `Download ZIP`
2. **Dézippe** le fichier téléchargé
3. Ouvre Chrome et va sur `chrome://extensions/`
4. Active le **Mode développeur** (toggle en haut à droite)
5. Clique sur **"Charger l'extension non empaquetée"**
6. Sélectionne le dossier dézippé
7. L'extension apparaît dans ta barre Chrome 🎉

---

## 🖥️ Utilisation

- **Activer / Désactiver** : clique sur l'icône de l'extension dans la barre Chrome
- **Révéler un tweet masqué** : clique sur le bouton `Afficher` dans le placeholder
- L'extension fonctionne automatiquement sur `twitter.com` et `x.com`

---

## 🔒 Permissions

| Permission | Raison |
|---|---|
| `storage` | Sauvegarder l'état on/off et le compteur |
| Accès à `x.com` / `twitter.com` | Lire et modifier le contenu de la page |

> Aucune donnée n'est collectée, envoyée ou stockée en dehors de ton navigateur.

---

## ⚠️ Limitations connues

- X/Twitter modifie régulièrement son DOM. Si l'extension cesse de fonctionner après une mise à jour de X, ouvre une **Issue** sur ce repo.
- La détection du badge bleu peut varier selon le type de compte vérifié (organisations gouvernementales, etc.)

---

## 📄 Licence

MIT — fais-en ce que tu veux.

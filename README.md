# SamaBudget

Application moderne de gestion budgétaire, personnalisable, multilingue (français/wolof), avec statistiques avancées, notifications, tutoriel interactif, et support Firebase.

---

## 🚀 Présentation
SamaBudget vous aide à suivre vos dépenses, épargner, relever des défis financiers, et analyser vos habitudes. L'application est responsive, accessible, et prête pour le web, le mobile (PWA) et l'intégration Firebase.

---

## ✨ Fonctionnalités principales
- Gestion complète des transactions (ajout, édition, suppression)
- Statistiques dynamiques (graphiques, comparaisons, top catégories)
- Objectifs d'épargne, défis, notifications, badges
- Personnalisation (thème, avatar, langue)
- Tutoriel interactif, page d'aide, accessibilité renforcée
- Export PDF, PWA, support Firebase (auth, données cloud)

---

## 🛠️ Stack technique
- **Next.js** (React 18, SSR/SSG)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (graphiques dynamiques)
- **Radix UI** (accessibilité, composants)
- **Firebase** (optionnel, cloud data)
- **Capacitor** (optionnel, mobile)

---

## ⚡ Installation locale
1. **Cloner le repo**
   ```bash
   git clone <repo-url>
   cd samabudget
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   pnpm install
   ```
3. **Lancer en développement**
   ```bash
   npm run dev
   ```
   Accédez à [http://localhost:3000](http://localhost:3000)

---

## 🔥 Intégrer Firebase (optionnel)
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Firestore, Auth, etc. selon vos besoins
3. Ajoutez le fichier `firebaseConfig.js` ou `.env.local` avec vos clés :
   ```js
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ...
   ```
4. Remplacez la logique locale par les hooks Firebase dans les contextes de données

---

## 🌐 Déploiement web (Vercel recommandé)
1. Poussez votre code sur GitHub
2. Connectez le repo à [Vercel](https://vercel.com/)
3. Configurez les variables d'environnement Firebase si besoin
4. Déployez en un clic

---

## 📱 Transformer en PWA/mobile
- L'app est déjà compatible PWA (installable sur mobile/tablette/desktop)
- Pour publier sur les stores :
  1. Ajoutez [Capacitor](https://capacitorjs.com/) : `npm install @capacitor/core @capacitor/cli`
  2. `npx cap init` puis `npx cap add android` ou `npx cap add ios`
  3. Suivez la doc Capacitor pour builder et publier

---

## ♿ Accessibilité & Internationalisation
- UI accessible (navigation clavier, aria-labels, contrastes)
- Tooltips et aides contextuelles partout
- Multilingue (français, wolof) via le système de traduction intégré

---

## 🙏 Crédits & Contact
- Développé par [VotreNom] (github.com/votrenom)
- Icônes : Lucide, Heroicons
- UI : Radix, Tailwind, Recharts

**Contact : [votre.email@exemple.com](mailto:votre.email@exemple.com)** 
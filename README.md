# Attentify Frontend

This is the frontend for **Attentify**, a unified, AI-powered customer support hub for Shopify stores.  
Built with **React**, **Vite**, and styled with **Tailwind CSS**.

---

## ✨ Features

- Modern, responsive UI
- Public landing page and authentication flows
- Unified inbox for all channels
- Settings, analytics, templates, and more
- Connects to the Attentify FastAPI backend

---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/your-org/attentify.git
cd attentify/frontend
```

### 2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Environment Variables**

Create a `.env` file for your API endpoint:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) (or as shown in your terminal) to view the app.

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/          # Shared UI components
│   ├── features/            # Feature modules (inbox, auth, etc.)
│   ├── hooks/
│   ├── layouts/
│   ├── pages/               # Route-level pages
│   ├── services/            # API clients
│   ├── store/               # State management
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🛠️ Useful Commands

- **Start dev server:** `npm run dev` or `yarn dev`
- **Build for production:** `npm run build` or `yarn build`
- **Preview production build:** `npm run preview` or `yarn preview`
- **Lint:** `npm run lint` or `yarn lint`

---

## 🧑‍💻 Contributing

See the main repository [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT

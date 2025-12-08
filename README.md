# TinyLearn Frontend

A clean and scalable Vite + React + TailwindCSS starter template with a well-organized folder structure.

## 🚀 Features

- ⚡ **Vite** - Next generation frontend tooling
- ⚛️ **React 19** - Modern UI library
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🛣️ **React Router** - Client-side routing
- 📦 **Scalable Structure** - Organized folder structure for building applications that scale

## 📁 Project Structure

```
src/
  ├── assets/          # Static assets (images, fonts, etc.)
  ├── components/      # Reusable UI components
  ├── features/        # Feature-specific components and logic
  ├── pages/           # Page-level components for routing
  ├── layouts/         # Layout wrapper components
  ├── hooks/           # Custom React hooks
  ├── contexts/        # React Context providers
  ├── services/        # API services and external integrations
  ├── utils/           # Utility functions and helpers
  ├── styles/          # Global styles and CSS files
  ├── App.jsx          # Main application component with routing
  └── main.jsx         # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NoLmuna/tinylearn-frontend.git
cd tinylearn-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 TailwindCSS

TailwindCSS is already configured and ready to use. The configuration file is at `tailwind.config.js` and the base styles are imported in `src/styles/globals.css`.

## 🧭 Routing

The application uses React Router v6 for client-side routing. Routes are configured in `src/App.jsx`.

### Current Routes

- `/` - Home page
- `/about` - About page
- `/dashboard` - Dashboard page
- `*` - 404 Not Found page

## 📝 Code Organization Guidelines

### Components
- Keep components small and focused
- Use PropTypes or JSDoc for documentation
- Place reusable components in `src/components/`

### Features
- Group related functionality in `src/features/`
- Each feature can have its own components, hooks, and utilities

### Pages
- Page components correspond to routes
- Compose pages from components and features

### Hooks
- Create custom hooks in `src/hooks/`
- Follow the `use` prefix naming convention

### Services
- Place API calls and external service integrations in `src/services/`
- Use the provided API service helper for consistent error handling

### Utils
- Add utility functions in `src/utils/`
- Keep functions pure and well-documented

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

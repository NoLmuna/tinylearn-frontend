# TinyLearn - Modern Learning Platform

A clean, modern, and fully responsive learning platform built with **Vite**, **React**, **React Router**, and **TailwindCSS**.

## 🚀 Features

- ✨ Modern and engaging landing page with smooth animations
- 🎨 Clean Tailwind CSS styling with gradient backgrounds
- 📱 Fully responsive design for all devices
- 🧭 Client-side routing with React Router v7
- 🎯 Organized page structure (Landing, Home, Features, About, Contact)
- 🔍 Smooth scrolling navigation
- 💡 Interactive navbar with mobile menu
- ⚡ Lightning-fast development with Vite

## 📂 Project Structure

```
tinylearn-frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   │   └── Navbar.jsx   # Modern navigation bar
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   │   ├── Landing.jsx  # Main landing page with all sections
│   │   ├── Home.jsx     # Dashboard/home page
│   │   ├── Features.jsx # Features overview page
│   │   ├── About.jsx    # About page
│   │   ├── Contact.jsx  # Contact page
│   │   └── NotFound.jsx # 404 page
│   ├── services/        # API services
│   ├── styles/
│   │   └── globals.css  # Global styles
│   ├── App.jsx          # Main app with routing
│   └── main.jsx         # Entry point
├── public/              # Public assets
└── package.json         # Dependencies and scripts
```

## 🛠️ Tech Stack

- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Next-generation build tool
- **React Router DOM 7.10.1** - Client-side routing
- **TailwindCSS 4.1.17** - Utility-first CSS framework
- **ESLint** - Code linting and quality

## 🎯 Pages

### Landing Page (`/`)
The main landing page includes:
- **Hero Section** - Eye-catching introduction with CTA buttons
- **Features Section** - Showcase of 6 key features with icons
- **About Section** - Platform information and statistics
- **Contact Section** - Contact form and contact information
- **Navigation Bar** - Links to Home, Features, About, Contact, and Sign In

### Home Page (`/home`)
User dashboard with learning statistics and progress cards

### Features Page (`/features`)
Detailed overview of all platform features

### About Page (`/about`)
Comprehensive information about TinyLearn and core values

### Contact Page (`/contact`)
Contact form with additional contact methods

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
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

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Colors
The project uses a blue color scheme. To change it, update the color classes in:
- `src/pages/Landing.jsx`
- `src/components/Navbar.jsx`
- Other component files

### Content
Edit the content in individual page components:
- `src/pages/Landing.jsx` - Landing page content
- `src/pages/About.jsx` - About page content
- Other page files

### Styling
Global styles are in `src/styles/globals.css`. The project uses TailwindCSS utility classes for component styling.

## 🌐 Routing

Routes are configured in `src/App.jsx`:
- `/` - Landing page
- `/home` - Home dashboard
- `/features` - Features page
- `/about` - About page
- `/contact` - Contact page
- `*` - 404 Not Found page

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for modern learners everywhere.

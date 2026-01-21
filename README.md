# Pogodapp ☀️🌧️

A modern weather application built with React, Redux Toolkit, and Vite.

## Features

- 🌍 Browse weather for multiple cities using mock data
- 📊 Detailed weather information for each city
- ⚡ Fast performance with Vite
- 🔄 State management with Redux Toolkit
- 🛣️ Client-side routing with React Router
- 🔌 Optional OpenWeatherMap API integration for live data

## Tech Stack

- **React 19.2.0** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **OpenWeatherMap API** (optional) - Live weather data provider

## Prerequisites

Before you begin, ensure you have the following installed: 
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RadekDulisz/pogodapp. git
   cd pogodapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:5173` and will work with mock data by default.

## Usage

### Development Mode

Start the development server: 
```bash
npm run dev
```
or
```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

Create a production build:
```bash
npm run build
```
or
```bash
yarn build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```
or
```bash
yarn preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```
or
```bash
yarn lint
```

## Project Structure

```
pogodapp/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   │   ├── CityList. jsx
│   │   └── CityDetail.jsx
│   ├── store/       # Redux store configuration
│   ├── App.jsx      # Main app component
│   ├── App. css      # App styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── . env.example     # Environment variables template
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Radosław Dulisz** - [RadekDulisz](https://github.com/RadekDulisz)

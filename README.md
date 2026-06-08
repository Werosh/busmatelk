# BusMate LK

**Live Demo:** [https://busmatelk.netlify.app/](https://busmatelk.netlify.app/)

**Sri Lanka's modern bus route companion** - search routes, explore stops on interactive maps, save favorites, and plan journeys across the island's public transport network.

BusMate LK is a React single-page application built for commuters, travelers, and administrators who need reliable access to Sri Lankan bus route information in one place.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Firebase Setup](#firebase-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### For Passengers

- **Route discovery** - Browse and search bus routes by number, destination, region, or stop name
- **Route details** - View stops, frequency, and route metadata on dedicated detail pages
- **Interactive maps** - Visualize routes and stop locations with Google Maps integration
- **Favorites** - Save frequently used routes to a personal list (requires sign-in)
- **User accounts** - Register, sign in, and manage your profile

### For Administrators

- **Admin dashboard** - Create, edit, and delete bus routes (admin role required)
- **Regional organization** - Assign routes to Sri Lankan provinces and regions
- **Stop management** - Add and maintain stop lists per route

### Platform

- Responsive layout optimized for mobile and desktop
- Real-time route updates via Firebase Firestore subscriptions
- Animated UI powered by Framer Motion
- SPA routing with client-side navigation

---

## Tech Stack

| Layer          | Technology                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | [React 19](https://react.dev/)                                                                                                                  |
| Build tool     | [Vite 6](https://vitejs.dev/)                                                                                                                   |
| Styling        | [Tailwind CSS 4](https://tailwindcss.com/)                                                                                                      |
| Routing        | [React Router 7](https://reactrouter.com/)                                                                                                      |
| Backend / Auth | [Firebase](https://firebase.google.com/) (Auth + Firestore)                                                                                     |
| Maps           | [Google Maps API](https://developers.google.com/maps), [Leaflet](https://leafletjs.com/), [React Map GL](https://visgl.github.io/react-map-gl/) |
| Animation      | [Framer Motion](https://www.framer.com/motion/)                                                                                                 |
| Icons          | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)                                                  |
| Linting        | [ESLint 9](https://eslint.org/)                                                                                                                 |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or later
- **npm** (or yarn / pnpm)
- A **Firebase** project with Authentication and Firestore enabled
- A **Google Maps API key** with Maps JavaScript API enabled

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/busmate-lk.git
cd busmate-lk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### 5. Build for production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

| Variable                        | Required | Description                                            |
| ------------------------------- | -------- | ------------------------------------------------------ |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Yes      | Google Maps JavaScript API key for route map rendering |

> **Note:** Firebase configuration is currently defined in `src/services/firebase.js`. For production deployments, consider moving Firebase credentials to environment variables and restricting API key usage in the Firebase and Google Cloud consoles.

---

## Available Scripts

| Command           | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot module replacement |
| `npm run build`   | Generate an optimized production build in `dist/`             |
| `npm run preview` | Serve the production build locally for testing                |
| `npm run lint`    | Run ESLint across the project                                 |

---

## Project Structure

```
busmate-lk/
├── public/                  # Static assets and SPA redirects
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, Layout, FeatureSection
│   │   ├── maps/            # BusRouteMap (Google Maps)
│   │   ├── routes/          # RouteList, RouteCard, RouteDetails
│   │   └── ui/              # Button, Card, Input, SearchBar, Preloader
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state and helpers
│   │   └── FavoritesContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AllRoutes.jsx
│   │   ├── RouteDetailsPage.jsx
│   │   ├── Favorites.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── firebase.js      # Firebase init, auth, and Firestore helpers
│   │   └── routeService.js  # Route CRUD, search, and pagination
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx              # Route definitions
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## Application Routes

| Path              | Page                         | Access        |
| ----------------- | ---------------------------- | ------------- |
| `/`               | Home                         | Public        |
| `/routes`         | All Routes (search & browse) | Public        |
| `/route/:id`      | Route Details                | Public        |
| `/favorites`      | Saved Routes                 | Authenticated |
| `/login`          | Sign In                      | Public        |
| `/register`       | Create Account               | Public        |
| `/profile`        | User Profile                 | Authenticated |
| `/admin_dashbord` | Admin Dashboard              | Admin only    |

---

## Firebase Setup

BusMate LK uses Firebase for authentication and data storage. To connect your own Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password** authentication under Authentication → Sign-in method
3. Create a **Firestore** database
4. Update the configuration in `src/services/firebase.js` with your project credentials
5. Set up the following Firestore collections:

| Collection  | Purpose                                                        |
| ----------- | -------------------------------------------------------------- |
| `users`     | User profiles (`displayName`, `email`, `role`, etc.)           |
| `routes`    | Bus route documents (number, name, region, stops, coordinates) |
| `stops`     | Optional separate stop documents linked by `routeId`           |
| `favorites` | User–route favorite mappings                                   |

### Admin access

Assign `"role": "admin"` in a user's Firestore document under the `users` collection to grant access to the admin dashboard.

### Recommended Firestore security rules

Configure rules so that:

- Routes are publicly readable
- Only authenticated admins can write to the `routes` collection
- Users can only read and write their own `favorites` documents

---

## Deployment

The app is deployed on **Netlify** and available at:

**[https://busmatelk.netlify.app/](https://busmatelk.netlify.app/)**

The project includes a `public/_redirects` file for SPA hosting on Netlify, ensuring all routes fall back to `index.html`.

### Build and deploy

```bash
npm run build
```

Deploy the contents of the `dist/` folder to your hosting provider (Netlify, Vercel, Firebase Hosting, etc.).

For Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with a clear message
4. Push to your branch and open a Pull Request

Please run `npm run lint` before submitting and ensure the app builds successfully with `npm run build`.

---

## License

This project is proprietary to **BusMate LK**. Contact the maintainers for licensing inquiries.

---

<p align="center">
  Built with care for Sri Lanka's commuters · <strong><a href="https://busmatelk.netlify.app/">BusMate LK</a></strong>
</p>

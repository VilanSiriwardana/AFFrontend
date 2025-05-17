# Country Explorer

An interactive and responsive full-stack web application that allows users to register, log in, and explore detailed information about countries. Built using the **MERN stack** and modern tools like **Redux Toolkit**, **Tailwind CSS**, and **Jest** for testing.

## Live Demo

- 🔗 Frontend: [https://af-frontend-three.vercel.app/](https://af-frontend-three.vercel.app/)
- 🔗 Backend API: [https://afbackend.onrender.com/api/v1](https://afbackend.onrender.com/api/v1)

## Features

- **Authentication** – Secure login and registration with JWT
- **Country Explorer** – View, search, and filter countries by region
- **Favorites** – Mark countries as favorites
- **Performance** – Optimized rendering with `react-window`
- **Testing** – Jest for unit and integration tests
- **Notifications** – User feedback via toast notifications
- **Responsive UI** – Styled with Tailwind CSS + Framer Motion

## 🛠 Tech Stack

### Frontend:

- React 19
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Toastify
- Framer Motion
- Jest

### Backend:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication

## Setup Instructions

### Clone the Repository

```bash
git https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-VilanSiriwardana
```

### Backend Setup (/backend)

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb+srv://vilansiriwardana:7sFtejqC8Z1froNW@dsprojectdb.ezmimy7.mongodb.net/?retryWrites=true&w=majority&appName=DSProjectDB
SECRET_KEY=U2NjVBZ2c0YUJISEs0NTQiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MDk3OTY1OSwiZXhwIjoxNzUxMzQ3NjU5fQ.zuHZkswCDBiEZqtfos0jOSvFyY
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

Backend will run at http://localhost:5000

### Frontend Setup (/frontend)

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
# Environment
REACT_APP_BASE_URL=http://localhost:3000
# REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_API_BASE_URL=https://afbackend.onrender.com/api/v1
```

Start the frontend:

```bash
npm start
```

App runs on http://localhost:3000 in development mode

## Running Tests

### Frontend (Jest)

```bash
npm run test
```

Tests are written using React Testing Library and Jest.

## Usage

1. Open the app in your browser
2. Register or log in
3. Explore the country cards
4. Search and filter by region
5. View details and manage favorites
6. Log out securely

## API Endpoints

### Auth Routes

- `POST /api/v1/register` – Register user
- `POST /api/v1/login` – Login and receive JWT

### Country Data

- Utilizes public REST Countries API

## Project Structure

```
frontend/
├── components/        # UI Components (LoginForm, Sidebar, CountryCard)
├── pages/             # Pages (Home, Favorites, Login/Register)
├── store/             # Redux slices and thunks
├── hooks/             # Custom hooks
├── configs/           # Axios config
├── utils/             # Toasts, validators
├── App.jsx
└── index.js

backend/
├── models/            # User schema
├── controllers/       # Auth logic
├── routes/            # User routes
├── server.js          # App entry point
└── .env               # Environment variables
```

## License

[MIT](LICENSE)

## Author

Your Name - [GitHub Profile](https://github.com/VilanSiriwardana)

## Acknowledgments

- [REST Countries API](https://restcountries.com/) for country data
- All open-source packages used in this project

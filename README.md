# MovieBuster

MovieBuster is a full-stack web application for discovering, searching, and managing your favorite movies and TV shows. It features user authentication, favorites, watchlists, and integrates with The Movie Database (TMDB) API for up-to-date movie and TV data.

---

## Features

- User registration and login
- Secure password hashing
- Add/remove movies and TV shows to favorites and watchlist
- Search for movies and TV shows
- View trending, top-rated, and popular content
- Responsive UI built with React and Tailwind CSS
- Backend REST API built with Express and MongoDB

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** bcryptjs
- **API Integration:** TMDB API
- **Deployment:** Netlify (frontend), Render.com (backend)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- MongoDB database (local or cloud, e.g., MongoDB Atlas)
- TMDB API key ([get one here](https://www.themoviedb.org/documentation/api))

---

### Environment Variables

#### Backend (`server/.env` on Render)

Set these in your Render.com dashboard:

- `MONGODB_URI`: Your MongoDB connection string
- `TMDB_API_KEY`: Your TMDB API key
- `JWT_SECRET`: A secret key for JWT authentication

#### Frontend (`.env` in the client directory)

- `VITE_TMDB_API_KEY`: Your TMDB API key

---

### Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

---

### Running the Application

```bash
# Run the backend server
cd server
npm run dev

# In a new terminal, run the frontend development server
cd client
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the backend.

---

### Building for Production

```bash
# Build the frontend for production
cd client
npm run build

# Start the backend server
cd server
npm start
```

The production build of the frontend will be served from the backend server.

---

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user
- `POST /api/auth/logout`: Log out the current user

### Users

- `GET /api/users/me`: Get the current user's profile
- `PUT /api/users/me`: Update the current user's profile

### Movies & TV Shows

- `GET /api/content/trending`: Get trending movies and TV shows
- `GET /api/content/top-rated`: Get top-rated movies and TV shows
- `GET /api/content/popular`: Get popular movies and TV shows
- `GET /api/content/search`: Search for movies and TV shows
- `POST /api/content/favorites`: Add a movie or TV show to favorites
- `DELETE /api/content/favorites`: Remove a movie or TV show from favorites
- `POST /api/content/watchlist`: Add a movie or TV show to watchlist
- `DELETE /api/content/watchlist`: Remove a movie or TV show from watchlist

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a pull request

---


## Acknowledgments

- [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for movie and TV data
- [Express](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the frontend
- [MongoDB](https://www.mongodb.com/) and [Mongoose](https://mongoosejs.com/) for the database and object modeling
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- [Netlify](https://www.netlify.com/) and [Render.com](https://render.com/) for deployment

# Project Setup Guide

This repository contains both a frontend and a backend service. Follow the steps below to set up and run the application.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- PostgreSQL (or use Docker for an alternative setup)
- Docker (optional, for running PostgreSQL via Docker)

## Backend Setup

The backend service is located in the `backend` folder and is built using **Express.js**. It requires a PostgreSQL database to run.

### Steps to Run the Backend

1.  **Configure Environment Variables:**

    - Copy the example environment file and update it with your database credentials:

      ```
      cp backend/env_example backend/.env
      ```

2.  **Set up the Database:**

    - Ensure you have a running PostgreSQL database.
    - Alternatively, use Docker to run a new PostgreSQL instance by executing:

      ```
      docker-compose -f backend/deploy/dev-docker-compose.yml --env-file backend/.env up -d
      ```

3.  **Install Dependencies:**

    ```
    cd backend
    npm install
    ```

4.  **Generate and Migrate Database Schema:**

    ```
    npm run drizzle:generate
    npm run drizzle:migrate
    ```

5.  **Run the Backend Server:**

    ```
    npm run dev
    ```

## Frontend Setup

The frontend service is located in the `frontend` folder and is built using **Vite**.

### Steps to Run the Frontend

**Note:** The frontend depends on the backend service, so ensure the backend is running first.

1.  **Navigate to the Frontend Directory:**

    ```
    cd frontend
    ```

2.  **Install Dependencies:**

    ```
    npm install
    ```

3.  **Configure Environment Variables:**

    - Copy the example environment file and update it as needed:

      ```
      cp frontend/env_example frontend/.env
      ```

4.  **Run the Development Server:**

    ```
    npm run dev
    ```

---

## Running the Full Application

1.  Start the backend service (see **Backend Setup**).
2.  Start the frontend service (see **Frontend Setup**).
3.  Access the frontend application in your browser at:

    ```
    http://localhost:3000
    ```

    _(or the port defined in Vite)_.

Now your application is up and running!

---

## Additional Commands

### Stopping the Services

To stop the backend service running via Docker:

```
docker-compose -f backend/deploy/dev-docker-compose.yml --env-file backend/.env down
```

### Running Database Migrations Again

If you need to regenerate and apply database migrations:

```
npm run drizzle:generate
npm run drizzle:migrate
```

---

## Issues & Support

If you encounter any issues, feel free to contact me at prasetya.ikrapriyadi@gmail.com

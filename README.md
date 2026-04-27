# Node.js Fundamentals & Internals

This repository contains my hands-on exploration of **Node.js fundamentals and internal working mechanisms**.
The focus of this project is understanding **how Node.js works under the hood**, including its architecture, event loop, async behavior, and database connectivity.

---

# DevBridge (Local + Deployment Setup)

This repository now also includes a full-stack app: **DevBridge**.

- Frontend: `DevBridge-Frontend` (React + Vite)
- Backend: `DevBridge` (Node.js + Express + MongoDB)

## How it works in both local and deployment

The app is made environment-safe using:

- **Frontend env-based API URL** (`VITE_API_BASE_URL`)
- **Vite local proxy** (`/api` -> backend target for local development)
- **Backend env-based CORS origins** (`CORS_ORIGINS`)

This means:

- Local machine can use `localhost` ports.
- EC2 deployment can use your domain/IP without code edits.

## Frontend env (`DevBridge-Frontend/.env`)

```env
VITE_API_BASE_URL=/api
VITE_PROXY_TARGET=http://localhost:3000
```

Notes:
- `VITE_API_BASE_URL=/api` works with local Vite proxy and reverse-proxy setups.
- If frontend and backend are on different domains in production, set:
  - `VITE_API_BASE_URL=https://your-backend-domain.com`

## Backend env (`DevBridge/.env`)

```env
PORT=3000
DB_CONNECTION=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>
JWT_SECRET=replace_with_secure_secret
SES_VERIFIED_EMAIL=you@example.com
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

## Local run steps

1. Start backend
```bash
cd DevBridge
npm install
npm run dev
```

2. Start frontend
```bash
cd DevBridge-Frontend
npm install
npm run dev
```

3. Verify API calls
- Frontend calls `/api/*`
- Vite proxies `/api/*` to `VITE_PROXY_TARGET`
- Backend handles routes like `/login`, `/signup`, `/feed`, etc.

## Deployment notes (EC2)

- Configure your frontend env for your deployed backend (or keep `/api` with Nginx reverse proxy).
- Set backend `CORS_ORIGINS` to your deployed frontend URL.
- Restart both services after env changes.
- Ensure cookie-based auth works with your HTTPS setup and domain.

---

# Topics Covered

### Node.js Basics

* What Node.js is and why it is used
* Running JavaScript on the server
* Understanding Node.js runtime

### Modules in Node.js

* `require()`
* `module.exports`
* Creating and importing custom modules

### Node.js Internals

* Synchronous vs Asynchronous execution
* `setTimeout()` vs `setTimeout(0)`
* Understanding the **Event Loop**
* Role of **libuv**
* **Thread Pool** in Node.js
* How Node handles I/O operations

### Node.js Source Code

* Exploring the Node.js GitHub repository
* Understanding how Node interacts with V8 and libuv

### Server Basics

* Creating a basic server in Node.js
* Handling requests and responses

### Databases

* SQL vs NoSQL concepts
* Connecting Node.js with **MongoDB Atlas**
* Performing basic database operations

---

# Tech Stack

* **Node.js**
* **JavaScript (ES6)**
* **MongoDB Atlas**
* **MongoDB Node Driver**
* **Git & GitHub**

---


# Installation

Clone the repository

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Move into the project folder

```
cd YOUR_REPO_NAME
```

Install dependencies

```
npm install
```

Run the example scripts

```
node database.js
```

---

# Example Output

```
Connected successfully to server

Found documents => [
  {
    name: "Luv Tomar",
    city: "Mathura",
    region: "Uttar Pradesh",
    Aim: "Just a good person"
  }
]
```

---

# Key Learnings

* How Node.js handles asynchronous operations
* Understanding the **Event Loop and libuv**
* How thread pools handle blocking tasks
* How Node.js interacts with databases
* Practical usage of MongoDB with Node.js

---

# Future Improvements

* Build REST APIs using Express.js
* Implement MVC architecture
* Add authentication and authorization
* Deploy backend services

---



# Author

**Luv Tomar**

Backend-focused developer learning system-level concepts behind Node.js.




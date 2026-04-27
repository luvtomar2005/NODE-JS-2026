# DevBridge

DevBridge is a full-stack developer networking platform where users can discover other developers, send connection requests, manage connections, and chat in real time.

Core differentiator: **room-based real-time chat with message persistence**, built with Socket.io + MongoDB on top of a JWT cookie-authenticated backend.

---

## 1) Project Overview

DevBridge solves two practical problems:

- **Developer discovery**: users browse a feed and connect with relevant developers.
- **Developer collaboration**: connected users can chat in real time with persisted history.

Main capabilities:

- Signup, login, logout (JWT via HTTP-only cookie)
- Profile view/edit
- Connection request workflow (`interested`, `ignored`, `accepted`, `rejected`)
- Connections list + requests management
- Real-time chat:
  - join room by deterministic `chatId`
  - send/receive messages instantly
  - fetch previous messages (last 50)
  - persist messages in MongoDB

---

## 2) Architecture Overview

### High-level components

- **Frontend**: React + Vite + Tailwind (`DevBridge-Frontend`)
- **Backend**: Node.js + Express (`DevBridge`)
- **Database**: MongoDB (Mongoose models)
- **Realtime layer**: Socket.io server attached to HTTP server

### Request + realtime flow

1. User logs in via `POST /login`.
2. Backend validates credentials and sets JWT in cookie (`token`).
3. Frontend sends authenticated requests with `withCredentials: true`.
4. Auth middleware validates cookie JWT and attaches `req.user`.
5. User opens chat with a connection.
6. Frontend computes target context and requests message history via `GET /chat/:targetUserId`.
7. Frontend emits `joinChat` with `{ chatId, userId }`.
8. Socket server joins room (`chatId`) and returns recent messages.
9. On send, frontend emits `sendMessage`.
10. Backend validates payload, saves message, emits `messageReceived` to room members.

---

## 3) Key Backend Concepts

### JWT authentication with cookies

- JWT is issued on successful login.
- JWT is stored in an **HTTP-only cookie** (not localStorage).
- Protected routes rely on cookie + middleware validation.
- This setup reduces XSS token exposure compared to localStorage-based auth.

### Middleware flow (`userAuth`)

- Reads `token` from cookies.
- Verifies JWT signature and expiry.
- Fetches user from DB using decoded `_id`.
- If valid: attaches user to `req.user`, then `next()`.
- If invalid/missing: returns unauthorized response.

### REST API design

The REST layer handles:

- Auth (`/signup`, `/login`, `/logout`)
- Profile read/update (`/profile/*`)
- Connection workflow (`/request/*`)
- Feed and relationship data (`/feed`, `/user/connections`, `/user/requests/*`)
- Chat history (`/chat/:targetUserId`)

Endpoints are split by domain routers for maintainability.

### Socket.io rooms for realtime communication

- Each one-to-one chat has a deterministic `chatId`.
- Both participants join the same room.
- Messages are emitted with `io.to(chatId).emit(...)`, ensuring scoped delivery.
- `joinChat` also returns recent history for continuity.

### Database schema design

Mongoose models represent domain boundaries:

- `User`: identity + profile fields
- `ConnectionRequest`: relationship state transitions
- `Message`: chat persistence by room (`chatId`) + sender

This keeps request/connection/chat concerns separated and query-friendly.

---

## 4) API Endpoints

### Auth

- `POST /signup` - Register a new user
- `POST /login` - Authenticate user and set auth cookie
- `POST /logout` - Clear auth cookie

### Profile

- `GET /profile` - Get current user profile
- `GET /profile/view` - Get current user profile (view endpoint)
- `PATCH /profile/edit` - Update profile fields

### Requests / Connections / Feed

- `POST /request/send/:status/:toUserId` - Send request (`interested` / `ignored`)
- `POST /request/review/:status/:requestId` - Review incoming request (`accepted` / `rejected`)
- `GET /user/requests/received` - Fetch incoming connection requests
- `GET /user/requests/sent` - Fetch sent connection requests
- `GET /user/connections` - Fetch accepted connections
- `GET /feed` - Fetch discoverable users (excludes self + already-related users)

### Chat

- `GET /chat/:targetUserId` - Fetch last 50 chat messages with a specific connected user

---

## 5) Socket Events

### `joinChat`

- **Client emits**: `{ chatId, userId }`
- **Server behavior**:
  - validates payload
  - joins socket room `chatId`
  - fetches last 50 messages
  - emits `chatHistory` back to client

### `sendMessage`

- **Client emits**: `{ chatId, senderId, text, type?, tag?, replyTo? }`
- **Server behavior**:
  - validates required fields
  - trims/sanitizes message
  - saves message to MongoDB
  - emits `messageReceived` to `chatId` room

### `messageReceived`

- **Server emits** full stored message object to all room members.
- Used by clients to append realtime messages instantly.

### `disconnect`

- Server logs socket disconnection with reason for observability/debugging.

---

## 6) Database Models

### User

Stores:

- Name, email, hashed password
- Profile metadata (`photoUrl`, `age`, `gender`, `about`, `skills`)

Used for auth, feed, profile, and connection rendering.

### ConnectionRequest

Stores relationship actions:

- `fromUserId`, `toUserId`
- `status` in lifecycle: `ignored`, `interested`, `accepted`, `rejected`

Prevents invalid relationship transitions and supports feed filtering.

### Message

Stores chat persistence:

- `senderId` (ObjectId)
- `chatId` (room key)
- `text`
- optional metadata (`type`, `tag`, `replyTo`)
- automatic timestamps

Supports both realtime delivery and history replay.

---

## 7) How to Run Locally

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone

```bash
git clone <your-repo-url>
cd NODE-JS-LEARNING
```

### 2. Install dependencies

```bash
cd DevBridge
npm install

cd ../DevBridge-Frontend
npm install
```

### 3. Setup environment variables

Create `.env` files from examples:

- `DevBridge/.env.example`
- `DevBridge-Frontend/.env.example`

Typical local values:

Backend (`DevBridge/.env`)

```env
PORT=3000
DB_CONNECTION=<your_mongodb_connection_string>
JWT_SECRET=<your_secret>
SES_VERIFIED_EMAIL=<optional_for_email_feature>
CORS_ORIGINS=http://localhost:5173
```

Frontend (`DevBridge-Frontend/.env`)

```env
VITE_API_BASE_URL=/api
VITE_PROXY_TARGET=http://localhost:3000
# optional:
# VITE_SOCKET_URL=http://localhost:3000
```

### 4. Start backend

```bash
cd DevBridge
npm run dev
```

### 5. Start frontend

```bash
cd DevBridge-Frontend
npm run dev
```

### 6. Realtime manual test

- Open app in two browser sessions with different users.
- Ensure both users are connected in app.
- Open same chat room and send messages.
- Verify instant delivery + history after refresh.

---

## 8) Challenges Faced

- **CORS + cookie auth**
  - Cookie-based JWT requires exact `withCredentials` alignment on frontend + backend CORS config.

- **Socket connection routing/proxy**
  - Socket endpoint mismatch (`/socket.io`) caused websocket failures until proxy/socket base URL were aligned.

- **404/502 route debugging**
  - `/api` proxy and backend port mismatches led to Bad Gateway and missing route issues.

- **State sync complexity**
  - Keeping frontend message state in sync with:
    - fetched history
    - realtime incoming messages
    - active chat switching
    required careful chatId/room mapping.

- **Auth consistency in realtime + REST**
  - Needed consistent user identity handling across REST profile fetch, chat history fetch, and socket event payloads.

---

## 9) Learnings

From a backend/system-design perspective, this project strengthened:

- JWT cookie auth trade-offs and middleware layering
- Designing deterministic room IDs for one-to-one realtime chat
- Combining REST (history) + sockets (live events) in one coherent flow
- Schema decisions that support both current features and future extensibility
- Practical debugging of CORS/proxy/socket issues in local and deployed environments

If rebuilding from scratch, I would immediately define:

- a unified error response contract,
- stronger input validation schemas,
- and centralized logging/observability from day one.

---

## 10) Future Improvements

- Typing indicators (`userTyping`, `userStoppedTyping`)
- Online/offline presence tracking
- Message delivered/read receipts
- Pagination for older message history
- File/image attachments
- Better socket auth handshake (token-based room access validation)
- Horizontal scaling with Redis adapter for Socket.io
- Integration tests for socket + REST chat flows

---

## Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT + HTTP-only cookies
- Realtime: Socket.io

---

## Author

**Luv Tomar**  
Backend-focused developer building production-style full-stack systems.




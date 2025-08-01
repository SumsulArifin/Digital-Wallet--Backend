Thanks for sharing the screenshot. Based on your folder structure and previous conversations, here's a complete `README.md` file tailored for your **Digital Wallet Backend** project:

---

### 📄 `README.md`

```md
# 💳 Digital Wallet Backend

A secure and modular digital wallet backend built with **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **Mongoose**, **Passport.js**, and **Redis**.

## 🚀 Live API Endpoint
- 🌐 Production: [https://digital-wallet-backend-iota.vercel.app](https://digital-wallet-backend-iota.vercel.app)

## 📂 Project Structure

```
src/
├── app/
│   ├── config/              → Configuration files (.env, db, redis, etc.)
│   ├── errorHelpers/        → Custom error classes and error handling
│   ├── helpers/             → Utility/helper functions
│   ├── interfaces/          → TypeScript interfaces/types
│   ├── middlewares/         → Middleware (e.g., auth, errorHandler)
│   ├── modules/             → Feature modules (user, wallet, transaction, auth)
│   ├── routes/              → All routes and routers
│   ├── utils/               → Common utility functions
│   └── constants.ts         → Enum roles & constants
├── app.ts                  → Express app config
├── server.ts               → Main server entry point
```

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT + Session + Google OAuth2 (Passport.js)
- **Security:** Helmet, CORS, Rate Limiting, Express Session
- **Deployment:** Vercel
- **Session Store:** Redis

---

## 🧪 API Endpoints (Summary)

### 🔐 Auth
| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| POST   | `/auth/login`             | Login with email/password        |
| POST   | `/auth/refresh-token`     | Get new access token             |
| POST   | `/auth/logout`            | Logout                           |
| POST   | `/auth/forgot-password`   | Request reset password OTP       |
| POST   | `/auth/reset-password`    | Reset password                   |
| POST   | `/auth/change-password`   | Change password (Logged In)      |
| POST   | `/auth/set-password`      | Set password after signup        |
| GET    | `/auth/google`            | Google login                     |
| GET    | `/auth/google/callback`   | Google login callback            |

### 👤 User (Admin Panel)
| Method | Endpoint                     | Description                   |
|--------|------------------------------|-------------------------------|
| POST   | `/user/register`             | Create user (Admin access)    |
| GET    | `/user/all-users`            | Get all users                 |
| PATCH  | `/user/createAgent/:id`      | Assign agent role to user     |

### 💼 Wallet
| Method | Endpoint                     | Description                      |
|--------|------------------------------|----------------------------------|
| GET    | `/wallet/getWallet`          | Get my wallet info               |
| PATCH  | `/wallet/update-status/:id`  | Update wallet status (Admin)     |
| GET    | `/user/all-wallet`           | All wallets (Admin)              |

### 💸 Transactions
| Method | Endpoint                      | Description                  |
|--------|-------------------------------|------------------------------|
| POST   | `/transactions/add-money`     | Add balance (Admin/User)     |
| POST   | `/transactions/send-money`    | Send balance                 |
| POST   | `/transactions/cashOut-money` | Cash out to agent            |
| POST   | `/transactions/cashIn-money`  | Agent deposits to user       |
| GET    | `/transactions/transaction_history` | My transaction history  |
| GET    | `/user/all-transaction`       | All transactions (Admin)     |

### 🔐 OTP
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| POST   | `/otp/send`       | Send OTP           |
| POST   | `/otp/verify`     | Verify OTP         |

---

## 📥 Environment Variables

Create a `.env` file.

## 🔧 Setup & Run Locally

```bash
git clone https://github.com/SumsulArifin/Digital-Wallet--Backend.git
cd Digital-Wallet--Backend

# Install dependencies
npm install

# Start development server
npm run dev

# For production build
npm run build
npm run start
```

---

## 📦 Scripts

| Script       | Description            |
|--------------|------------------------|
| `npm run dev`| Start in dev mode with `ts-node-dev` |
| `npm run build`| Compile TypeScript    |
| `npm start`  | Run compiled JS code   |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Let me know if you'd like me to auto-push it to your GitHub repo or update the `README.md` in your local project.

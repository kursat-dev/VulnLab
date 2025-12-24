<div align="center">

# 🛡️ VulnLab

**An Intentionally Vulnerable Web Application for Educational Purposes**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg)](https://www.sqlite.org/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Vulnerabilities](#-vulnerabilities) • [Disclaimer](#-disclaimer)

</div>

---

## 📖 Overview

**VulnLab** is a modern, aesthetically pleasing web application designed to be **intentionally vulnerable**. It serves as a safe environment for developers and security enthusiasts to practice their skills in identifying and exploiting common web vulnerabilities (OWASP Top 10).

Unlike typical "ugly" vulnerable apps, VulnLab features a sleek, responsive UI built with **React** and **Tailwind CSS**, proving that even good-looking apps can have serious security flaws.

## ✨ Features

- 🎨 **Modern UI**: Polished interface with dark mode, glassmorphism effects, and smooth animations.
- 🔐 **Vulnerable Authentication**: Classic login bypass scenarios.
- 📊 **Interactive Dashboard**: Easy navigation between vulnerability modules.
- 📝 **Real-world Scenarios**:
  - **SQL Injection**: Bypass login and dump database data.
  - **IDOR (Insecure Direct Object References)**: Access private documents of other users.
  - **Stored XSS**: Inject malicious scripts into a persistent guestbook.
  - **Reflected XSS**: Execute scripts via search parameters.
- 🛠️ **Educational Hints**: Built-in tips to guide beginners.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (No setup required!)

## 📦 Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v16 or higher)
- npm

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/vulnlab.git
cd vulnlab
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## ☁️ Deployment (Vercel)

This project is configured for easy deployment on [Vercel](https://vercel.com).

1. **Push to GitHub**: Make sure your project is pushed to a GitHub repository.
2. **Import to Vercel**:
   - Go to Vercel Dashboard and "Add New Project".
   - Select your VulnLab repository.
3. **Configure Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Deploy**: Click Deploy!

> **Note on Database**: due to the serverless nature of Vercel, the SQLite database is ephemeral. It will be recreated in `/tmp` on cold starts. This means user data and comments may reset frequently. This is intended behavior for a sandbox environment.

## 🚀 Usage

You need to run both the backend and frontend servers.

### Start the Backend

```bash
# In the /server directory
node index.js
```
The API will run at `http://localhost:3000`.

### Start the Frontend

```bash
# In the /client directory
npm run dev
```
Access the application at `http://localhost:5173`.

## ⚠️ Vulnerabilities

| Vulnerability | Location | Description |
|---------------|----------|-------------|
| **SQL Injection** | `/login` | Bypass authentication using `' OR '1'='1`. |
| **IDOR** | `/documents` | Access other users' documents by changing the ID in the URL. |
| **Stored XSS** | `/guestbook` | Comments are stored and rendered without sanitization. |
| **Reflected XSS** | `/search` | Search query is reflected back in the HTML response. |

## ⚠️ Disclaimer

> [!CAUTION]
> **THIS APPLICATION IS INTENTIONALLY VULNERABLE.**
> 
> - **DO NOT** deploy this application to a public server or production environment.
> - **DO NOT** use the code from this repository as a reference for secure coding practices.
> - The author is not responsible for any damage caused by the misuse of this software.
> - Use only for educational purposes in a safe, isolated environment.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ for Security Education</p>
</div>

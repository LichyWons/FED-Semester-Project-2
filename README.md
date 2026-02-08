# The Auction House

Frontend auction platform built as **Semester Project 2** at Noroff School of Technology and Digital Media.  
The project consumes the Noroff Auction API and focuses on authentication, listings, bidding, and responsive UI.

---

## 📌 Project Overview

The Auction House allows users to:

- register and log in using a `stud.noroff.no` email
- browse auction listings as a guest
- view listing details
- place bids when logged in
- manage profile data (avatar, credits)
- create and manage own listings

All functionality is implemented using **vanilla JavaScript**, **Tailwind CSS**, and the **Noroff Auction API**.

---

## 🧱 Tech Stack

- HTML5
- Tailwind CSS
- Vanilla JavaScript (ES Modules)
- Noroff Auction API (v2)
- GitHub Pages / Netlify (static hosting)
- Figma (design)
- GitHub Projects (planning)

---

## 🔐 Authentication

- JWT-based authentication via Noroff API
- Access token stored in `localStorage`
- Navigation and UI adapt automatically to auth state
- Guests can browse listings but cannot place bids

---

## 📂 Project Structure

/
├── index.html # Current auctions
├── js/
│ ├── index.js
│ ├── api.js
│ ├── authNav.js
│
├── login/
│ ├── index.html
│ └── index.js
│
├── register/
│ ├── index.html
│ └── index.js
│
├── profile/
│ ├── index.html
│ └── index.js
│
├── singleListing/
│ ├── index.html
│ └── index.js
│
├── css/
│ └── style.css
└── README.md

Each page has its own JavaScript file to keep logic isolated and easy to reason about.

---

## 👤 User Stories (Implemented)

- [x] Register with `stud.noroff.no` email
- [x] Login / Logout
- [x] View listings as guest
- [x] View listing details
- [x] Place bids (authenticated users only)
- [x] View bid history (authenticated users only)
- [x] View and update avatar
- [x] View credits
- [x] View own listings

---

## 📱 Responsive Design

- Fully responsive layout
- Mobile-first approach
- Separate mobile navigation (hamburger menu)
- Mobile menu overlays content with smooth transitions
- Desktop and mobile nav adapt automatically based on auth state

---

## 🚀 Getting Started (Local Setup)

1. Clone the repository
2. Open the project in VS Code
3. Start a local server (for example with Live Server)
4. No build step required – pure frontend project

If using Tailwind CLI:

```bash
npx tailwindcss -i ./css/input.css -o ./css/style.css --watch

🌍 API
Noroff Auction API v2

Documentation: https://v2.api.noroff.dev/docs

🔗 Required Links (for submission)
📊 Gantt chart: (add link)

🎨 Design prototype (Figma): (add link)

🎨 Style guide: (add link)

🗂 Kanban board (GitHub Projects): (add link)

💻 Repository: (add link)

🌐 Live demo: (add link)

⚠️ Notes
This project is frontend-only; all data is handled via the Noroff API

Error handling and edge cases are handled gracefully in the UI

Authentication state is managed via localStorage

👨‍💻 Author
Krzysztof Bytniewski
Frontend Development – Noroff School of Technology and Digital Media
2026
```

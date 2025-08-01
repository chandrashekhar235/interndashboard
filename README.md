Intern Fundraising Dashboard

This is a full-stack intern portal dashboard for fundraising interns. It provides an interactive UI for login, viewing personal fundraising progress, unlocked rewards, and a live leaderboard — all with a clean modern UI.


Project Structure

├── index.html         # Entry point with React root
├── styles.css         # Custom styling (CSS variables + layout)
├── script.js          # All React + fetch logic (dashboard, auth, API)
└── server.js          # Express.js backend serving API routes
Features

Login / Signup Interface
Dashboard with Donation Stats
Gamified Rewards System
Leaderboard Ranking System
Referral Code Copy Button
Responsive React UI
Mock Backend (JSON or Express)
Tech Stack

Frontend: HTML, CSS, JavaScript (React via CDN)
Backend: Node.js with Express (mock API)
Styling: Custom CSS with variables
Icons: Font Awesome
State Handling: React useState, useEffect
Local Setup

1. Clone the repo
git clone https://github.com/your-username/intern-dashboard.git
cd intern-dashboard
2. Install Backend Dependencies
npm init -y
npm install express cors
3. Run the Backend
node server.js
The API will be served at http://localhost:5000.

4. Open the Frontend
Just open index.html in your browser.

API Endpoints

Method	Endpoint	Description
GET	/api/user	Returns mock intern data
GET	/api/leaderboard	Returns top fundraisers
Screenshots

Add screenshots of:
Login Page
Dashboard View
Leaderboard View
Future Improvements

Firebase Authentication or JWT
Persistent MongoDB for users
Admin panel to manage interns
Referral system logic with sharing
Deployment on Vercel or Render/Netlify
Author

Chandra Shekhar
Email: sahiljoshi399@gmail.com
LinkedIn: linkedin.com/in/chandra-shekhar-a29789284

License

MIT License

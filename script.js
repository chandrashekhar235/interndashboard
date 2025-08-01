const BASE_URL = "http://localhost:5000"; // change if deployed elsewhere

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

const showMessage = (message, type = "success") => {
  const messageEl = document.createElement("div");
  messageEl.className = `message message-${type}`;
  messageEl.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
    ${message}
  `;
  document.body.appendChild(messageEl);
  setTimeout(() => messageEl.remove(), 3000);
};

const { useState, useEffect } = React;

// Authentication Component
function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));

    let user;

    if (activeTab === "login") {
      try {
        const res = await fetch(`${BASE_URL}/api/user`);
        user = await res.json();
        showMessage("Login successful! Welcome back.");
      } catch (err) {
        showMessage("Login failed. Could not fetch user.", "error");
        setLoading(false);
        return;
      }
    } else {
      user = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        referralCode: `${formData.name.toLowerCase().replace(/\s+/g, "")}2025`,
        donationsRaised: Math.floor(Math.random() * 5000) + 500,
        rewards: [
          { name: "First Donation", unlocked: true, threshold: 100 },
          { name: "Fundraising Pro", unlocked: Math.random() > 0.5, threshold: 1000 },
          { name: "Community Champion", unlocked: Math.random() > 0.7, threshold: 5000 },
          { name: "Super Fundraiser", unlocked: Math.random() > 0.8, threshold: 10000 },
          { name: "Elite Donor", unlocked: false, threshold: 25000 },
        ],
      };
      showMessage("Account created successfully! Welcome to the intern portal.");
    }

    setLoading(false);
    onLogin(user);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Intern Portal</h2>
        <p>Join our fundraising community</p>
      </div>

      <div className="auth-tabs">
        <button
          className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          <i className="fas fa-sign-in-alt"></i> Login
        </button>
        <button
          className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
        >
          <i className="fas fa-user-plus"></i> Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "signup" && (
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <>
              <div className="loading-spinner" style={{ width: "20px", height: "20px", display: "inline-block", marginRight: "8px" }}></div>
              {activeTab === "login" ? "Signing In..." : "Creating Account..."}
            </>
          ) : activeTab === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => {
        console.error("Error loading leaderboard:", err);
      });
  }, []);

  const handleCopyReferralCode = async () => {
    const success = await copyToClipboard(user.referralCode);
    showMessage(success ? "Referral code copied!" : "Failed to copy", success ? "success" : "error");
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-title">
          <div className="card-icon"><i className="fas fa-user"></i></div>
          Profile Information
        </div>
        <div className="stat-value">{user.name}</div>
        <div className="stat-label">Intern Name</div>
        <div className="referral-code" onClick={handleCopyReferralCode}>{user.referralCode}</div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-icon"><i className="fas fa-dollar-sign"></i></div>
          Total Donations
        </div>
        <div className="stat-value">{formatCurrency(user.donationsRaised)}</div>
        <div className="stat-label">Amount Raised</div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-icon"><i className="fas fa-trophy"></i></div>
          Rewards & Achievements
        </div>
        <ul className="rewards-list">
          {user.rewards.map((reward, i) => (
            <li key={i} className={`reward-item ${reward.unlocked ? "reward-unlocked" : ""}`}>
              <div className="reward-info">
                <div className="reward-icon">
                  <i className={`fas fa-${reward.unlocked ? "check" : "lock"}`}></i>
                </div>
                <div>
                  <div className="reward-name">{reward.name}</div>
                  <div className="reward-threshold">Unlock at {formatCurrency(reward.threshold)}</div>
                </div>
              </div>
              <span className={`reward-badge ${reward.unlocked ? "badge-unlocked" : "badge-locked"}`}>
                {reward.unlocked ? "Unlocked" : "Locked"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="card">
      <div className="card-title">
        <div className="card-icon"><i className="fas fa-medal"></i></div>
        Fundraising Leaderboard
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr><th>Rank</th><th>Name</th><th>Amount Raised</th></tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <tr key={i} className={entry.name === user.name ? "current-user" : ""}>
              <td>
                <div className="leaderboard-name">
                  <div className={`rank rank-${entry.rank <= 3 ? entry.rank : "other"}`}>{entry.rank}</div>
                </div>
              </td>
              <td>
                <div className="leaderboard-name">
                  {entry.name}
                  {entry.name === user.name && (
                    <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--info-color)" }}>(You)</span>
                  )}
                </div>
              </td>
              <td>
                <div className="leaderboard-amount">{formatCurrency(entry.raised)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <div className="logo"><i className="fas fa-hands-helping"></i> Intern Portal</div>
        <div className="user-info">
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Fundraising Intern</div>
          </div>
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <button onClick={onLogout} className="btn btn-danger btn-small">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <div className="nav-tabs">
        <button className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </button>
        <button className={`nav-tab ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>
          <i className="fas fa-chart-bar"></i> Leaderboard
        </button>
      </div>

      {activeTab === "dashboard" ? renderDashboard() : renderLeaderboard()}
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading Intern Portal...</p>
    </div>
  ) : user ? (
    <Dashboard user={user} onLogout={() => { setUser(null); showMessage("You have been logged out."); }} />
  ) : (
    <AuthPage onLogin={setUser} />
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

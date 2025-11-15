// Handle Login / Sign Up
let loginMode = true;
const authButton = document.getElementById('auth-button');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const switchAuth = document.getElementById('switch-auth');
const authTitle = document.getElementById('auth-title');

// Switch between login and sign up
switchAuth.addEventListener('click', () => {
  loginMode = !loginMode;
  authTitle.textContent = loginMode ? 'Login' : 'Sign Up';
  authButton.textContent = loginMode ? 'Login' : 'Sign Up';
  switchAuth.textContent = loginMode ? "Don't have an account? Sign Up" : "Already have an account? Login";
});

// Handle login/signup button
authButton.addEventListener('click', () => {
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');

  if (loginMode) {
    // Login logic
    if (users[username] && users[username].password === password) {
      localStorage.setItem('currentUser', username);
      showDashboard(users[username]);
    } else {
      alert('Invalid username or password');
    }
  } else {
    // Sign-up logic
    if (users[username]) {
      alert('Username already exists');
    } else {
      users[username] = { password, balance: 1000 }; // Create new user with balance
      localStorage.setItem('users', JSON.stringify(users));
      alert('Account created successfully!');
      loginMode = true;
      authTitle.textContent = 'Login';
      authButton.textContent = 'Login';
      switchAuth.textContent = "Don't have an account? Sign Up";
    }
  }
});

// Display Dashboard
function showDashboard(userData) {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  document.getElementById('username').textContent = localStorage.getItem('currentUser');
  document.getElementById('balance').textContent = userData.balance;
  loadTable();
}

// Load cryptocurrency table
function loadTable() {
  const coinsData = [
    { name: "Bitcoin", symbol: "BTC", price: 1200000, change: 2.5, market: 2400000000, spark: [1150000, 1160000, 1175000, 1180000, 1190000, 1200000], color: "#F7931A" },
    { name: "Ethereum", symbol: "ETH", price: 90000, change: -1.2, market: 900000000, spark: [88000, 89000, 89500, 90500, 90000], color: "#627EEA" },
    { name: "Tether", symbol: "USDT", price: 55, change: 0.1, market: 600000000, spark: [55, 55, 55, 55, 55], color: "#26A17B" }
  ];

  const tbody = document.querySelector('#coins-table tbody');
  tbody.innerHTML = '';

  coinsData.forEach((coin, i) => {
    const tr = document.createElement('tr');
    const changeClass = coin.change >= 0 ? 'positive' : 'negative';

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${coin.symbol} - ${coin.name}</td>
      <td>$${coin.price}</td>
      <td class="price-change ${changeClass}">${coin.change.toFixed(2)}%</td>
      <td>$${coin.market}</td>
      <td><canvas width="100" height="40"></canvas></td>
    `;

    tbody.appendChild(tr);
    const canvas = tr.querySelector('canvas');
    drawSparkline(canvas, coin.spark, coin.change >= 0);
  });
}

// Draw sparkline chart
function drawSparkline(canvas, prices, positive = true) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const max = Math.max(...prices), min = Math.min(...prices);
  const stepX = canvas.width / (prices.length - 1);

  prices.forEach((p, i) => {
    const x = i * stepX;
    const y = canvas.height - ((p - min) / (max - min || 1)) * canvas.height;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.strokeStyle = positive ? 'green' : 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
}

setInterval(loadTable, 5000);

// -----------------------------
// FIREBASE IMPORTS
// -----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// -----------------------------
// FIREBASE CONFIG
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAN0MfvvHmznveLEoIV8vLNorRO6F2VAs0",
  authDomain: "cashdeals-185df.firebaseapp.com",
  projectId: "cashdeals-185df",
  storageBucket: "cashdeals-185df.firebasestorage.app",
  messagingSenderId: "749879075742",
  appId: "1:749879075742:web:0fe6487fa9faedbc9aac8f"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// ------------------------------------
// LOGIN
// ------------------------------------
export async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (e) {
    alert("Login Failed: " + e.message);
  }
}


// ------------------------------------
// REGISTER (PUBLIC SIGN UP)
// ------------------------------------
export async function registerUser(event) {
  event.preventDefault();

  const email = document.getElementById("reg-email").value;
  const username = document.getElementById("reg-username").value;
  const phone = document.getElementById("reg-phone").value;
  const password = document.getElementById("reg-password").value;

  try {
    // Create Firebase Auth account
    await createUserWithEmailAndPassword(auth, email, password);

    // Save in Firestore INCLUDING PASSWORD (your request)
    await addDoc(collection(db, "clients"), {
      email,
      username,
      phone,
      password,
      balance: 0,
      status: "active"
    });

    alert("Account Created!");
    window.location.href = "index.html";
  } catch (e) {
    alert("Sign Up Failed: " + e.message);
  }
}


// ------------------------------------
// LOAD CLIENTS TO ADMIN TABLE
// ------------------------------------
async function loadClients() {
  const table = document.getElementById("clientTable");
  table.innerHTML = "";

  const snap = await getDocs(collection(db, "clients"));

  snap.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;

    const row = `
      <tr>
        <td>${data.email}</td>
        <td>${data.username}</td>
        <td>${data.password}</td>
        <td>${data.phone}</td>
        <td>${data.balance}</td>
        <td>
          <button class="edit-btn" onclick="editBalance('${id}', '${data.balance}')">Edit</button>
          <button class="del-btn" onclick="deleteUser('${id}')">Delete</button>
        </td>
      </tr>
    `;

    table.innerHTML += row;
  });
}


// ------------------------------------
// EDIT BALANCE
// ------------------------------------
window.editBalance = async function (userId, oldBalance) {
  const newBalance = prompt("Enter new balance:", oldBalance);

  if (newBalance === null) return;

  await updateDoc(doc(db, "clients", userId), {
    balance: Number(newBalance)
  });

  alert("Balance updated!");
  loadClients();
};


// ------------------------------------
// DELETE USER
// ------------------------------------
window.deleteUser = async function (userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  await deleteDoc(doc(db, "clients", userId));

  alert("User deleted.");
  loadClients();
};


// ------------------------------------
// AUTH CHECK (ADMIN ONLY PAGE)
// ------------------------------------
onAuthStateChanged(auth, (user) => {
  const page = window.location.pathname.split("/").pop();

  if (page === "admin.html") {
    if (!user) window.location.href = "index.html";

    document.getElementById("admin-email").innerText =
      "Logged in as: " + user.email;

    loadClients();
  }
});
// app.js or your main JS file

// Assuming `authContainer` and `dashboard` are already defined globally
// and `adminData` is fetched (e.g., from localStorage, an API, etc.)
function showAdminDashboard(adminData) {
    // Hide login or user dashboard, show the admin panel
    authContainer.style.display = 'none';
    dashboard.style.display = 'flex';

    // Set admin-related data
    document.getElementById('admin-username').textContent = 'Admin';
    document.getElementById('total-users').textContent = adminData.totalUsers;
    document.getElementById('pending-transactions').textContent = adminData.pendingTransactions;
    
    // Load user data into the admin panel (e.g., user table)
    loadUsersTable();  // Load table with user data
}

// Call this function with admin data when the user is authenticated as an admin
// For example, you might call this after checking the user's session or login credentials
const adminData = {
    totalUsers: 150,        // Example data
    pendingTransactions: 5
};

// Call this function to display the admin dashboard
showAdminDashboard(adminData);


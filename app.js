// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAN0MfvvHmznveLEoIV8vLNorRO6F2VAs0",
  authDomain: "cashdeals-185df.firebaseapp.com",
  projectId: "cashdeals-185df",
  storageBucket: "cashdeals-185df.firebasestorage.app",
  messagingSenderId: "749879075742",
  appId: "1:749879075742:web:0fe6487fa9faedbc9aac8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


// -------------------------
// SIGNUP FUNCTION
// -------------------------
window.signup = function() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Admin account created!");
      window.location.href = "login.html";
    })
    .catch(err => alert(err.message));
};


// -------------------------
// LOGIN FUNCTION
// -------------------------
window.login = function() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch(err => alert(err.message));
};


// -------------------------
// LOGOUT
// -------------------------
window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};


// -------------------------
// PROTECT ADMIN PAGE
// -------------------------
onAuthStateChanged(auth, user => {
  const protectedPages = ["admin.html"];

  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = "login.html";
  }

  if (user && currentPage === "admin.html") {
    document.getElementById("admin-email").innerText = "Logged in as: " + user.email;
  }
});

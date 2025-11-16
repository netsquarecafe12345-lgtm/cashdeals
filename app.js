import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

// LOAD CLIENT DATA INTO ADMIN TABLE
async function loadClients() {
  const table = document.getElementById("clientTable");

  const querySnapshot = await getDocs(collection(db, "clients"));
  querySnapshot.forEach((doc) => {

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

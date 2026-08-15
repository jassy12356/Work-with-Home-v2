import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const history = document.getElementById("history");

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  try {

    const withdrawRef = collection(db, "withdraws");

    const q = query(
      withdrawRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    history.innerHTML = "";

    if (snapshot.empty) {

      history.innerHTML =
        "<p>No withdrawal history found.</p>";

      return;

    }

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      let date = "Processing...";

      if (data.createdAt) {

        date = data.createdAt
          .toDate()
          .toLocaleString();

      }

      const status =
        data.status || "Pending";

      const div = document.createElement("div");

      div.className = "card";

      div.innerHTML = `

        <h3>Withdrawal</h3>

        <p>
          <b>Amount:</b>
          Rs. ${Number(data.amount || 0)}
        </p>

        <p>
          <b>Account:</b>
          ${data.account || ""}
        </p>

        <p>
          <b>Date:</b>
          ${date}
        </p>

        <p>
          <b>Status:</b>
          ${status}
        </p>

      `;

      history.appendChild(div);

    });

  } catch (error) {

    console.log(error);

    history.innerHTML =
      "<p>Unable to load withdrawal history.</p>";

  }

});

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

    const withdrawalsRef =
      collection(db, "withdraws");


    const q = query(
      withdrawalsRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );


    const snapshot = await getDocs(q);


    if (snapshot.empty) {

      history.innerHTML =
        "<p>No withdrawal history found.</p>";

      return;
    }


    history.innerHTML = "";


    snapshot.forEach((withdraw) => {

      const data = withdraw.data();


      let date = "Date unavailable";


      if (data.createdAt) {

        date =
          data.createdAt
            .toDate()
            .toLocaleString();

      }


      history.innerHTML += `

        <div class="plan">

          <h3>
            Rs. ${data.amount}
          </h3>

          <p>
            <b>Account:</b>
            ${data.account}
          </p>

          <p>
            <b>Date:</b>
            ${date}
          </p>

          <p>
            <b>Status:</b>
            ${data.status}
          </p>

        </div>

      `;

    });


  } catch (error) {

    console.log(error);

    history.innerHTML =
      "<p>Unable to load withdrawal history.</p>";

  }

});

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const form = document.getElementById("withdrawForm");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User not found.");
    return;
  }

  const data = snap.data();

  let currentBalance = Number(data.balance || 0);

  document.getElementById("balance").textContent =
    "Rs. " + currentBalance;


  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const amount =
      Number(document.getElementById("amount").value);

    const account =
      document.getElementById("account").value.trim();


    if (amount < 10000) {
      alert("Minimum withdrawal is Rs. 10000.");
      return;
    }


    if (amount > currentBalance) {
      alert("Insufficient balance.");
      return;
    }


    try {

      // Create a NEW withdrawal document
      await addDoc(
        collection(db, "withdraws"),
        {
          uid: user.uid,
          amount: amount,
          account: account,
          status: "Success",
          createdAt: serverTimestamp()
        }
      );


      // Deduct amount from balance
      await updateDoc(userRef, {
        balance: currentBalance - amount
      });


      alert(
        "Withdrawal Successful!\n\n" +
        "Rs. " + amount +
        " deducted from your balance."
      );


      window.location.href =
        "withdraw-history.html";


    } catch (error) {

      alert(error.message);

    }

  });

});

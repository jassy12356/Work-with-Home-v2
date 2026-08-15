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

  try {

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("User account not found.");
      return;
    }

    const data = snap.data();

    const currentBalance = Number(data.balance || 0);

    document.getElementById("balance").innerText =
      "Rs. " + currentBalance;

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      const amount = Number(
        document.getElementById("amount").value
      );

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

      if (!account) {

        alert("Please enter EasyPaisa Number / IBAN.");
        return;

      }

      try {

        // Save every withdrawal as a separate record
        await addDoc(
          collection(db, "withdraws"),
          {

            uid: user.uid,

            amount: amount,

            account: account,

            status: "Pending",

            createdAt: serverTimestamp()

          }
        );

        // Deduct withdrawal amount from balance
        await updateDoc(userRef, {

          balance: currentBalance - amount

        });

        alert(
          "Withdrawal request submitted successfully.\n\n" +
          "Status: Pending"
        );

        window.location.href = "withdraw-history.html";

      } catch (error) {

        console.log(error);

        alert(error.message);

      }

    });

  } catch (error) {

    console.log(error);

    alert("Unable to load account information.");

  }

});

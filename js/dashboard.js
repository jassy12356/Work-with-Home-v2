import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const watchBtn = document.getElementById("watchBtn");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User not found");
    return;
  }

  const data = snap.data();

  document.getElementById("userName").textContent =
    data.name || "";

  document.getElementById("userPlan").textContent =
    data.plan || "No Plan";

  document.getElementById("balance").textContent =
    data.balance || 0;

  watchBtn.addEventListener("click", async () => {

    let reward = 0;

    if (data.plan === "Plan 1") {
      reward = 10;
    }

    if (data.plan === "Plan 2") {
      reward = 20;
    }

    if (data.plan === "Plan 3") {
      reward = 30;
    }

    if (reward === 0) {
      alert("Please select a plan first.");
      return;
    }

    await updateDoc(userRef, {
      balance: increment(reward),
      videosWatched: increment(1)
    });

    alert("Rs. " + reward + " added to your earnings.");

    location.reload();

  });

});

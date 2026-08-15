import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp
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

        alert("User not found.");
        return;

    }


    const data = snap.data();


    // User information
    document.getElementById("userName").textContent =
        data.name || "User";

    document.getElementById("userPlan").textContent =
        data.plan || "No Plan";

    document.getElementById("balance").textContent =
        data.balance || 0;

    document.getElementById("dailyEarnings").textContent =
        data.dailyEarnings || 0;

    document.getElementById("totalEarnings").textContent =
        data.totalEarnings || data.balance || 0;


    watchBtn.addEventListener("click", async () => {

        let reward = 0;


        // Plan reward
        if (data.plan === "Plan 1") {

            reward = 10;

        } else if (data.plan === "Plan 2") {

            reward = 20;

        } else if (data.plan === "Plan 3") {

            reward = 30;

        } else {

            alert("Please select a plan first.");
            return;

        }


        try {

            await updateDoc(userRef, {

                balance: increment(reward),

                dailyEarnings: increment(reward),

                totalEarnings: increment(reward),

                videosWatched: increment(1),

                lastWatchedAt: serverTimestamp()

            });


            // Open YouTube
            window.open(
                "https://www.youtube.com/",
                "_blank"
            );


            alert(
                "Congratulations!\n\n" +
                "Rs. " + reward +
                " added to your earnings."
            );


            location.reload();


        } catch (error) {

            alert(error.message);

        }

    });

});

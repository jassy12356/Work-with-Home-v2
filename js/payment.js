import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const form = document.getElementById("paymentForm");


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }


    form.addEventListener("submit", async (e) => {

        e.preventDefault();


        const trxid =
            document.getElementById("trxid").value.trim();

        const phone =
            document.getElementById("phone").value.trim();


        const plan =
            localStorage.getItem("plan");

        const amount =
            localStorage.getItem("amount");


        if (!plan || !amount) {

            alert("Please select a plan first.");
            return;

        }


        try {

            // Save payment
            await setDoc(
                doc(db, "payments", user.uid),
                {

                    uid: user.uid,

                    plan: plan,

                    amount: Number(amount),

                    transactionId: trxid,

                    phoneNumber: phone,

                    status: "Submitted",

                    createdAt: serverTimestamp()

                }
            );


            // Save selected plan to user
            await updateDoc(
                doc(db, "users", user.uid),
                {

                    plan: plan,

                    planAmount: Number(amount),

                    paymentSubmitted: true,

                    paymentApproved: true,

                    balance: 0,

                    dailyEarnings: 0,

                    totalEarnings: 0,

                    videosWatched: 0

                }
            );


            alert(
                "Payment Submitted Successfully.\n\n" +
                "Opening Dashboard..."
            );


            // Clear selected plan
            localStorage.removeItem("plan");
            localStorage.removeItem("amount");


            // Direct dashboard
            window.location.href = "dashboard.html";


        } catch (error) {

            alert(error.message);

        }

    });

});

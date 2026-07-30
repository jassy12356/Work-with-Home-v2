import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
getDoc,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const watchBtn = document.getElementById("watchBtn");

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()){

alert("User not found");
return;

}

const data = snap.data();

if(!data.paymentApproved){

alert("Your payment is waiting for Admin Approval.");

window.location.href="payment.html";
return;

}

document.getElementById("userName").textContent = data.name;
document.getElementById("userPlan").textContent = data.plan;
document.getElementById("balance").textContent = data.balance || 0;

watchBtn.addEventListener("click", async()=>{

let reward = 0;

switch(data.plan){

case "Plan 1":
reward = 10;
break;

case "Plan 2":
reward = 20;
break;

case "Plan 3":
reward = 30;
break;

default:
alert("No active plan.");
return;

}

await updateDoc(userRef,{

balance: increment(reward),
videosWatched: increment(1)

});

alert("Congratulations!\nRs. " + reward + " added to your balance.");

location.reload();

});

});

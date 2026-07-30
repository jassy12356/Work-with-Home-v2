import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
getDoc,
setDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const form = document.getElementById("withdrawForm");

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()) return;

const data = snap.data();

document.getElementById("balance").innerHTML = "Rs. " + (data.balance || 0);

form.addEventListener("submit", async(e)=>{

e.preventDefault();

const amount = Number(document.getElementById("amount").value);

const account = document.getElementById("account").value.trim();

if(amount < 10000){

alert("Minimum withdrawal is Rs. 10000");
return;

}

if(amount > (data.balance || 0)){

alert("Insufficient balance");
return;

}

try{

await setDoc(doc(db,"withdraws",user.uid),{

uid:user.uid,

amount:amount,

account:account,

status:"Pending",

createdAt:serverTimestamp()

});

await updateDoc(userRef,{

balance:(data.balance-amount)

});

alert("Withdrawal request submitted successfully.");

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

});

});

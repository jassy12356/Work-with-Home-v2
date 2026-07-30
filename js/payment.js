import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
setDoc,
updateDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const form = document.getElementById("paymentForm");

onAuthStateChanged(auth, (user) => {

if(!user){

window.location.href="login.html";
return;

}

form.addEventListener("submit", async(e)=>{

e.preventDefault();

const trxid=document.getElementById("trxid").value.trim();

const phone=document.getElementById("phone").value.trim();

const plan=localStorage.getItem("plan");

const amount=localStorage.getItem("amount");

try{

await setDoc(doc(db,"payments",user.uid),{

uid:user.uid,

plan:plan,

amount:amount,

transactionId:trxid,

phoneNumber:phone,

status:"Pending",

createdAt:serverTimestamp()

});

await updateDoc(doc(db,"users",user.uid),{

plan:plan,

paymentApproved:false

});

alert("Payment Submitted Successfully.\nWaiting For Admin Approval.");

window.location.href="login.html";

}catch(error){

alert(error.message);

}

});

});

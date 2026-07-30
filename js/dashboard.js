import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

const snap = await getDoc(doc(db,"users",user.uid));

if(!snap.exists()) return;

const data = snap.data();

document.getElementById("userName").innerHTML = data.name;

document.getElementById("userPlan").innerHTML = data.plan || "No Plan";

document.getElementById("balance").innerHTML = data.balance || 0;

});

document.getElementById("watchBtn").addEventListener("click",()=>{

alert("Video System will be connected in next step.");

});

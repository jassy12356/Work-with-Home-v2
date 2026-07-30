import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
doc,
getDoc,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const claimBtn = document.getElementById("claimBtn");

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="login.html";
return;

}

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()) return;

const data = snap.data();

document.getElementById("balance").innerHTML = data.balance || 0;

claimBtn.addEventListener("click", async()=>{

let reward = 0;

if(data.plan=="Plan 1"){

reward = 10;

}else if(data.plan=="Plan 2"){

reward = 20;

}else if(data.plan=="Plan 3"){

reward = 30;

}else{

alert("Please buy a plan first.");
return;

}

await updateDoc(userRef,{

balance: increment(reward),
videosWatched: increment(1)

});

alert("Rs. "+reward+" Added Successfully");

location.reload();

});

});

import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// REGISTER

const registerForm = document.getElementById("registerForm");

if (registerForm) {

registerForm.addEventListener("submit", async (e) => {

e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

try {

const userCredential = await createUserWithEmailAndPassword(auth, email, password);

await setDoc(doc(db, "users", userCredential.user.uid), {

name,
email,
approved: false,
plan: "",
paymentApproved: false,
balance: 0,
videosWatched: 0,
createdAt: new Date().toISOString()

});

alert("Registration Successful");

window.location.href = "login.html";

} catch (error) {

alert(error.message);

}

});

}

// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("loginEmail").value.trim();
const password = document.getElementById("loginPassword").value;

try {

const userCredential = await signInWithEmailAndPassword(auth, email, password);

const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

if (!userDoc.exists()) {

alert("User not found");

return;

}

const data = userDoc.data();

window.location.href = "plans.html";

} catch (error) {

alert(error.message);

}

});

}

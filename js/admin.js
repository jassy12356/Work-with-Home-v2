import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ⚠️ Apni admin Gmail yahan likho
const ADMIN_EMAIL = "ta5984978@gmail.com";

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location.href="login.html";
return;
}

if(user.email !== ADMIN_EMAIL){
alert("Access Denied");
window.location.href="dashboard.html";
return;
}

loadPayments();
loadWithdraws();

});

const paymentList = document.getElementById("paymentList");
const withdrawList = document.getElementById("withdrawList");

async function loadPayments(){

paymentList.innerHTML="";

const snap = await getDocs(collection(db,"payments"));

snap.forEach((payment)=>{

const data = payment.data();

paymentList.innerHTML += `
<div class="plan">
<h3>${data.plan}</h3>
<p><b>Amount:</b> Rs. ${data.amount}</p>
<p><b>Transaction ID:</b> ${data.transactionId}</p>
<p><b>Phone:</b> ${data.phoneNumber}</p>
<p><b>Status:</b> ${data.status}</p>

<button onclick="approve('${payment.id}','${data.plan}')">Approve</button>
<button onclick="rejectPayment('${payment.id}')">Reject</button>

</div>
`;

});

}

window.approve = async function(uid,plan){

await updateDoc(doc(db,"payments",uid),{
status:"Approved",
paymentApproved:true
});

await updateDoc(doc(db,"users",uid),{
paymentApproved:true,
approved:true,
plan:plan
});

alert("Payment Approved");
location.reload();

}

window.rejectPayment = async function(uid){

await updateDoc(doc(db,"payments",uid),{
status:"Rejected"
});

alert("Payment Rejected");
location.reload();

}

async function loadWithdraws(){

withdrawList.innerHTML="";

const snap = await getDocs(collection(db,"withdraws"));

snap.forEach((withdraw)=>{

const data = withdraw.data();

withdrawList.innerHTML += `
<div class="plan">

<h3>Withdraw Request</h3>

<p><b>Amount:</b> Rs. ${data.amount}</p>
<p><b>Account:</b> ${data.account}</p>
<p><b>Status:</b> ${data.status}</p>

<button onclick="approveWithdraw('${withdraw.id}')">Approve</button>

<button onclick="rejectWithdraw('${withdraw.id}')">Reject</button>

</div>
`;

});

}

window.approveWithdraw = async function(uid){

await updateDoc(doc(db,"withdraws",uid),{
status:"Approved"
});

alert("Withdraw Approved");
location.reload();

}

window.rejectWithdraw = async function(uid){

await updateDoc(doc(db,"withdraws",uid),{
status:"Rejected"
});

alert("Withdraw Rejected");
location.reload();

}

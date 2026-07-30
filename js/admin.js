import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const paymentList = document.getElementById("paymentList");

async function loadPayments() {

paymentList.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"payments"));

querySnapshot.forEach((payment)=>{

const data = payment.data();

paymentList.innerHTML += `

<div class="plan">

<h3>${data.plan}</h3>

<p><b>Amount:</b> Rs. ${data.amount}</p>

<p><b>Transaction ID:</b> ${data.transactionId}</p>

<p><b>Phone:</b> ${data.phoneNumber}</p>

<button onclick="approve('${payment.id}')">

Approve

</button>

<button onclick="rejectPayment('${payment.id}')">

Reject

</button>

</div>

`;

});

}

loadPayments();
window.approve = async function(paymentId){

try{

await updateDoc(doc(db,"payments",paymentId),{

paymentApproved:true

});

await updateDoc(doc(db,"users",paymentId),{

paymentApproved:true,

approved:true,

planActive:true

});

alert("Payment Approved Successfully");

location.reload();

}catch(error){

alert(error.message);

}

}

window.rejectPayment = async function(paymentId){

const ok = confirm("Reject this payment?");

if(!ok) return;

try{

await updateDoc(doc(db,"payments",paymentId),{

paymentApproved:false,

rejected:true

});

alert("Payment Rejected");

location.reload();

}catch(error){

alert(error.message);

}

}

import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const paymentList = document.getElementById("paymentList");

async function loadPayments(){

paymentList.innerHTML="";

const querySnapshot=await getDocs(collection(db,"payments"));

querySnapshot.forEach((payment)=>{

const data=payment.data();

paymentList.innerHTML+=`

<div class="plan">

<h3>${data.plan}</h3>

<p><b>Amount:</b> Rs. ${data.amount}</p>

<p><b>Transaction ID:</b> ${data.transactionId}</p>

<p><b>Phone:</b> ${data.phoneNumber}</p>

<p><b>Status:</b> ${data.status}</p>

<button onclick="approve('${payment.id}','${data.plan}')">
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

window.approve=async function(uid,plan){

try{

await updateDoc(doc(db,"payments",uid),{

status:"Approved",
paymentApproved:true

});

await updateDoc(doc(db,"users",uid),{

approved:true,
paymentApproved:true,
plan:plan,
balance:0,
videosWatched:0

});

alert("Payment Approved Successfully");

location.reload();

}catch(error){

alert(error.message);

}

}

window.rejectPayment=async function(uid){

if(!confirm("Reject Payment?")) return;

try{

await updateDoc(doc(db,"payments",uid),{

status:"Rejected",
paymentApproved:false

});

alert("Payment Rejected");

location.reload();

}catch(error){

alert(error.message);

}

}

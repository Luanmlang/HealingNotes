// Your Firebase Config (replace with your real config from Firebase Console)
const firebaseConfig = {

  apiKey: "AIzaSyA5UoiRIPgvqbyzFdsOZjk4MrPmBiQiMYc",

  authDomain: "healing-notes-of-texas.firebaseapp.com",

  projectId: "healing-notes-of-texas",

  storageBucket: "healing-notes-of-texas.firebasestorage.app",

  messagingSenderId: "496292088297",

  appId: "1:496292088297:web:dfa05d3f4f3e5b940e2378",

  measurementId: "G-GBJFENLW5M"

};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const signInBtn = document.getElementById("google-signin");
const signOutBtn = document.getElementById("signout");
const form = document.getElementById("hours-form");
const userInfo = document.getElementById("user-info");
const log = document.getElementById("log");

// Sign In
signInBtn.addEventListener("click", () => {
const provider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(provider).catch(console.error);
});

// Sign Out
signOutBtn.addEventListener("click", () => {
auth.signOut();
});

// Auth State Change
auth.onAuthStateChanged(user => {
if (user) {
  userInfo.textContent = `Signed in as: ${user.displayName}`;
  signInBtn.style.display = "none";
  signOutBtn.style.display = "block";
  form.style.display = "block";
  loadHours(user.uid);
} else {
  userInfo.textContent = "";
  signInBtn.style.display = "block";
  signOutBtn.style.display = "none";
  form.style.display = "none";
  log.innerHTML = "";
}
});

// Submit Hours
form.addEventListener("submit", e => {
e.preventDefault();
const user = auth.currentUser;
if (!user) return;

const data = {
  uid: user.uid,
  date: document.getElementById("date").value,
  description: document.getElementById("desc").value,
  hours: Number(document.getElementById("hours").value),
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
};

db.collection("volunteer-hours").add(data)
  .then(() => {
    alert("Hours submitted!");
    form.reset();
    loadHours(user.uid);
  })
  .catch(console.error);
});

// Load Submitted Hours
function loadHours(uid) {
db.collection("volunteer-hours")
  .where("uid", "==", uid)
  .orderBy("timestamp", "desc")
  .get()
  .then(snapshot => {
    log.innerHTML = "<h3>Your Submitted Hours:</h3>";
    snapshot.forEach(doc => {
      const d = doc.data();
      log.innerHTML += `
        <div><strong>${d.date}</strong> - ${d.description}: ${d.hours} hours</div>
      `;
    });
  })
  .catch(console.error);
}

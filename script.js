//-------------------------------------------
// بيانات الموظفين
//-------------------------------------------
let defaultEmployees = [
    {name:"rose", password:"1234", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"noor", password:"3333", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"mohammad", password:"1111", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"fedda", password:"2222", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"hamza", password:"5555", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"hazem", password:"4444", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"ibrahem", password:"6666", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"bashar", password:"7777", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"bader", password:"8888", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"ahmad abo", password:"3245", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"shade", password:"7890", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"mahmood", password:"4567", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"abdullah", password:"1010", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"bilal", password:"2020", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"hanee", password:"3030", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"saleh", password:"4040", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"sadeel", password:"12345", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""},
    {name:"admin", password:"admin_2025", hours:0, lastCheckIn:null, lastCheckOut:null, lastLocation:""}
];

// حفظ الموظفين في LocalStorage
if(!localStorage.getItem("employees")){
    localStorage.setItem("employees", JSON.stringify(defaultEmployees));
}

let employees = JSON.parse(localStorage.getItem("employees"));

// حفظ البيانات
function saveEmployees(){
    localStorage.setItem("employees", JSON.stringify(employees));
}

// تسجيل الدخول
function login(){
    let username = document.getElementById("username").value.trim().toLowerCase();
    let password = document.getElementById("password").value.trim();

    let user = employees.find(u => u.name.toLowerCase() === username && u.password === password);

    if(user){
        localStorage.setItem("currentUser", user.name);
        if(user.name.toLowerCase() === "admin"){
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }
    } else {
        document.getElementById("login-error").innerText = "الاسم أو كلمة المرور خاطئة";
    }
}

// Dashboard
function loadDashboard(){
    let current = localStorage.getItem("currentUser");
    if(!current){ window.location.href="index.html"; return; }

    let user = employees.find(u => u.name === current);
    document.getElementById("user-name").innerText = user.name;
    document.getElementById("hours-worked").innerText = user.hours.toFixed(2);
    document.getElementById("last-in").innerText = user.lastCheckIn || "—";
    document.getElementById("last-out").innerText = user.lastCheckOut || "—";

    // تحديث اللوكيشن مباشرة عند فتح الصفحة
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos=>{
            user.lastLocation = `Lat:${pos.coords.latitude.toFixed(4)}, Lng:${pos.coords.longitude.toFixed(4)}`;
            document.getElementById("user-location").innerText = user.lastLocation;
            saveEmployees();
        }, err=>{
            document.getElementById("user-location").innerText = "Location not available";
        });
    }
}


// تسجيل حضور
function checkIn(){
    let current = localStorage.getItem("currentUser");
    let user = employees.find(u => u.name === current);
    if(user.lastCheckIn){
        alert("أنت مسجل حضور بالفعل");
        return;
    }
    let now = new Date().toLocaleString();
    user.lastCheckIn = now;
    saveEmployees();
    document.getElementById("last-in").innerText = now;
    alert("تم تسجيل الحضور");
}

// تسجيل خروج
function checkOut(){
    let current = localStorage.getItem("currentUser");
    let user = employees.find(u => u.name === current);
    if(user.lastCheckIn){
        alert("لم يتم تسجيل حضور");
        return;
    }
    let now = new Date();
    user.lastCheckOut = now.toLocaleString();

    let inTime = new Date(user.lastCheckIn);
    let diff = (now - inTime)/1000/3600;
    user.hours += parseFloat(diff.toFixed(2));
    user.lastCheckIn = null;
    saveEmployees();

    document.getElementById("hours-worked").innerText = user.hours.toFixed(2);
    document.getElementById("last-out").innerText = user.lastCheckOut;
    alert(`تم تسجيل المغادرة. الساعات: ${diff.toFixed(2)} ساعة`);
}

// تسجيل خروج
function logout(){
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Admin
function loadAdmin(){
    let table = document.getElementById("admin-table");
    table.innerHTML = "";
    employees.forEach(emp=>{
        if(emp.name.toLowerCase() !== "admin"){
            table.innerHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.lastCheckIn || "—"}</td>
                <td>${emp.lastCheckOut || "—"}</td>
                <td>${emp.hours.toFixed(2)}</td>
                <td>${emp.lastLocation}</td>
            </tr>`;
        }
    });
}




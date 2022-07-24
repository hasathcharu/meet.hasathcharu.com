
const profileModal = document.getElementById("profile-modal");
const profileIcon = document.getElementById("profile-icon");

profileIcon.addEventListener("click",()=>{
    $(profileModal).toggle();
});
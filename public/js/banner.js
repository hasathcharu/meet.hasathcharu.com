var bannerClose = document.getElementById("banner-close");
bannerClose.addEventListener("click",()=>{
    closeBanner();
});
setTimeout(()=>{
   closeBanner();
},15000);

function closeBanner(){
    $("#banner").slideUp();
    const profileModal = document.getElementById("profile-modal");
    profileModal.style.top = "4rem";
}
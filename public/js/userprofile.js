import {Modal} from "./modal.js";
const d = new Date();
d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
let expires = "expires="+d.toUTCString();
if(theme){
    document.cookie = 'theme' + "=" + 'dark' + ";" + expires + ";path=/";
}
else{
    document.cookie = 'theme' + "=" + 'light' + ";" + expires + ";path=/";
}

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var unameText="";
const joinBtns = [...document.querySelectorAll(".join")];
const copyBtns = [...document.querySelectorAll(".copy")];
const unAssignBtns = [...document.querySelectorAll(".unassign")];
const linkDoms = [...document.querySelectorAll(".profile-link-box")];
joinBtns.forEach((button)=>{
    const meetingId = button.getAttribute('link-id');
    button.addEventListener("click",()=>{
        const modal = new Modal("join-modal-template");
        const meetingNameArea = modal.modalElement.querySelector(".meeting-name");
        const meetingName  = links.find((link)=>link.id === meetingId).topic;
        
        const pass = links.find((link)=>link.id===meetingId).pwd;
        meetingNameArea.textContent = meetingName;

        const joinBtn = modal.modalElement.querySelector(".join-link");
        const joinName = modal.modalElement.querySelector(".modal-uname-box");

        joinBtn.addEventListener("click",()=>{
                var uname = joinName.value.trim().split(" ");
                uname.forEach((item,index)=>{uname[index] = item.charAt(0).toUpperCase() + item.slice(1);});
                uname = uname.join(" ");
                if (uname){
                    unameText="&uname="+encodeURI(uname);
                }
                else if(user){
                    unameText="&uname="+encodeURI(user.fname+" "+user.lname);
                }
                else{
                    unameText="";
                }
                if(isMobile){
                    window.location.href=`zoomus://zoom.us/join?confno=${meetingId}&pwd=${pass}${unameText}`;
                }
                else{
                    window.location.href=`zoommtg://zoom.us/join?confno=${meetingId}&pwd=${pass}${unameText}`;
                }
        });
        joinName.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
             event.preventDefault();
             joinBtn.click();
            }
        });
    })
});

copyBtns.forEach((copyBtn)=>{
    copyBtn.addEventListener("click",()=>{
    const meetingUrl = copyBtn.getAttribute("url");
        if(navigator.clipboard){
            navigator.clipboard.writeText(`https://meet.hasathcharu.com/j/${meetingUrl}`);
            copyBtn.innerHTML="<i class=\'fas fa-check-circle\'></i>";
            setTimeout(()=>{
                copyBtn.innerHTML = "<i class=\'far fa-copy\'></i>";
            },2000);
        }
        else{
            copyBtn.innerHTML="<i class=\'fas fa-times-circle\'></i>";
            setTimeout(()=>{
                copyBtn.innerHTML = "<i class=\'far fa-copy\'></i>";
            },2000);
        }
    });
});

unAssignBtns.forEach((button)=>{
    const linkId = button.getAttribute("link-id");
    button.addEventListener("click",()=>{
        $.post("/user/unassign",{
            user_id: user.user_id,
            link_id: linkId,
        },
        (result)=>{
            if(result=="Success"){
                location.reload();
            }
            else{
                const message = document.getElementById("assign-error");
                message.style.display = "block";
                message.textContent = "Something went wrong";
            }
        })
    });
});

const update = ()=>{
    $.post("/user/profile"
    ,(result)=>{
        if(result!="Fail"){
            const updatedLinks = result;
            updatedLinks.forEach(updatedLink=>{
                const linkDom = linkDoms.find((linkDom)=>linkDom.getAttribute("link-id") === updatedLink.id);
                const statusElement = linkDom.querySelector(".link-status");
                if(updatedLink.status){
                    statusElement.className = "link-status live";
                    statusElement.innerHTML = "<i class='fas fa-video'></i>&nbsp;&nbsp; "+updatedLink.timeText;
                }else{
                    statusElement.className = "link-status inactive";
                    statusElement.innerHTML = "<i class='fas fa-minus-circle'></i>&nbsp;&nbsp; Inactive";
                }
                if(updatedLink.anyOther==1){
                    anyOther.style.display = "block";
                }
                else{
                    anyOther.style.display = "none";
                }
            })
        }
        else{
            location.reload();
        }
    });
}
// update();
var request=setInterval(update,5000);
$(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");
    if (prevType != e.type) {   //  reduce double fire issues
        switch (e.type) {
            case "blur":
                clearInterval(request);
                request = 0;
                break;
            case "focus":
                update();
                if(!request){
                    request = setInterval(update,1000);
                }
                break;
        }
    }
    $(this).data("prevType", e.type);
});
const initStatus = link.status;
var currStatus = link.status;
const topicValue = link.topic;
const meetingId = link.id;
const meetingUrl = link.url;
var pass = link.pwd;
const joinBtn = document.getElementById("join");
const assume = document.getElementById("assume");
const topic = document.getElementById("topic");
const joinName = document.getElementById("name");
joinName.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     joinBtn.click();
    }
  });
document.querySelector("title").innerHTML = topicValue;
topic.innerHTML = topicValue;
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
var count = 0;
var unameText="";


var request=setInterval(update,1000);;


function update(){
    $.post("/zoom-sync/link-data", 
    {
        "url":meetingUrl,
    },
    function(result){
        const statusElement = document.getElementById("status");
        const data = JSON.parse(result);
        const newStatus = data.status;
        console.log(data);
        if(currStatus && newStatus){
            statusElement.className = "live";
            statusElement.innerHTML = "<i class='fas fa-video'></i>&nbsp;&nbsp; "+data.timeText;
            currStatus = 1;
        }
        else if(!currStatus && newStatus){
            statusElement.className = "live";
            statusElement.innerHTML = "<i class='fas fa-video'></i>&nbsp;&nbsp; "+data.timeText;
            const end = document.getElementById('endedMeeting');
            if(end){
                end.remove();
            }
            currStatus = 1;
        }
        else if(!currStatus && !newStatus && data.other){
            statusElement.className = "another";
            statusElement.innerHTML = "<i class='fas fa-brain'></i>&nbsp;&nbsp; Host is in another meeting";
            currStatus = 0;
        }
        else if(currStatus && !newStatus){
            window.location.href="/o/" + meetingUrl;
            currStatus = 0;
        }else{
            statusElement.className = "inactive";
            statusElement.innerHTML = "<i class='fas fa-minus-circle'></i>&nbsp;&nbsp; Inactive";
            currStatus = 0;
        }

    });
}

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
                    request = setInterval(update,5000);
                }
                break;
        }
    }

    $(this).data("prevType", e.type);
});


const copyBtn = document.getElementById("copyLink");


copyBtn.addEventListener("click",()=>{
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


joinBtn.addEventListener("click",()=>{
    uname = joinName.value.trim().split(" ");
    uname.forEach((item,index)=>{uname[index] = item.charAt(0).toUpperCase() + item.slice(1);});
    uname = uname.join(" ");
    if (uname){
        unameText="&uname="+encodeURI(uname);
    }
    else{
        unameText="";
    }
    console.log(pass);
    count++;
    if(isMobile){
        window.location.href=`zoomus://zoom.us/join?confno=${meetingId}&pwd=${pass}${unameText}`;
    }
    else{
        window.location.href=`zoommtg://zoom.us/join?confno=${meetingId}&pwd=${pass}${unameText}`;
    }
    if (count>1){
    assume.innerHTML=  `Doesn't work? Click <a href='https://us02web.zoom.us/j/${meetingId}?pwd=${pass}${unameText}'>here</a> to join`;
    }
});


setTimeout(()=>{
    const end = document.getElementById('endedMeeting');
    if(end){
        end.remove();
    }
},30000);
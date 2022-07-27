import {showLoadingAnimation, removeLoadingAnimation} from "./form.js";

const approveButtons = [...document.getElementsByClassName("approve-btn")];
const rejectButtons = [...document.getElementsByClassName("reject-btn")];

approveButtons.forEach(button => {
    button.addEventListener("click",()=>{
        const userId = button.getAttribute('user-id');
        showLoadingAnimation(button);
        $.post("/admin/approve-user",{
            user_id: userId,
            approve: 1,
        },
        (result)=>{
            removeLoadingAnimation(button,"Approve");
            if(result=="Success"){
                button.parentElement.parentElement.remove();
            }
        });
    });
});

rejectButtons.forEach(button => {
    button.addEventListener("click",()=>{
        const userId = button.getAttribute('user-id');
        showLoadingAnimation(button);
        $.post("/admin/approve-user",{
            user_id: userId,
            approve:0,
        },
        (result)=>{
            removeLoadingAnimation(button,"Reject");
            if(result=="Success"){
                button.parentElement.parentElement.remove();
            }
        });
    });
});
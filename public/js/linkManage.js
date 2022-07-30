import {Modal} from "./modal.js";
import {Assigner} from "./assigner.js";
const assignButtons = [...document.getElementsByClassName("assign-btn")];
assignButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
        const linkId = button.getAttribute("link-id");
        const modal = new Modal("assign-modal-template");
        const assigner = new Assigner(linkId,modal.modalElement,1);
        assigner.updateList();
    });
});

const editURLButtons = [...document.getElementsByClassName("url-btn")];
editURLButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
        const linkId = button.getAttribute("link-id");
        const modal = new Modal("url-modal-template");
        const saveBtn = modal.modalElement.querySelector(".save-url");
        const url = modal.modalElement.querySelector(".modal-url-box");
        url.value = links.filter((link)=>link.link_id===linkId)[0].url;
        saveBtn.addEventListener("click",saveURL.bind(this,linkId,url,modal));
        url.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
             event.preventDefault();
             saveBtn.click();
            }
        });
    });
});


const saveURL = (link_id,url,modal) => {
    const error = modal.modalElement.querySelector(".error");
    $.post("/admin/zoom-links/save-url",{
        link_id: link_id,
        url: url.value,
    },
    (result)=>{
        if(result!="Fail"){
            if(result!="URL TAKEN"){
                error.style.display = "none";
                links.filter((link)=>link.link_id===link_id)[0].url = url.value;
                modal.removeModal();
            }
            else{
                error.style.display = "block";
                error.textContent = "URL is not available";
            }
        }
        else{
            error.style.display = "block";
            error.textContent = "Something went wrong";
        }
    }
    )
}
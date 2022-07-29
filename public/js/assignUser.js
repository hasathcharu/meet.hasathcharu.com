import {Modal} from "./modal.js";
import {Assigner} from "./assigner.js";
// import {SearchBox} from "./search.js";

const assignButtons = [...document.getElementsByClassName("assign-btn")];
assignButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
        const userId = button.getAttribute("user-id");
        const modal = new Modal();
        const assigner = new Assigner(userId,modal.modalElement);
        assigner.updateList();
        assigner.updateSearchList();
    });
});

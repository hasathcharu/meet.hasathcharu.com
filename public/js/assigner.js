export class Assigner{
    constructor(id,modalElement,linkAssigner = 0){
        this.id = id;
        this.modal = modalElement;
        this.assignedArea = this.modal.querySelector(".modal-assigned").querySelector(".link-boxes");
        this.searchBox = this.modal.querySelector(".modal-search-box");
        if(!linkAssigner){
            this.searchBox.parentNode.parentNode.style.display = "none";
        }
        this.searchArea = this.modal.querySelector(".modal-search-items").querySelector(".link-boxes");
    }

    // setAssignedArea(domId){
    //     this.assignedArea = document.querySelector();
    // }
    // setSearchArea(domId){
    //     this.searchArea = document.getElementById(domId);
    // }
    // setSearchBox(domId){
    //     this.searchBox = document.getElementById(domId);
    // }
    updateList(){
        $.post("/admin/users/assigned",
        {
            id: this.id,
        },
        (result)=>{
            this.assignedArea.innerHTML = "";
            this.displayLinksDom(result);
        });
    }
    updateSearchList(search = null){
        $.post("/admin/users/unassigned",
        {
            id: this.id,
            search: search,
        },
        (result)=>{
            this.searchArea.innerHTML = "";
            this.displayLinksDom(result,0);
        });
    }
    displayLinksDom = (result,assigned = 1)=> {
        let items = result;
        if(items.length==0){
            if(assigned){
                this.assignedArea.innerHTML = "<h3>No links yet</h3>";
                return;
            }
            this.searchArea.innerHTML = "<h3>No links yet</h3>";
            return;
        }
        items.forEach((item)=>{
            const linkBoxElement = document.createElement("div");
            linkBoxElement.classList.add("link-box");
            const linkBoxTopic = document.createElement("div");
            linkBoxTopic.classList.add("link-box-topic");
            linkBoxTopic.innerHTML = `
                <h3>${item.topic}</h3>
                <p>${item.link_id}</p>
            `;
            linkBoxElement.appendChild(linkBoxTopic);
            const button = document.createElement("button");
            if(assigned){
                button.classList.add("warning-btn");
                button.innerHTML = '<i class="fas fa-minus-circle"></i>';
                button.addEventListener("click",()=>{
                    $.post("/admin/users/unassign",{
                        link_id: item.link_id,
                        user_id: this.id,
                    },
                    (result)=>{
                        this.updateList();
                        this.updateSearchList();
                    });
                });
            }
            else{
                button.innerHTML = '<i class="fas fa-plus-circle"></i>';
                button.addEventListener("click",()=>{
                    $.post("/admin/users/assign",{
                        link_id: item.link_id,
                        user_id: this.id,
                    },
                    (result)=>{
                        this.updateList();
                        this.updateSearchList();
                    });
                });
            }
            linkBoxElement.appendChild(button);
            if(assigned){
                this.assignedArea.append(linkBoxElement);
            }
            else{
                this.searchArea.append(linkBoxElement);
            }
            
        });
    }
}
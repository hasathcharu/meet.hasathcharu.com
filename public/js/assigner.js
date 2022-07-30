export class Assigner{
    constructor(id,modalElement,linkAssigner = 0){
        this.id = id;
        this.modal = modalElement;
        this.assignedArea = this.modal.querySelector(".modal-assigned").querySelector(".link-boxes");
        this.searchBox = this.modal.querySelector(".modal-search-box");
        this.linkAssigner = linkAssigner
        if(!this.linkAssigner){
            this.searchBox.parentNode.parentNode.style.display = "none";
        }else{
            this.search();
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

    search(){
        this.searchBox.addEventListener("keyup",()=>{
            this.updateSearchList(this.searchBox.value);
        });
    }
    updateList(){
        var url = "/admin/users/assigned";
        if(this.linkAssigner){
            url = "/admin/zoom-links/assigned"
        }
        $.post(url,
        {
            id: this.id,
        },
        (result)=>{
            this.assignedArea.innerHTML = "";
            this.displayLinksDom(result);
        });
    }
    updateSearchList(search = null){
        let url = "/admin/users/unassigned";
        if(this.linkAssigner){
            url = "/admin/zoom-links/unassigned"
        }
        $.post(url,
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
                this.assignedArea.innerHTML = "<h3>No links</h3>";
                if(this.linkAssigner){
                    this.assignedArea.innerHTML = "<h3>No users</h3>";
                }
                return;
            }
            this.searchArea.innerHTML = "<h3>No links yet</h3>";
            if(this.linkAssigner){
                this.searchArea.innerHTML = "<h3>No users yet</h3>";
            }
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
            if(this.linkAssigner){
                linkBoxTopic.innerHTML = `
                    <h3>${item.fname} ${item.lname}</h3>
                    <p>${item.email}</p>
                `;
            }
            linkBoxElement.appendChild(linkBoxTopic);
            const button = document.createElement("button");
            if(assigned){
                button.classList.add("warning-btn");
                button.innerHTML = '<i class="fas fa-minus-circle"></i>';
                button.addEventListener("click",()=>{
                    let url = "/admin/users/unassign";
                    let data = {
                        link_id: item.link_id,
                        user_id: this.id,
                    }
                    if(this.linkAssigner){
                        url = "/admin/zoom-links/unassign";
                        data = {
                            user_id: item.user_id,
                            link_id: this.id,
                        }
                    }
                    $.post(url,data,
                    (result)=>{
                        this.updateList();
                        this.updateSearchList();
                    });
                });
            }
            else{
                button.innerHTML = '<i class="fas fa-plus-circle"></i>';
                button.addEventListener("click",()=>{
                    let url = "/admin/users/assign";
                    let data = {
                        link_id: item.link_id,
                        user_id: this.id,
                    }
                    if(this.linkAssigner){
                        url = "/admin/zoom-links/assign";
                        data = {
                            user_id: item.user_id,
                            link_id: this.id,
                        }
                    }
                    $.post(url,data,
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
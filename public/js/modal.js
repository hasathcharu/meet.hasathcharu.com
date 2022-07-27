export class Modal {
	constructor(item, parent) {
		this.item = item;
		this.parent = parent;
		document.body.style.overflow = "hidden";
		this.modalElement = document.createElement("div");
		this.modalElement.className = "card-modal";
		const modalTemplate = document.getElementById("card-modal-template");
		this.modalBody = document.importNode(modalTemplate.content, true);
		this.modalBody.querySelector("h3").textContent = this.item.title;
		// this.modalBody.querySelector("h4").textContent = this.item.type;
		if (this.item.desktopImg) {
			const imgElement = document.createElement("img");
			imgElement.src = this.item.desktopImg;
			this.modalBody.querySelector(".img-container").append(imgElement);
		}
		// if (this.item.role){
		// 	this.modalBody.querySelector(".role").innerHTML = this.item.role;
		// }
		this.modalBody.querySelector("p").innerHTML = this.item.description;
		this.modalBody.querySelector("button").addEventListener("click", (e) => {
			this.removeModal();
		});
		this.modalElement.append(this.modalBody);
		document.body.append(this.modalElement);
		this.fadeIn();
		this.modalElement.addEventListener("click", (e) => {
			if (
				!e.path.includes(document.querySelector("div.card-modal-content")) &&
				document.querySelector(".card-modal")
			) {
				this.removeModal();
			}
		});
		this.modalElement.addEventListener("touchstart", (e) => {
			if (
				!e.path.includes(document.querySelector("div.card-modal-content")) &&
				document.querySelector(".card-modal")
			) {
				this.removeModal();
			}
		});
	}
	fadeIn = ()=> {
		$(this.modalElement).animate({ opacity: 1 }, 200);
		$(this.modalElement.querySelector(".card-modal-content")).animate(
			{ marginTop: "1rem" },
			200
		);
	}
	fadeOut = ()=> {
		return new Promise((resolve) => {
			$(this.modalElement).animate({ opacity: 0 }, 200);
			$(this.modalElement.querySelector(".card-modal-content")).animate(
				{ marginTop: "10rem" },
				200,
				"swing",
				resolve
			);
		});
	}
	removeModal = ()=> {
		this.fadeOut().then(() => {
			this.modalElement.remove();
			document.body.style.overflow = "auto";
		});
	}
}
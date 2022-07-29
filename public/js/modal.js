export class Modal {
	constructor(templateId) {
		document.body.style.overflow = "hidden";
		this.modalElement = document.createElement("div");
		this.modalElement.className = "card-modal";
		const modalTemplate = document.getElementById(templateId);
		this.modalBody = document.importNode(modalTemplate.content, true);
		
		
		
		this.modalBody.querySelector(".close").addEventListener("click", (e) => {
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
		// this.modalElement.addEventListener("touchstart", (e) => {
		// 	if (
		// 		!e.path.includes(document.querySelector("div.card-modal-content")) &&
		// 		document.querySelector(".card-modal")
		// 	) {
		// 		this.removeModal();
		// 	}
		// });
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
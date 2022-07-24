function getThemeCookie() {
	let name = 'theme' + "=";
	let ca = document.cookie.split(';');
	for(let i = 0; i < ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
  }
function checkThemeCookie() {
	let cookie = getThemeCookie('theme');
	if (cookie != "") {
		var html = document.querySelector("html")
		html.dataset.theme = cookie;
	}
}
checkThemeCookie();
window.addEventListener("load",()=>{
	loadContent();
});

function loadContent(){
	$(".se-pre-con").fadeOut("400", () => {
		$("main.portal")
			.css("opacity", 0)
			.css("display", "grid")
			.css("margin-top", "3rem")
			.animate({ opacity: 1, marginTop: 0 }, 500);
	});
}
function setThemeCookie(cvalue) {
	$.post("/user/set-theme",
	{
		theme: cvalue,
	});
	const d = new Date();
	d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
	let expires = "expires="+d.toUTCString();
	document.cookie = 'theme' + "=" + cvalue + ";" + expires + ";path=/";
}
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
var darkButton = document.getElementById("darkMode");
if(getThemeCookie()=="dark"){
	darkButton.classList.add('toggleDark');
}
darkButton.addEventListener("click",()=>{
	var html = document.querySelector("html")
	var theme = html.dataset.theme;
	if(theme == 'dark'){
		html.dataset.theme = 'light';
		darkButton.classList.remove('toggleDark');
		setThemeCookie('light');
	}
	else{
		html.dataset.theme = 'dark';
		darkButton.classList.add('toggleDark');
		setThemeCookie('dark');
	}
});
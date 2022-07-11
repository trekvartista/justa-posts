function route(event) {
	event = event || window.event
	event.preventDefault()

	history.pushState(null, null, event.target.href)
	handleLocation()
}

const routes = {
	404: "404.html",
	'/': "index.html",
	'/:id': "post.html"
}

function handleLocation() {
	const path = window.location.pathname
	const route = routes[path] || routes[404]
	const html = fetch(route).then(res => res.text())
	document.getElementById("main").innerHTML = html
}

window.onpopstate = handleLocation
window.route = route

handleLocation()
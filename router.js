import { displayPostPage } from "./index.js";

function routing() {
    // var content = document.getElementById("wrapper");

    const routes = [
        { path: "", callback: () => console.log("main page") },
        { path: "post/", callback: (params) => {
			displayPostPage(params)
			console.log(`post ${params} page`)
		}},
        // { path: "/posts", callback: () => console.log("posts page") },
    ];

    const hash = window.location.hash.substring(1).replace(/\//gi, "/");
    //Default route is first registered route
    let route = routes[0];
    //Find matching route
    for (let i = 0; i < routes.length; i++) {
        let testRoute = routes[i];
        // console.log(hash, testRoute.path);
        if (hash.includes(testRoute.path)) {
            route = testRoute;
        }
    }
    // console.log(hash);
    let param = hash.split(route.path)[1];
    // console.log(param);

    // Fire route
    route.callback(param);
}

// Listener
window.addEventListener("popstate", routing);
// Initial call
setTimeout(routing, 0);

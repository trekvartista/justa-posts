var posts = [];
var filteredPosts = [];
var users = [];
var currentPage = 1;
var limit = 10;
var filterValue = 0;

var handleError = function (err) {
    console.warn(err);
    return new Response(
        JSON.stringify({
            code: 400,
            message: "Stupid network Error",
        })
    );
};

function searchPosts() {
    // Get the value of the input field.
    let searchValue = searchInput.value.toLowerCase();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        changePage(currentPage);
    }
}

function nextPage() {
    if (currentPage < limit) {
        currentPage++;
        changePage(currentPage);
    }
}

function numPages() {
    return Math.ceil(filteredPosts.length / limit);
}

async function getPosts() {
    // fetch the posts
    posts = await (await fetch(`https://jsonplaceholder.typicode.com/posts`).catch(err => handleError(err))).json().then(data => {
    	filteredPosts = data;
    	changePage(1)
    })
    // filteredPosts = [...posts];
    // changePage(currentPage);
    // console.log(filteredPosts)

    // fetch(`https://jsonplaceholder.typicode.com/posts`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         posts = data;
    //         filteredPosts = data;
    //         // console.log(posts);
    //         changePage(currentPage);
    //     })
    //     .catch((err) => handleError(err));
}

async function getUsers() {
    // get list of users
    // fetch(`https://jsonplaceholder.typicode.com/users`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         users = data;
    //         // console.log(users);
    //     })
    //     .catch((err) => handleError(err));

    users = await (await fetch(`https://jsonplaceholder.typicode.com/users`).catch(err => handleError(err))).json()
    // console.log(users)
}

function displayPost(i) {
    let li = document.createElement("li");
    li.setAttribute("class", "collection-item");

    let a = document.createElement("a");
    a.setAttribute("href", "#post/" + filteredPosts[i].id);
    a.innerHTML = filteredPosts[i].title;

    let user = users.find((user) => user.id == filteredPosts[i].userId);
    let user_span = document.createElement("span");
    user_span.setAttribute("class", "secondary-content");
    // console.log(user_span)
    user_span.innerHTML = user?.name;
    li.appendChild(user_span);

    li.appendChild(a);
    ul.appendChild(li);
}

function changePage(page) {
    let page_span = document.getElementById("pageNumber");
    // console.log(users)

    // boundary check
    if (page < 1 || !numPages()) page = 1;
    else if (page > numPages()) page = numPages();

    // clear data from previous pages
    ul.innerHTML = "";

    // display 10 posts of the page
    for (
        let i = (page - 1) * limit;
        i < page * limit && i < filteredPosts.length;
        i++
    ) {
        displayPost(i);
    }
    // display page number
    page_span.innerHTML = page;

    if (page == 1) {
        prev_btn.setAttribute("class", "btn disabled");
    } else {
        prev_btn.setAttribute("class", "waves-effect waves-light btn");
    }

    if (page == numPages() || !numPages()) {
        next_btn.setAttribute("class", "btn disabled");
    } else {
        next_btn.setAttribute("class", "waves-effect waves-light btn");
    }
}

function filterPosts() {
    let searchValue = searchInput.value.toLowerCase();
    let filterValue = filter.value;

    filteredPosts = posts.filter((post) => {
        let users_match;
        let title_match = post.title.toLowerCase().includes(searchValue);
        let body_match = post.body.toLowerCase().includes(searchValue);

        users.map((user) => {
            if (user.id == post.userId) {
                users_match = user.name.toLowerCase().includes(searchValue);
            }
        });

        if (filterValue == 0) {
            return title_match || body_match || users_match;
        } else if (filterValue == 1) {
            return title_match;
        } else if (filterValue == 2) {
            return users_match;
        } else if (filterValue == 3) {
            return body_match;
        }
    });
    changePage(1);
    // console.log(filteredPosts);
}

var ul = document.getElementById("posts");
var content = document.getElementById("wrapper");

// handle input bar
let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", filterPosts);

// handle input filter
let filter = document.getElementById("filter");
filter.addEventListener("change", (e) => {
    filterValue = e.target.value;
    filterPosts();
});

// handle pagination
var paginator = document.getElementById("paginator");
var prev_btn = document.getElementById("prev");
var next_btn = document.getElementById("next");
next_btn.addEventListener("click", nextPage);
prev_btn.addEventListener("click", prevPage);



function routing() {
	const routes = [
		{ path: "", callback: () => console.log("main page") },
		{ path: "post/", callback: (params) => {
			// console.log(params);
			content.innerHTML = "";
			let post = filteredPosts.find((post) => post.id == params);
			let post_div = document.createElement("div");

			let user = users.find((user) => user.id == post.userId);
			let user_div = document.createElement("div");
			user_div.setAttribute("class", "card-panel");
			user_div.innerHTML = `<h5>${user.name}</h5>`;
			
			post_div.setAttribute("class", "card");
			post_div.innerHTML = `
				<div class="card-content">
					<span class="card-title">${post.title}</span>
					<p>${post.body}</p>
				</div>
			`;
			post_div.appendChild(user_div);
			content.appendChild(post_div);

		} },
		// { path: "/posts", callback: () => console.log("posts page") },
	];

    const hash = window.location.hash.substring(1).replace(/\//ig, '/');
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
//Listener
window.addEventListener('popstate', routing);
//Initial call
setTimeout(routing, 0);
//Add other routes


window.onload = function () {
    getUsers();
    getPosts();
    console.log("loaded");
};
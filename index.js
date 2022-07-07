var posts = [];
var filteredPosts = [];
var users = [];
var currentPage = 1;
var limit = 10;
var filterValue = 0

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

// posts = await (await fetch(`https://jsonplaceholder.typicode.com/posts`).catch(err => handleError(err))).json()

function getPosts() {
    // fetch the posts
    fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((res) => res.json())
        .then((data) => {
            posts = data;
            filteredPosts = data;
            // console.log(posts);
            changePage(currentPage);
        })
        .catch((err) => handleError(err));
}

function getUsers() {
    // get list of users
    fetch(`https://jsonplaceholder.typicode.com/users`)
        .then((res) => res.json())
        .then((data) => {
            users = data;
            // console.log(users);
        })
        .catch((err) => handleError(err));
}

function displayPost(i) {
    let li = document.createElement("li");
    li.setAttribute("class", "collection-item");

    let a = document.createElement("a");
    a.setAttribute("href", document.URL + "/" + filteredPosts[i].id);
    a.innerHTML = filteredPosts[i].title;

	let user = users.find((user) => user.id == filteredPosts[i].userId);
	let user_span = document.createElement("span");
	user_span.setAttribute("class", "secondary-content");
	user_span.innerHTML = user.name;
	li.appendChild(user_span);

    li.appendChild(a);
    ul.appendChild(li);
}

function changePage(page) {
    let page_span = document.getElementById("page");

    // boundary check
    if (page < 1 || !numPages()) page = 1;
    else if (page > numPages()) page = numPages();

    // clear data from previous pages
    ul.innerHTML = "";

    // display 10 posts of the page
    for (let i = (page - 1) * limit; i < page * limit && i < filteredPosts.length; i++) {
        // console.log(page, i, filteredPosts.length)

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

		users.map(user => {
			if (user.id == post.userId) {
				users_match = user.name.toLowerCase().includes(searchValue);
			}
		})

		if (filterValue == 0) {
			return title_match || body_match || users_match;
		}
		else if (filterValue == 1) {
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


let ul = document.getElementById("posts");

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

// debugger
window.onload = function () {
    getUsers();
    getPosts();
    console.log("loaded");
    // changePage(1);
};

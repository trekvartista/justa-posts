var posts = [];
var filteredPosts = [];
var users = [];
let currentPage = 1;
let limit = 10;

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
            console.log(posts);
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
            console.log(users);
        })
        .catch((err) => handleError(err));
}

let ul = document.getElementById("posts");

// handle pagination
var paginator = document.getElementById("paginator");
var prev_btn = document.getElementById("prev");
var next_btn = document.getElementById("next");
next_btn.addEventListener("click", nextPage);
prev_btn.addEventListener("click", prevPage);

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

let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", filterPosts);

function filterPosts() {
    let filterValue = searchInput.value.toLowerCase();
    filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(filterValue)
    );
    changePage(1);
    // console.log(filteredPosts);
}

// debugger
window.onload = function () {
    getUsers();
    getPosts();
    console.log("loaded");
    // changePage(1);
};

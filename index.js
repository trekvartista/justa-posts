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
    await (await fetch(`https://jsonplaceholder.typicode.com/posts`).catch(err => handleError(err))).json().then(data => {
    	filteredPosts = data;
		posts = data;
    	changePage(1)
    })
	// console.log(posts);
}

async function getUsers() {

    // get list of users
    await (await fetch(`https://jsonplaceholder.typicode.com/users`).catch(err => handleError(err))).json().then(data => {
		users = data;
	})
}

function displayPost(i) {
    let li = document.createElement("li");
    li.setAttribute("class", "collection-item");

	let h5 = document.createElement("h5");

    let a = document.createElement("a");
	a.className = "postLink"
    a.setAttribute("href", "#post/" + filteredPosts[i].id);
    a.innerHTML = filteredPosts[i].title;

	let p = document.createElement("p");
	p.innerHTML = filteredPosts[i].body;

    let user = users.find((user) => user.id == filteredPosts[i].userId);
    let user_span = document.createElement("span");
    user_span.setAttribute("class", "secondary-content");
    // console.log(user_span)
    user_span.innerHTML = user?.name;
    li.appendChild(user_span);

	h5.appendChild(a);
    li.appendChild(h5);
	li.appendChild(p);
    ul.appendChild(li);
}

export const displayPostPage = (params) => {

	// console.log(users);
	content.innerHTML = "";
	let post = filteredPosts.find((post) => post.id == params);
	let post_div = document.createElement("div");

	let user = users.find((user) => user.id == post.userId);
	console.log(user);
	let user_div = document.createElement("div");
	user_div.setAttribute("class", "card-panel");
	user_div.innerHTML = `
		<div>
			<h5><a href="mailto:${user?.email}">${user?.name}</a></h5>
			<span> from <i>${user?.company?.name}</i> </span>	
		</div>`;
	
	post_div.setAttribute("class", "card");
	post_div.innerHTML = `
		<div class="card-content">
			<span class="card-title"><b>${post?.title}</b></span>
			<p>${post?.body}</p>
		</div>
	`;
	post_div.appendChild(user_div);
	content.appendChild(post_div);
}

export const dislpayTestPage = () => {
	content.innerHTML = "";
	let test_div = document.createElement("div");
	test_div.setAttribute("class", "card-panel");
	test_div.innerHTML = `
		
		<div class="card-content">
			<span class="card-title"><b>Test Page</b></span>
		</div>
	`;

	let first_input = document.createElement("input");
	let second_input = document.createElement("input");

	first_input.setAttribute("type", "number");
	first_input.min = "1";
	first_input.max = "100000";
	first_input.setAttribute("id", "first_input");
	first_input.oninput = function () {
		second_input.value = first_input.value;
		console.log(first_input.value);
	}
	
	first_input.setAttribute("placeholder", "Enter numbers between 0 and 100000...");
	// first_input.setAttribute("class", "input-field col s6");

	second_input.setAttribute("type", "number");
	second_input.disabled = true;
	// console.log(first_input.value);
	
	test_div.appendChild(first_input);
	test_div.appendChild(second_input);

	content.appendChild(test_div);
}

function changePage(page) {
    let page_span = document.getElementById("pageNumber");

    // boundary check
    if (page < 1 || !numPages()) page = 1;
    else if (page > numPages()) page = numPages();

    // clear data from previous pages
    ul.innerHTML = "";

    // display 10 posts of the page
    for ( let i = (page - 1) * limit; i < page * limit && i < filteredPosts.length; i++ ) {
        displayPost(i);
    }

    // display page number
	if (page_span) page_span.innerHTML = page;

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



window.onload = function () {
    getUsers();
    getPosts();
    console.log("loaded");
};
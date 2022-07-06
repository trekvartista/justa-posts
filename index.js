var posts = []
let currentPage = 1;
let limit = 10;

var handleError = function (err) {
	console.warn(err);
	return new Response(JSON.stringify({
		code: 400,
		message: 'Stupid network Error'
	}));
};


function searchPosts() {
    // Get the value of the input field.
    let searchValue = searchInput.value.toLowerCase();
}

function prevPage() {
	if (currentPage > 1) {
		currentPage--;
		changePage(currentPage)
	}
}

function nextPage() {
	if (currentPage < limit) {
		currentPage++;
		changePage(currentPage)
	}
}

function numPages() {
	return Math.ceil(posts.length / limit);
}

// fetch Posts()
// posts = await (await fetch(`https://jsonplaceholder.typicode.com/posts`).catch(err => handleError(err))).json()
posts = fetch(`https://jsonplaceholder.typicode.com/posts`).then(res => res.json()).then(data => {
	posts = data;
	changePage(currentPage);
}
).catch(err => handleError(err));

let ul = document.getElementById('posts');
// // let li = ul.querySelectorAll('li.collection-item');

// for (let i = 0; i < posts.length; i++) {
// 	let li = document.createElement('li');
// 	li.setAttribute('class', 'collection-item');
// 	let a = document.createElement('a');
// 	a.setAttribute('href', document.URL + '/' + posts[i].id);
// 	a.innerHTML = posts[i].title;
// 	li.appendChild(a);
// 	ul.appendChild(li);
// 	// console.log(posts[i].title);
// }	

function changePage(page) {
	let prev_btn = document.getElementById('prev');
	let next_btn = document.getElementById('next');
	let paginator = document.getElementById('paginator');
	let page_span = document.getElementById('page');

	if (page < 1) page = 1;
	if (page > numPages()) page = numPages();

	ul.innerHTML = '';

	for (let i = (page - 1) * limit; i < (page * limit) && i < posts.length; i++) {
		console.log(i)
		let li = document.createElement('li');
		li.setAttribute('class', 'collection-item');
		let a = document.createElement('a');
		a.setAttribute('href', document.URL + '/' + posts[i].id);
		a.innerHTML = posts[i].title;
		li.appendChild(a);
		ul.appendChild(li);

	}
	page_span.innerHTML = page;
	if (page == 1) {
		prev_btn.setAttribute('class', 'disabled');
	}
	else {
		prev_btn.setAttribute('class', 'waves-effect');
	}

	if (page == numPages()) {
		next_btn.setAttribute('class', 'disabled');
	}
	else {
		next_btn.setAttribute('class', 'waves-effect');
	}
}

// handle pagination 
let paginator = document.getElementById('paginator');
let prev_btn = document.getElementById('prev');
let next_btn = document.getElementById('next');
next_btn.addEventListener('click', nextPage);
prev_btn.addEventListener('click', prevPage);



let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", searchPosts);

// debugger
window.onload = function () {
	// console.log(posts);
	console.log('loaded');
	// changePage(1);
}

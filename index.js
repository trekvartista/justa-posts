var posts = []

var handleError = function (err) {
	console.warn(err);
	return new Response(JSON.stringify({
		code: 400,
		message: 'Stupid network Error'
	}));
};

async function fetchPosts() {

    let data = await (await fetch('https://jsonplaceholder.typicode.com/posts').catch(err => handleError(err))).json()
	posts = data;
}

function searchPosts() {
    // Get the value of the input field.
    let searchValue = searchInput.value.toLowerCase();
}

// fetchPosts()
posts = await (await fetch('https://jsonplaceholder.typicode.com/posts').catch(err => handleError(err))).json()


let ul = document.getElementById('posts');
// let li = ul.querySelectorAll('li.collection-item');

for (let i = 0; i < posts.length; i++) {
	let li = document.createElement('li');
	li.setAttribute('class', 'collection-item');
	let a = document.createElement('a');
	a.setAttribute('href', document.URL + '/' + posts[i].id);
	a.innerHTML = posts[i].title;
	li.appendChild(a);
	ul.appendChild(li);
	// console.log(posts[i].title);
}	

let searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", searchPosts);



console.log(posts);
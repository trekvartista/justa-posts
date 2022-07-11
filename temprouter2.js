const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const routes = [
    { path: "/", view: () => console.log("main page") },
    { path: "/posts", view: () => console.log("posts page") },
];

const router = async () => {
    const potentialMatches = routes.map((route) => {
        return { route: route, isMatch: route.path === location.pathname };
    });

    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.isMatch
    );

    if (!match) {
        match = { route: routes[0], isMatch: true };
    }

    console.log(match.route.view());
};

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});

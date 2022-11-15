const app = {};
app["apiBaseURL"] = "https://api.demoblaze.com";
app["api"] = {
    addToCart: { method: "POST", url: app.apiBaseURL + '/addtocart' },
    deleteCart: { method: "POST", url: app.apiBaseURL + '/deletecart' },
    login: { method: "POST", url: app.apiBaseURL + '/login' },
    view: { method: "POST", url: app.apiBaseURL + '/view' },
    viewCart: { method: "POST", url: app.apiBaseURL + '/viewcart' },
};
app["sectionPaths"] = {
    home: '/index.html',
    product(idp = 1) { return `/prod.html?idp_=${idp}`},
    cart: '/cart.html'
};

exports.app = app;
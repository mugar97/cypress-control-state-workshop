export const navigationBar = {
    get navBar() {
        return cy.get('ul.navbar-nav');
    },
    get home() {
        return cy.contains('.nav-item a', 'Home');
    },
    get contact() {
        return cy.contains('.nav-item a', 'Contact');
    },
    get aboutUs() {
        return cy.contains('.nav-item a', 'About us');
    },
    get cart() {
        return cy.contains('.nav-item a', 'Cart');
    },
    get logIn() {
        return cy.get('#login2');
    },
    get signUp() {
        return cy.get('#signin2');
    },
    get logOut() {
        return cy.get('#logout2');
    },
    get welcome() {
        return cy.get('#nameofuser');
    }
};

export const productPage = {
    get infoCard() {
        return cy.get('#tbodyid');
    },
    get title() {
        return cy.get('.name');
    },
    get priceContainer() {
        return cy.get('.price-container');
    },
    get descriptionContainer() {
        return cy.get('#more-information');
    },
    get addToCartButton() {
        return cy.get('a.btn');
    },
    get image() {
        return cy.get('#imgp img');
    },
};

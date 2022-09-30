const { app } = require("../helpers/config");
const { navigationBar } = require("../helpers/pages");

describe('Navigation', () => {
    it('Home - redirects to home section', () => {
        cy.visit(app.sectionPaths.product());
        navigationBar.home.click();
        cy.url().should('contain',app.sectionPaths.home);
    });
    context('Home', () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.visit(app.sectionPaths.home);
        });
        it('Cart - redirects to Cart section', () => {
            navigationBar.cart.click();
            cy.url().should('contain',app.sectionPaths.cart);
        });
        it('Contact - opens Contact modal', () => {
            navigationBar.contact.click();
            cy.get("#exampleModal").should('be.visible');
        });
        it('About us - opens video modal', () => {
            navigationBar.aboutUs.click();
            cy.get("#videoModal").should('be.visible');
        });
        it('Log In - opens login modal', () => {
            navigationBar.logIn.click();
            cy.get("#logInModal").should('be.visible');
        });
        it('Sign up - opens sign up modal', () => {
            navigationBar.signUp.click();
            cy.get("#signInModal").should('be.visible');
        });
    });
    context('Logged in', () => {
        beforeEach(() => {
            cy.loginAPI();
            cy.visit(app.sectionPaths.home);
        });
        it('Log Out - logs out the user', () => {
            navigationBar.logOut.should('be.visible').click();
            navigationBar.logIn.should('be.visible');
            navigationBar.signUp.should('be.visible');
            navigationBar.logOut.should('not.be.visible');
            navigationBar.welcome.should('not.be.visible');
        });
        it('Welcome - is present', () => {
            navigationBar.welcome.should('be.visible').and('contain.text','Welcome');
        });
    });
});
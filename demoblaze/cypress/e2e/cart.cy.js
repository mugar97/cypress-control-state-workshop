const { app } = require("../helpers/config");

describe('Cart', () => {
    beforeEach(() => {
        cy.loginAPI().clearCart();
    });
    it('Cart with products', () => {
        cy.addToCart([2, 3, 1]).visit(app.sectionPaths.cart);
        cy.get("#tbodyid").should("be.visible"); 
    });
});

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

// TODO list:
// Products list:
//  - renders proper information when there are products
//  - shows an empty list when there are no products
//  - total shows right total (experiment with calculations)
//  - User actions:
//    - deletes a product
//    - Place Order button opens a modal with the right total
//    - Dismiss Place Order modal
//  - Place Order from:
//    - Alerts - empty name or credit card

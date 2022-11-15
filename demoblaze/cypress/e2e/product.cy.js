const { app } = require("../helpers/config");
const { getViewStubbedResponse } = require("../helpers/data");
const { productPage } = require("../helpers/pages");

describe('Product', () => {
    context('Display', () => {        
        it('Shows the product information delivered by /view', () => {
            // arrange
            const productStub = getViewStubbedResponse({
                id: 100,
                title: "My Product",
                price: 360.99,
                desc: "ABCdef123\n&%'\nåãá.",
                img: "imgs/my_image.jpg",
            });
            const expected = {
                title: productStub.title,
                price: "$360.99 *includes tax",
                desc: productStub.desc,
                img: productStub.img,
                onClickMethod: `addToCart(${productStub.id})`,
            }
            cy.intercept(app.api.view, productStub).as('product');
            
            // act
            cy.visit(app.sectionPaths.product(productStub.id));
            
            // assert
            cy.wait('@product').its('request.body.id').should("eq",productStub.id.toString());
            productPage.infoCard.within(() => {
                productPage.title.should("have.text", productStub.title);
                productPage.priceContainer.should("have.text", expected.price);
                productPage.descriptionContainer.within(()=>{
                    cy.get('strong').should("have.text","Product description");
                    cy.get('p').should("have.text", expected.desc);
                });
                productPage.addToCartButton.should("have.attr", "onclick", expected.onClickMethod);
            });
            productPage.image.should("have.attr","src",expected.img);
        });
        
        context('Prices', () => {
            [
                {tc:'hide cents - cents: 0, precision: 2', price: 300.00, priceTag: "$300 *includes tax"},
                {tc:'show cents - cents: 20, precision: 1', price: 300.2, priceTag: "$300.2 *includes tax"},
                {tc:'round cents - cents: 4444, precision: 4', price: 100.4444, priceTag: "$100.44 *includes tax"},
                {tc:'negative values', price: -10.00, priceTag: "$0 *includes tax"},
            ].forEach(({tc, price, priceTag}) => {
                it(tc, () => {
                    // arrange
                    const productStub = getViewStubbedResponse({ price: price });
                    cy.intercept(app.api.view, productStub);
    
                    // act
                    cy.visit(app.sectionPaths.product(productStub.id));
    
                    // assert
                    productPage.infoCard.within(() => {
                        productPage.priceContainer.should("have.text", priceTag);
                    });
                });
            });
        });
    });
    context('User actions', () => {
        beforeEach(() => {
            cy.loginAPI().clearCart();
        });
        it('Can add a product to the cart using the Add to Cart button', () => {
            // arrange
            const initialProductsOnCart = [5, 9]; 
            const productToAdd = 14;
            const expectedProductsOnCart = [...initialProductsOnCart, productToAdd];
            
            cy.addToCart([5, 9]).then(() => {
                cy.intercept(app.api.addToCart).as('addToCart');
                
                // act
                cy.visit(app.sectionPaths.product(productToAdd));
                cy.window().then((win) => {
                    cy.spy(win, 'alert');
                    productPage.addToCartButton.click();

                    // assert - alert
                    cy.wait('@addToCart').then(() => {
                        expect(win.alert).to.be.calledWith("Product added.");
                    });
                });

                // assert - product added
                cy.getProductsOnCart().then((products) => {
                    expect(products).to.have.members(expectedProductsOnCart);
                });
            });
        });
    });
});

const { app } = require("../helpers/config");
const { getViewStubbedResponse, getViewCartStubbedResponse } = require("../helpers/data");

describe('Purchase', () => {
    context('Successful purchase results', () => {
        const purchaseData = {
            price: 1995.99,
            name: "Test Name",
            creditCard: "1234-asdf-5689",
            date: {
                year: 2018,
                month: 8,
                day: 31
            }
        }
        const { year, month, day } = purchaseData.date;
        const expectedPurchaseSummary = {
            amount: "1995 USD",
            cardNumber: purchaseData.creditCard,
            name: purchaseData.name,
            date: `${day}/${month}/${year}`,
        }
        before(() => {
            cy.loginAPI();
            cy.clock(Date.UTC(year, month - 1, day), ['Date']);
            const cartStub = getViewCartStubbedResponse();
            const productStub = getViewStubbedResponse({ price: purchaseData.price }); 
            cy.intercept(app.api.viewCart, cartStub);
            cy.intercept(app.api.view, productStub).as('product');
            
            cy.visit(app.sectionPaths.cart);
            cy.wait('@product').then(()=>{
                cy.get("#name").setVal(purchaseData.name);
                cy.get("#card").setVal(purchaseData.creditCard);
            });
        });
        it('The summary view is shown with proper information', () => {
            // act
            cy.window().invoke('purchaseOrder');
            
            // assert
            cy.get(".sweet-alert")
                .should("be.visible")
                .invoke("text")
                    .should("contain", "Thank you for your purchase!")
                    .and("match", /Id: \d+/)
                    .and("contain", `Amount: ${expectedPurchaseSummary.amount}`)
                    .and("contain", `Card Number: ${expectedPurchaseSummary.cardNumber}`)
                    .and("contain", `Name: ${expectedPurchaseSummary.name}`)
                    .and("contain", `Date: ${expectedPurchaseSummary.date}`);
        });
        it('Redirects to home after accepting the summary', () => {
            // act
            cy.window().invoke('purchaseOrder');
            cy.wait(1000); // waiting for animation to end
            cy.get(".sweet-alert button.confirm").click();
    
            // assert
            cy.url().should("contain", app.sectionPaths.home);
        });
    });
});
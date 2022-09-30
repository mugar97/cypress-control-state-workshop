// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { app } from "../helpers/config";
import { base64, guid } from "../helpers/utils";

Cypress.Commands.add('setVal', { prevSubject: 'element' }, (subject, text) => {
    cy.wrap(subject).then(($elem) => {
        $elem.val(text);
    });
});

// To submit login form using App Actions
Cypress.Commands.add('loginJS', ({ username, password } = {}) => {
    username && cy.get('#loginusername').setVal(username);
    password && cy.get('#loginpassword').setVal(password);
    cy.window().invoke('logIn');
});

// Login via API
Cypress.Commands.add('loginAPI', () => {
    cy.fixture('user').then(({username, password})=>{
        cy.request({
            ...app.api.login,
            body: {
                username: username,
                password: base64(password)
            }
        }).then((response) => {
            const token = response.body.replace("Auth_token: ", "");
            cy.setCookie('tokenp_', token);
        });
    });
});

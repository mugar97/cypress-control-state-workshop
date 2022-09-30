function assertLoggedIn() {
  cy.get("#logInModal").should("not.be.visible");
  cy.get("#login2").should("not.be.visible");
  cy.get('#signin2').should("not.be.visible");
  cy.get('#logout2').should("be.visible");
  cy.get('#nameofuser')
    .should("be.visible")
    .should("have.text", `Welcome test`);
}

function assertLoggedOut() {
  cy.get("#login2").should("be.visible");
  cy.get('#signin2').should("be.visible");
  cy.get('#logout2').should("not.be.visible");
  cy.get('#nameofuser').should("not.be.visible");
}

describe('Login', () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  context('User behavior', () => {
    beforeEach(() => {
      cy.visit('/index.html');
      cy.get("#logInModal")
        .invoke("removeClass", "fade")
        .invoke("modal", "show")
        .invoke("addClass", "fade");
    });

    it('User can successfully login by enter credentials', () => {
      // arrange
      cy.fixture('user').then(({username, password}) => {
        // act
        cy.get('#loginusername').click().type(username);
        cy.get('#loginpassword').click().type(password);
        cy.contains('#logInModal button','Log in').click();
      });

      // assert
      assertLoggedIn();
    });

    it('Dismiss the login form with the cancel button keeps the user logged out', () => {
      // act
      cy.contains('#logInModal button','Close').click();
      // assert
      assertLoggedOut();
    });

    it('Dismiss the login form with the "x" icon keeps the user logged out', () => {
      // act
      cy.get('#logInModal .close').click();
      // assert
      assertLoggedOut();
    });

    it('Dismiss the login form clicking outside the modal keeps the user logged out', () => {
      // act
      cy.get('body').click(0,0);
      // assert
      assertLoggedOut();
    });
  });

  context('Alerts', () => {
    beforeEach(() => {
      cy.visit('/index.html');
    });
    it('User that doesn\'t exist', () => {
      // Arrange
      cy.intercept('/login', {
        body: {
          errorMessage: "User does not exist."
        }
      }).as('login');
      
      const notExistingUser = {
        username: "not existing username",
        password: "any password"
      };
      
      cy.window().then((win) => {
        cy.spy(win, 'alert');
        // act
        cy.loginJS(notExistingUser);
        // assert
        cy.wait('@login').then(()=>{
          expect(win.alert).to.be.calledWith("User does not exist.");
        });
      });
    });

    it('Wrong password', () => {
      // Arrange
      cy.intercept('/login', {
        body: {
          errorMessage: "Wrong password."
        }
      }).as('login');

      const userWithWrongPassword = {
        username: "Existing username",
        password: "any password"
      };

      cy.window().then((win) => {
        cy.spy(win, 'alert');
        // act
        cy.loginJS(userWithWrongPassword);
        // assert
        cy.wait('@login').then(() => {
          expect(win.alert).to.be.calledWith("Wrong password.");
        });
      });
    });

    [
      {tc: "empty password only", username:"test"},
      {tc: "empty username only", password:"test"},
      {tc: "empty credentials"},
    ].forEach(({tc, username, password})=>{
      it(`Empty fields - ${tc}`, () => {
        // arrange
        cy.window().then((win) => {
          cy.spy(win, 'alert');
          // act
          cy.loginJS({ username, password }).then(() => {
            // assert
            expect(win.alert).to.be.calledWith("Please fill out Username and Password.");
          });
        });
      });
    });
  });

  context('Post-login', () => {
    beforeEach(() => {
      cy.loginAPI()
        .visit('/index.html');
    });
    it('Login persists', () => {
      assertLoggedIn();
      cy.reload();
      assertLoggedIn();
    });
    it('Logout', () => {
      assertLoggedIn();
      cy.get('#logout2').click();
      assertLoggedOut();
    });
  });
});

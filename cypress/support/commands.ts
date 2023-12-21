/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
Cypress.Commands.add("login", (email: string, password: string) => {
  Cypress.log({
    displayName: "login",
  });

  cy.intercept("/api/users/login").as("login");
  cy.visit("http://localhost:5173/login");
  cy.get('[data-cy="email_input"]').type(email);
  cy.get('[data-cy="password_input"]').type(password);
  cy.get('[data-cy="login_button"]').click();
  cy.wait("@login");
});

Cypress.Commands.add("logout", () => {
  Cypress.log({
    displayName: "logout",
  });

  cy.get('[data-cy="logout_button"]').click();
});

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): Chainable<any>;
    logout(): Chainable<any>;
  }
}

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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

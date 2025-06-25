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

declare namespace Cypress {
  interface Chainable<Subject> {
    //Проверяет, что элемент, содержащий указанный текст, не существует в DOM.
    textDoesNotExist(text: string): Chainable<void>;

    //Проверяет, что элемент, содержащий указанный текст, существует в DOM.
    textExists(text: string): Chainable<HTMLElement>;

    //Кликает по дочернему элементу, содержащему указанный текст,
    clickAddButtonForIngredient(
      containerDataCy: string
    ): Chainable<HTMLElement>;

    // Находит элемент по любому CSS-селектору и проверяет, что он содержит указанный текст.
    getBySelectorText(selector: string, text: string): Chainable<JQuery<HTMLElement>>;

    // Кликает по кнопке закрытия модального окна.
    clickModalCloseButton(): Chainable<HTMLElement>;

    //Кликает по кнопке внутри элемента сводки заказа.
    clickOrderSummaryButton(): Chainable<HTMLElement>;

    // Кликает по оверлею модального окна, используя принудительный клик.
    clickModalOverlay(): Chainable<HTMLElement>;

    //Кликает по карточке ингредиента, чтобы открыть его детали в модальном окне.
    clickIngredientCard(ingredientName: string): Chainable<HTMLElement>;

    // Проверяет, что элемент, найденный по указанному CSS-селектору, НЕ существует в DOM
    elementDoesNotExist(selector: string): Chainable<void>;
  }
}
// Команда для проверки отсутствия текста
Cypress.Commands.add('textDoesNotExist', (text: string) => {
  cy.contains(text).should('not.exist');
});
// Команда для проверки наличия текста
Cypress.Commands.add('textExists', (text: string) => {
  cy.contains(text).should('exist');
});

Cypress.Commands.add(
  'clickAddButtonForIngredient',
  (containerDataCy: string) => {
    cy.get(`[data-cy=${containerDataCy}]`).contains('Добавить').click();
  }
);

Cypress.Commands.add('getBySelectorText', (selector: string, text: string) => {
  return cy.get(selector).should('contain', text);
});

Cypress.Commands.add('clickModalCloseButton', () => {
  cy.get('#modals button[aria-label="Закрыть"]').click();
});

Cypress.Commands.add('clickOrderSummaryButton', () => {
  cy.get('[data-cy=order-summ] button').click();
});

Cypress.Commands.add('clickModalOverlay', () => {
  cy.get('[data-cy=modal-overlay]').click('left', { force: true });
});

Cypress.Commands.add('clickIngredientCard', (ingredientName: string) => {
  cy.contains(ingredientName).click();
});

Cypress.Commands.add('elementDoesNotExist', (selector: string) => {
  cy.get(selector).should('not.exist');
});

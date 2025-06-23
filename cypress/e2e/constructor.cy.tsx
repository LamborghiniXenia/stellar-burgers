describe('проверяем доступность приложения', () => {
    it('сервис должен быть доступен по адресу localhost:4000', () => {
        cy.visit('http://localhost:4000'); 
    });
}); 

describe('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    beforeEach(() =>{
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000');
    });

    it('добавление булки', () => {
        cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=constructor-bun-1]')
          .contains('Краторная булка 1')
          .should('exist');
        cy.get('[data-cy=constructor-bun-2]')
          .contains('Краторная булка 1')
          .should('exist');
    })

    it('добавление ингредиента', () => {
        cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=constructor-ingredients]')
          .contains('Котлета 1')
          .should('exist');
        cy.get('[data-cy=constructor-ingredients]')
          .contains('Соус 1')
          .should('exist');
    })
})

describe('Открытие и закрытие модального окна с описанием ингредиента', () => {
    beforeEach( () => {
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'});
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000');
    });

    it('открытие модального окна', () => {
        cy.contains('Детали ингредиента').should('not.exist');
        cy.contains('Краторная булка 1').click();
        cy.contains('Детали ингредиента').should('exist');
//Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик.
        cy.get('#modals').contains('Краторная булка 1').should('exist');
    })

    it('закрытие модального окна', () => {
        cy.contains('Краторная булка 1').click();
        cy.contains('Детали ингредиента').should('exist');
        cy.get('[data-cy=modal-overlay]')
            .click('left', {force: true});
        cy.contains('Детали ингредиента').should('not.exist');
    })
})

describe('Процесс создания заказа', () => {
        beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients.json'}).as('ingredients');
        cy.intercept('GET', 'api/auth/user', {fixture: 'user.json'});
        cy.intercept('POST', 'api/orders', {fixture: 'post_order.json'}).as('postOrder');

        window.localStorage.setItem(
            'refreshToken',
            JSON.stringify('test-refreshToken')
        );
        cy.setCookie('accessToken', 'test-accessToken')
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000');
    });

    afterEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    })

    it('добавление ингредиентов в конструктор бургера', () => {
        cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=main-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=sauce-ingredients]').contains('Добавить').click();
        cy.get('[data-cy=order-summ] button').click();

        cy.wait('@postOrder')
        .its('request.body')
        .should('deep.equal', {
            ingredients: ['1', '3', '5', '1']
        });
        //проверка отображения модального окна с верным номером заказа при клике на кнопку оформления заказа. 
        cy.get('[data-cy=order-number]').contains('12').should('exist');

        cy.get('#modals button[aria-label="Закрыть"]').click();
        cy.get('[data-cy=order-number]').should('not.exist');

        //Проверка очистки конструктора бургера от добавленных ингредиентов.
        cy.contains('Краторная булка 1').should('not.exist')
        cy.contains('Котлета 1').should('not.exist');
        cy.contains('Соус 1').should('not.exist')
    })
})

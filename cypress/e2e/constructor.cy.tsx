describe('проверяем доступность приложения', () => {
  it('сервис должен быть доступен по адресу localhost:4000', () => {
    cy.visit('/');
  });
});

describe('Добавление ингредиента из списка ингредиентов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('добавление булки', () => {
    cy.clickAddButtonForIngredient('bun-ingredients');
    cy.getBySelectorText('[data-cy=constructor-bun-1]', 'Краторная булка 1');
    cy.getBySelectorText('[data-cy=constructor-bun-2]', 'Краторная булка 1');
  });

  it('добавление ингредиента', () => {
    cy.clickAddButtonForIngredient('main-ingredients');
    cy.clickAddButtonForIngredient('sauce-ingredients');
    cy.getBySelectorText('[data-cy=constructor-ingredients]', 'Котлета 1');
    cy.getBySelectorText('[data-cy=constructor-ingredients]', 'Соус 1');
  });
});

describe('Открытие и закрытие модального окна с описанием ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('открытие модального окна', () => {
    cy.textDoesNotExist('Детали ингредиента');
    cy.clickIngredientCard('Краторная булка 1');
    cy.textExists('Детали ингредиента');
    //Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик.
    cy.getBySelectorText('#modals', 'Краторная булка 1');
  });

  it('закрытие модального окна', () => {
    cy.clickIngredientCard('Краторная булка 1');
    cy.textExists('Детали ингредиента');
    cy.clickModalOverlay();
    cy.textDoesNotExist('Детали ингредиента');
  });
});

describe('Процесс создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('добавление ингредиентов в конструктор бургера', () => {
    cy.clickAddButtonForIngredient('bun-ingredients');
    cy.clickAddButtonForIngredient('main-ingredients');
    cy.clickAddButtonForIngredient('sauce-ingredients');
    cy.clickOrderSummaryButton();

    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '3', '5', '1']
      });
    //проверка отображения модального окна с верным номером заказа при клике на кнопку оформления заказа.
    cy.getBySelectorText('[data-cy=order-number]', '12');

    cy.clickModalCloseButton();
    cy.elementDoesNotExist('[data-cy=order-number]');

    //Проверка очистки конструктора бургера от добавленных ингредиентов.
    cy.textDoesNotExist('Краторная булка 1');
    cy.textDoesNotExist('Котлета 1');
    cy.textDoesNotExist('Соус 1');
  });
});

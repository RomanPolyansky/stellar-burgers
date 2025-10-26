/// <reference types="cypress" />

const BURGER_API_URL = Cypress.env('BURGER_API_URL');

describe('проверяем переменные окружения', function() {
    it('переменные окружения должны быть заданы', function() {
        expect(BURGER_API_URL).to.be.not.undefined;
    });
});

describe('проверяем доступность приложения', function() {
    it(`сервис должен быть доступен`, function() {
        cy.visit('/'); 
    });
}); 

describe('проверяем работу конструктора бургеров', function() {
    this.beforeEach(() => {
        cy.visit('/');
        cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.fixture('ingredients.json').as('ingredients');
    });

    it('проверяем, что запрос на получение ингредиентов выполняется 1 раз', function() {
        cy.get('@getIngredients.all').should('have.length', 1);
    });

    it('загружаем начальную страницу конструктора бургеров', function() {
        cy.wait('@getIngredients');
        cy.get('[data-cy="burger-ingredients-section"]').should('exist');
    });

    it('проверяем, что ингредиенты отображаются в конструкторе', function() {
        const ingredientList = ['Булки', 'Начинки', 'Соусы'];

        ingredientList.forEach((ingredient) => {
            const list = cy.get(`[data-cy="ingredients-category-list-${ingredient}"]`);
            list.should('exist');
            list.children().should('have.length.greaterThan', 0);
        });
    });

    it('проверяем добавление булки', function() {
        const addBunButton = cy.get('[data-cy="ingredient-in-list-1"]').children('button');
        addBunButton.should('exist');
        addBunButton.click();

        cy.get('[data-cy="burger-constructor-selected-bun-top"]').should('exist');
        cy.get('[data-cy="burger-constructor-selected-bun-bottom"]').should('exist');
    });

    it('проверяем добавление начинки', function() {
        const addFillingButton = cy.get('[data-cy="ingredient-in-list-2"]').children('button');
        addFillingButton.should('exist');
        addFillingButton.click();

        cy.get('[data-cy="burger-ingredients-fillers-list"]')
            .should('exist')
            .children()
            .should('have.length', 1);

        const addSauceButton = cy.get('[data-cy="ingredient-in-list-3"]').children('button');
        addSauceButton.should('exist');
        addSauceButton.click();

        cy.get('[data-cy="burger-ingredients-fillers-list"]')
            .should('exist')
            .children()
            .should('have.length', 2);
    });

    it('работа модальных окон', function() {
        const modalWindowIngredient = this.ingredients.data.find((ing: { _id: string }) => ing._id === '1');

        const ingredientItem = cy.get('[data-cy="ingredient-in-list-1"]');
        ingredientItem.should('exist');
        ingredientItem.click();

        // Проверяем, что открылось модальное окно с деталями ингредиента
        cy.get('[data-cy="modal-window"]').should('exist');
        cy.get('[data-cy="modal-window"]').contains('Детали ингредиента');
        cy.get('[data-cy="modal-window"]').contains(modalWindowIngredient.name).should('exist');

        // Закрываем модальное окно на крестик
        const closeModalButton = cy.get('[data-cy="modal-window"]').find('button').first();
        closeModalButton.should('exist');
        closeModalButton.click();
        cy.get('[data-cy="modal-window"]').should('not.exist');

        ingredientItem.click();
        // Закрываем модальное окно кликом по оверлею
        cy.get('[data-cy="modal-window"]').should('exist');
        cy.get('[data-cy="modal-window"]').next().click({ force: true });
        cy.get('[data-cy="modal-window"]').should('not.exist');

        ingredientItem.click();
        // Закрываем модальное окно нажатием клавиши Esc
        cy.get('[data-cy="modal-window"]').should('exist');
        cy.get('body').type('{esc}');
        cy.get('[data-cy="modal-window"]').should('not.exist');
    });
});

describe('проверяем работу оформления заказа', function() {
    this.beforeEach(() => {
        cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', `${BURGER_API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', `${BURGER_API_URL}/orders`, { 
            fixture: 'newOrderResponse.json',
            delay: 2000
        }).as('placeOrder');

        cy.fixture('newOrderResponse.json').as('orderResponse');

        cy.setCookie('accessToken', 'testAccessToken');
    });

    it('оформление заказа с авторизацией', function() {
        cy.visit('/');
        cy.wait('@getUser');

        // Добавляем булку
        const addBunButton = cy.get('[data-cy="ingredient-in-list-1"]').children('button');
        addBunButton.should('exist');
        addBunButton.click();

        // Добавляем начинку
        const addFillingButton = cy.get('[data-cy="ingredient-in-list-2"]').children('button');
        addFillingButton.should('exist');
        addFillingButton.click();

        // Оформляем заказ
        const placeOrderButton = cy.get('[data-cy="burger-constructor-total-section"]').children('button');
        placeOrderButton.should('exist');
        placeOrderButton.click();

        // Проверяем, что открылось модальное окно загрузки
        cy.get('[data-cy="modal-window"]').should('exist');
        cy.get('[data-cy="modal-window"]').contains('Оформляем заказ...').should('exist');

        cy.wait('@placeOrder');

        // Проверяем, что открылось модальное окно с информацией о заказе
        cy.get('[data-cy="modal-window"]').contains('Ваш заказ начали готовить').should('exist');
        cy.get('[data-cy="modal-window"]').contains(String(this.orderResponse.order.number)).should('exist');
    });
});

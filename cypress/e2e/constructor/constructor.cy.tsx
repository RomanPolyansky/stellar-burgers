/// <reference types="cypress" />
import { dataCy, cySelectors, cySel } from '../../../src/utils/dataCy';

const BURGER_API_URL = Cypress.env('BURGER_API_URL');

describe('проверяем переменные окружения', function () {
    it('переменные окружения должны быть заданы', function () {
        expect(BURGER_API_URL).to.be.not.undefined;
    });
});

describe('проверяем доступность приложения', function () {
    it(`сервис должен быть доступен`, function () {
        cy.visit('/');
    });
});

describe('проверяем работу конструктора бургеров', function () {
    this.beforeEach(() => {
        cy.fixture('ingredients.json').as('ingredients');
        cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.visit('/');
    });

    it('проверяем, что запрос на получение ингредиентов выполняется 1 раз', function () {
        cy.get('@getIngredients.all').should('have.length', 1);
    });

    it('загружаем начальную страницу конструктора бургеров', function () {
        cy.wait('@getIngredients');
        cy.get(cySelectors.burgerIngredientsSection).should('exist');
    });

    it('проверяем, что ингредиенты отображаются в конструкторе', function () {
        const ingredientList = ['Булки', 'Начинки', 'Соусы'];

        ingredientList.forEach((ingredient) => {
            const list = cy.get(cySel(dataCy.ingredientsCategoryList(ingredient)));
            list.should('exist');
            list.children().should('have.length.greaterThan', 0);
        });
    });

    it('проверяем добавление булки', function () {
        const addBunButton = cy.get(cySel(dataCy.ingredientInList(1))).children('button');
        addBunButton.should('exist');
        addBunButton.click();

        cy.get(cySelectors.burgerConstructorSelectedBunTop).should('exist');
        cy.get(cySelectors.burgerConstructorSelectedBunBottom).should('exist');
    });

    it('проверяем добавление начинки', function () {
        const addFillingButton = cy.get(cySel(dataCy.ingredientInList(2))).children('button');
        addFillingButton.should('exist');
        addFillingButton.click();

        cy.get(cySelectors.burgerIngredientsFillersList)
            .should('exist')
            .children()
            .should('have.length', 1);

        const addSauceButton = cy.get(cySel(dataCy.ingredientInList(3))).children('button');
        addSauceButton.should('exist');
        addSauceButton.click();

        cy.get(cySelectors.burgerIngredientsFillersList)
            .should('exist')
            .children()
            .should('have.length', 2);
    });

    it('работа модальных окон', function () {
        const modalWindowIngredient = this.ingredients.data.find((ing: { _id: string }) => ing._id === '1');

        const ingredientItem = cy.get(cySel(dataCy.ingredientInList(1)));
        ingredientItem.should('exist');
        ingredientItem.click();

        // Проверяем, что открылось модальное окно с деталями ингредиента
        cy.get(cySelectors.modalWindow).should('exist');
        cy.get(cySelectors.modalWindow).contains('Детали ингредиента');
        cy.get(cySelectors.modalWindow).contains(modalWindowIngredient.name).should('exist');

        // Закрываем модальное окно на крестик
        const closeModalButton = cy.get(cySelectors.modalWindow).find('button').first();
        closeModalButton.should('exist');
        closeModalButton.click();
        cy.get(cySelectors.modalWindow).should('not.exist');

        ingredientItem.click();
        // Закрываем модальное окно кликом по оверлею
        cy.get(cySelectors.modalWindow).should('exist');
        cy.get(cySelectors.modalOverlay).click({ force: true });
        cy.get(cySelectors.modalWindow).should('not.exist');

        ingredientItem.click();
        // Закрываем модальное окно нажатием клавиши Esc
        cy.get(cySelectors.modalWindow).should('exist');
        cy.get('body').type('{esc}');
        cy.get(cySelectors.modalWindow).should('not.exist');
    });
});

describe('проверяем работу оформления заказа', function () {
    this.beforeEach(() => {
        cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', `${BURGER_API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', `${BURGER_API_URL}/orders`, {
            fixture: 'newOrderResponse.json',
            delay: 2000
        }).as('placeOrder');

        cy.fixture('newOrderResponse.json').as('orderResponse');

        cy.setCookie('accessToken', 'testAccessToken');
        cy.setCookie('refreshToken', 'testRefreshToken');
    });

    this.afterEach(() => {
        cy.clearCookies();
    });

    it('оформление заказа с авторизацией', function () {
        cy.visit('/');
        cy.wait('@getUser');

        // Добавляем булку
        const addBunButton = cy.get(cySel(dataCy.ingredientInList(1))).children('button');
        addBunButton.should('exist');
        addBunButton.click();

        // Добавляем начинку
        const addFillingButton = cy.get(cySel(dataCy.ingredientInList(2))).children('button');
        addFillingButton.should('exist');
        addFillingButton.click();

        // Оформляем заказ
        const placeOrderButton = cy.get(cySelectors.burgerConstructorTotalSection).children('button');
        placeOrderButton.should('exist');
        placeOrderButton.click();

        // Проверяем, что открылось модальное окно загрузки
        cy.get(cySelectors.modalWindow).should('exist');
        cy.get(cySelectors.modalWindow).contains('Оформляем заказ...').should('exist');

        cy.wait('@placeOrder');

        // Проверяем, что открылось модальное окно с информацией о заказе
        cy.get(cySelectors.modalWindow).contains('Ваш заказ начали готовить').should('exist');
        cy.get(cySelectors.modalWindow).contains(String(this.orderResponse.order.number)).should('exist');

        // Закрываем модальное окно
        cy.get('body').type('{esc}');

        cy.wait(500);

        // проверяем, что произошла переадресация на страницу заказа
        cy.url().should('include', '/profile/orders');
    });
});

describe('тестирование редьюсера rootReducer', () => {
    it('должен возвращать начальное состояние', () => {
      const store = require('../services/store').default;
      const initialState = store.getState();

      expect(initialState).toHaveProperty('ingredients');
      expect(initialState).toHaveProperty('burgerConstructor');
      expect(initialState).toHaveProperty('feed');
      expect(initialState).toHaveProperty('order');
      expect(initialState).toHaveProperty('login');
    });
});
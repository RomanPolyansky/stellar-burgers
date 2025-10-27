export const dataCy = {
  modalWindow: 'modal-window',
  modalOverlay: 'modal-overlay',

  burgerIngredientsSection: 'burger-ingredients-section',
  ingredientsCategoryList: (title: string) =>
    `ingredients-category-list-${title}`,
  ingredientInList: (id: string | number) => `ingredient-in-list-${id}`,

  burgerConstructorSelectedBunTop: 'burger-constructor-selected-bun-top',
  burgerConstructorSelectedBunBottom: 'burger-constructor-selected-bun-bottom',
  burgerIngredientsFillersList: 'burger-ingredients-fillers-list',
  burgerConstructorTotalSection: 'burger-constructor-total-section'
} as const;

export const cySel = (attr: string) => `[data-cy="${attr}"]`;

export const cySelectors = {
  modalWindow: cySel(dataCy.modalWindow),
  modalOverlay: cySel(dataCy.modalOverlay),
  burgerIngredientsSection: cySel(dataCy.burgerIngredientsSection),
  burgerConstructorSelectedBunTop: cySel(
    dataCy.burgerConstructorSelectedBunTop
  ),
  burgerConstructorSelectedBunBottom: cySel(
    dataCy.burgerConstructorSelectedBunBottom
  ),
  burgerIngredientsFillersList: cySel(dataCy.burgerIngredientsFillersList),
  burgerConstructorTotalSection: cySel(dataCy.burgerConstructorTotalSection)
} as const;

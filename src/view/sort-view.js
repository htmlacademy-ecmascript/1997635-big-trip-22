import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';
import { getStrStartWithCapitalLetters } from '../utils/common.js';

function createSortTemplate(currentSortType = SortType.DAY) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">

    ${Object.values(SortType).map((type) => {

      const isDisabled = type === SortType.EVENT || type === SortType.OFFERS;

      const isChecked = currentSortType === type;

      return (
        `<div class="trip-sort__item  trip-sort__item--${type}">
          <input
            id="sort-${type}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${type}"
            data-sort-type="${type}"
            ${isChecked ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}
          >
          <label class="trip-sort__btn" for="sort-${type}">${getStrStartWithCapitalLetters(type)}</label>
        </div>`
      );
    }).join('')}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #onSortTypeChange = null;
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}


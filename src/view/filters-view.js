import AbstractView from '../framework/view/abstract-view.js';
import { getStrStartWithCapitalLetters } from '../utils/common.js';

function createFilterItemTemplate(filter, currentFilter) {
  const {type, count} = filter;
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value=${type}
        ${type === currentFilter ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
        >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}">${getStrStartWithCapitalLetters(type)}</label>
    </div>`
  );
}

function createFiltersTemplate(filterItems, currentFilter) {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilter, onFilterTypeChange}){
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}


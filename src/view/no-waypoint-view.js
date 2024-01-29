import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType } from '../const.js';

function createNoWaypointTemplate(filterType) {
  const NoPointsTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">${NoPointsTextValue}</p>`
  );
}

export default class NoWaypointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoWaypointTemplate(this.#filterType);
  }
}

import {render, RenderPosition} from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #headerContainer = null;
  #tripInfoComponent = null;
  #points = null;
  #destinations = null;

  constructor({headerContainer, pointsModel}) {
    this.#headerContainer = headerContainer;
    this.#points = pointsModel.points;
    this.#destinations = pointsModel.destinations;

  }

  init() {
    this.#tripInfoComponent = new TripInfo({
      points: this.#points,
      destinations: this.#destinations,
    });
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }
}

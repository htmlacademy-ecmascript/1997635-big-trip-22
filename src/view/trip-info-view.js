import AbstractView from '../framework/view/abstract-view.js';
import { getDayMonth, sortWaypointsByDay } from '../utils/waypoint.js';

function createTripInfoTemplate(points, destinations) {
  const filteredPoints = [...points].sort(sortWaypointsByDay);

  const totalPrice = points.reduce((s, point) => s + point.basePrice, 0);

  const getDestinationById = (id) => destinations.find((el) => el.id === id).name;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getDestinationById(filteredPoints.at(0).destination)} &mdash; ${points.lenght === 3 ? getDestinationById(filteredPoints.at(1).destination) : '...'} &mdash; ${getDestinationById(filteredPoints.at(-1).destination)}</h1>

     <p class="trip-info__dates">${getDayMonth(filteredPoints.at(0).dateFrom)}&nbsp;&mdash;&nbsp;${getDayMonth(filteredPoints.at(-1).dateTo)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
      </section>`;
}

export default class TripInfo extends AbstractView{
  #points = null;
  #destinations = null;

  constructor ({points, destinations}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations);
  }
}

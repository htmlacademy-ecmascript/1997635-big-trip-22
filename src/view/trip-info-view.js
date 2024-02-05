import AbstractView from '../framework/view/abstract-view.js';
import { getDayMonth, sortWaypointsByDay } from '../utils/waypoint.js';

function createTripInfoTemplate(getTotalPrice, getStringDestinations, getStringData) {

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getStringDestinations()}</h1>

     <p class="trip-info__dates">${getStringData()}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice()}</span>
    </p>
      </section>`;
}

export default class TripInfoView extends AbstractView{
  #points = null;
  #destinations = null;
  #offers = null;

  constructor ({points, destinations, offers}) {
    super();
    this.#points = [...points].sort(sortWaypointsByDay);
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#getTotalPrice, this.#getStringDestinations, this.#getStringData);
  }

  #getTotalPrice = () => {
    if (this.#points.length === 0) {
      return 0;
    }

    let totalPrice = 0;

    this.#points.forEach((point) => {
      const offersForType = this.#offers.find((offer) => offer.type === point.type);
      const checkedOffers = offersForType.offers.filter((offer) => point.offers.find((el) => el === offer.id));
      totalPrice += checkedOffers.reduce((s, checkedOffer) => s + Number(checkedOffer.price), 0);
    });

    totalPrice += this.#points.reduce((s, point) => s + point.basePrice, 0);

    return totalPrice;
  };

  #getDestinationById = (id) => this.#destinations?.find((el) => el.id === id).name;

  #getStringDestinations = () => {
    if (this.#points.length === 0) {
      return;
    }

    if (this.#points.length === 1) {
      return `${this.#getDestinationById(this.#points.at(0).destination)}`;
    }

    if (this.#points.length === 2) {
      return `${this.#getDestinationById(this.#points.at(0).destination)} &mdash; ${this.#getDestinationById(this.#points.at(1).destination)}`;
    }

    if (this.#points.length === 3) {
      return `${this.#getDestinationById(this.#points.at(0).destination)} &mdash; ${this.#getDestinationById(this.#points.at(1).destination)} &mdash; ${this.#getDestinationById(this.#points.at(-1).destination)}`;
    }

    return `${this.#getDestinationById(this.#points.at(0).destination)} &mdash; ... &mdash; ${this.#getDestinationById(this.#points.at(-1).destination)}`;
  };

  #getStringData = () => {
    if (this.#points.length === 0) {
      return;
    }

    if (this.#points.length === 1) {
      return getDayMonth(this.#points.at(0).dateFrom);
    }

    return `${getDayMonth(this.#points.at(0).dateFrom)}&nbsp;&mdash;&nbsp;${getDayMonth(this.#points.at(-1).dateTo)}`;
  };

}

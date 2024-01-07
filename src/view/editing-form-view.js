import AbstractView from '../framework/view/abstract-view.js';
import { POINT_TYPES } from '../const.js';
import { getStrStartWithCapitalLetters } from '../utils/common.js';
import { getDataTime } from '../utils/waypoint.js';

function createEventTypeTemplate(type, pointTipe) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointTipe === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${getStrStartWithCapitalLetters(type)}</label>
    </div>`
  );
}

function createOfferTemplate(offerType, pointOffers, pointId) {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${pointId}" type="checkbox" name="event-offer-luggage" ${pointOffers.includes(offerType.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-luggage-${pointId}">
        <span class="event__offer-title">${offerType.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerType.price}</span>
      </label>
    </div>`
  );
}

function createOffersListTemplate(offersForType, pointOffers, pointId) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersForType.map((offerType) => createOfferTemplate(offerType, pointOffers, pointId)).join('')}
      </div>
    </section>`
  );
}

function createPicturesTemplate(pictures) {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>`
  );
}

function createDestinationTemplate({description, pictures}) {

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${description.join('')}
      </p>
      ${pictures.length ? createPicturesTemplate(pictures) : ''}
    </section>`
  );
}

function createEditingFormTemplate(point, destinations, offers) {
  const pointId = point.id;
  const { type: pointType, basePrice, dateFrom, dateTo, destination, offers: pointOffers } = point;

  const currentDestination = destinations.find((el) => el.id === destination);

  const offersForType = offers.find((offer) => offer.type === pointType).offers;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="${pointType}">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${POINT_TYPES.map((type) => createEventTypeTemplate(type, pointType)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${getStrStartWithCapitalLetters(pointType)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${destinations.map(({name}) => `<option value="${name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${getDataTime(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${getDataTime(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${offersForType.length ? createOffersListTemplate(offersForType, pointOffers, pointId) : ''}

          ${(currentDestination.description.length || currentDestination.pictures.length) ? createDestinationTemplate(currentDestination) : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditingFormView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleResetClick = null;

  constructor({point, destinations, offers, onFormSubmit, onResetClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetBtnClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditingFormTemplate(this.#point, this.#destinations, this.#offers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };

  #resetBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };
}


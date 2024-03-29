import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FormType, POINT_BLANK } from '../const.js';
import { getStrStartWithCapitalLetters } from '../utils/common.js';
import { getDataTime } from '../utils/waypoint.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEventTypeTemplate(type, pointTipe) {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointTipe === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${getStrStartWithCapitalLetters(type)}</label>
    </div>`
  );
}

function createOfferTemplate(offerType, pointOffers, isDisabled) {
  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-luggage-${offerType.id}"
        type="checkbox"
        name="event-offer-luggage"
        ${pointOffers.includes(offerType.id) ? 'checked' : ''}
        data-offer-id=${offerType.id}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-luggage-${offerType.id}">
        <span class="event__offer-title">${offerType.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerType.price}</span>
      </label>
    </div>`
  );
}

function createOffersListTemplate(offersForType, pointOffers, isDisabled) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersForType.map((offerType) => createOfferTemplate(offerType, pointOffers, isDisabled)).join('')}
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
        ${description}
      </p>
      ${pictures.length !== 0 ? createPicturesTemplate(pictures) : ''}
    </section>`
  );
}

function createButtonTemplate(isCreating, isDeleting, isDisabled) {
  if (isCreating) {
    return `
      <button class="event__reset-btn" type="reset">Cancel</button>
    `;
  }

  return `
    <button
      class="event__reset-btn"
      type="reset"
      ${isDisabled ? 'disabled' : ''}
    >${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createEditingFormTemplate(point, destinations, offers, formType) {
  const pointId = point.id;
  const { type: pointType, basePrice, dateFrom, dateTo, destination, offers: pointOffers, isDisabled, isSaving, isDeleting } = point;

  const currentDestination = destinations?.find((el) => el.id === destination);

  const offersForType = offers?.find((offer) => offer.type === pointType)?.offers;

  const isCreating = (formType === FormType.CREATION);

  const offersKeys = offers?.map((offer) => offer.type);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="${pointType}">
            </label>
            <input class="event__type-toggle
              visually-hidden"
              id="event-type-toggle-${pointId}"
              type="checkbox"
              ${isDisabled ? 'disabled' : ''}
            >

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${offersKeys?.map((type) => createEventTypeTemplate(type, pointType)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${getStrStartWithCapitalLetters(pointType)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${pointId}"
              type="text"
              name="event-destination"
              value="${currentDestination ? he.encode(currentDestination.name) : ''}"
              list="destination-list-${pointId}"
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist
              id="destination-list-${pointId}">
              ${destinations.map(({name}) => `<option value="${name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${pointId}"
              type="text"
              name="event-start-time"
              value="${dateFrom ? getDataTime(dateFrom) : ''}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${pointId}"
              type="text"
              name="event-end-time"
              value="${dateTo ? getDataTime(dateTo) : ''}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${pointId}"
              type="text"
              name="event-price"
              pattern="^[ 0-9]+$"
              min="1"
              max="100000"
              value="${he.encode(String(basePrice))}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isDisabled ? 'disabled' : ''}
          >${isSaving ? 'Saving...' : 'Save'}</button>
          ${createButtonTemplate(isCreating, isDeleting, isDisabled)}
        </header>
        <section class="event__details">

          ${offersForType.length !== 0 ? createOffersListTemplate(offersForType, pointOffers, isDisabled) : ''}

          ${currentDestination && (currentDestination.description.length !== 0 || currentDestination.pictures.length !== 0) ? createDestinationTemplate(currentDestination) : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditingFormView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #handleFormSubmit = null;
  #handleResetClick = null;
  #handleDeleteClick = null;
  #datepickerTo = null;
  #datepickerFrom = null;
  #currentformType = null;

  constructor({point = POINT_BLANK, destinations, offers, onFormSubmit, onResetClick, onDeleteClick, formType}) {
    super();
    this._setState(EditingFormView.parseWaypointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#currentformType = formType;
    this._restoreHandlers();
  }

  get template() {
    return createEditingFormTemplate(this._state, this.#destinations, this.#offers, this.#currentformType);
  }

  _restoreHandlers() {
    if(this.#currentformType === FormType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetBtnClickHandler);
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setDatepicker();
  }

  reset(point) {
    this.updateElement(
      EditingFormView.parseWaypointToState(point)
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #dateFromCloseHandler = ([userDateFrom]) => {
    this._setState({
      dateFrom: userDateFrom
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDateTo]) => {
    this._setState({
      dateTo: userDateTo
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value)?.id;
    this.updateElement({
      destination: selectedDestination || this._state.destination
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedOffers.map((offer) => offer.dataset.offerId)
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditingFormView.parseStateToWaypoint(this._state));
  };

  #resetBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditingFormView.parseStateToWaypoint(this._state));
  };

  #setDatepicker() {

    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeel: 1},
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement, {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement, {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom
      }
    );
  }

  static parseStateToWaypoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  static parseWaypointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }
}


import {remove, render, RenderPosition} from '../framework/render.js';
import EditingFormView from '../view/editing-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, FormType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointNewComponent = null;

  constructor({container, destinations, offers, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }
    this.#pointNewComponent = new EditingFormView({
      destinations: this.#destinations,
      offers: this.#offers,
      onResetClick: this.#handleResetClick,
      onDeleteClick: this.#handleResetClick,
      onPointEditSubmit: this.#handleFormSubmit,
      modeAddForm: FormType.CREATION
    });
    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#handleDestroy();

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

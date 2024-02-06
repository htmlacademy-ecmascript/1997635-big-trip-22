import {remove, render, RenderPosition} from '../framework/render.js';
import EditingFormView from '../view/editing-form-view.js';
import {UserAction, UpdateType, FormType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointNewComponent = null;
  #pointsModel = null;

  constructor({container, pointsModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }
    this.#pointNewComponent = new EditingFormView({
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onResetClick: this.#handleResetClick,
      onDeleteClick: this.#handleResetClick,
      onFormSubmit: this.#handleFormSubmit,
      formType: FormType.CREATION,
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

  setSaving() {
    this.#pointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#pointNewComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
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

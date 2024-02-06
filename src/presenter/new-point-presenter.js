import {remove, render, RenderPosition} from '../framework/render.js';
import EditingFormView from '../view/editing-form-view.js';
import {UserAction, UpdateType, FormType} from '../const.js';

export default class NewPointPresenter {
  #container = null;
  #onDataChange = null;
  #onDestroy = null;
  #pointNewComponent = null;
  #pointsModel = null;

  constructor({container, pointsModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }
    this.#pointNewComponent = new EditingFormView({
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onResetClick: this.#onResetClick,
      onDeleteClick: this.#onResetClick,
      onFormSubmit: this.#onFormSubmit,
      formType: FormType.CREATION,
    });
    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy() {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#onDestroy();

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
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

  #onFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #onResetClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

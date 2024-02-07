import WaypointView from '../view/waypoint-view.js';
import EditingFormView from '../view/editing-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { FormType, Mode, UserAction, UpdateType } from '../const.js';
import { isBigDifference } from '../utils/waypoint.js';
export default class WaypointPresenter {
  #waypointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #waypointComponent = null;
  #editingFormComponent = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor({waypointListContainer, onDataChange, onModeChange}) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destinations, offers) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevWaypointComponent = this.#waypointComponent;
    const prevEditingFormComponent = this.#editingFormComponent;

    this.#waypointComponent = new WaypointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editingFormComponent = new EditingFormView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      formType: FormType.EDITING,
      onResetClick: this.#handleFormClose,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if(prevWaypointComponent === null || prevEditingFormComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer.element);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#editingFormComponent, prevEditingFormComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEditingFormComponent);
  }

  destroy(){
    remove(this.#waypointComponent);
    remove(this.#editingFormComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editingFormComponent.reset(this.#point);
      this.#replaceEditingFormToWaypoint();
    }
  }

  setSaving() {
    if(this.#mode === Mode.EDITING) {
      this.#editingFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if(this.#mode === Mode.EDITING) {
      this.#editingFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }
    if(this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#editingFormComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };
      this.#editingFormComponent.shake(resetFormState);
    }
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape') {
      evt.preventDefault();
      this.#editingFormComponent.reset(this.#point);
      this.#replaceEditingFormToWaypoint();
    }
  };

  #replaceWaypointToEditingForm() {
    replace(this.#editingFormComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditingFormToWaypoint() {
    replace(this.#waypointComponent, this.#editingFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replaceWaypointToEditingForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT,
      UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormClose = () => {
    this.#editingFormComponent.reset(this.#point);
    this.#replaceEditingFormToWaypoint();
  };

  #handleFormSubmit = (point) => {
    const isMinorUpdate = isBigDifference(point, this.#point);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
      this.#destinations,
      this.#offers);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT,
      UpdateType.MINOR, point);
  };
}

import WaypointView from '../view/waypoint-view.js';
import EditingFormView from '../view/editing-form-view.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

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
      onResetClick: this.#handleFormClose,
      onFormSubmit: this.#handleFormSubmit
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
      this.#replaceEditingFormToWaypoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape') {
      evt.preventDefault();
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
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite}, this.#destinations, this.#offers);
  };

  #handleFormClose = () => {
    this.#replaceEditingFormToWaypoint();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point, this.#destinations, this.#offers);
    this.#replaceEditingFormToWaypoint();
  };
}

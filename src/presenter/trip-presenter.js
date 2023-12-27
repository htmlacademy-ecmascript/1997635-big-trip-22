import WaypointView from '../view/waypoint-view.js';
import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import EditingFormView from '../view/editing-form-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import { render, replace } from '../framework/render.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #points = [];
  #destinations = [];
  #offers = [];

  #waypointListComponent = new WaypointListView();
  #tripComponent = new TripView();

  constructor ({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];

    this.#renderTrip();
  }

  #renderWaypoint(point, destinations, offers) {
    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditingFormToWaypoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const waypointComponent = new WaypointView({
      point,
      destinations,
      offers,
      onEditClick: () => {
        replaceWaypointToEditingForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editingFormComponent = new EditingFormView({
      point,
      destinations,
      offers,
      onFormClick: () => {
        replaceEditingFormToWaypoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceWaypointToEditingForm() {
      replace(editingFormComponent, waypointComponent);
    }

    function replaceEditingFormToWaypoint() {
      replace(waypointComponent, editingFormComponent);
    }

    render(waypointComponent, this.#waypointListComponent.element);

  }

  #renderTrip() {
    render(new SortView(), this.#tripContainer);
    render(this.#waypointListComponent, this.#tripContainer);

    if(!this.#points.length) {
      render(new NoWaypointView(), this.#waypointListComponent.element);
      return;
    }

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderWaypoint(this.#points[i], this.#destinations, this.#offers);
    }
  }
}


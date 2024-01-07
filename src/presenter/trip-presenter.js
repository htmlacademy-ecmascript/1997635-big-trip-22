import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import { render, RenderPosition } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { updateItem } from '../utils/common.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #sortComponent = new SortView();
  #noWaypointComponent = new NoWaypointView();

  #waypointListComponent = new WaypointListView();
  #tripComponent = new TripView();
  #waypointPresenters = new Map();

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
    const waypointPresenter = new WaypointPresenter({
      waypointListContainer: this.#waypointListComponent,
      onDataChange: this.#handleWaypointChange,
      onModeChange: this.#handleModeChange
    });
    waypointPresenter.init(point, destinations, offers);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#points = updateItem(this.#points, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint, this.#destinations, this.#offers);
  };

  #renderTrip() {
    render(this.#waypointListComponent, this.#tripContainer);

    if(!this.#points.length) {
      this.#renderNoWaypoint();
      return;
    }

    this.#renderSort();
    this.#renderWaypointList();
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderWaypointList() {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderWaypoint(this.#points[i], this.#destinations, this.#offers);
    }
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoWaypoint() {
    render(this.#noWaypointComponent, this.#waypointListComponent.element, RenderPosition.AFTERBEGIN);
  }
}


import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import { render, RenderPosition } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortWaypointsByDay, sortWaypointsByPrice, sortWaypointsByTime } from '../utils/waypoint.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #sortComponent = null;
  #noWaypointComponent = new NoWaypointView();
  #waypointListComponent = new WaypointListView();
  #tripComponent = new TripView();
  #waypointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #sourcedWaypoints = [];

  constructor ({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#sourcedWaypoints = [...this.#pointsModel.points];
  }

  init() {
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
    this.#sourcedWaypoints = updateItem(this.#sourcedWaypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint, this.#destinations, this.#offers);
  };

  #sortWaypoints(sortType){
    switch (sortType){
      case SortType.PRICE:
        this.#points.sort(sortWaypointsByPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortWaypointsByTime);
        break;
      case SortType.DAY:
      default:
        this.#points.sort(sortWaypointsByDay);
        break;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints(sortType);
    this.#clearWaypointList();
    this.#renderWaypointList();
  };

  #renderTrip() {
    this.#renderSort();
    render(this.#waypointListComponent, this.#tripContainer);

    if(!this.#points.length) {
      this.#renderNoWaypoint();
      return;
    }
    this.#sortWaypoints(this.#currentSortType);
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
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderNoWaypoint() {
    render(this.#noWaypointComponent, this.#waypointListComponent.element, RenderPosition.AFTERBEGIN);
  }
}


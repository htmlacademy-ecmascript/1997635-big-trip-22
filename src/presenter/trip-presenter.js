import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import NewPointButtonView from '../view/new-point-btn-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortWaypointsByDay, sortWaypointsByPrice, sortWaypointsByTime } from '../utils/waypoint.js';
import { filter } from '../utils/filter.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #sortComponent = null;
  #isCreating = false;
  #noWaypointComponent = null;
  #waypointListComponent = new WaypointListView();
  #tripComponent = new TripView();
  #waypointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #newPointPresenter = null;
  #newPointButtonComponent = null;
  #newPointButtonContainer = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;


  constructor ({tripContainer, pointsModel, newPointButtonContainer, filterModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#waypointListComponent.element,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler ,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoint = filter[this.#filterType](points);

    switch (this.#currentSortType){
      case SortType.PRICE:
        return filteredPoint.sort(sortWaypointsByPrice);
      case SortType.TIME:
        return filteredPoint.sort(sortWaypointsByTime);
      case SortType.DAY:
      default:
        return filteredPoint.sort(sortWaypointsByDay);
    }
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#renderTrip();
    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
  }

  #buttonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  };

  #renderWaypoint(point, destinations, offers) {
    const waypointPresenter = new WaypointPresenter({
      waypointListContainer: this.#waypointListComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    waypointPresenter.init(point, destinations, offers);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#clearWaypointList();
    remove(this.#sortComponent);
    this.#sortComponent = null;

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noWaypointComponent) {
      remove(this.#noWaypointComponent);
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  /*#handleWaypointChange = (updatedWaypoint) => {
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint, this.destinations, this.offers);
  };*/

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearWaypointList();
    this.#renderWaypointList(this.points);
  };

  #renderTrip() {
    this.#renderSort();
    render(this.#waypointListComponent, this.#tripContainer);
    if(this.points.length === 0) {
      this.#renderNoWaypoint();
      return;
    }
    this.#renderWaypointList(this.points);
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    if(this.points.length === 0) {
      this.#clearTrip();
      this.#renderTrip();
    }
  };

  #renderWaypointList(points) {
    points.forEach((point) => this.#renderWaypoint(point, this.destinations, this.offers));
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#tripContainer);
  }

  #renderNoWaypoint() {
    this.#noWaypointComponent = new NoWaypointView({filterType: this.#filterType});
    render(this.#noWaypointComponent, this.#waypointListComponent.element, RenderPosition.AFTERBEGIN);
  }
}


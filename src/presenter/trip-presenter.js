import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
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
  #tripInfoComponent = null;
  #noWaypointComponent = null;
  #newPointPresenter = null;
  #newPointButtonComponent = null;
  #newPointButtonContainer = null;
  #filterModel = null;

  #waypointListComponent = new WaypointListView();
  #loadingComponent = new LoadingView();
  #tripComponent = new TripView();
  #waypointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;
  #isCreating = false;


  constructor ({tripContainer, pointsModel, newPointButtonContainer, filterModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#waypointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler,
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
    render(this.#waypointListComponent, this.#tripContainer);
    this.#newPointButtonComponent = new NewPointButtonView({
      onButtonClick: this.#buttonClickHandler,
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
    this.#renderTrip();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #buttonClickHandler = () => {
    this.#isCreating = true;
    if (this.#noWaypointComponent) {
      remove(this.#noWaypointComponent);
    }
    this.createPoint();
    this.#newPointButtonComponent.setDisabled(true);
  };

  #renderTripInfo() {
    this.#tripInfoComponent = new TripInfoView({
      points: this.#pointsModel.points,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
    });
    render(this.#tripInfoComponent, this.#newPointButtonContainer, RenderPosition.AFTERBEGIN);
  }

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
    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
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
        //this.#waypointPresenters.get(update.id).setSaving();
        //try {
        this.#pointsModel.updateWaypoint(updateType, update);
        //} catch(err) {
        //  this.#waypointPresenters.get(update.id).setAborting();
        //}
        break;
      case UserAction.ADD_POINT:
        //this.#newPointPresenter.setSaving();
        //try {
        this.#pointsModel.addWaypoint(updateType, update);
        //this.#newPointPresenter.destroy();
        //} catch(err) {
        //this.#newPointPresenter.setAborting();
        //}
        break;
      case UserAction.DELETE_POINT:
        //this.#waypointPresenters.get(update.id).setDeleting();
        //try {
        this.#pointsModel.deleteWaypoint(updateType, update);
        //} catch(err) {
        //  this.#waypointPresenters.get(update.id).setAborting();
        //}
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init(data, this.#pointsModel.destinations, this.#pointsModel.offers);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearWaypointList();
    this.#renderWaypointList(this.points);
  };

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderLoading();
      this.#newPointButtonComponent.setDisabled(true);
      return;
    }
    if(this.points.length === 0 && !this.#isLoading) {
      if(!this.#isCreating) {
        this.#renderNoWaypoint();
        this.#newPointButtonComponent.setDisabled(false);
      }
      return;
    }
    this.#renderTripInfo();
    this.#newPointButtonComponent.setDisabled(false);
    this.#renderSort();
    render(this.#waypointListComponent, this.#tripContainer);
    this.#renderWaypointList(this.points);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#waypointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
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


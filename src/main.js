import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const headerElement = document.querySelector('.trip-main');
const tripControlsElement = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  pointsModel,
  newPointButtonContainer: headerElement,
  filterModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsElement,
  filterModel,
  pointsModel
});
const tripInfoPresenter = new TripInfoPresenter({
  pointsModel,
  filterModel,
  headerContainer: headerElement,
});

filterPresenter.init();
tripInfoPresenter.init();
tripPresenter.init();


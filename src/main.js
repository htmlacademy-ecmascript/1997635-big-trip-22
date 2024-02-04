import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import TripApiService from './trip-api-service.js';

const AUTHORIZATION = 'Basic 45tfghgt676hgfh6hfvgh';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripEventsElement = document.querySelector('.trip-events');
const headerElement = document.querySelector('.trip-main');
const tripControlsElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel({
  tripApiService: new TripApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  newPointButtonContainer: headerElement,
  pointsModel,
  filterModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsElement,
  filterModel,
  pointsModel
});


pointsModel.init();
filterPresenter.init();
tripPresenter.init();

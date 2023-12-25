import FiltersView from './view/filters-view.js';
import { render } from './render.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsElement = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  pointsModel
});

render(new FiltersView(), tripControlsElement);

tripPresenter.init();

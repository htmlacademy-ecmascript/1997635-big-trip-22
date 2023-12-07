import FiltersView from './view/filters-view.js';
import { render } from './render.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsElement = document.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter({tripContainer: tripEventsElement});

//render(new SortView(), tripEventsElement);
render(new FiltersView(), tripControlsElement);

tripPresenter.init();

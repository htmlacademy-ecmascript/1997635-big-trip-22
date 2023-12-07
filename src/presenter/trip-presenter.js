import EditingFormView from '../view/editing-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import { RenderPosition, render } from '../render.js';

export default class TripPresenter {
  waypointListComponent = new WaypointListView();
  tripComponent = new TripView();

  constructor ({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(new SortView(), this.tripContainer);
    render(this.waypointListComponent, this.tripContainer);
    for (let i = 0; i < 3; i++) {
      render(new WaypointView(), this.waypointListComponent.getElement());
    }
    render(new EditingFormView(), this.waypointListComponent.getElement(), RenderPosition.BEFOREBEGIN);
  }
}

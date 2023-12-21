import EditingFormView from '../view/editing-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointListView from '../view/waypoint-list-view.js';
import SortView from '../view/sort-view.js';
import TripView from '../view/trip-view.js';
import { RenderPosition, render } from '../render.js';

export default class TripPresenter {
  waypointListComponent = new WaypointListView();
  tripComponent = new TripView();

  constructor ({tripContainer, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const points = [...this.pointsModel.getPoints()];
    const offers = [...this.pointsModel.getOffers()];
    const destinations = [...this.pointsModel.getDestinations()];

    render(new SortView(), this.tripContainer);
    render(this.waypointListComponent, this.tripContainer);
    for (let i = 0; i < points.length; i++) {
      render(new WaypointView({point: points[i], destinations, offers}), this.waypointListComponent.getElement());
    }
    render(new EditingFormView({point: points[0], destinations, offers}), this.waypointListComponent.getElement(), RenderPosition.BEFOREBEGIN);
  }
}

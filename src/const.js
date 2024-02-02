const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const POINT_NAMES = [
  'Tokio',
  'Rotterdam',
  'Madrid',
  'Saint Petersburg',
  'Frankfurt',
  'Kioto',
  'Munich',
  'Geneva',
  'Naples',
  'Valencia'
];

const POINT_DESCRIPTIONS = [
  'Valencia - in a middle of Europe',
  'Naples - full of of cozy canteens where you can try the best coffee in the Middle East',
  'Geneva - is a beautiful city',
  'Munich - in a middle of Europe',
  'Madrid - in a middle of Europe',
  'Frankfurt - middle-eastern paradise'
];

const POINT_PICTURES = [
  {
    src: 'https://22.objects.htmlacademy.pro/static/destinations/12.jpg',
    description: 'Valencia with a beautiful old town'
  },
  {
    src: 'https://22.objects.htmlacademy.pro/static/destinations/8.jpg',
    description: 'Naples famous for its crowded street markets with the best street food in Asia'
  },
  {
    src: 'https://22.objects.htmlacademy.pro/static/destinations/1.jpg',
    description: 'Naples with crowded streets'
  },
  {
    src: 'https://22.objects.htmlacademy.pro/static/destinations/4.jpg',
    description: 'Kioto famous for its crowded street markets with the best street food in Asia'
  },
  {
    src: 'https://22.objects.htmlacademy.pro/static/destinations/14.jpg',
    description: 'Saint Petersburg in a middle of Europe'
  },
];

const OFFER_TITLES = [
  'Choose VIP area',
  'Choose live music',
  'With air conditioning',
  'With automatic transmission',
  'Business lounge',
  'Upgrade to a business class',
  'Choose temperature',
  'Choose meal',
  'Choose seats',
  'Business lounge',
  'Add luggage'
];

const Milliseconds = {
  MILLISECONDS_IN_DAY: 60000 * 60 * 24,
  MILLISECONDS_IN_HOURS: 60000 * 60,
  MILLISECONDS_IN_MINUTES: 60000
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FormType = {
  EDITING: 'editing',
  CREATION: 'creation'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const POINT_BLANCK = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const NoPointsTextType = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now',
};

export {
  POINT_TYPES,
  POINT_NAMES,
  POINT_DESCRIPTIONS,
  POINT_PICTURES,
  OFFER_TITLES,
  Milliseconds,
  FilterType,
  SortType,
  Mode,
  FormType,
  UserAction,
  UpdateType,
  POINT_BLANCK,
  NoPointsTextType
};

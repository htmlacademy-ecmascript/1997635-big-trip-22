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

const SortTipe = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export {
  POINT_TYPES,
  POINT_NAMES,
  POINT_DESCRIPTIONS,
  POINT_PICTURES,
  OFFER_TITLES,
  Milliseconds,
  FilterType,
  SortTipe
};

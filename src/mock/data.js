import { getRandomPositiveInteger, getRandomArrayElement, createRandomIdFromRangeGenerator, getRandomDate } from '../utils/common.js';
import { POINT_TYPES, POINT_NAMES, POINT_DESCRIPTIONS, POINT_PICTURES, OFFER_TITLES } from '../const.js';
import { nanoid } from 'nanoid';
import { getRandomDateTo } from '../utils/waypoint.js';

const generateDestinationId = createRandomIdFromRangeGenerator(1, 10);

const createDestination = () => ({
  id: generateDestinationId(),
  description: Array.from({length: getRandomPositiveInteger(0, 1)}, () => getRandomArrayElement(POINT_DESCRIPTIONS)),
  name: getRandomArrayElement(POINT_NAMES),
  pictures: Array.from({length: getRandomPositiveInteger(0, 3)}, () => getRandomArrayElement(POINT_PICTURES)),
});

const generateTypeIndex = createRandomIdFromRangeGenerator(0, POINT_TYPES.length - 1);

const generateOfferId = createRandomIdFromRangeGenerator(1, 100);

const createOffer = () => ({
  id: generateOfferId(),
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomPositiveInteger(10, 200)
});

const createOfferType = () => ({
  type: POINT_TYPES[generateTypeIndex()],
  offers: Array.from({length: getRandomPositiveInteger(0, 3)}, createOffer)
});

const mockDestinations = Array.from({length: 10}, createDestination);

const mockOffers = Array.from({length: POINT_TYPES.length}, createOfferType);

const generatePointId = createRandomIdFromRangeGenerator(1, 25);

const getOffersListForType = (currentType) => mockOffers.find((offer) => offer.type === currentType).offers;

const getOfferListForPoint = (currentType) => {
  const offersListForType = getOffersListForType(currentType);
  const quantityOffers = getRandomPositiveInteger(0, offersListForType.length);
  const offerListForPoint = new Set();
  while (offerListForPoint.size < quantityOffers) {
    offerListForPoint.add(getRandomArrayElement(offersListForType).id);
  }
  return Array.from(offerListForPoint);
};

const createPoint = () => {
  const currentType = getRandomArrayElement(POINT_TYPES);
  const randomDateFrom = getRandomDate(new Date(), new Date(2025, 0, 1));
  return ({
    id: generatePointId(),
    basePrice: getRandomPositiveInteger(500, 10000),
    dateFrom: randomDateFrom,
    dateTo: getRandomDateTo(randomDateFrom),
    destination: getRandomArrayElement(mockDestinations).id,
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    type: currentType,
    offers: getOfferListForPoint(currentType)
  });
};

const mockPoints = Array.from({length: 25}, createPoint);

const getRandomPoint = () => ({
  id: nanoid(),
  ...getRandomArrayElement(mockPoints)
});

export { getRandomPoint, mockDestinations, mockOffers };

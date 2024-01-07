const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

const createRandomIdFromRangeGenerator = (min, max) => {
  const previousValues = [];

  return function () {
    let currentValue = getRandomPositiveInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomPositiveInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const getRandomDate = (start, end) => new Date(start.getTime()
  + Math.random() * (end.getTime() - start.getTime()));

const getStrStartWithCapitalLetters = (str) => str.replace(str[0], str[0].toUpperCase());

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {getRandomPositiveInteger, getRandomArrayElement, createRandomIdFromRangeGenerator, getRandomDate, getStrStartWithCapitalLetters, updateItem};

import dayjs from 'dayjs';
import { Milliseconds } from './const';

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

const getHours = (data) => dayjs(data).format('HH:mm');

const getMonth = (data) => dayjs(data).format('MMM YY');

const getDataTime = (data) => dayjs(data).format('DD/MM/YY HH:mm');

const getDifferenceInTime = (start, end) => {
  const difference = dayjs(end).diff(start);

  switch (difference) {
    case difference <= Milliseconds.MILLISECONDS_IN_MINUTES:
      return dayjs(difference).format('mm[M]');
    case difference > Milliseconds.MILLISECONDS_IN_MINUTES && difference < Milliseconds.MILLISECONDS_IN_DAY:
      return dayjs(difference).format('HH[H] mm[M]');
    default:
      return dayjs(difference).format('DD[D] HH[H] mm[M]');
  }
};

export {getRandomPositiveInteger, getRandomArrayElement, createRandomIdFromRangeGenerator, getRandomDate, getStrStartWithCapitalLetters, getHours, getMonth, getDataTime, getDifferenceInTime};

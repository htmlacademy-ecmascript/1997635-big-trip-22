import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Milliseconds } from '../const.js';

dayjs.extend(duration);

const getHours = (data) => dayjs(data).format('HH:mm');

const getMonth = (data) => dayjs(data).format('MMM DD');

const getDataTime = (data) => dayjs(data).format('DD/MM/YY HH:mm');

const getDay = (data) => dayjs(data).format('DD');

const getDayMonth = (data) => dayjs(data).format('DD MMM');

const getDifferenceInTime = (start, end) => {
  const difference = dayjs(end).diff(dayjs(start));
  const differenceInDay = dayjs(end).diff(dayjs(start), 'day');

  let pointDuration = 0;

  switch (true) {
    case difference >= Milliseconds.DAY * 10:
      pointDuration = `${differenceInDay}D ${dayjs.duration(difference).format('HH[H] mm[M]')}`;
      break;
    case difference >= Milliseconds.DAY:
      pointDuration = dayjs.duration(difference).format('DD[D] HH[H] mm[M]');
      break;
    case difference >= Milliseconds.HOURS:
      pointDuration = dayjs.duration(difference).format('HH[H] mm[M]');
      break;
    case difference < Milliseconds.HOURS:
      pointDuration = dayjs.duration(difference).format('mm[M]');
      break;
  }
  return pointDuration;

};

const sortWaypointsByDay = (pointA, pointB) => {
  if(dayjs(pointA.dateFrom) > dayjs(pointB.dateFrom)) {
    return 1;
  }
  if(dayjs(pointA.dateFrom) < dayjs(pointB.dateFrom)) {
    return -1;
  }
  return 0;
};

const sortWaypointsByTime = (pointB, pointA) => {
  const aTime = dayjs(pointA.dateTo).diff(pointA.dateFrom);
  const bTime = dayjs(pointB.dateTo).diff(pointB.dateFrom);
  if(aTime > bTime) {
    return 1;
  }
  if(aTime < bTime) {
    return -1;
  }
  return 0;
};

const sortWaypointsByPrice = (pointB, pointA) => {
  if(pointA.basePrice > pointB.basePrice) {
    return 1;
  }
  if(pointA.basePrice < pointB.basePrice) {
    return -1;
  }
  return 0;
};

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom
  || pointA.basePrice !== pointB.basePrice
  || getDifferenceInTime(pointA.dateFrom, pointA.dateTo) !== getDifferenceInTime(pointB.dateFrom, pointB.dateTo);
}

export {getDataTime, getHours, getMonth, getDifferenceInTime, sortWaypointsByDay, sortWaypointsByTime, sortWaypointsByPrice, isBigDifference, getDay, getDayMonth};

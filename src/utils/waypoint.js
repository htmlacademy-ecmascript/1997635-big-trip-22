import dayjs from 'dayjs';
import { Milliseconds } from '../const.js';

const getRandomDateTo = (dateFrom) => dayjs(dateFrom).add((Math.random() * 10), 'hour').add((Math.random() * 10), 'minute');

const getHours = (data) => dayjs(data).format('HH:mm');

const getMonth = (data) => dayjs(data).format('MMM YY');

const getDataTime = (data) => dayjs(data).format('DD/MM/YY HH:mm');

const getDifferenceInTime = (start, end) => {
  const difference = dayjs(end).diff(dayjs(start));
  if (difference <= Milliseconds.MILLISECONDS_IN_HOURS) {
    return dayjs(difference).format('mm[M]');
  }
  if (difference > Milliseconds.MILLISECONDS_IN_HOURS && difference < Milliseconds.MILLISECONDS_IN_DAY) {
    return dayjs(difference).format('HH[H] mm[M]');
  }
  if (difference >= Milliseconds.MILLISECONDS_IN_DAY) {
    return dayjs(difference).format('DD[D] HH[H] mm[M]');
  }
};

const sortWaypointsByDay = (a, b) => {
  if(dayjs(a.dateFrom) > dayjs(b.dateFrom)) {
    return 1;
  }
  if(dayjs(a.dateFrom) < dayjs(b.dateFrom)) {
    return -1;
  }
  return 0;
};

const sortWaypointsByTime = (b, a) => {
  const aTime = dayjs(a.dateTo).diff(a.dateFrom);
  const bTime = dayjs(b.dateTo).diff(b.dateFrom);
  if(aTime > bTime) {
    return 1;
  }
  if(aTime < bTime) {
    return -1;
  }
  return 0;
};

const sortWaypointsByPrice = (b, a) => {
  if(a.basePrice > b.basePrice) {
    return 1;
  }
  if(a.basePrice < b.basePrice) {
    return -1;
  }
  return 0;
};

export {getRandomDateTo, getDataTime, getHours, getMonth, getDifferenceInTime, sortWaypointsByDay, sortWaypointsByTime, sortWaypointsByPrice};

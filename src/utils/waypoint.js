import dayjs from 'dayjs';
import { Milliseconds } from '../const.js';

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

export {getDataTime, getHours, getMonth, getDifferenceInTime};

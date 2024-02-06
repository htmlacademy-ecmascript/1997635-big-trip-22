import { FilterType } from '../const.js';
import dayjs from 'dayjs';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(point.dateFrom, 'day')),
  [FilterType.PRESENT]: (points) => points.filter((point) => !(dayjs().isBefore(point.dateFrom, 'day')) && !(dayjs().isAfter(point.dateTo, 'day'))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(point.dateTo, 'day'))
};

export { filter };

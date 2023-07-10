import Dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

Dayjs.extend(utc);
Dayjs.extend(duration);

export const dayjs = Dayjs;

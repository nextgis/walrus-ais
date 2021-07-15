import type { AisFilterData } from './interfaces';

export const RMBR_KEY = 'ngw-login';

export const NULL_STR = '---';

export const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
] as const;

export const astdCatList = [
  'Bulk carriers',
  'Chemical tankers',
  'Container ships',
  'Crude oil tankers',
  'Cruise ships',
  'Fishing vessels',
  'Gas tankers',
  'General cargo ships',
  'Offshore supply ships',
  'Oil product tankers',
  'Other activities',
  'Other service offshore vessels',
  'Passenger ships',
  'Refrigerated cargo ships',
  'Ro-Ro cargo ships',
  'Unknown',
];

export const iceClassList = [
  'FS Ice Class 1A',
  'FS Ice Class 1A Super',
  'FS Ice Class 1B',
  'FS Ice Class 1C',
  'FS Ice Class II',
];

export const sizeGroupList = ['0', '1', '2', '3', '4', '5', '6'];

export const AIS_DEF_FILTER_DATA: AisFilterData = {
  astdCatList,
  iceClassList,
  sizeGroupList,
};

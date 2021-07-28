import type { AisFilterData, AisProperties } from './interfaces';

export const RMBR_KEY = 'ngw-login';

export const NULL_STR = '---';

export const AIS_LAYER_ID = 'ais-layer';
export const WALRUS_LAYER_ID = 'walrus-layer';

export const AIS_ALIASES: Record<keyof AisProperties, string> = {
  astd_cat: 'Тип судна',
  datetime: 'Дата',
  fid: 'fid',
  flagname: 'Флаг',
  fuelq: 'Качество топлива',
  iceclass: 'Ледовый класс',
  shipid: 'ID судна',
  sizegroup: 'Тоннаж',
};

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

export const fuelQList = ['0', '1', '2', '3', '4', '5', '6'];

export const sizeGroupList = [
  '< 1000 GT',
  '1000 - 4999 GT',
  '5000 - 9999 GT',
  '10000 - 24999',
  '25000 - 49999',
  '50000 - 99999',
  '>= 100000',
];

export const AIS_DEF_FILTER_DATA: AisFilterData = {
  astd_cat: astdCatList,
  iceclass: iceClassList,
  sizegroup: sizeGroupList,
  fuelq: fuelQList,
};

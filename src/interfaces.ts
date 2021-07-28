import {
  astdCatList,
  fuelQList,
  iceClassList,
  sizeGroupList,
} from './constants';

export interface AisLayerItem extends DateDict {
  name: string;
  resource: number;
}

export interface DateDict {
  year: string;
  month: string;
}

export type AstdCat = typeof astdCatList[number];
export type IceClass = typeof iceClassList[number];
export type SizeGroup = typeof sizeGroupList[number];
export type FuelQ = typeof fuelQList[number];

export interface AisFilterInterface {
  astd_cat: AstdCat[];
  iceclass: IceClass[];
  sizegroup: SizeGroup[];
  fuelq: FuelQ[];
}

export type AisFilterData = Readonly<AisFilterInterface>;

export type AisCalendar = { [year: string]: string[] };

export interface AisProperties {
  astd_cat: AstdCat; // "Offshore supply ships"
  datetime: string; // "2020-12-01 00:01:22";
  fid: string; // "_0"
  flagname: string; // "Russia"
  fuelq: string; // '0';
  iceclass: IceClass; // 'FS Ice Class 1A';
  shipid: string; // '244';
  sizegroup: SizeGroup; // '5000 - 9999 GT';
}

export interface WalrusProperties {
  Platform_I: string;
  Latitude: string;
  Longitude: string;
  Loc_qualit: string;
  Loc_date: string;
  dt: number;
}

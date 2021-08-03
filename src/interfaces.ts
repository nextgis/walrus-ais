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

export interface AisVisibility {
  point: boolean;
  track: boolean;
}

export interface AisProperties {
  astd_cat: AstdCat;
  flagname: string; // "Russia"
  fuelq: string; // '0';
  iceclass: IceClass;
  shipid: string; // '244';
  sizegroup: SizeGroup;
}

export interface AisPointProperties extends AisProperties {
  /** date string "2020-12-01 00:01:22" */
  datetime: string;
  fid: string; // "_0"
}

export interface AisTrackProperties extends AisProperties {
  /** timestamp in second */
  date_begin: number;
  /** timestamp in second */
  date_end: number;
}

export interface WalrusProperties {
  Platform_I: string;
  Latitude: string;
  Longitude: string;
  Loc_qualit: string;
  Loc_date: string;
  dt: number;
}

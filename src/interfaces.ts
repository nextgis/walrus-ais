export interface AisLayerItem extends DateDict {
  name: string;
  resource: number;
}

export interface DateDict {
  year: string;
  month: string;
}

export type AstdCat = string;

export interface WalrusMapFilter {
  date: DateDict | null;
  astdCat: AstdCat;
}

export interface AisFilterData {
  astdCatList: AstdCat[];
}

export interface AisProperties {
  astd_cat: string; // "Offshore supply ships"
  datetime: string; // "2020-12-01 00:01:22";
  fid: string; // "_0"
  flagname: string; // "Russia"
  fuelq: string; // '0';
  iceclass: string; // 'FS Ice Class 1A';
  shipid: string; // '244';
  sizegroup: string; //'5000 - 9999 GT';
}

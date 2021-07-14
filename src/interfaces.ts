export interface AisLayerItem extends DateDict {
  name: string;
  resource: number;
}

export interface DateDict {
  year: string;
  month: string;
}

export interface WalrusMapFilter {
  date: DateDict | null;
}

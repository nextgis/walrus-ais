import { getRandomColor } from './getRandomColor';

interface ShipidColor {
  [shipid: string]: string;
}

const STORAGE_KEY = 'SHIPID_COLOR';
const getStorage = (): ShipidColor => {
  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) {
      return JSON.parse(fromStorage);
    }
  } catch {
    //
  }
  return {};
};
const SHIPID_COLORS = getStorage();

export function getShipidColor(shipid: string) {
  const exist = SHIPID_COLORS[shipid];
  if (exist) {
    return exist;
  }
  const color = getRandomColor();
  SHIPID_COLORS[shipid] = color;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SHIPID_COLORS));
  return color;
}

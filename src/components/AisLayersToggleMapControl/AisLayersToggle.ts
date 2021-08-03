import PointsIcon from '../../images/show_points.svg';
import TracksIcon from '../../images/show_tracks.svg';
import PointsTracksIcon from '../../images/show_points_and_tracks.svg';

import type { MapControl } from '@nextgis/webmap';
import type { AisVisibility } from '../../interfaces';
import type { AisLayersToggleMapControlOptions } from './interfaces';

const ICONS: (AisVisibility & { icon: string })[] = [
  { point: true, track: true, icon: PointsTracksIcon },
  { point: true, track: false, icon: PointsIcon },
  { point: false, track: true, icon: TracksIcon },
];

export class AisLayerToggle implements MapControl {
  private _content?: HTMLElement;
  private readonly _width = '64px';
  private readonly _height = '64px';

  private point = true;
  private track = true;
  private onClick: (status: AisVisibility) => void;

  constructor(options: AisLayersToggleMapControlOptions) {
    const { point, track, onClick } = options;
    this.point = point;
    this.track = track;
    this.onClick = onClick;
  }

  onAdd() {
    const content = document.createElement('button');

    const setContent = () => {
      content.innerHTML = `<img
                          src="${this.getIcon()}"
                          width="${this._width}"
                          height="${this._height}"
                          alt="Скрыть треки">`;
    };
    setContent();
    content.addEventListener('click', () => {
      this.nextPhase();
      setContent();
      this.onClick({ point: this.point, track: this.track });
    });

    this._content = content;
    return this._content;
  }

  onRemove() {
    //
  }

  private nextPhase() {
    const cur = ICONS.findIndex(
      (x) => x.point === this.point && x.track === this.track,
    );
    const { point, track } = ICONS[(cur + 1) % ICONS.length];
    this.point = point;
    this.track = track;
  }

  private getIcon(): string {
    const str = ICONS.find(
      (x) => x.point === this.point && x.track === this.track,
    );
    return str?.icon || '';
  }
}

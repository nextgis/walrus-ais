import { AisVisibility } from '../../interfaces';

export interface AisLayersToggleMapControlOptions extends AisVisibility {
  point: boolean;
  track: boolean;
  onClick: (status: AisVisibility) => void;
}

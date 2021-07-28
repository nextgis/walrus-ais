import type { FunctionComponent } from 'react';
import { Form } from 'react-bulma-components';
import { AIS_ALIASES } from '../constants';
import { MultiplySelect } from './MultiplySelect';
import type { AisFilterData, AisFilterInterface } from '../interfaces';

interface AisFilterProps {
  aisFilter: AisFilterInterface;
  aisFilterData: AisFilterData;
  onChange: (filter: Partial<AisFilterInterface>) => void;
}

export const AisFilter: FunctionComponent<AisFilterProps> = (props) => {
  const data = props.aisFilterData;
  const { astd_cat, iceclass, sizegroup, fuelq } = props.aisFilter;

  return (
    <>
      <Form.Field>
        <Form.Field kind="group">
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.astd_cat}
              items={data.astd_cat}
              value={astd_cat}
              onChange={(astd_cat) => props.onChange({ astd_cat })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.iceclass}
              items={data.iceclass}
              value={iceclass}
              onChange={(iceclass) => props.onChange({ iceclass })}
            />
          </Form.Control>
        </Form.Field>
        <Form.Field kind="group">
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.sizegroup}
              items={data.sizegroup}
              value={sizegroup}
              onChange={(sizegroup) => props.onChange({ sizegroup })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.fuelq}
              items={data.fuelq}
              value={fuelq}
              onChange={(fuelq) => props.onChange({ fuelq })}
            />
          </Form.Control>
        </Form.Field>
      </Form.Field>
    </>
  );
};

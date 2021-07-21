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
              items={data.astdCatList}
              value={astd_cat}
              onChange={(astd_cat) => props.onChange({ astd_cat })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.iceclass}
              items={data.iceClassList}
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
              items={data.sizeGroupList}
              value={sizegroup}
              onChange={(sizegroup) => props.onChange({ sizegroup })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label={AIS_ALIASES.fuelq}
              items={data.fuelQList}
              value={fuelq}
              onChange={(fuelq) => props.onChange({ fuelq })}
            />
          </Form.Control>
        </Form.Field>
      </Form.Field>
    </>
  );
};

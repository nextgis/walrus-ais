import type { FunctionComponent } from 'react';
import { Columns, Form } from 'react-bulma-components';
import type { AisFilterData, AisFilterInterface } from '../interfaces';
import { MultiplySelect } from './MultiplySelect';

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
              label="Тип судна"
              items={data.astdCatList}
              value={astd_cat}
              onChange={(astd_cat) => props.onChange({ astd_cat })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label="Ледовый класс"
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
              label="Тоннаж"
              items={data.sizeGroupList}
              value={sizegroup}
              onChange={(sizegroup) => props.onChange({ sizegroup })}
            />
          </Form.Control>
          <Form.Control>
            <MultiplySelect
              up
              label="Качество топлива"
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

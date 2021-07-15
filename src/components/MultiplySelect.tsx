import { FunctionComponent } from 'react';
import { Dropdown, Form } from 'react-bulma-components';
import { Icon } from '@iconify/react';
import menuDown from '@iconify/icons-mdi/menu-down';

interface MultiplySelectProps<T extends any = any> {
  label: string;
  items: T[];
  value: T;
  up?: boolean;
  onChange: (val: T) => void;
}

export const MultiplySelect: FunctionComponent<MultiplySelectProps> = (
  props,
) => {
  return (
    <Dropdown
      closeOnSelect={false}
      color=""
      up={props.up}
      icon={<Icon icon={menuDown} />}
      label={props.label}
    >
      {props.items.map((x) => (
        <Dropdown.Item key={x} value="item">
          <Form.Field>
            <Form.Control>
              <Form.Checkbox>{x}</Form.Checkbox>
            </Form.Control>
          </Form.Field>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

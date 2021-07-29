import { FunctionComponent, useState } from 'react';
import { Dropdown, Form } from 'react-bulma-components';
import { Icon } from '@iconify/react';
import menuDown from '@iconify/icons-mdi/menu-down';
import { useEffect } from 'react';

interface MultiplySelectProps<T extends any = any> {
  label: string;
  items: T[];
  value: T[];
  up?: boolean;
  onChange: (val: T) => void;
}

export const MultiplySelect: FunctionComponent<MultiplySelectProps> = (
  props,
) => {
  const [values, setValues] = useState<string[]>(
    props.value.filter((x) => props.items.includes(x)),
  );

  useEffect(() => {
    props.onChange(values);
  }, [values]);

  return (
    <Dropdown
      closeOnSelect={false}
      color=""
      up={props.up}
      icon={<Icon icon={menuDown} />}
      label={props.label}
    >
      <Dropdown.Item key="all_item" value="item">
        <Form.Field>
          <Form.Control>
            <Form.Checkbox
              checked={values.length === props.items.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setValues(props.items);
                } else {
                  setValues([]);
                }
              }}
            >
              Все
            </Form.Checkbox>
          </Form.Control>
        </Form.Field>
      </Dropdown.Item>
      <Dropdown.Divider></Dropdown.Divider>
      {props.items.map((x) => (
        <Dropdown.Item key={x} value="item">
          <Form.Field>
            <Form.Control>
              <Form.Checkbox
                checked={values.includes(x)}
                onChange={(e) => {
                  const values_ = [...values];
                  if (e.target.checked) {
                    values_.push(x);
                  } else {
                    values_.splice(values_.indexOf(x), 1);
                  }
                  setValues(values_);
                }}
              >
                {x || 'Not set'}
              </Form.Checkbox>
            </Form.Control>
          </Form.Field>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

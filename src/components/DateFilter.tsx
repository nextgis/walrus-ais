import { useState, useEffect } from 'react';
import { Form } from 'react-bulma-components';
import { nullValStr } from '../constants';

import type { ChangeEvent, FunctionComponent } from 'react';

import type { AisLayerItem, DateDict } from '../interfaces';

interface DateFilterProps {
  aisLayerItems: AisLayerItem[];
  activeAisLayerItem: AisLayerItem | null;
  onChange: (date: DateDict | null) => void;
}

export const DateFilter: FunctionComponent<DateFilterProps> = (props) => {
  const calendar: { [year: string]: string[] } = {};
  const years: string[] = [];
  for (const d of props.aisLayerItems) {
    const exist = calendar[d.year];
    if (!exist) {
      calendar[d.year] = [];
      years.push(d.year);
    }
    calendar[d.year].push(d.month);
  }

  const cur = props.activeAisLayerItem;
  const [year, setYear] = useState<string>(cur ? cur.year : nullValStr);
  const [month, setMonth] = useState<string>(cur ? cur.month : nullValStr);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    const months_ = year && calendar[year];
    if (months_) {
      setMonths([...months_].reverse());
    }
  }, [year]);

  useEffect(() => {
    props.onChange({ year, month });
  }, [year, month]);

  const onYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const y = e.target.value;
    // if the new year does not contain selected month
    if (!calendar[y].includes(month)) {
      setMonth(nullValStr);
    }
    setYear(y);
  };
  const onMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };
  return (
    <>
      <Form.Field kind="group">
        <Form.Control>
          <Form.Label>Год</Form.Label>
          <Form.Select onChange={onYearChange} value={year}>
            {years.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Control>
        <Form.Control>
          <Form.Label>Месяц</Form.Label>
          <Form.Select onChange={onMonthChange} value={month}>
            <option value={nullValStr}>{nullValStr}</option>
            {months.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Control>
      </Form.Field>
    </>
  );
};

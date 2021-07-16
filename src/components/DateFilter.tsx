import { useState, useEffect, useMemo } from 'react';
import { Form } from 'react-bulma-components';
import { MONTHS } from '../constants';

import type { ChangeEvent, FunctionComponent } from 'react';

import type { AisCalendar, DateDict } from '../interfaces';

interface DateFilterProps {
  calendar: AisCalendar;
  activeDate: DateDict | null;
  onChange: (date: DateDict | null) => void;
}

export const DateFilter: FunctionComponent<DateFilterProps> = (props) => {
  const { calendar, activeDate } = props;
  // const [months, setMonths] = useState<string[]>([]);
  const years: string[] = useMemo(
    () => Object.keys(calendar).sort(),
    [calendar],
  );

  const months = useMemo<string[]>(() => {
    const year_ = activeDate && activeDate.year;
    const months_ = year_ && props.calendar[year_];
    if (months_) {
      return [...months_].reverse();
    }
    return [];
  }, [activeDate?.year]);

  const onDateChange = (date: Partial<DateDict>) => {
    props.onChange({ ...activeDate, ...date } as DateDict);
  };

  const onYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const y = e.target.value;
    const date = { year: y } as DateDict;
    // if the new year does not contain selected month
    if (activeDate && !calendar[y].includes(activeDate.month)) {
      date.month = '';
    }
    onDateChange(date);
  };
  const onMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onDateChange({ month: e.target.value });
  };
  return (
    <>
      <Form.Field kind="group">
        <Form.Control>
          <Form.Label>Год</Form.Label>
          <Form.Select onChange={onYearChange} value={activeDate?.year}>
            {years.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Control>
        <Form.Control>
          <Form.Label>Месяц</Form.Label>
          <Form.Select onChange={onMonthChange} value={activeDate?.month}>
            {months.map((x) => (
              <option key={x} value={x}>
                {MONTHS[Number(x) - 1]}
              </option>
            ))}
          </Form.Select>
        </Form.Control>
      </Form.Field>
    </>
  );
};

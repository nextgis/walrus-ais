import { useState } from 'react';
import { Container, Form, Hero } from 'react-bulma-components';

import type { ChangeEvent } from 'react';
import { MapControl } from '../NgwMap/MapControl';
import type { AisLayerItem } from '../interfaces';
import { useEffect } from 'react';

export interface PanelMapControlProps {
  aisLayerItems: AisLayerItem[];
  acitveAisLayerItem: AisLayerItem | null;
  onChange: (item: AisLayerItem) => void;
}

function DateFilter<P extends PanelMapControlProps = PanelMapControlProps>(
  props: P,
) {
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
  const nullVal = '---';
  const cur = props.acitveAisLayerItem;
  const [year, setYear] = useState<string>(cur ? cur.year : nullVal);
  const [month, setMonth] = useState<string>(cur ? cur.month : nullVal);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    const months_ = year && calendar[year];
    if (months_) {
      setMonths([...months_].reverse());
    }
  }, [year]);

  useEffect(() => {
    if ([year, month].every((x) => x && x !== nullVal)) {
      const exist = props.aisLayerItems.find(
        (x) => x.year === year && x.month === month,
      );
      if (exist) {
        props.onChange(exist);
      }
    }
  }, [year, month]);

  const onYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(nullVal);
    setYear(e.target.value);
  };
  const onMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };
  return (
    <>
      <Form.Field>
        <Form.Label>Год</Form.Label>
        <Form.Control>
          <Form.Select onChange={onYearChange} value={year}>
            {years.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Control>
      </Form.Field>
      <Form.Field>
        <Form.Label>Месяц</Form.Label>
        <Form.Control>
          <Form.Select onChange={onMonthChange} value={month}>
            <option value={nullVal}>{nullVal}</option>
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
}

export function PanelMapControl<
  P extends PanelMapControlProps = PanelMapControlProps,
>(props: P) {
  return (
    <MapControl position="bottom-left" bar>
      <Hero size="small" color="primary">
        <Hero.Body>
          <Container></Container>
          {props.acitveAisLayerItem ? (
            <DateFilter {...props} onChange={props.onChange}></DateFilter>
          ) : (
            'Загрузка данных...'
          )}
        </Hero.Body>
      </Hero>
    </MapControl>
  );
}

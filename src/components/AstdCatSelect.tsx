import { useState } from 'react';
import { Form } from 'react-bulma-components';

import type { ChangeEvent, FunctionComponent } from 'react';
import type { AstdCat } from '../interfaces';

interface AstdCatSelectProps {
  astdCatList: AstdCat[];
  activeAstdCat: AstdCat;
  onChange: (cat: AstdCat) => void;
}

export const AstdCatSelect: FunctionComponent<AstdCatSelectProps> = (props) => {
  const [cat, setCat] = useState<AstdCat>(props.activeAstdCat);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCat(e.target.value);
  };
  return (
    <>
      <Form.Field>
        <Form.Control>
          <Form.Label>Тип судна</Form.Label>
          <Form.Select onChange={onChange} value={cat}>
            {props.astdCatList.map((x) => (
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

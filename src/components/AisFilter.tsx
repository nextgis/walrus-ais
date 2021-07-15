import { Form } from 'react-bulma-components';

import type { FunctionComponent } from 'react';
import type { AisFilterData, AisFilterInterface } from '../interfaces';
import { MultiplySelect } from './MultiplySelect';

interface AisFilterProps {
  aisFilter: AisFilterInterface;
  aisFilterData: AisFilterData;
  onChange: (filter: Partial<AisFilterInterface>) => void;
}

export const AisFilter: FunctionComponent<AisFilterProps> = (props) => {
  const data = props.aisFilterData;
  const cat = props.aisFilter.astd_cat;

  // const [cat, setCat] = useState<AstdCat | null>(props.aisFilter.astd_cat);
  // const onCatChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setCat(e.target.value);
  // };

  return (
    <>
      <MultiplySelect
        up
        label="Тип судна"
        items={data.astdCatList}
        value={cat}
        onChange={(astd_cat) => props.onChange({ astd_cat })}
      />
    </>
  );
};

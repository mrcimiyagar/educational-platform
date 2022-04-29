import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {colors} from '../../util/settings';

export default function ShowHideToggle(props) {
  const [value, setValue] = React.useState(false);

  const handleChange = (event, v) => {
    setValue(v);
    props.setParentValue(v);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={handleChange}
      style={{color: colors.text}}
    >
      <ToggleButton value={true}><div style={{margin: 12, fontSize: 14, color: colors.text}}>مخفی</div></ToggleButton>
      <ToggleButton value={false}><div style={{margin: 12, fontSize: 14, color: colors.text}}>آشکار</div></ToggleButton>
    </ToggleButtonGroup>
  );
}

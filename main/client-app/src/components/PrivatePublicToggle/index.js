import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {colors} from '../../util/settings';

export default function PrivatePublicToggle(props) {
  const [value, setValue] = React.useState('public');

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
      <ToggleButton value="public"><div style={{margin: 12, fontSize: 14, color: colors.text}}>عمومی</div></ToggleButton>
      <ToggleButton value="private"><div style={{margin: 12, fontSize: 14, color: colors.text}}>خصوصی</div></ToggleButton>
    </ToggleButtonGroup>
  );
}
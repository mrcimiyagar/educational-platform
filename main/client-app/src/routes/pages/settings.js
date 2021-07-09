import React, {Fragment, useEffect} from "react";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";

import ColorSwitcher from '../../components/ColorSwitcher';
import { colors } from "../../util/settings";
import { leaveRoom } from "../../util/Utils";

function SettingsPage(props) {

  useEffect(() => {
    leaveRoom();
  }, []);

  return (
      <Fragment>
        <ColorSwitcher/>
      </Fragment>
  );
}
export default SettingsPage;
import "chartjs-plugin-datalabels";
import React, { Fragment, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-table/react-table.css";
import ColorSwitcher from '../../components/ColorSwitcher';
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
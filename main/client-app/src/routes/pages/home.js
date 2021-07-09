import React, {Fragment, useEffect} from "react";
import {
  Card,
  CardBody
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

import CircularProgressbar from "react-circular-progressbar";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import './home.css';

import {ConnectToIo, roothPath, validateToken, leaveRoom} from "../../util/Utils";
import {ColorBase, colors, setToken, token} from "../../util/settings";
import {toggleInvites, toggleRooms} from "../../containers/Sidebar";

import {isDesktop, gotoPage} from '../../App';

export let reloadRoomsList = undefined;

function HomePage(props) {

  let [canLoad, setCanLoad] = React.useState(false);

  setToken(localStorage.getItem('token'));

  useEffect(() => {
    leaveRoom();
    validateToken(token, (result, config) => {
      if (!result) {
        gotoPage('/app/register');
      } else {
        if (config.isGuest === true) {
          gotoPage('/app/register');
        }
        else {
          setCanLoad(true);
        }
      }
    })
  }, []);

  ConnectToIo()

  if (!canLoad) {
    return <div/>;
  }

  if (isDesktop) {
    return (
        <div style={{paddingRight: 16, paddingTop: 16, width: window.innerWidth + 'px', height: window.innerHeight - 56 + 'px', position: 'absolute', right: 0, left: 0, top: 56, bottom: 0, backgroundColor: colors.primaryDark}}>
          <ColorBase/>
          <div style={{display: 'flex', width: '100%', height: 'calc(50% - 24px)'}}>
            <Card className="progress-banner" onClick={toggleRooms} style={{width: 'calc(50% - 24px)', height: '100%', marginTop: 16}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        روم ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
            </Card>
            <Card className="progress-banner" onClick={toggleInvites} style={{width: 'calc(50% - 24px)', height: '100%', marginTop: 16, marginRight: 16}}>
                <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        دعوت ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
            </Card>
          </div>
          <div style={{display: 'flex', width: '100%', height: 'calc(50% - 24px)', marginTop: 16}}>
            <Card className="progress-banner" style={{width: 'calc(50% - 24px)', height: '100%', marginTop: 16}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        ثبت اختراعات
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
            <Card className="progress-banner" style={{width: 'calc(50% - 24px)', height: '100%', marginTop: 16, marginRight: 16}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        آزمون ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
          </div>
        </div>
    );
  }
  else {
    return (
        <div style={{width: window.innerWidth + 'px', height: window.innerHeight + 'px', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, backgroundColor: colors.primaryDark, 
                    display: 'grid',
                    gridTemplateColumns: '100%',
                    rowGap: 8,
                    overflowY: 'auto'}}>
            <ColorBase/>
            <Card className="progress-banner" onClick={toggleRooms} style={{width: 'calc(100% - 32px)', marginLeft: 12, marginRight: 16, marginTop: 96}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        روم ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
            <Card className="progress-banner" onClick={toggleInvites} style={{width: 'calc(100% - 32px)', marginLeft: 12, marginRight: 16, marginTop: 16}}>
                <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        دعوت ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
            <Card className="progress-banner" style={{width: 'calc(100% - 32px)', marginLeft: 12, marginRight: 16, marginTop: 16}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        ثبت اختراعات
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
            <Card className="progress-banner" style={{width: 'calc(100% - 32px)', marginLeft: 12, marginRight: 16, marginTop: 16, marginBottom: 128}}>
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                        آزمون ها
                        </p>
                      </div>
                    </div>

                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={41}
                        text={"5/12"}
                      />
                    </div>
                  </CardBody>
                </Card>
        </div>
    );
  }
}
export default HomePage;

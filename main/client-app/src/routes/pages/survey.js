import React, { Component, Fragment } from "react";
import {
  Row,
  Card,
  CardBody,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Badge,
  Collapse,
  ButtonDropdown,
  CustomInput,
  Label,
  Input
} from "reactstrap";

import { Colxx, Separator } from "../../components/CustomBootstrap";
import { BreadcrumbItems } from "../../components/BreadcrumbContainer";
import { NavLink } from "react-router-dom";
import ApplicationMenu from "../../components/ApplicationMenu";

import PerfectScrollbar from "react-perfect-scrollbar";
import {currentSurvey, setCurrentSurvey, setToken, token} from "../../util/settings";
import {toggleAddSurvey} from '../../containers/Sidebar/index';
import { config, leaveRoom } from "../../util/Utils";

export let reloadSurveysList = undefined;

class SurveyListApplication extends Component {
  constructor(props) {
    super(props);
    setToken(localStorage.getItem('token'));
    this.toggleSplit = this.toggleSplit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);

    this.state = {
      dropdownSplitOpen: false,
      modalOpen: false,
      lastChecked: null,
      allSurveys: [],
      surveys: [],
      states: [],
      labels: [],
      categories: [],
      title: "",
      label: {},
      category: {},
      status: "ACTIVE",
      displayOptionsIsOpen: false,
      selectedStatus: '',
      selectedLabelId: 0,
      selectedCatId: 0,
      searchKey: '',
      loading: true,
      checkList: {},
      selectedItems: [],
      orderColumn: {
        label: ""
      }
    };
  }
  componentDidMount() {
    leaveRoom();
    let fetchSurveys = () => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        redirect: 'follow'
      };
      fetch("../survey/get_surveys", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.setState({surveys: result.surveys, states: result.states, loading: false});
          }
        })
        .catch(error => console.log('error', error));
    };
    reloadSurveysList = fetchSurveys;
    fetchSurveys();
    let requestOptions2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      redirect: 'follow'
    };
    fetch("../survey/get_labels", requestOptions2)
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        if (result.status === 'success') {
          this.setState({labels: result.labels});
        }
      })
      .catch(error => console.log('error', error));
    let requestOptions3 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        redirect: 'follow'
      };
      fetch("../survey/get_categories", requestOptions3)
        .then(response => response.json())
        .then(result => {
          console.log(JSON.stringify(result));
          if (result.status === 'success') {
            this.setState({categories: result.categories});
          }
        })
        .catch(error => console.log('error', error));
  }

  toggleDisplayOptions() {
    this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  addFilter(column, value) {
    this.props.getSurveyListWithFilter(column, value);
  }
  changeOrderBy(column) {
    this.props.getSurveyListWithOrder(column);
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.props.getSurveyListSearch(e.target.value);
    }
  }

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
  render() {
    document.body.style.overflow = 'auto';
    document.body.style.overflowY = 'auto';

    let surveys = [];
    if (this.state.selectedStatus === 'ACTIVE') {
      let counter = 0;
      surveys = this.state.surveys.filter(s => {
        if (this.state.states[counter].answered === false) {
          counter++;
          return true;
        }
        else {
          counter++;
          return false;
        }
      });
    }
    else if (this.state.selectedStatus === 'COMPLETED') {
      let counter = 0;
      surveys = this.state.surveys.filter(s => {
        if (this.state.states[counter].answered === true) {
          counter++;
          return true;
        }
        else {
          counter++;
          return false;
        }
      });
    }
    else {
      surveys = this.state.surveys;
    }

    if (this.state.selectedCatId > 0) {
      surveys = surveys.filter(s => {
        if (s.categoryId === this.state.selectedCatId) {
          return true;
        }
        else {
          return false;
        }
      });
    }

    if (this.state.selectedLabelId > 0) {
      surveys = surveys.filter(s => {
        if (s.labelId === this.state.selectedLabelId) {
          return true;
        }
        else {
          return false;
        }
      });
    }

    return (
      <Fragment>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <div className="mb-2">
              <h1>
                آزمون
              </h1>

              <div className="float-sm-left">
              
              { 
                config.canAddSurvey ?
                  <Button
                    color="primary"
                    size="lg"
                    className="top-right-button mr-1"
                    onClick={toggleAddSurvey}
                  >
                    ساخت آزمون جدید
                  </Button> :
                  null 
              }

                <ButtonDropdown
                  isOpen={this.state.dropdownSplitOpen}
                  toggle={this.toggleSplit}
                >
                  <div className="btn btn-primary pr-3 pl-0 check-button">
                    <Label
                      for="checkAll"
                      className="custom-control custom-checkbox mb-0 d-inline-block"
                    >
                      <Input
                        className="custom-control-input"
                        type="checkbox"
                        id="checkAll"
                        checked={
                          (() => {
                            let checkList = this.state.checkList;
                            let allOn = true;
                            let anyItem = false;
                            this.state.surveys.forEach((s) => {
                              anyItem = true;
                              if (checkList[s._id] === false || checkList[s._id] === undefined) {
                                allOn = false;
                              }
                            });
                            return allOn && anyItem;
                          })()
                        }
                        onClick={() => {
                          let checkList = this.state.checkList;
                          let allOn = true;
                          let anyItem = false;
                          for (let check in checkList) {
                            anyItem = true;
                            if (checkList[check] === false || checkList[check] === undefined) {
                              allOn = false;
                              break;
                            }
                          }
                          this.state.surveys.forEach((s) => {
                            checkList[s._id] = !(allOn && anyItem);
                          });
                          this.setState({checkList: checkList});
                        }}
                      />
                      <span
                        className={`custom-control-label ${
                          this.state.loading &&
                          this.state.selectedItems.length > 0 &&
                          this.state.selectedItems.length < this.state.surveys.length
                            ? "indeterminate"
                            : ""
                        }`}
                      />
                    </Label>
                  </div>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="dropdown-toggle-split pl-2 pr-2"
                  />
                  {
                    config.canRemoveSurvey ?
                      <DropdownMenu right>
                        <DropdownItem>
                          حذف نمودن
                        </DropdownItem>
                      </DropdownMenu> :
                      null
                  }
                </ButtonDropdown>
              </div>

              <BreadcrumbItems match={this.props.match} />
            </div>

            <div className="mb-2">
              <Button
                color="empty"
                id="displayOptions"
                className="pt-0 pl-0 d-inline-block d-md-none"
                onClick={this.toggleDisplayOptions}
              >
                نمایش موارد
                <i className="simple-icon-arrow-down align-middle" />
              </Button>

              <Collapse
                className="d-md-block"
                isOpen={this.state.displayOptionsIsOpen}
              >
                <div className="d-block mb-2 d-md-inline-block">
                  <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                    <DropdownToggle caret color="outline-dark" size="xs">
                      مرتب سازی
                      {this.state.orderColumn ? this.state.orderColumn.label : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {["عنوان", "دسته بندی", "برچسب"].map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              let sur = this.state.surveys;
                              if (index === 0) {
                                sur.sort((a, b) => (a.title > b.title) ? 1 : -1);
                              }
                              else if (index === 1) {
                                sur.sort((a, b) => (a.category > b.category) ? 1 : -1);
                              }
                              else if (index === 2) {
                                sur.sort((a, b) => (a.label > b.label) ? 1 : -1);
                              }
                              this.setState({surveys: sur});
                            }}
                          >
                            {o}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                    <input
                      type="text"
                      name="keyword"
                      id="search"
                      placeholder={'جستجو'}
                      value={this.state.searchKey}
                      onChange={(e) => {
                        this.setState({searchKey: e.target.value, loading: true});
                        setTimeout(() => {
                          this.setState({loading: false});
                        }, 500);
                      }}
                      onKeyPress={e => this.handleKeyPress(e)}
                    />
                  </div>
                </div>
              </Collapse>
            </div>
            <Separator className="mb-5" />
            <Row>
              {!this.state.loading ? (
                surveys.filter(s => s.title.includes(this.state.searchKey)).map((item, index) => {
                  return (
                    <Colxx xxs="12" key={index}>
                      <Card className="card d-flex flex-row mb-3">
                        <div className="d-flex flex-grow-1 min-width-zero">
                          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <NavLink
                              onClick={() => setCurrentSurvey(item)}
                              to={`/app/survey/${item._id}`}
                              className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                            >
                              <i
                                className={`${
                                  item.status === "COMPLETED"
                                    ? "simple-icon-check heading-icon"
                                    : "simple-icon-refresh heading-icon"
                                }`}
                              />
                              <span className="align-middle d-inline-block">{item.title}</span>
                            </NavLink>
                            <p className="mb-1 text-muted text-small w-15 w-xs-100">
                              {item.details}
                            </p>
                            <p className="mb-1 text-muted text-small w-15 w-xs-100">
                              {item.categoryId}
                            </p>
                            <p className="mb-1 text-muted text-small w-15 w-xs-100">
                              {item.createdDate}
                            </p>
                            <div className="w-15 w-xs-100">
                                {item.labelId}
                            </div>
                          </CardBody>
                          <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                            <CustomInput
                              className="itemCheck mb-0"
                              type="checkbox"
                              id={`check_${item.id}`}
                              checked={
                                this.state.checkList[item._id] !== undefined ? this.state.checkList[item._id] : false
                              }
                              onClick={event => {
                                let checkList = this.state.checkList;
                                if (checkList[item._id] === undefined) {
                                  checkList[item._id] = true;
                                }
                                else {
                                  checkList[item._id] = !checkList[item._id];
                                }
                                this.setState({checkList: checkList});
                              }}
                              label=""
                            />
                          </div>
                        </div>
                      </Card>
                    </Colxx>
                  );
                })
              ) : (
                <div className="loading" />
              )}
            </Row>
          </Colxx>
        </Row>

        <ApplicationMenu>
          <PerfectScrollbar
            option={{ suppressScrollX: true, wheelPropagation: false }}
          >
            <div className="p-4">
              <p className="text-muted text-small">
                وضعیت
              </p>
              <ul className="list-unstyled mb-5">
                <NavItem>
                  <NavLink to="#" onClick={e => this.setState({selectedStatus: ''})}>
                    <i className="simple-icon-reload" />
                    همه ی آزمون ها
                    <span className="float-right">
                      {this.state.loading && this.state.states.length}
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="#"
                    onClick={e => this.setState({selectedStatus: 'ACTIVE'})}
                  >
                    <i className="simple-icon-refresh" />
                    آزمون های فعال
                    <span className="float-right">
                      {this.state.loading &&
                        this.state.states.filter(x => x.answered === false).length}
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to="#"
                    onClick={e => this.setState({selectedStatus: 'COMPLETED'})}
                  >
                    <i className="simple-icon-check" />
                    آزمون های پایان یافته
                    <span className="float-right">
                      {this.state.loading &&
                        this.state.states.filter(x => x.answered === true).length}
                    </span>
                  </NavLink>
                </NavItem>
              </ul>
              <p className="text-muted text-small">
                دسته ها
              </p>
              <ul className="list-unstyled mb-5">
                {this.state.categories.map((c, index) => {
                  return (
                    <NavItem key={index}>
                      <div onClick={e => this.setState({selectedCatId: Number(c.id)})}>
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input"
                            checked={
                              this.state.selectedCatId === Number(c.id)
                            }
                          />
                          <label className="custom-control-label">{c.name}</label>
                        </div>
                      </div>
                    </NavItem>
                  );
                })}
              </ul>
              <p className="text-muted text-small">
                برچسب ها
              </p>
              <div>
                {this.state.labels.map((l, index) => {
                  return (
                    <p className="d-sm-inline-block mb-1" key={index}>
                      <NavLink
                        to="#"
                        onClick={e => this.setState({selectedLabelId: Number(l.id)})}
                      >
                        
                      </NavLink>
                    </p>
                  );
                })}
              </div>
            </div>
          </PerfectScrollbar>
        </ApplicationMenu>
      </Fragment>
    );
  }
}

export default SurveyListApplication;

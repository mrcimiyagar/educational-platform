import classnames from "classnames";
import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import {
  Badge, Button, ButtonDropdown, Card,
  CardBody, CardTitle, DropdownItem,
  DropdownMenu, DropdownToggle, Nav,
  NavItem, Progress, Row, TabContent,
  TabPane
} from "reactstrap";
import { BreadcrumbItems } from "../../components/BreadcrumbContainer";
import { Colxx } from "../../components/CustomBootstrap";
import SurveyQuestionBuilder from "../../components/SurveyQuestionBuilder";
import { currentSurvey, setCurrentSurvey } from "../../util/settings";
import { leaveRoom, mapOrder } from "../../util/Utils";


class SurveyDetailApplication extends Component {
  constructor(props) {
    super(props);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.state = {
      activeFirstTab: "1",
      dropdownSplitOpen: false,
      survey: {},
      loading: true
    };
  }
  componentDidMount() {
    leaveRoom();
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeFirstTab: tab
      });
    }
  }

  toggleSplit() {
    this.setState(prevState => ({
      dropdownSplitOpen: !prevState.dropdownSplitOpen
    }));
  }

  addQuestion() {
    const survey = currentSurvey;

    var nextId = 0;
    if (survey.questions.length > 0) {
      var ordered =survey.questions.slice().sort((a, b) => {
        return a.id < b.id;
      });
      nextId = ordered[0].id + 1;
    }
    const newSurvey = Object.assign({},survey);
    newSurvey.questions.push( { id: nextId });
    setCurrentSurvey(newSurvey);
    this.setState({survey: newSurvey});
  }

  handleSortChange(order,sortable,evt){
    var ordered_array = mapOrder(
      this.state.survey.questions,
      order,
      "id"
    );
  }

  deleteQuestion(id) {
    let counter = 0;
    currentSurvey.questions.forEach(q => {
      if (q.id === id) {
        currentSurvey.questions.splice(counter, 1);
      }
      counter++;
    });
    setCurrentSurvey(currentSurvey);
    this.setState({survey: currentSurvey});
  }

  render() {
    document.body.style.overflow = 'auto';
    document.body.style.overflowY = 'auto';

    return (
      <Fragment>
        <Row className="app-row survey-app">
          <Colxx xxs="12">
            <h1>
              <i className="simple-icon-refresh heading-icon" /> <span className="align-middle d-inline-block pt-1">{currentSurvey.title}</span>              
            </h1>
            <div className="float-sm-left mb-2">
              <ButtonDropdown
                className="top-right-button top-right-button-single"
                isOpen={this.state.dropdownSplitOpen}
                toggle={this.toggleSplit}
              >
                <Button
                  outline
                  className="flex-grow-1"
                  size="lg"
                  color="primary"
                >
                  ذخیره
                </Button>
                <DropdownToggle
                  size="lg"
                  className="pr-4 pl-4"
                  caret
                  outline
                  color="primary"
                />
                <DropdownMenu right>
                  <DropdownItem header>
                    حذف
                  </DropdownItem>
                  <DropdownItem disabled>
                    ویرایش
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
            </div>

            <BreadcrumbItems match={this.props.match} />
            {this.state.loading ?
            <Fragment>
            <Nav tabs className="separator-tabs ml-0 mb-5">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeFirstTab === "1",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                  to="#"
                >
                  جزئیات
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeFirstTab === "2",
                    "nav-link": true
                  })}
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                  to="#"
                >
                  نتایج
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeFirstTab}>
              <TabPane tabId="1">
   
                <Row>
                  <Colxx xxs="12" lg="4" className="mb-4">
                    <Card className="mb-4">
                      <CardBody>
                        <p className="list-item-heading mb-4">خلاصه</p>
                        <p className="text-muted text-small mb-2">نام</p>
                        <p className="mb-3">{currentSurvey.title}</p>

                        <p className="text-muted text-small mb-2">جزئیات</p>
                        <p className="mb-3" dangerouslySetInnerHTML={{ __html: currentSurvey.details }}/>

                        <p className="text-muted text-small mb-2">دسته بندی</p>
                        <p className="mb-3">{currentSurvey.categoryId}</p>

                        <p className="text-muted text-small mb-2">برچسب</p>
                        <div>
                          <p className="d-sm-inline-block mb-1">
                          <Badge pill>{currentSurvey.labelId}</Badge>
                          </p>
                          <p className="d-sm-inline-block  mb-1" />
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>

                  <Colxx xxs="12" lg="8">
                    <ul className="list-unstyled mb-4">
                        {currentSurvey.questions.map((item, index) => {
                          return (
                            <li data-id={item.id} key={item.id}>
                              <SurveyQuestionBuilder
                                order={index}
                                {...item}
                                expanded={!item.title && true}
                                deleteClick={id => {
                                  this.deleteQuestion(id);
                                }}
                              />
                            </li>
                          );
                        })}
                    </ul>

                    <div className="text-center">
                      <Button
                        outline
                        color="primary"
                        className="mt-3"
                        onClick={() => this.addQuestion()}
                      >
                        <i className="simple-icon-plus btn-group-icon" /> اضافه کردن
                        سوال
                      </Button>
                    </div>
                  </Colxx>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Colxx xxs="12" lg="4">
                    <Card className="mb-4">
                      <CardBody>
                        <p className="list-item-heading mb-4">سهم</p>

                        <div className="mb-4">
                          <p className="mb-2">جنسیت</p>

                          <Progress multi className="mb-3">
                            <Progress bar value="60" />
                            <Progress bar color="theme-2" value="40" />
                          </Progress>

                          <table className="table table-sm table-borderless">
                            <tbody>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-1 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    105/125 مرد
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-2 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    90/125 زن
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mb-4">
                          <p className="mb-2">تحصیلات</p>
                          <Progress multi className="mb-3">
                            <Progress bar value="80" />
                            <Progress bar color="theme-2" value="20" />
                          </Progress>

                          <table className="table table-sm table-borderless">
                            <tbody>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-1 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    139/125 دانشگاه
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-2 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    95/125 دبیرستان
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mb-4">
                          <p className="mb-2">سن</p>
                          <Progress multi className="mb-3">
                            <Progress bar value="35" />
                            <Progress bar color="theme-2" value="25" />
                            <Progress bar color="theme-3" value="40" />
                          </Progress>

                          <table className="table table-sm table-borderless">
                            <tbody>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-1 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    50/75 18-24
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-2 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    40/75 24-30
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-0 pb-1 w-10">
                                  <span className="log-indicator border-theme-3 align-middle" />
                                </td>
                                <td className="p-0 pb-1">
                                  <span className="font-weight-medium text-muted text-small">
                                    60/75 30-40
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>

                  <Colxx xxs="12" lg="8">
                    <Card className="mb-4">
                      <CardBody>
                        <CardTitle>شما چند سال دارید؟</CardTitle>
                        <div className="chart-container">
                          
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="mb-4">
                      <CardBody>
                        <CardTitle>جنسیت شما چیست؟</CardTitle>
                        <div className="chart-container">
                          
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="mb-4">
                      <CardBody>
                        <CardTitle>وضعیت شغلی شما چیست؟</CardTitle>
                        <div className="chart-container">
                          
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="mb-4">
                      <CardBody>
                        <CardTitle>
                        چه از زبان برنامه نویسی شمااستفاده می کنید؟
                        </CardTitle>
                        <div className="chart-container">
                          
                        </div>
                      </CardBody>
                    </Card>
                  </Colxx>
                </Row>
              </TabPane>
            </TabContent>
            </Fragment>
             :<div className="loading"></div>
            }
          </Colxx>
        </Row>

    </Fragment>
    );
  }
}

export default SurveyDetailApplication;

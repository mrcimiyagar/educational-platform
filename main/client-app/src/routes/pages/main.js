import "chartjs-plugin-datalabels";
import moment from "moment";
import React, { Component, Fragment } from "react";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Chart } from "react-chartjs-2";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import Sortable from "react-sortablejs";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
    Badge, Button, Card,
    CardBody, CardHeader, CardTitle, CustomInput, DropdownItem, DropdownMenu, DropdownToggle, Form,
    FormGroup, Input, Label, Progress, Row, UncontrolledDropdown
} from "reactstrap";
import { CalendarToolbar } from "../../components/Calendar/CalendarToolbar";
import { LineShadow, PolarShadow, SmallLineChart } from "../../components/Charts";
import { Colxx } from "../../components/CustomBootstrap";
import CustomSelectInput from "../../components/CustomSelectInput";
import DataTablePagination from "../../components/DataTables/pagination";
import Rating from "../../components/Rating";
import ReactSiemaCarousel from "../../components/ReactSiema/ReactSiemaCarousel";
import {
    conversionChartConfig,
    lineChartConfig,
    polarChartConfig,
    smallChartData1,
    smallChartData2,
    smallChartData3,
    smallChartData4, visitChartConfig
} from "../../constants/chartConfig";
import cakeData from "../../data/dashboard.cakes.json";
import profileStatusData from "../../data/dashboard.profile.status.json";
import eventsData from "../../data/events.json";
import logsData from "../../data/logs.json";
import productsData from "../../data/products.json";
import ticketsData from "../../data/tickets.json";
import lang from '../../lang/locales/fa_IR';





Chart.defaults.global.plugins.datalabels.display = false;

const localizer = BigCalendar.momentLocalizer(moment) 

const selectData = [
  { label: "شکلات", value: "chocolate", key: 0 },
  { label: "موز", value: "vanilla", key: 1 },
  { label: "توت فرنگی", value: "strawberry", key: 2 },
  { label: "کرم کارامل", value: "caramel", key: 3 },
  { label: "بستنی", value: "cookiescream", key: 4 },
  { label: "چایی", value: "peppermint", key: 5 }
];

const selectDataType = [
  { label: "کیک", value: "cake", key: 0 },
  { label: "کاپ کیک", value: "cupcake", key: 1 },
  { label: "دسر", value: "dessert", key: 2 }
];

const dataTableColumns = [
  {
    Header: "نام",
    accessor: "name",
    Cell: props => <p className="list-item-heading">{props.value}</p>
  },
  {
    Header: "حراجی",
    accessor: "sales",
    Cell: props => <p className="text-muted">{props.value}</p>
  },
  {
    Header: "موجودی",
    accessor: "stock",
    Cell: props => <p className="text-muted">{props.value}</p>
  },
  {
    Header: "دسته بندی",
    accessor: "category",
    Cell: props => <p className="text-muted">{props.value}</p>
  }
];

const recentOrders = productsData.data.slice(0, 6);
const tickets = ticketsData.data;
const events = eventsData.data;
const logs = logsData.data;
const dataTableData = productsData.data.slice(0, 12);
const profileStatuses = profileStatusData.data;
const cakes = cakeData.data;

BigCalendar.momentLocalizer(moment);

let IntlMessages = (props) => {
  return <p>{lang[props.id]}</p>
}

class DefaultDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);

    this.state = {
      selectedOptions: [],
      selectedOptionsType: []
    };

    document.body.style.overflow = 'auto'
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleChangeType = selectedOptionsType => {
    this.setState({ selectedOptionsType });
  };

  render() {
    const messages = {};
    return (
      <Fragment style={{width: window.innerWidth - 96 + 'px'}}>
        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx lg="12" xl="6">
            <div className="icon-cards-row">
              <ReactSiemaCarousel
                perPage={{
                  0: 1,
                  320: 2,
                  576: 3,
                  1800: 4
                }}
                controls={false}
                loop={false}
              >
                <div className="icon-row-item">
                  <Card className="mb-4">
                    <CardBody className="text-center">
                      <i className="iconsminds-clock" />
                      <p className="card-text font-weight-semibold mb-0">
                        <IntlMessages id="dashboards.pending-orders" />
                      </p>
                      <p className="lead text-center">14</p>
                    </CardBody>
                  </Card>
                </div>
                <div className="icon-row-item">
                  <Card className="mb-4">
                    <CardBody className="text-center">
                      <i className="iconsminds-basket-coins" />
                      <p className="card-text font-weight-semibold mb-0">
                        <IntlMessages id="dashboards.completed-orders" />
                      </p>
                      <p className="lead text-center">32</p>
                    </CardBody>
                  </Card>
                </div>
                <div className="icon-row-item">
                  <Card className="mb-4">
                    <CardBody className="text-center">
                      <i className="iconsminds-arrow-refresh" />
                      <p className="card-text font-weight-semibold mb-0">
                        <IntlMessages id="dashboards.refund-requests" />
                      </p>
                      <p className="lead text-center">74</p>
                    </CardBody>
                  </Card>
                </div>
                <div className="icon-row-item">
                  <Card className="mb-4">
                    <CardBody className="text-center">
                      <i className="iconsminds-mail-read" />
                      <p className="card-text font-weight-semibold mb-0">
                        <IntlMessages id="dashboards.new-comments" />
                      </p>
                      <p className="lead text-center">25</p>
                    </CardBody>
                  </Card>
                </div>
              </ReactSiemaCarousel>
            </div>

            <Row>
              <Colxx md="12" className="mb-4">
                <Card>
                  <div className="position-absolute card-top-buttons">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        color=""
                        className="btn btn-header-light icon-button"
                      >
                        <i className="simple-icon-refresh" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <IntlMessages id="dashboards.sales" />
                        </DropdownItem>
                        <DropdownItem>
                          <IntlMessages id="dashboards.orders" />
                        </DropdownItem>
                        <DropdownItem>
                          <IntlMessages id="dashboards.refunds" />
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  <CardBody>
                    <CardTitle>
                      <IntlMessages id="dashboards.sales" />
                    </CardTitle>
                    <div className="dashboard-line-chart">
                      <LineShadow {...lineChartConfig} />
                    </div>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </Colxx>
          <Colxx lg="12" xl="6" className="mb-4">
            <Card>
              <div className="position-absolute card-top-buttons">
                <button className="btn btn-header-light icon-button">
                  <i className="simple-icon-refresh" />
                </button>
              </div>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.recent-orders" />
                </CardTitle>
                <div className="scroll dashboard-list-with-thumbs">
                  <PerfectScrollbar
                    option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {recentOrders.map((order, index) => {
                      return (
                        <div key={index} className="d-flex flex-row mb-3">
                          <NavLink
                            to="/app/pages/details"
                            className="d-block position-relative"
                          >
                            <img
                              src={order.img}
                              alt={order.name}
                              className="list-thumbnail border-0"
                            />
                            <Badge
                              key={index}
                              className="position-absolute badge-top-right"
                              color={order.statusColor}
                              pill
                            >
                              {order.status}
                            </Badge>
                          </NavLink>

                          <div className="pl-3 pt-2 pr-2 pb-2">
                            <NavLink to="/app/pages/details">
                              <p className="list-item-heading">{order.name}</p>
                              <div className="pr-4">
                                <p className="text-muted mb-1 text-small">
                                  {order.description}
                                </p>
                              </div>
                              <div className="text-primary text-small font-weight-medium d-none d-sm-block">
                                {order.createDate}
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      );
                    })}
                  </PerfectScrollbar>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx lg="4" md="12" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.product-categories" />
                </CardTitle>
                <div className="dashboard-donut-chart">
                  <PolarShadow {...polarChartConfig} />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.logs" />
                </CardTitle>
                <div className="dashboard-logs">
                  <PerfectScrollbar
                    option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    <table className="table table-sm table-borderless">
                      <tbody>
                        {logs.map((log, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span
                                  className={`log-indicator align-middle ${
                                    log.color
                                  }`}
                                />
                              </td>
                              <td>
                                <span className="font-weight-medium">
                                  {log.label}
                                </span>
                              </td>
                              <td className="text-right">
                                <span className="text-muted">{log.time}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </PerfectScrollbar>
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx lg="4" md="6" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.tickets" />
                </CardTitle>
                <div className="dashboard-list-with-user">
                  <PerfectScrollbar
                      option={{ suppressScrollX: true, wheelPropagation: false }}
                  >
                    {tickets.map((ticket, index) => {
                      return (
                          <div
                              key={index}
                              className="d-flex flex-row mb-3 pb-3 border-bottom"
                          >
                            <NavLink to="/app/pages/details">
                              <img
                                  src={ticket.thumb}
                                  alt={ticket.label}
                                  className="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall"
                              />
                            </NavLink>

                            <div className="pl-3 pr-2">
                              <NavLink to="/app/pages/details">
                                <p className="font-weight-medium mb-0 ">
                                  {ticket.label}
                                </p>
                                <p className="text-muted mb-0 text-small">
                                  {ticket.date}
                                </p>
                              </NavLink>
                            </div>
                          </div>
                      );
                    })}
                  </PerfectScrollbar>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx xl="6" lg="12" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.calendar" />
                </CardTitle>
                <BigCalendar
                  localizer={localizer}
                  style={{ minHeight: "500px" }}
                  events={events}
                  views={["month"]}
                  components={{
                    toolbar: CalendarToolbar
                  }}
                />
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="6" lg="12" className="mb-4">
            <Card className="h-100">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.best-sellers" />
                </CardTitle>
                <ReactTable
                  defaultPageSize={6}
                  data={dataTableData}
                  columns={dataTableColumns}
                  minRows={0}
                  showPageJump={false}
                  showPageSizeOptions={false}
                  PaginationComponent={DataTablePagination}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx sm="12" lg="4" className="mb-4">
            <Card className="h-100">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.profile-status" />
                </CardTitle>
                {profileStatuses.map((s, index) => {
                  return (
                    <div key={index} className="mb-4">
                      <p className="mb-2">
                        {s.title}
                        <span className="float-right text-muted">
                          {s.status}/{s.total}
                        </span>
                      </p>
                      <Progress value={(s.status / s.total) * 100} />
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </Colxx>
          <Colxx md="6" lg="4" className="mb-4">
            <Card className="dashboard-sq-banner justify-content-end">
              <CardBody className="justify-content-end d-flex flex-column">
                <span className="badge badge-pill badge-theme-3 align-self-start mb-3">
                  <IntlMessages id="dashboards.gogo" />
                </span>
                <p className="lead text-white">
                  <IntlMessages id="dashboards.magic-is-in-the-details" />
                </p>
                <p className="text-white">
                  <IntlMessages id="dashboards.yes-it-is-indeed" />
                </p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx md="6" lg="4" className="mb-4">
            <Card className="dashboard-link-list">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.cakes" />
                </CardTitle>
                <div className="d-flex flex-row">
                  <div className="w-50">
                    <ul className="list-unstyled mb-0">
                      {cakes.slice(0, 12).map((c, index) => {
                        return (
                          <li key={index} className="mb-1">
                            <NavLink to={c.link}>{c.title}</NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="w-50">
                    <ul className="list-unstyled mb-0">
                      {cakes.slice(12, 24).map((c, index) => {
                        return (
                          <li key={index} className="mb-1">
                            <NavLink to={c.link}>{c.title}</NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Sortable
          options={{
            handle: ".handle"
          }}
          className="row"
          style={{width: window.innerWidth - 96 + 'px'}}
        >
          <Colxx xl="3" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="dashboards.payment-status" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={64}
                    text={"64%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="3" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="dashboards.work-progress" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={75}
                    text={"75%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="3" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="dashboards.tasks-completed" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={32}
                    text={"32%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="3" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="dashboards.payments-done" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={60}
                    text={"45%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Sortable>

        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx sm="12" md="6" className="mb-4">
            <Card className="dashboard-filled-line-chart">
              <CardBody>
                <div className="float-left float-none-xs">
                  <div className="d-inline-block">
                    <h5 className="d-inline">
                      <IntlMessages id="dashboards.website-visits" />
                    </h5>
                    <span className="text-muted text-small d-block">
                      <IntlMessages id="dashboards.unique-visitors" />
                    </span>
                  </div>
                </div>

                <div className="btn-group float-right float-none-xs mt-2">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="btn-xs"
                      outline
                    >
                      <IntlMessages id="dashboards.this-week" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <IntlMessages id="dashboards.last-week" />
                      </DropdownItem>
                      <DropdownItem>
                        <IntlMessages id="dashboards.this-month" />
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </CardBody>

              <div className="chart card-body pt-0">
                <LineShadow {...visitChartConfig} />
              </div>
            </Card>
          </Colxx>
          <Colxx sm="12" md="6" className="mb-4">
            <Card className="dashboard-filled-line-chart">
              <CardBody>
                <div className="float-left float-none-xs">
                  <div className="d-inline-block">
                    <h5 className="d-inline">
                      <IntlMessages id="dashboards.conversion-rates" />
                    </h5>
                    <span className="text-muted text-small d-block">
                      <IntlMessages id="dashboards.per-session" />
                    </span>
                  </div>
                </div>

                <div className="btn-group float-right float-none-xs mt-2">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      color="secondary"
                      className="btn-xs"
                      outline
                    >
                      <IntlMessages id="dashboards.this-week" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <IntlMessages id="dashboards.last-week" />
                      </DropdownItem>
                      <DropdownItem>
                        <IntlMessages id="dashboards.this-month" />
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </CardBody>

              <div className="chart card-body pt-0">
                <LineShadow {...conversionChartConfig} />
              </div>
            </Card>
          </Colxx>
        </Row>

        <Row style={{width: window.innerWidth - 96 + 'px'}}>
          <Colxx lg="12" md="6" xl="4">
            <Row>
              <Colxx lg="4" xl="12" className="mb-4">
                <Card className="progress-banner">
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-clock mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                          5 <IntlMessages id="dashboards.files" />
                        </p>
                        <p className="text-small text-white">
                          <IntlMessages id="dashboards.pending-for-print" />
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
              </Colxx>

              <Colxx lg="4" xl="12" className="mb-4">
                <Card className="progress-banner">
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-male mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                          4 <IntlMessages id="dashboards.orders" />
                        </p>
                        <p className="text-small text-white">
                          <IntlMessages id="dashboards.on-approval-process" />
                        </p>
                      </div>
                    </div>
                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={66}
                        text={"4/6"}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Colxx>

              <Colxx lg="4" xl="12" className="mb-4">
                <Card className="progress-banner">
                  <CardBody className="justify-content-between d-flex flex-row align-items-center">
                    <div>
                      <i className="iconsminds-bell mr-2 text-white align-text-bottom d-inline-block" />
                      <div>
                        <p className="lead text-white">
                          8 <IntlMessages id="dashboards.alerts" />
                        </p>
                        <p className="text-small text-white">
                          <IntlMessages id="dashboards.waiting-for-notice" />
                        </p>
                      </div>
                    </div>
                    <div className="progress-bar-circle progress-bar-banner position-relative">
                      <CircularProgressbar
                        strokeWidth={4}
                        percentage={80}
                        text={"8/10"}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </Colxx>

          <Colxx lg="6" md="6" xl="4" sm="12" className="mb-4">
            <Card className="dashboard-search">
              <CardBody>
                <CardTitle className="text-white">
                  <IntlMessages id="dashboards.advanced-search" />
                </CardTitle>
                <Form className="form-container">
                  <FormGroup>
                    <label>
                      <IntlMessages id="dashboards.toppings" />
                    </label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      name="form-field-name"
                      value={this.state.selectedOption}
                      onChange={this.handleChange}
                      options={selectData}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>
                      <IntlMessages id="dashboards.type" />
                    </label>
                    <Select
                      components={{ Input: CustomSelectInput }}
                      className="react-select"
                      classNamePrefix="react-select"
                      name="form-field-name"
                      value={this.state.selectedOptionType}
                      onChange={this.handleChangeType}
                      options={selectDataType}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>
                      <IntlMessages id="dashboards.keyword" />
                    </Label>
                    <Input type="text" placeholder={messages["dashboards.keyword"]} />
                  </FormGroup>
                  <FormGroup>
                    <CustomInput
                      type="checkbox"
                      id="exampleCustomCheckbox"
                      label="این جعبه سفارشی را بررسی کنید"
                    />
                  </FormGroup>
                  <FormGroup className="text-center">
                    <Button color="primary" className="mt-4 pl-5 pr-5">
                      <IntlMessages id="dashboards.search" />
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Colxx>

          <Colxx lg="6" xl="4" className="mb-4">
            <Row>
              <Colxx xxs="6" className="mb-4">
                <Card className="dashboard-small-chart">
                  <CardBody>
                    <SmallLineChart {...smallChartData1} />
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" className="mb-4">
                <Card className="dashboard-small-chart">
                  <CardBody>
                    <SmallLineChart {...smallChartData2} />
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" className="mb-4">
                <Card className="dashboard-small-chart">
                  <CardBody>
                    <SmallLineChart {...smallChartData3} />
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx xxs="6" className="mb-4">
                <Card className="dashboard-small-chart">
                  <CardBody>
                    <SmallLineChart {...smallChartData4} />
                  </CardBody>
                </Card>
              </Colxx>
            </Row>

            <Card className="dashboard-top-rated">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.top-rated-items" />
                </CardTitle>
                <ReactSiemaCarousel
                  perPage={{
                    0: 1,
                    480: 2,
                    992: 1
                  }}
                  controls={false}
                  loop={false}
                >
                  <div className="pr-2 pl-2">
                    <img
                      src="/assets/img/carousel-1.jpg"
                      alt="کیک پنیر"
                      className="mb-4"
                    />
                    <h6 className="mb-1">
                      <span className="mr-2">1.</span>
                      کیک پنیر
                    </h6>

                    <Rating total={5} rating={5} interactive={false} />

                    <p className="text-small text-muted mb-0 d-inline-block">
                      (48)
                    </p>
                  </div>

                  <div className="pr-2 pl-2">
                    <img
                      src="/assets/img/carousel-2.jpg"
                      alt="کیک پنیر"
                      className="mb-4"
                    />
                    <h6 className="mb-1">
                      <span className="mr-2">2.</span>
                      کیک شکلاتی
                    </h6>

                    <Rating total={5} rating={4} interactive={false} />
                    <p className="text-small text-muted mb-0  d-inline-block">
                      (24)
                    </p>
                  </div>

                  <div className="pr-2 pl-2">
                    <img
                      src="/assets/img/carousel-3.jpg"
                      alt="کیک پنیر"
                      className="mb-4"
                    />
                    <h6 className="mb-1">
                      <span className="mr-2">3.</span>
                      Cremeschnitte
                    </h6>

                    <Rating total={5} rating={4} interactive={false} />
                    <p className="text-small text-muted mb-0  d-inline-block">
                      (18)
                    </p>
                  </div>
                </ReactSiemaCarousel>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
export default DefaultDashboard;
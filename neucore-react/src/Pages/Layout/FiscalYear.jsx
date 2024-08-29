import React, { Component } from "react";
import {
  NavDropdown,
  Nav,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  FormControl,
} from "react-bootstrap";
import {
  authenticationService,
  current_financial_year,
  getBranchesByInstitute,
  getAcademicYearByBranch,
} from "@/services/api_functions";
import { Formik } from "formik";

import Select from "react-select";
import * as Yup from "yup";

import {
  getHeader,
  customStyles,
  isActionExist,
  getSelectValue,
  eventBus,
  MyNotifications,
  numberWithCommasIN,
  getValue,
} from "@/helpers";
export default class FiscalYear extends Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();

    this.state = {
      current_fiscalYr: "",
      opAcademicYearList: [],
      opbranchList: [],
      academicYearId: "",
      initVal: {
        standardId: "",
        branchId: "",
        studentType: "",
        busStopId: "",
        id: "",
      },
    };
  }

  getBranchData = (outletId, initObj = null, branchId = null) => {
    let reqData = new FormData();
    console.log("outletId", outletId);
    reqData.append(
      "outletId",
      authenticationService.currentUserValue.companyId
    );
    getBranchesByInstitute(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.branchName };
            });

            this.setState({ opbranchList: Opt }, () => {
              if (initObj != null && branchId != null) {
                initObj["branchId"] = getSelectValue(Opt, parseInt(branchId));
                this.setState({ initVal: initObj }, () => {
                  // console.log(" caste data initObj ", initObj);
                });
              } else {
                let branchId = getSelectValue(
                  Opt,
                  authenticationService.currentUserValue.branchId
                );
                // this.searchRef.current.setFieldValue("branchId", branchId);
                if (authenticationService.currentUserValue.userRole != "CADMIN") {

                  this.getAcademicYearData(branchId.value);
                }
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opbranchList: [] });
        console.log("error", error);
      });
  };
  getAcademicYearData = (branchId) => {
    let { current_fiscalYr } = this.state;
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getAcademicYearByBranch(reqData)
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.academicYear };
            });
            this.setState({ opAcademicYearList: Opt }, () => {
              console.log("Opt ", Opt);
              console.log("current_fiscalYr ", current_fiscalYr);
              let ayId = Opt.find((o) => o.value == current_fiscalYr);
              console.log("ayId", ayId);
              this.setState({ academicYearId: ayId }, () => {
                console.log("academicyearid", this.state.academicYearId);
              });
            });
            // this.state.academicYearId= Opt.find((o)=>o.value===current_fiscalYr);
          }
        }
      })
      .catch((error) => {
        this.setState({ opAcademicYearList: [] });

        console.log("error", error);
      });
  };

  componentWillMount() {
    console.log("wiil mount");
    let current_fiscalYr = localStorage.getItem("current_financial_year");
    // this.state.current_fiscalYr = current_fiscalYr;
    this.setState({ current_fiscalYr: current_fiscalYr });
  }
  componentDidMount() {
    let companyId = authenticationService.currentUserValue.companyId;
    // console.log("companyId ", companyId);
    // const { prop_data } = this.props.block;
    // console.log("in fiscalyr", localStorage.getItem("current_financial_year"));

    this.getBranchData(companyId);
  }

  handleSelection = (v) => {
    if (v != "") {
      this.setState({ academicYearId: v }, () => {
        localStorage.setItem("current_financial_year", v.value);
      });
    }
  };
  render() {
    let { opAcademicYearList, academicYearId } = this.state;
    return (
      <>
        <Nav>
          <Select
            className="selectTo formbg"
            styles={customStyles}
            isClearable={true}
            onChange={(v) => {
              this.handleSelection(v);
            }}
            name="academicYearId"
            id="academicYearId"
            options={opAcademicYearList}
            value={academicYearId}
          />
        </Nav>
      </>
    );
  }
}

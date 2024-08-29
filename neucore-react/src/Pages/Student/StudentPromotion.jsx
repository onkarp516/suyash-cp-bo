import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  FormControl,
  Modal,
  CloseButton,
} from "react-bootstrap";
import {
  authenticationService,
  getBranchesByInstitute,
  getStandardsByBranch,
  getDivisionsByStandard,
  getAcademicYearByBranch,
  createStudentPromotion,
  getStudentListforStudentPromotion,
} from "@/services/api_functions";

import Select from "react-select";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import {
  EMAILREGEXP,
  numericRegExp,
  urlRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  MyDatePicker,
  isActionExist,
  customStyles,
  getSelectValue,
  eventBus,
  MyNotifications,
} from "@/helpers";
import moment from "moment";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh_iconblack from "@/assets/images/3x/refresh_iconblack.png";
import arrowicon from "@/assets/images/3x/arrowicon.png";
import cancel_icon from "@/assets/images/3x/cancel_icon.png";
import reset from "@/assets/images/reset.png";
import excel from "@/assets/images/3x/excel.png";
import print from "@/assets/images/3x/print.png";
import edit from "@/assets/images/3x/edit.png";
import save from "@/assets/images/3x/save.png";
import cancel from "@/assets/images/3x/cancel.png";
import upgrade from "@/assets/images/3x/upgrade.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const CustomClearText = () => "clear all";
const ClearIndicator = (props) => {
  const {
    children = <CustomClearText />,
    getStyles,
    innerProps: { ref, ...restInnerProps },
  } = props;

  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles("clearIndicator", props)}
    >
      <div style={{ padding: "0px 5px" }}>{children}</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: "pointer",
  color: state.isFocused ? "blue" : "black",
});

const Currencyopt = [{ label: "INR", value: "INR" }];

export default class StudentPromotion extends React.Component {
  constructor() {
    super();
    this.SpromotionRef = React.createRef();
    this.state = {
      show: false,
      rightoffmodal: false,
      toggle: false,
      opendiv: false,
      promotionType: "",
      opInstituteList: [],
      selectedStudent: [],
      selectedStudentPromotion: [],
      opBranchList: [],
      opAcademicYearList: [],
      opStandardList: [],
      opDivisionId: [],
      opStudentList: [],
      data: [],
      stateOpt: [],
      countryOpt: [],
      studentOpt: [],
      rightoffInitVal:
      {
        rightOffBranchId: "",
        rightOffStudentName: "",
        rightOffNote: "",
        rightOffAmt: "",
        rightOffAcademicYear: "",
        rightOffStandard: "",
        rightOffAcademicYearId: "",
        rightOffStandardId: "",
      },

      modalInitval: {
        macademicYearId: "",
        mstandardId: "",
        mdivisionId: "",
        mstudentType: "",
        doa: "",
        branchId: "",
      },
      GSTopt: [],
      initVal: {
        id: "",
        instituteId: "",
        transactionDate: new Date(),
        branchId: "",
        academicYearId: "",

        standardId: "",
        divisionId: "",
        studentId: "",

        studentType: "",
        isFeeClear: "",
      },
      studentTypeOptions: [
        { label: "Day School", value: 1 },
        { label: "Residential", value: 2 },
      ],
      studentOutstandingOption: [
        { label: "Clear", value: 1 },
        { label: "Not Clear", value: 0 },
      ],
    };
  }

  handleShow = (value, operation = "") => {
    console.log("value", value);
    console.log("operation", operation);

    let { opAcademicYearList, opBranchList, opStandardList, opDivisionList } = this.state;
    let { isFeeClear } = this.state.initVal;
    let acId = "";
    let finalstdId = {};
    let kidStd = "";
    console.log("isFeeclear", isFeeClear);
    let branchId = getSelectValue(
      opBranchList,
      authenticationService.currentUserValue.branchId
    );
    if (isFeeClear.value == 1) {
      console.log("multiple student value", value[0]["nextAcademicYearId"]);
      acId = value[0]["nextAcademicYearId"];
    }
    else {
      acId = value.nextAcademicYearId;

    }
    console.log("acId", acId);
    let modalInitval = {};
    if (isFeeClear.value == 1) {

      kidStd = value[0]["standardName"];
    }
    else {
      kidStd = value.standardName;
    }

    console.log("check condition", kidStd != "LKG");
    if (kidStd == "LKG") {

      //  set promoting standard
      let stdId = "UKG";
      finalstdId = opStandardList.find((o) => {
        console.log("os", o.label, stdId);

        return o.label == stdId;
      });
      console.log("final standard", finalstdId);

      // set promoting divison

      // set promoting AcademicYear
      let finalacId = getSelectValue(opAcademicYearList, parseInt(acId));
      console.log("finalacId", finalacId);



      // set promoting year Admission date

      let doadmission = "";
      if (isFeeClear.value == 1) {
        doadmission = moment(new Date(value[0]["start_date_of_admission"])).toDate();
      }
      else {
        doadmission = moment(new Date(value.start_date_of_admission)).toDate();
      }
      modalInitval = {
        branchId: branchId,
        macademicYearId: finalacId,
        mstandardId: finalstdId,
        mdivisionId: "",
        mstudentType: "",
        doa: doadmission,
      };
    } else if (kidStd == "UKG") {
      let stdId = 1;
      finalstdId = opStandardList.find((o) => {
        console.log("os", o.label, stdId);

        return o.label == stdId;
      });
      console.log("final standard", finalstdId);

      // set promoting divison

      // set promoting AcademicYear
      let finalacId = getSelectValue(opAcademicYearList, parseInt(acId));
      console.log("finalacId", finalacId);
      let branchId = getSelectValue(
        opBranchList,
        authenticationService.currentUserValue.branchId
      );


      // set promoting year Admission date

      let doadmission = "";
      if (isFeeClear.value == 1) {
        doadmission = moment(new Date(value[0]["start_date_of_admission"])).toDate();
      }
      else {
        doadmission = moment(new Date(value.start_date_of_admission)).toDate();
      }
      modalInitval = {
        branchId: branchId,
        macademicYearId: finalacId,
        mstandardId: finalstdId,
        mdivisionId: "",
        mstudentType: "",
        doa: doadmission,
      };


    }
    else {
      let stdId = "";
      if (isFeeClear.value == 1) {

        stdId = 1 + parseInt(value[0]["standardName"]);
      }
      else {
        console.log("value.std", value.standardName);
        stdId = 1 + parseInt(value.standardName);
      }
      finalstdId = opStandardList.find((o) => {
        console.log("os", o.label, stdId);

        return o.label == stdId;
      });
      console.log("final standard", finalstdId);

      // set promoting divison

      // set promoting AcademicYear
      let finalacId = getSelectValue(opAcademicYearList, parseInt(acId));
      console.log("finalacId", finalacId);



      // set promoting year Admission date

      let doadmission = "";
      if (isFeeClear.value == 1) {
        doadmission = moment(new Date(value[0]["start_date_of_admission"])).toDate();
      }
      else {
        doadmission = moment(new Date(value.start_date_of_admission)).toDate();
      }
      modalInitval = {
        branchId: branchId,
        macademicYearId: finalacId,
        mstandardId: finalstdId,
        mdivisionId: "",
        mstudentType: "",
        doa: doadmission,
      };

    }
    console.log("check window:", operation == "exceptionpromotion");
    if (operation == "exceptionpromotion" || operation == "normalpromotion") {
      this.setState({ modalInitval: modalInitval, promotionType: operation }, () => {
        this.setState({ show: true }, () => {
          if (isFeeClear.value == 1) {

          } else {
            let { selectedStudent } = this.state;
            selectedStudent.push(value.id)
            console.log("selectedStudent >>>>>>>>>>>> ", selectedStudent)
            this.setState({ selectedStudent: selectedStudent });
          }
          console.log("selectedStudent", this.state.selectedStudent);
          this.getDivisionData(finalstdId.value, modalInitval);

        });
      });
    } else {
      let rightoffInitval =
      {
        rightOffBranchId: branchId,
        rightOffStudentName: value.firstName + " " + value.lastName,
        rightOffNote: "",
        rightOffAmt: value.pendingfees,
        rightOffAcademicYear: value.academicYear,

        rightOffStandard: value.standardName,
      }
      let { selectedStudent } = this.state;
      selectedStudent.push(value.id);
      this.setState({ rightoffInitVal: rightoffInitval, selectedStudent: selectedStudent, promotionType: "rightoff" }, () => {
        this.setState({ rightoffmodal: true });
      })

    }
    // this.SpromotionRef.current.setFieldValue("macademicYearId", finalacId);
  };
  handleClose = () => {
    this.setState({ show: false }, () => {
      this.setState({ selectedStudent: [] });

    }
    );
  };

  handleRightoffClose = () => {
    this.setState({ rightoffmodal: false }, () => {
      this.setState({ selectedStudent: [] });


    });
  };

  getBranchData = () => {
    let requestData = new FormData();
    requestData.append(
      "outletId",
      authenticationService.currentUserValue.companyId
    );
    getBranchesByInstitute(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;

          let Opt = d.map(function (values) {
            return { value: values.id, label: values.branchName };
          });
          this.setState({ opBranchList: Opt }, () => {
            let branchId = getSelectValue(
              Opt,
              authenticationService.currentUserValue.branchId
            );
            this.SpromotionRef.current.setFieldValue("branchId", branchId);
            this.getAcademicYearData(branchId.value);
            this.getStandardData(branchId.value);
          });
        }
      })
      .catch((error) => {
        this.setState({ opBranchList: [] });
        console.log("error", error);
      });
  };

  getStandardData = (id) => {
    let requestData = new FormData();
    requestData.append("branchId", id);
    getStandardsByBranch(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.standardName };
            });
            this.setState({ opStandardList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opStandardList: [] });
        console.log("error", error);
      });
  };

  getDivisionData = (id, modalinit = "") => {
    let requestData = new FormData();
    requestData.append("standardId", id);
    getDivisionsByStandard(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return { value: values.id, label: values.divName, standardId: values.standardId };
            });
            this.setState({ opDivisionList: Opt }, () => {
              if (modalinit != "" && modalinit != null) {
                modalinit["mdivisionId"] = Opt[0]
                this.setState({ modalInitval: modalinit });
              }
            });
          }
        }
      })
      .catch((error) => {
        this.setState({ opDivisionList: [] });
        console.log("error", error);
      });
  };

  getAcademicYearData = (branchId) => {
    let reqData = new FormData();
    reqData.append("branchId", branchId);
    getAcademicYearByBranch(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let d = res.responseObject;
          // if (d.length > 0)
          {
            let Opt = d.map(function (values) {
              return {
                value: values.id,
                label: values.academicYear,
                start_date: values.start_date,
              };
            });
            this.setState({ opAcademicYearList: Opt });
          }
        }
      })
      .catch((error) => {
        this.setState({ opAcademicYearList: [] });
        console.log("error", error);
      });
  };

  createStudentPromotionData = (values, selectedStudentPromotion) => {
    let { selectedStudent } = this.state;
    console.log("this.state.initval", {
      values,
      selectedStudentPromotion,
      selectedStudent,
    });

    if (selectedStudent.length > 0) {
      let requestData = new FormData();

      if (this.state.promotionType == "rightoff") {
        requestData.append("rightOffAmt", values.rightOffAmt);
        requestData.append("rightOffAcademicYear", values.rightOffAcademicYear);
        requestData.append("rightOffStandard", values.rightOffStandard);
        requestData.append("rightOffBranchId", values.rightOffBranchId.value);
        requestData.append("rightOffNote", values.rightOffNote);

      }
      requestData.append("promotionType", this.state.promotionType);
      requestData.append(
        "branchId",
        authenticationService.currentUserValue.branchId
      );
      requestData.append(
        "academicYearId",
        values.macademicYearId != "" && values.macademicYearId != null
          ? values.macademicYearId.value
          : 0
      );
      requestData.append(
        "standardId",
        values.mstandardId != "" && values.mstandardId != null
          ? values.mstandardId.value
          : 0
      );
      requestData.append(
        "divisionId",
        values.mdivisionId != "" && values.mdivisionId != null
          ? values.mdivisionId.value
          : 0
      );
      if (values.doa != null && values.doa != undefined) {
        requestData.append("doa", moment(values.doa).format("yyyy-MM-DD"));
      }

      requestData.append(
        "studentlist",
        selectedStudent.toString()
        // JSON.stringify(selectedStudent)
      );
      requestData.append(
        "studentType",
        values.mstudentType != "" && values.mstudentType != null
          ? values.mstudentType.value
          : 0
      );
      console.log("requestData", requestData);

      createStudentPromotion(requestData).then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: response.message,
            is_timeout: true,
            delay: 1000,
          });
          eventBus.dispatch("page_change", "studentpromotion");
          this.pageReload();
          this.handleClose();
          this.handleRightoffClose();
          this.setInitValues();
        }
      });
    }
  };

  getStudentDataforStudentPromotion = () => {
    let { branchId, academicYearId, standardId, divisionId, studentType, isFeeClear } =
      this.state.initVal;
    let requestData = new FormData();
    requestData.append("branchId", branchId.value);
    requestData.append("academicYearId", academicYearId.value);
    requestData.append("standardId", standardId.value);
    requestData.append("divisionId", divisionId.value);
    requestData.append("studentType", studentType.value);
    requestData.append("isFeeClear", isFeeClear.value);


    getStudentListforStudentPromotion(requestData).then((response) => {
      let res = response.data;
      console.log("res", res);
      let d = res.responseObject;
      if (res.responseStatus == 200) {
        // console.log("opt", d);
        let s_std = [];
        d.map(function (values) {
          if (values.pendingfees == 0) {


            if (!s_std.includes(values.id)) {
              s_std = [...s_std, values.id];
            }
          }
        });

        this.setState({ selectedStudent: s_std, studentOpt: d });
        if (this.state.studentOpt.length > 0) {
          console.log(this.state.studentOpt);
        }
      }
    });
  };

  setInitValues = () => {
    let { opBranchList } = this.state;

    this.setState({
      toggle: false,
      opendiv: false,
      modalInitval: {
        macademicYearId: "",
        mstandardId: "",
        mdivisionId: "",
        mstudentType: "",
        doa: "",
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
      },
      rightoffInitVal:
      {
        rightOffBranchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        rightOffStudentName: "",
        rightOffNote: "",
        rightOffAmt: 0,
        rightOffAcademicYear: "",
        rightOffStandard: "",
        rightOffAcademicYearId: "",
        rightOffStandardId: "",
      },
      initVal: {
        branchId: getSelectValue(
          opBranchList,
          authenticationService.currentUserValue.branchId
        ),
        id: "",
        instituteId: "",
        transactionDate: new Date(),

        academicYearId: "",

        standardId: "",
        divisionId: "",
        studentId: "",

        studentType: "",
        isFeeClear: "",
      },
      selectedStudent: [],
      studentOpt: [],
      selectedStudentPromotion: [],
      opStudentList: [],
    });
  };

  addSelectionStudent = (id, status) => {
    let { selectedStudent, studentOpt } = this.state;
    let f_selectedStudents = selectedStudent;
    let f_students = studentOpt;
    if (status == true) {
      if (selectedStudent.length > 0) {
        if (!selectedStudent.includes(id)) {
          f_selectedStudents = [...f_selectedStudents, id];
        }
      } else {
        f_selectedStudents = [...f_selectedStudents, id];
      }
    } else {
      f_selectedStudents = f_selectedStudents.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked:
        f_students.length == f_selectedStudents.length ? true : false,
      selectedStudent: f_selectedStudents,
      studentOpt: f_students,
    });
  };

  allselection = (status = false) => {
    let { studentOpt, selectedStudent } = this.state;
    let s_std = selectedStudent;
    if (status === true) {
      studentOpt.map(function (values) {
        if (!s_std.includes(values.id)) {
          s_std = [...s_std, values.id];
        }
      });

      this.setState({ selectedStudent: s_std });
    } else {
      this.setState({ selectedStudent: [] });
    }
  }

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getBranchData();
    }
  }

  pageReload = () => {
    this.componentDidMount();
    console.log("page refreshed");
  };



  render() {
    let {
      data,
      opStudentList,
      studentOpt,
      rightoffmodal,
      opendiv,
      opAcademicYearList,
      opstandList,
      studentTypeOptions,
      studentOutstandingOption,
      studentOutstanding,
      opBranchList,
      opStandardList,
      opDivisionList,
      initVal,
      toggle,
      selectedStudent,
      selectedStudentPromotion,
      show,
      rightoffInitVal,
      modalInitval,
    } = this.state;

    return (
      <div className="">
        <Form in={opendiv}>
          <div id="example-collapse-text" className="common-form-style mt-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Student Promotion</h4>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                innerRef={this.SpromotionRef}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  academicYearId: Yup.object().required(
                    "Academic Year  is required"
                  ),
                  standardId: Yup.object().required("Standard is required"),
                  divisionId: Yup.object().required("Division is required"),
                  studentType: Yup.object().required("studentType is required"),
                  isFeeClear: Yup.object().required("Student outstanding is required"),

                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
                  // });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,

                  setFieldValue,
                }) => (
                  <Form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="form-style"
                  >
                    <div
                      id="example-collapse-text"
                      className="common-form-style mt-2 p-2"
                    >
                      <div className=" mb-2 m-0">
                        <div className="common-form-style m-0 mb-2">
                          {/* {JSON.stringify(values)} */}
                          <Row className="">
                            <Col md="12" className="mb-2">
                              <Row className="row-inside">
                                <Col lg="2" md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Branch</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      isDisabled={true}
                                      onChange={(v) => {
                                        setFieldValue("branchId", "");

                                        setFieldValue("standardId", "");
                                        setFieldValue("academicYearId", "");
                                        setFieldValue("divisionId", "");
                                        if (v != null) {
                                          setFieldValue("branchId", v);

                                          this.getStandardData(v.value);
                                          this.getAcademicYearData(v.value);
                                        } else {
                                          this.setState({
                                            opStandardList: [],
                                            opAcademicYearList: [],
                                          });
                                        }
                                      }}
                                      name="branchId"
                                      options={opBranchList}
                                      value={values.branchId}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg="2" md="2">
                                  <Form.Group>
                                    <Form.Label>Year</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      onChange={(v) => {
                                        setFieldValue("academicYearId", v);
                                      }}
                                      name="academicYearId"
                                      options={opAcademicYearList}
                                      value={values.academicYearId}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.academicYearId}
                                    </span>
                                  </Form.Group>
                                </Col>
                                <Col lg="2" md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Standard</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      onChange={(v) => {
                                        setFieldValue("standardId", "");
                                        setFieldValue("divisionId", "");
                                        if (v != null) {
                                          setFieldValue("standardId", v);
                                          this.getDivisionData(v.value);
                                        } else {
                                          this.setState({
                                            opDivisionList: [],
                                          });
                                        }
                                      }}
                                      name="standardId"
                                      options={opStandardList}
                                      value={values.standardId}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col lg="2" md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Division</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      name="divisionId"
                                      options={opDivisionList}
                                      value={values.divisionId}
                                      onChange={(v) => {
                                        setFieldValue("divisionId", "");
                                        if (v != null) {
                                          setFieldValue("divisionId", v);
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>{" "}
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Student Type</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      name="studentType"
                                      options={studentTypeOptions}
                                      value={values.studentType}
                                      id="studentType"
                                      onChange={(v) => {
                                        setFieldValue("studentType", "");
                                        if (v != null) {
                                          setFieldValue("studentType", v);
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md="2">
                                  <Form.Group className="createnew">
                                    <Form.Label>Student Outstanding</Form.Label>
                                    <Select
                                      className="selectTo"
                                      styles={customStyles}
                                      isClearable={true}
                                      name="isFeeClear"
                                      options={studentOutstandingOption}
                                      value={values.isFeeClear}
                                      id="isFeeClear"
                                      onChange={(v) => {
                                        setFieldValue("isFeeClear", "");
                                        if (v != null) {
                                          setFieldValue("isFeeClear", v);
                                        }
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="8"></Col>
                                <Col
                                  lg="4"
                                  md="2"
                                  xs={12}
                                  className="add-btn-style text-end"
                                >
                                  <Button
                                    type="button"
                                    className="submitbtn me-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({ initVal: values }, () => {
                                        this.getStudentDataforStudentPromotion();
                                      });
                                    }}
                                  >
                                    Submit
                                    <img
                                      src={arrowicon}
                                      className="btnico ms-1"
                                    ></img>
                                  </Button>

                                  <Button
                                    type="button"
                                    className="cancelbtn submitbtn me-2"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // this.SpromotionRef.current.resetForm();
                                      this.setInitValues();
                                    }}
                                  >
                                    Reset
                                    <img
                                      src={reset}
                                      className="btnico ms-1"
                                    ></img>
                                  </Button>

                                  <Button
                                    type="button"
                                    className="cancelbtn submitbtn"
                                    variant="secondary"
                                    onClick={(e) => {
                                      console.log("hello");
                                      e.preventDefault();
                                      eventBus.dispatch("page_change", {
                                        from: "studentpromotion",
                                        to: "studentpromotionlist",
                                        isNewTab: false,
                                      });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          {/* {JSON.stringify(opStudentList)} */}
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Form>
        <div className="wrapper_div heightdiv mb-0">
          <div className="cust_table p-2">
            <div
              className="table_wrapper denomination-style"
              style={{ height: "60vh", overflow: "auto", overflowX: "hidden" }}
            >
              <Table hover size="sm" className="tbl-font">
                <thead>
                  <tr>
                    {initVal["isFeeClear"]["value"] == 1 ? (

                      <>
                        <th className="tableno">Select</th>
                      </>
                    ) : ""}
                    <th>#.</th>
                    <th>Acdemic Year</th>
                    <th>Student Name</th>
                    <th>Standard</th>
                    <th>Student Type</th>
                    <th>Gender</th>
                    <th>Mobile No</th>
                    <th>Date of Admission</th>
                    {initVal["isFeeClear"]["value"] == 0 ?
                      (
                        <>
                          <th>Pending Fee</th>

                          <th>Exception Promote</th>
                          <th>Write Off</th>
                        </>
                      ) : ""
                    }
                  </tr>
                  <tr>
                    {initVal["isFeeClear"]["value"] == 1 ? (

                      <td>
                        <div key={`inline-checkbox`}>
                          <Form.Check
                            inline
                            name="checked"
                            // id={`checked_` + key}
                            type="checkbox"

                            onChange={(e) => {
                              console.log("selectedStudent", selectedStudent);
                              this.allselection(
                                e.target.checked
                              );
                            }}
                            checked={

                              selectedStudent.length > 0 && selectedStudent.length === studentOpt.length ? true : false
                            }
                          />
                        </div>
                      </td>
                    ) : ""}

                  </tr>
                </thead>
                <tbody className="tabletrcursor">
                  {studentOpt.length > 0 ? (
                    studentOpt.map((value, key) => {

                      return (
                        <tr
                          onDoubleClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {initVal["isFeeClear"]["value"] == 1 ? (
                            <td>
                              <div key={`inline-checkbox`}>
                                <Form.Check
                                  inline
                                  name="checked"
                                  id={`checked_` + key}
                                  type="checkbox"
                                  checked={
                                    selectedStudent.includes(value.id) == true
                                      ? true
                                      : false
                                  }
                                  value={value.checked}
                                  onChange={(e) => {

                                    if (value.pendingfees == 0) {
                                      this.addSelectionStudent(
                                        value.id,
                                        e.target.checked
                                      );
                                    }
                                    else {


                                      MyNotifications.fire(
                                        {
                                          show: true,
                                          is_button_show: true,
                                          icon: "warning",
                                          title: "Warning",
                                          msg: `${value.firstName} ${value.lastName} has pending fee of ₹ ${value.pendingfees}.00`,
                                          is_timeout: false,
                                        }
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </td>
                          ) : ""}
                          <td>{key + 1}</td>
                          <td>{value.academicYear}</td>
                          <td>{value.firstName + " " + value.lastName}</td>
                          <td>{value.standardName}</td>
                          <td>{value.studentType}</td>
                          <td>{value.gender}</td>
                          <td>{value.mobileNo}</td>
                          <td>
                            {moment(value.dateOfAdmission).format("DD-MM-yyyy")}
                          </td>
                          {
                            initVal["isFeeClear"]["value"] == 0 ? (
                              <>
                                <td>{value.pendingfees}</td>
                                <td style={{ width: '10%', textAlign: 'center' }}> <Button onClick={() => {
                                  let operation = "exceptionpromotion";

                                  if (value.standardName != "12") {

                                    this.handleShow(value, operation);
                                  } else {
                                    MyNotifications.fire(
                                      {
                                        show: true,
                                        is_button_show: true,
                                        icon: "warning",
                                        title: "Warning",
                                        msg: `Student can't be promoted of 12th Standard`,
                                        is_timeout: false,
                                      }
                                    );
                                  }
                                }}>Promote</Button></td>
                                <td className="text-center"> <Button variant="danger" onClick={() => {
                                  let operation = "rightoff";
                                  this.handleShow(value, operation);
                                }}>Write Off</Button></td>
                              </>
                            ) : ""
                          }
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <div className="p-2 text-center fourbtnfeestrans ">
          {
            initVal["isFeeClear"]["value"] == 1 ? (


              <Button
                type="submit"
                className="submitbtn formbtn affiliated"
                // onClick={() => this.handleShow()}
                onClick={() => {
                  if (studentOpt[0]["standardName"] != 12) {

                    this.handleShow(studentOpt, "normalpromotion")
                  }
                  MyNotifications.fire(
                    {
                      show: true,
                      is_button_show: true,
                      icon: "warning",
                      title: "Warning",
                      msg: `Student can't be promoted of 12th Standard`,
                      is_timeout: false,
                    }
                  );


                }

                }
              >
                Promote Student
                <img src={upgrade} alt="" className="btsubmit "></img>
              </Button>
            ) : ""}

          <Button
            type="submit"
            className="submitbtn cancelbtn formbtn affiliated"
            variant="secondary"
          >
            Cancel
            <img src={cancel} alt="" className="btsubmit "></img>
          </Button>
        </div>
        {/* <div className="wrapper_div heightdiv">
          {/* <h6>Group</h6> */}

        {/*<div className="cust_table p-2">
            <div
              className="table_wrapper denomination-style"
              style={{ height: "45vh", overflow: "auto", overflowX: "hidden" }}
            ></div> */}
        {/* <div className="p-2 text-center fourbtnfeestrans">
              <Button
                type="submit"
                className="submitbtn formbtn affiliated"
                onClick={() => {
                  this.CheckedStudent();
                  this.handleShow();
                }}
              >
                Promote Student
                <img src={upgrade} alt="" className="btsubmit "></img>
              </Button>

              <Button
                type="submit"
                className="submitbtn formbtn affiliated"
                onClick={() => {
                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
                  // });
                }}
              >
                Cancel
                <img src={cancel} alt="" className="btsubmit "></img>
              </Button>
            </div> */}
        {/* )} */}
        <>
          <Modal
            show={show}
            // {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="form-header pt-0 pb-0">
              <h6 className="pt-2">Promote Student</h6>
              <CloseButton
                variant="black"
                className="pull-right closemodal icons"
                onClick={this.handleClose}
              />
            </Modal.Header>
            <Modal.Body>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                innerRef={this.SpromotionRef}
                enableReinitialize={true}
                initialValues={modalInitval}
                validationSchema={Yup.object().shape({
                  macademicYearId: Yup.object().required(
                    "Academic Year  is required"
                  ),
                  mstandardId: Yup.object().required("Standard is required"),
                  mdivisionId: Yup.object().required("Division is required"),
                  mstudentType: Yup.object().required(
                    "studentType is required"
                  ),
                  doa: Yup.string().required("Admission Date is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);

                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
                  // });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,

                  setFieldValue,
                }) => (
                  <Form autoComplete="off">
                    {/* {JSON.stringify(errors)} */}
                    <div className="common-form-style m-0 mb-2">
                      <Row className="">
                        <Col md="12" className="mb-2">
                          <Row className="row-inside">
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Branch</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  isDisabled={true}
                                  onChange={(v) => {
                                    setFieldValue("branchId", "");

                                    setFieldValue("mstandardId", "");
                                    setFieldValue("macademicYearId", "");
                                    setFieldValue("mdivisionId", "");
                                    if (v != null) {
                                      setFieldValue("branchId", v);

                                      this.getStandardData(v.value);
                                      this.getAcademicYearData(v.value);
                                    } else {
                                      this.setState({
                                        opStandardList: [],
                                        opAcademicYearList: [],
                                      });
                                    }
                                  }}
                                  name="branchId"
                                  options={opBranchList}
                                  value={values.branchId}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Admission Date</Form.Label>
                                <MyDatePicker
                                  className="datepic form-control"
                                  styles={customStyles}
                                  name="doa"
                                  placeholderText="dd/MM/yyyy"
                                  id="doa"
                                  dateFormat="dd/MM/yyyy"
                                  value={values.doa}
                                  onChange={(date) => {
                                    setFieldValue("doa", date);
                                    // getAge(date, setFieldValue);
                                  }}
                                  selected={values.doa}
                                  maxDate={new Date()}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Year</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  id="macademicYearId"
                                  onChange={(v) => {
                                    setFieldValue("macademicYearId", v);
                                  }}
                                  // isDisabled={true}

                                  name="macademicYearId"
                                  options={opAcademicYearList}
                                  value={values.macademicYearId}
                                />
                                <span className="text-danger errormsg">
                                  {errors.macademicYearId}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Standard</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  id="mstandardId1"
                                  isClearable={true}
                                  isDisabled={true}

                                  onChange={(v) => {
                                    setFieldValue("mstandardId", "");
                                    setFieldValue("mdivisionId", "");
                                    if (v != null) {
                                      setFieldValue("mstandardId", v);
                                      this.getDivisionData(v.value);
                                    } else {
                                      this.setState({
                                        opDivisionList: [],
                                      });
                                    }
                                  }}
                                  name="mstandardId"
                                  options={opStandardList}
                                  value={values.mstandardId}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Division</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  name="mdivisionId"
                                  id="mdivisionId1"
                                  isDisabled={true}

                                  options={opDivisionList}
                                  value={values.mdivisionId}
                                  onChange={(v) => {
                                    setFieldValue("mdivisionId", "");
                                    if (v != null) {
                                      setFieldValue("mdivisionId", v);
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>{" "}
                            <Col md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Student Type</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  name="mstudentType"
                                  options={studentTypeOptions}
                                  value={values.mstudentType}
                                  id="mstudentType"
                                  onChange={(v) => {
                                    setFieldValue("mstudentType", "");
                                    if (v != null) {
                                      setFieldValue("mstudentType", v);
                                    }
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <Col
                              lg="4"
                              md="2"
                              xs={12}
                              className="add-btn-style mt-4"
                            ></Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* <h5>Formation</h5> */}
                      <Row className="">
                        <Col md="12" className="btn_align ">
                          <Button
                            className="submitbtn me-2"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              this.createStudentPromotionData(
                                values,
                                selectedStudentPromotion
                              );
                            }}

                          // onClick={() => this.handleClose()}
                          // // disabled={isSubmitting}
                          >
                            Submit
                            <img src={arrowicon} className="btnico ms-1"></img>
                          </Button>
                          <Button
                            className="cancelbtn submitbtn"
                            variant="secondary"
                            onClick={() => this.handleClose()}
                          >
                            Cancel
                            <img
                              src={cancel_icon}
                              className="ms-1 btnico"
                              style={{ height: "14px" }}
                            ></img>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </>
        <>
          <Modal
            show={rightoffmodal}
            // {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="form-header pt-0 pb-0">
              <h6 className="pt-2">Write Off Student</h6>
              <CloseButton
                variant="black"
                className="pull-right closemodal icons"
                onClick={this.handleRightoffClose}
              />
            </Modal.Header>
            <Modal.Body>
              <Formik
                validateOnChange={false}
                // validateOnBlur={false}
                innerRef={this.SpromotionRef}
                enableReinitialize={true}
                initialValues={rightoffInitVal}
                validationSchema={Yup.object().shape({

                  rightOffNote: Yup.string().required("Admission Date is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);

                  // this.setState({ initVal: values }, () => {
                  //   this.getStudentDataforStudentPromotion();
                  //   console.log("studentdata called");
                  // });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  resetForm,

                  setFieldValue,
                }) => (
                  <Form autoComplete="off">
                    {/* {JSON.stringify(errors)} */}
                    <div className="common-form-style m-0 mb-2">
                      <Row className="">
                        <Col md="12" className="mb-2">
                          <Row className="row-inside">
                            <Col lg="2" md="2">
                              <Form.Group className="createnew">
                                <Form.Label>Branch</Form.Label>
                                <Select
                                  className="selectTo"
                                  styles={customStyles}
                                  isClearable={true}
                                  isDisabled={true}
                                  onChange={(v) => {
                                    setFieldValue("rightOffBranchId", "");
                                    if (v != null) {
                                      setFieldValue("rightOffBranchId", v);

                                      this.getStandardData(v.value);
                                      this.getAcademicYearData(v.value);
                                    } else {
                                      this.setState({
                                        opStandardList: [],
                                        opAcademicYearList: [],
                                      });
                                    }
                                  }}
                                  name="rightOffBranchId"
                                  options={opBranchList}
                                  value={values.rightOffBranchId}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Student Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="rightOffStudentName"
                                  id="rightOffStudentName"
                                  className="formbg"
                                  value={values.rightOffStudentName}
                                  onChange={handleChange}


                                  isValid={touched.rightOffStudentName && !errors.rightOffStudentName}
                                  isInvalid={!!errors.rightOffStudentName}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Academic Year</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="rightOffAcademicYear"
                                  isDisabled={true}
                                  id="rightOffAcademicYear"
                                  className="formbg"
                                  value={values.rightOffAcademicYear}
                                  onChange={handleChange}


                                  isValid={touched.rightOffAcademicYear && !errors.rightOffAcademicYear}
                                  isInvalid={!!errors.rightOffAcademicYear}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Standard</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="rightOffStandard"
                                  id="rightOffStandard"
                                  isDisabled={true}

                                  className="formbg"
                                  value={values.rightOffStandard}
                                  onChange={handleChange}


                                  isValid={touched.rightOffStandard && !errors.rightOffStandard}
                                  isInvalid={!!errors.rightOffStandard}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg="2" md="2">
                              <Form.Group>
                                <Form.Label>Pending Fee</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="rightOffAmt"
                                  isDisabled={true}

                                  id="rightOffAmt"
                                  className="formbg"
                                  value={values.rightOffAmt}
                                  onChange={handleChange}


                                  isValid={touched.rightOffAmt && !errors.rightOffAmt}
                                  isInvalid={!!errors.rightOffAmt}
                                />
                              </Form.Group>
                            </Col>
                            {/* <Col
                              lg="4"
                              md="2"
                              xs={12}
                              className="add-btn-style mt-4"
                            ></Col> */}
                          </Row>
                          <Row className="row-inside">
                            <Col>
                              <Form.Group>
                                <Form.Label>Termination Reason</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="rightOffNote"
                                  id="rightOffNote"
                                  className="formbg"
                                  value={values.rightOffNote}
                                  onChange={handleChange}


                                  isValid={touched.rightOffNote && !errors.rightOffNote}
                                  isInvalid={!!errors.rightOffNote}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      {/* <h5>Formation</h5> */}
                      <Row className="">
                        <Col md="12" className="btn_align ">
                          <Button
                            className="submitbtn me-2"
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault();
                              this.createStudentPromotionData(
                                values,
                                selectedStudentPromotion
                              );
                            }}

                          // onClick={() => this.handleClose()}
                          // // disabled={isSubmitting}
                          >
                            Submit
                            <img src={arrowicon} className="btnico ms-1"></img>
                          </Button>
                          <Button
                            className="cancelbtn submitbtn"
                            variant="secondary"
                            onClick={() => this.handleRightoffClose()}
                          >
                            Cancel
                            <img
                              src={cancel_icon}
                              className="ms-1 btnico"
                              style={{ height: "14px" }}
                            ></img>
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </>

      </div >
      //{" "}
    );
  }
}

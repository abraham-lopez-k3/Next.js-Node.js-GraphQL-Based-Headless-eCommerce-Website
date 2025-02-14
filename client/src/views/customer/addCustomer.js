import React, { Fragment, useState, useEffect } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { customerAddAction } from "../../store/action/";
import MuiPhoneNumber from "material-ui-phone-number";
import "../../App.css"
import viewStyles from "../viewStyles.js";
import {
  Loading,
  TextInput,
  PasswordInput,
  TopBar,
  Alert,
  CardBlocks,
} from "../components";
import { client_app_route_url } from "../../utils/helper";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "../../theme/index";
import { validate, validatePhone } from "../components/validate";
import { isEmpty } from "../../utils/helper";
import { ALERT_SUCCESS } from "../../store/reducers/alertReducer";
import { useNavigate } from "react-router-dom";
import PhoneNumber from "../components/phoneNumberValidation";
var customerObj = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  company: "",
  phone: "",
};

const AddCustomerComponent = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = viewStyles();
  const dispatch = useDispatch();
  const Customers = useSelector((state) => state.customers);
  const [customer, setcustomer] = useState(customerObj);
  const navigate = useNavigate()

  useEffect(() => {
    document.forms[0].reset();
    setcustomer(customerObj);
  }, [Customers.customers]);

  const addCustomer = (e) => {
    e.preventDefault();



    let errors = validate(['company', "password", "email", "lastName", "firstName"], customer);
    let phoneError = validatePhone(["phone"], customer)

    if (!isEmpty(errors)) {
      dispatch({
        type: ALERT_SUCCESS,
        payload: {
          boolean: false,
          message: errors,
          error: true,
        },
      });
    }
    else if (!isEmpty(phoneError)) {
      dispatch({
        type: ALERT_SUCCESS,
        payload: {
          boolean: false,
          message: phoneError,
          error: true,
        },
      });
    }
    else {

      dispatch(customerAddAction(customer, navigate));
    }
  };

  const handleChange = (e) => {
    setcustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleOnChange = (value, name) => {
    setcustomer({ ...customer, [name]: value });
  }

  const toInputLowercase = e => {
    e.target.value = ("" + e.target.value).toLowerCase();
  };

  return (
    <>
      <Alert />
      {Customers.loading && <Loading />}
      <form>
        <TopBar
          title="Add Customer"
          onSubmit={addCustomer}
          submitTitle="Add"
          backLink={`${client_app_route_url}all-customer`}
        />
        <Grid
          container
          spacing={isSmall ? 2 : 4}
          className={classes.secondmainrow}
        >
          <Grid item lg={12}>
            <CardBlocks title="Add Customer" nomargin>
              <Grid container spacing={4}>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.firstName}
                    label="First Name"
                    name="firstName"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.lastName}
                    label="Last Name"
                    name="lastName"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.email}
                    type="email"
                    label="Email"
                    name="email"
                    onInputChange={handleChange}
                    onInput={toInputLowercase}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <PasswordInput
                    name="password"
                    value={customer.password}
                    label="Password"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <TextInput
                    value={customer.company}
                    label="Company"
                    name="company"
                    onInputChange={handleChange}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <PhoneNumber handleOnChange={handleOnChange}  width= "100%"/>
                </Grid>
              </Grid>                                                                                 
            </CardBlocks>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default function AddCustomer() {
  return (
    <ThemeProvider theme={theme}>
      <AddCustomerComponent />
    </ThemeProvider>
  );
}

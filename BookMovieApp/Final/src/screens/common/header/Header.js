import React, { useState, useEffect } from "react";
import { Button, Tab, Tabs } from "@material-ui/core";
import Modal from "react-modal";

import "./Header.css";
import { TabPan } from "../tabPanel/TabPanel";
import HeaderLogo from "../../../assets/logo.svg";
import FormInput from "../formInput/FormInput";



const registrationMessage = "Registration Successful. Please Login!";

Modal.setAppElement("#root");
const initialSignUpState = {
  email_address: "",
  first_name: "",
  last_name: "",
  mobile_number: "",
  password: "",
};

const initialLoginState = {
  username: "",
  password: "",
};
const Header = (props) => {
  const [registered, setRegistered] = useState(false);
  const [signUpData, setsignUpData] = useState(initialSignUpState);
  const [loggedIn, setloggedIn] = useState(false);
  const [loggedInData, setloggedInData] = useState(initialLoginState);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [emptyDataSubmittedForSignUp, setemptyDataSubmittedForSignUp] = useState(false);
  const [emptyDataSubmittedForLogin, setemptyDataSubmittedForLogin] = useState(false);
  const [isTabVal, setTabVal] = useState(0);


  const clearRegisteredData = () => {
    setRegistered(false);
    setsignUpData((val) => ({ ...val, ...initialSignUpState }));
  };

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
    // clear the registration value on tab change
    clearRegisteredData();
  };


  useEffect(() => {
    const accessToken = sessionStorage.getItem("access-token");
    if (accessToken) { setloggedIn(true); }
  }, []);

  const changeSignUp = (name, value) =>
    setsignUpData((val) => ({ ...val, [name]: value }));

  const changeLoggedInData = (name, value) =>
    setloggedInData((val) => ({ ...val, [name]: value }));

  const login = async () => {
    if (!loggedInData.username || !loggedInData.password) {
      setemptyDataSubmittedForLogin(true);
    } else {
      if (emptyDataSubmittedForLogin) {
        setemptyDataSubmittedForLogin(false);
      }
      // encoding username and password into base64 
      const param = window.btoa(`${loggedInData.username}:${loggedInData.password}`);
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;charset=UTF-8",
          authorization: `Basic ${param}`,
        },
      };
      try {
        const rawResponse = await fetch(
          `${props.baseUrl}auth/login`,
          requestData
        );
        console.log("rawResponse is, ", rawResponse);
        if (rawResponse.status === 200) {
          // retrieving token from raw response and storing it
          const response = await rawResponse.json();
          sessionStorage.setItem("user-details", JSON.stringify(response));
          sessionStorage.setItem(
            "access-token",
            rawResponse.headers.get("access-token")
          );
          setisModalVisible(false);
          // clearing the login form data on successfully loggin int
          setloggedInData((val) => ({ ...val, ...initialLoginState }));

          setloggedIn(true);
          console.log("response is, ", response);
        } else {
          const response = await rawResponse.json();
          alert(response.message);
          console.log("response is, ", response);
        }
      } catch (error) {
        alert("Something is wrong, wait awhile");
        console.log("error is, ", error);
      }
    }
  };

  const register = () => {
    const { email_address, first_name, last_name, mobile_number, password } =
      signUpData;
    if (
      !email_address ||
      !first_name ||
      !last_name ||
      !mobile_number ||
      !password
    ) {
      // setting error state true if any required field is empty
      setemptyDataSubmittedForSignUp(true);
    } else {
      if (emptyDataSubmittedForSignUp) {
        setemptyDataSubmittedForSignUp(false);
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      };
      fetch(`${props.baseUrl}signup`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.id) {
            setRegistered(true);
          } else if (res.message) {
            alert(res.message);
          }
        })
        .catch((err) => {
          alert("Something went wrong");
          console.log("the error is, ", err);
        });
    }
  };



  const logout = () =>
    fetch(`${props.baseUrl}auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        // invalidation of token via api
        Authorization: "Bearer " + sessionStorage.getItem("access-token"),
      },
    }).then((response) => {
      if (response.status === 200) {
        // clearing session storage after invalidating the token
        sessionStorage.clear();
        setloggedIn(false);
        alert("Log Out Successfull");
      }
    });

  return (
    <div className="headerContent">
      <img className="movieLogo" alt="Header Logo" src={HeaderLogo} />
      <div className="buttonContents">
        {props.isReleased ? (
          <div style={{ marginRight: 12 }}>
            <Button
              onClick={
                // method for the user's session conditional modal click
                loggedIn
                  ? () => props.onBookShow()
                  : () => setisModalVisible(true)
              } color="primary" variant="contained"
            >
              Book Show
            </Button>
          </div>
        ) : null}
        <Button
          onClick={loggedIn ? () => logout() : () => setisModalVisible(true)} color="default" variant="contained"
        >
          {loggedIn ? "Log Out" : "Login"}
        </Button>
      </div>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setisModalVisible(false)}
        style={styles.modalContainer}
      >
        <Tabs
          variant="fullWidth"
          value={isTabVal}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <TabPan value={isTabVal} index={0}>
          <FormInput
            id="username"
            onChange={changeLoggedInData}
            value={loggedInData.username}
            label="Username *"
            required
            showError={emptyDataSubmittedForLogin}
          />
          <FormInput
            id="password"
            onChange={changeLoggedInData}
            value={loggedInData.password}
            label="Password *"
            type="password"
            required
            showError={emptyDataSubmittedForLogin}
          />
          <div className="bottomButton">
            <Button onClick={login} color="primary" variant="contained">
              Login
            </Button>
          </div>
        </TabPan>
        <TabPan value={isTabVal} index={1}>
          <FormInput
            id="first_name"
            onChange={changeSignUp}
            value={signUpData.first_name}
            label="First name *"
            required
            showError={emptyDataSubmittedForSignUp}
          />
          <FormInput
            id="last_name"
            onChange={changeSignUp}
            value={signUpData.last_name}
            label="Last Name *"
            required
            showError={emptyDataSubmittedForSignUp}
          />
          <FormInput
            id="email_address"
            onChange={changeSignUp}
            value={signUpData.email_address}
            label="Email *"
            required
            showError={emptyDataSubmittedForSignUp}
          />
          <FormInput
            id="password"
            onChange={changeSignUp}
            value={signUpData.password}
            label="Password *"
            type="password"
            required
            showError={emptyDataSubmittedForSignUp}
          />
          <FormInput
            id="mobile_number"
            onChange={changeSignUp}
            value={signUpData.mobile_number}
            label="Contact Number *"
            type="tel"
            required
            showError={emptyDataSubmittedForSignUp}
          />
          {registered ? (
            <div className="promptText">{registrationMessage}</div>
          ) : null}
          <div className="bottomButton">
            <Button onClick={register} color="primary" variant="contained">
              Register
            </Button>
          </div>
        </TabPan>
      </Modal>
    </div>
  );
};

export default Header;

const styles = {
  modalContainer: {
    content: {
      width: "40%",
      position: "absolute",
      left: "30%",
      right: "30%",
    },
    overlay: {
      zIndex: 101,
    },
  },
};

Header.defaultProps = {
  onBookShow: () => { },
};
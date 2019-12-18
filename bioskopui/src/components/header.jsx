import React, { useState } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LogoutSuccessAction } from "./../redux/actions";
import { FaCartPlus } from "react-icons/fa";

const logOutUser = () => {
  localStorage.clear();
  LogoutSuccessAction();
};

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar style={{ height: "100px" }} className="warnaHeader" dark expand="md">
        <NavbarBrand> IMAX </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-5" navbar>
            <NavItem>
              <NavLink className="warnalink" href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              {props.role === "admin" ? (
                <div className="d-flex mr-3 salah">
                  <NavLink href={"/manageAdmin"}>manageAdmin</NavLink>
                  <NavLink href={"/manageStudio"}>Manage Studio</NavLink>
                </div>
              ) : null}
            </NavItem>
            <NavItem>
              {props.authLogin ? null : (
                <NavLink>
                  <Link className="warnalink" to={"/login"}>
                    Login
                  </Link>
                </NavLink>
              )}
            </NavItem>
            {props.AuthLog === "" ? <NavItem></NavItem> : null}
            {props.AuthLog === "" ? null : <NavItem className="mt-2 user d-flex">Selamat Datang {props.AuthLog}</NavItem>}
          </Nav>
          <Nav>
            {props.AuthLog === "" ? null : (
              <NavItem className="logout d-flex">
                <NavLink>
                  {props.role === "user" ? (
                    <Link to={"/cart"}>
                      <div style={{ color: "white" }}>
                        <FaCartPlus style={{ color: "white", fontSize: "20px" }} />
                        {props.notif}
                      </div>
                    </Link>
                  ) : null}
                </NavLink>
                <NavLink href="/" onClick={() => logOutUser()} className="btn btn-dark">
                  Logout
                </NavLink>
                <NavLink className="warnalink" href="/gantipassword">
                  Ganti Password
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const MapstateToprops = state => {
  return {
    AuthLog: state.Auth.username,
    role: state.Auth.role,
    authLogin: state.Auth.login,
    notif: state.Auth.notif
  };
};

export default connect(MapstateToprops, { LogoutSuccessAction })(Header);

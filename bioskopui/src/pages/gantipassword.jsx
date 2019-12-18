import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { gantiPassword } from "./../redux/actions";


class Gantipass extends Component {
  state = {
    backtohome: false
  };

  onClickgantipass = () => {
    var passwordbaru = this.refs.passwordbaru.value;
    var passwordlama = this.refs.passwordlama.value;
    var password = this.refs.confirmpass.value;

    var updatepassword = {
      username: this.props.username,
      password,
      role: this.props.role
    };

    if (passwordlama === "" || passwordbaru === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password tidak boleh kosong"
      });
    } else if (passwordlama === passwordbaru) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password baru tidak boleh sama dengan password lama"
      });
    } else if (passwordlama !== this.props.passuser) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password lama salah"
      });
    } else if (passwordbaru !== password) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "konfirmasi password salah"
      });
    } else {
      Axios.patch(`${APIURL}users/${this.props.userId}`, updatepassword)
        .then(res => {
          Swal.fire({
            title: "Yakin ganti password?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes"
          }).then(result => {
            if (result.value) {
              this.props.gantiPassword(res.data);
              this.setState({ backtohome: true });
              Swal.fire({
                icon: "success",
                title: "Password berhasil diganti",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    if (this.state.backtohome || this.props.loginuser===false) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ height: "90vh" }}>
        <div className="container borderregis" style={{ width: "20%" }}>
          <h1>Ganti Password</h1>
          <div>
            <label>Password Lama</label>
            <input className="form-control" type="password" placeholder="Password" ref="passwordlama" />
          </div>
          <div>
            <label>Password Baru</label>
            <input className="form-control" type="password" placeholder="Password" ref="passwordbaru" />
          </div>
          <div>
            <label>Re-enter Password</label>
            <input className="form-control" type="password" placeholder="Re-enter" ref="confirmpass" />
          </div>

          <button onClick={this.onClickgantipass} className="btn btn-dark mt-4 mb-3" type="submit">
            Submit
          </button>
        </div>
      </div>
    );
  }
}
const MapstateToprops = state => {
  return {
    username: state.Auth.username,
    loginuser: state.Auth.login,
    userId: state.Auth.id,
    passuser: state.Auth.password,
    role: state.Auth.role
  };
};
export default connect(MapstateToprops, { gantiPassword })(Gantipass);

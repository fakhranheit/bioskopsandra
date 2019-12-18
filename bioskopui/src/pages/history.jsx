import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@material-ui/core";
import { APIURL } from "./../support/ApiUrl";

class Cart extends Component {
  state = {
    datacart: null,
    loading: true,
    AuthId: "",
    modaldetail: false,
    modalindex: ""
  };

  componentDidMount() {
    Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.AuthId}&bayar=true`)
      .then(res => {
        var datacart1 = res.data;
        var qtyarr1 = [];
        console.log(datacart1); //......................................................1...datacart1
        res.data.forEach(val => {
          qtyarr1.push(Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`));
        });
        console.log(qtyarr1); //........................................................2...qtyarr1
        var qtyarr2 = [];
        Axios.all(qtyarr1)
          .then(res1 => {
            console.log(res1); //.......................................................3...res1
            res1.forEach(val => {
              qtyarr2.push(val.data);
            });
            console.log(qtyarr2); //....................................................4...qtyarr2
            var datacart2 = [];
            datacart1.forEach((val, index) => {
              datacart2.push({ ...val, qty: qtyarr2[index] });
            });
            console.log(datacart2); //..................................................5...datacart2
            this.setState({ datacart: datacart2 });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderCart = () => {
    if (this.state.datacart !== null) {
      if (this.state.datacart.length === 0) {
        // console.log('rendercart')
        return (
          <tr>
            <td>anda belum melakukan pembayaran</td>
          </tr>
        );
      }

      return this.state.datacart.map((val, index) => {
        return (
          <TableRow key={index}>
            <TableCell>{index + 1} </TableCell>
            <TableCell>{val.movie.title} </TableCell>
            <TableCell>{val.jadwal} </TableCell>
            <TableCell>{val.qty.length} </TableCell>
            <TableCell>Rp. {val.totalHarga} </TableCell>
            <TableCell>
              <button className="mt-2 mb-2 mr-2 btn btn-info" onClick={() => this.setState({ modaldetail: true, modalindex: index })}>
                Detail
              </button>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  detailhead = () => {
    return <div>Detail orderan no. {this.state.datacart[this.state.modalindex].id} </div>;
  };

  render() {
    // console.log(this.props.AuthId)
    if (this.props.AuthId) {
      // console.log('render1')
      return (
        <div style={{ height: "91vh" }}>
          <div className="mt-3 mb-2 username-history">{this.props.AuthUsername}</div>
          <Modal isOpen={this.state.modaldetail} toggle={() => this.setState({ modaldetail: false })} size="sm">
            <ModalHeader>{this.state.modalindex !== "" ? this.detailhead() : null}</ModalHeader>
            <ModalBody>
              <center>
                sudah bayar
                <table className="mt-2">
                  <thead>
                    <tr>
                      <td style={{ width: "50px" }}>
                        <center>No.</center>
                      </td>
                      <td style={{ width: "100px" }}>
                        <center>Bangku</center>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.modalindex !== ""
                      ? this.state.datacart[this.state.modalindex].qty.map((val, index) => {
                          // console.log(val.row,val.seat)
                          return (
                            <tr key={index}>
                              <td style={{ width: "50px" }}>
                                <center>{index + 1}</center>
                              </td>
                              <td style={{ width: "100px" }}>
                                <center>
                                  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[val.row]} {val.seat + 1}
                                </center>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </center>
            </ModalBody>
          </Modal>
          <center>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Movies</TableCell>
                    <TableCell>Jadwal</TableCell>
                    <TableCell>Jumlah</TableCell>
                    <TableCell>Harga</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{this.renderCart()}</TableBody>
              </Table>
            </Paper>
          </center>
        </div>
      );
    }
    // console.log('render2')
    return <div className="">404 not found</div>;
  }
}

const MapstateToprops = state => {
  // console.log('mstp')
  return {
    AuthUsername: state.Auth.username,
    AuthLog: state.Auth.login,
    AuthId: state.Auth.id
  };
};

export default connect(MapstateToprops)(Cart);

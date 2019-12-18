import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { APIURL } from "./../support/ApiUrl";
import { Redirect } from "react-router-dom";
// import { NotifCart } from "./../redux/actions";

class Cart extends Component {
  state = {
    datacart: null,
    modaldetail: false,
    loading: true,
    AuthId: "",
    indexdetail: 0,
    modaldelete: false,
    datadelete: {},
    modalcheckout: false,
    hargacheckout: 0
  };

  checkoutTable = () => {
    return this.setState({ modalcheckout: true })
  };

  componentDidMount() {
    Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`)
      .then(res => {
        var datacart = res.data;
        var qtyarr = [];
        // console.log(res.data)
        res.data.forEach(element => {
          qtyarr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`));
        });
        var qtyarrfinal = [];
        Axios.all(qtyarr)
          .then(res1 => {
            res1.forEach(val => {
              qtyarrfinal.push(val.data);
            });
            var datafinal = [];

            datacart.forEach((val, index) => {
              datafinal.push({ ...val, qty: qtyarrfinal[index] });
            });
            this.setState({
              datacart: datafinal,
              loading: false
            });
          })
          .catch(err1 => {});
      })
      .catch(err => {
        console.log(err);
      });
  }

  totalcheckout = () => {
    var pesanan = this.state.datacart;
    for (var i = 0; i < pesanan.length; i++) {
      this.state.hargacheckout += pesanan[i].totalHarga;
    }
    return this.state.hargacheckout;
  };

  bayarcheckout = () => {
    var pesanan = this.state.datacart;
    for (var i = 0; i < pesanan.length; i++) {
      var data = {
        userId: pesanan[i].userId,
        movieId: pesanan[i].movieId,
        jadwal: pesanan[i].jadwal,
        totalHarga: pesanan[i].totalHarga,
        bayar: true,
        id: pesanan[i].id
      };
      var id = data.id;
      // console.log(data)
      Axios.patch(`${APIURL}orders/${id}`, data)
        .then(res => {
          this.componentDidMount();
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.setState({ modalcheckout: false });
  };

  renderCart = () => {
    if (this.state.datacart !== null) {
      // this.props.NotifCart(this.state.datacart.length);

      // if (this.state.datacart.length === 0) {
      //   return (
      //     <tr>
      //       <td> belum ada barang</td>
      //     </tr>
      //   );
      // }
      return this.state.datacart.map((val, index) => {
        return (
          <tr key={index}>
            <td style={{ width: 100 }}>{index + 1}</td>
            <td style={{ width: 300 }}>{val.movie.title}</td>
            <td style={{ width: 100 }}>{val.jadwal}</td>
            <td style={{ width: 100 }}>{val.qty.length}</td>
            <td style={{ width: 100 }}>
              <button className="btn btn-dark" onClick={() => this.setState({ modaldetail: true, indexdetail: index })}>
                Details
              </button>
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    if (this.props.role !== "user") {
      return (
        <div>
          <Redirect to={"/error"} />
        </div>
      );
    }
    if (this.state.loading) {
      console.log("loading");
      return <div>loading..</div>;
    }
    console.log(this.state.datacart);
    return (
      <div>
        <Modal
          isOpen={this.state.modaldetail}
          toggle={() => {
            this.setState({ modaldetail: false });
          }}
        >
          <ModalHeader>Details</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Bangku</th>
                </tr>
              </thead>
              <tbody>
                {this.state.datacart !== null && this.state.datacart.length !== 0
                  ? this.state.datacart[this.state.indexdetail].qty.map((val, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{"abcdefghijklmnopqrstuvwxyz".toUpperCase()[val.row] + [val.seat + 1]}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        <center>
          <Table style={{ width: 600 }}>
            <thead>
              <tr>
                <th style={{ width: 100 }}>No.</th>
                <th style={{ width: 100 }}>Title</th>
                <th style={{ width: 100 }}>Jadwal</th>
                <th style={{ width: 100 }}>Jumlah</th>
                <th style={{ width: 100 }}>Detail</th>
              </tr>
            </thead>
            <tbody>{this.renderCart()}</tbody>
            <tfoot>
              <button onClick={this.checkoutTable} className="btn btn-dark">
                Checkout
              </button>
            </tfoot>
            <Modal
              isOpen={this.state.modalcheckout}
              toggle={() => {
                this.setState({ modalcheckout: false });
              }}
            >
              <ModalHeader>Total harga tiket</ModalHeader>
              <ModalBody>Total harga pesanan anda adalah : Rp. {this.totalcheckout()}</ModalBody>
              <ModalFooter>
                <button onClick={this.bayarcheckout}>bayar</button>
              </ModalFooter>
            </Modal>
          </Table>
        </center>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    Authlog: state.Auth.login,
    UserId: state.Auth.id,
    role: state.Auth.role
  };
};

export default connect(MapstateToprops, {})(Cart);

import React, { Component } from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { APIURL } from "./../support/ApiUrl";
import { NotifCart } from "./../redux/actions";

class Cart extends Component {
  state = {
    datacart: null,
    modaldetail: false,
    indexdetail:0
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
              datacart: datafinal
            });
          })
          .catch(err1 => {});
      })
      .catch(err => {
        console.log(err);
      });
  }

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
              <button className="btn btn-dark" onClick={()=>this.setState({modaldetail:true,indexdetail:index})}>Details</button>
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    //   console.log(this.state.datacart)
    return (
      <div>
        <Modal isOpen={this.state.modaldetail} toggle={()=>{this.setState({modaldetail:false})}}>
          <ModalHeader>
            Details
          </ModalHeader>
          <ModalBody>
              <Table>
                <thead>
                    <tr>
                      <th>
                        No.
                      </th>
                      <th>
                        Bangku
                      </th>
                    </tr>
                </thead>
                <tbody>
                  {this.state.datacart!==null && this.state.datacart.length!==0 ?
                    this.state.datacart[this.state.indexdetail].qty.map((val,index)=>{
                      return(
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{'abcdefghijklmnopqrstuvwxyz'.toUpperCase()[val.row]+[val.seat+1]}</td>
                        </tr>
                      )
                    })
                    :
                    null
                  }
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
            <tfoot><button className="btn btn-dark">Checkout</button></tfoot>
          </Table>
        </center>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    Authlog: state.Auth.login,
    UserId: state.Auth.id
  };
};

export default connect(MapstateToprops,{})(Cart);

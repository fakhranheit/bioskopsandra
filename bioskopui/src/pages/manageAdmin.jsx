import React, { Component } from "react";
import { Table, TableBody, TableHead, TableCell, TableRow } from "@material-ui/core";
import Axios from "axios";
import { APIURL } from "../support/ApiUrl";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Fade from "react-reveal/Fade";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";

const Myswal = withReactContent(Swal);

class ManageAdmin extends Component {
  state = {
    dataFilm: [],
    modaladd: false,
    modaledit: false,
    indexedit: 0,
    iddelete: -1,
    jadwal: [12, 14, 16, 18, 20, 22],
    datastudio: []
  };

  onUpdateDataClick = () => {
    var jadwaltemplate = this.state.jadwal;
    var jadwal = [];
    var id = this.state.dataFilm[this.state.indexedit].id;
    // console.log(this.refs.jadwal0);
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`editjadwal ${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.edittitle.value;
    var image = iniref.editimage.value;
    var sinopsis = iniref.editsynopsys.value;
    var sutradara = iniref.editsutradara.value;
    var genre = iniref.editgenre.value;
    var durasi = iniref.editdurasi.value;
    var produksi = iniref.editproduksi.value;
    var trailer = iniref.edittrailer.value;
    var studioId = iniref.studio.value;

    var data = {
      title: title,
      image: image,
      synopsys: sinopsis,
      sutradara: sutradara,
      genre: genre,
      durasi: durasi,
      jadwal: jadwal,
      produksi: produksi,
      trailer,
      studioId
    };

    if (title === "" || image === "" || sinopsis === "" || genre === "" || jadwal === "" || produksi === "") {
      Myswal.fire("Failed", "Data harus diisi semua", "error");
    } else {
      Axios.patch(`${APIURL}movies/${id}`, data)
        .then(res => {
          Axios.get(`${APIURL}movies`).then(res => {
            this.setState({ dataFilm: res.data });
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.setState({ modaladd: false });
      Myswal.fire("Berhasil", "Data berhasil dimasukkan", "success");
    }
  };

  onSaveDataClick = () => {
    var jadwaltemplate = [12, 14, 16, 18, 20];
    var jadwal = [];
    // console.log(this.refs.jadwal0);
    for (var i = 0; i < jadwaltemplate.length; i++) {
      if (this.refs[`jadwal ${i}`].checked) {
        jadwal.push(jadwaltemplate[i]);
      }
    }
    var iniref = this.refs;
    var title = iniref.title.value;
    var image = iniref.image.value;
    var sinopsis = iniref.synopsys.value;
    var sutradara = iniref.sutradara.value;
    var genre = iniref.genre.value;
    var durasi = iniref.durasi.value;
    var produksi = iniref.produksi.value;
    var trailer = iniref.trailer.value;
    var studioId = iniref.studioId.value;

    var data = {
      title: title,
      image: image,
      synopsys: sinopsis,
      sutradara: sutradara,
      genre: genre,
      durasi: durasi,
      jadwal: jadwal,
      produksi: produksi,
      trailer,
      studioId
    };

    if (title === "" || image === "" || sinopsis === "" || genre === "" || jadwal === "" || produksi === "") {
      Myswal.fire("Failed", "Data harus diisi semua", "error");
    } else {
      Myswal.fire("Berhasil", "Data berhasil dimasukkan", "success");

      Axios.post(`${APIURL}movies`, data)
        .then(res => {
          Axios.get(`${APIURL}movies`).then(res => {
            this.setState({ dataFilm: res.data });
          });
        })
        .catch(err => {
          console.log(err);
        });
      this.setState({ modaladd: false });
    }
  };

  componentDidMount() {
    Axios.get(`${APIURL}movies`)
      .then(res => {
        // console.log(res.data)
        Axios.get(`${APIURL}studios`).then(res1 => {
          this.setState({
            dataFilm: res.data,
            datastudio: res1.data
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  deleteMovie = index => {
    Myswal.fire({
      title: `Hapus  ${this.state.dataFilm[index].title}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        const datahapus = this.state.dataFilm;
        this.setState({ iddelete: datahapus[index].id });
        Axios.delete(`${APIURL}movies/${this.state.iddelete}`).then(() => {
          Axios.get(`${APIURL}movies`)
            .then(res => {
              this.setState({ dataFilm: res.data });
            })
            .catch(err => {
              console.log(err);
            });
        });
        console.log(this.state.iddelete);
        // datahapus.splice(index, 1);
        Myswal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        Myswal.fire("Cancelled", "", "error");
      }
    });
  };

  renderMovie = () => {
    return this.state.dataFilm.map((val, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{val.title}</TableCell>
          <TableCell>
            <img src={val.image} alt="gambar" height="200px" />
          </TableCell>

          {val.synopsys.split("").length <= 50 ? (
            <TableCell>{val.synopsys}</TableCell>
          ) : this.state.readmoreselected === index ? (
            <TableCell>
              {val.synopsys}
              <span className="readMore" onClick={() => this.setState({ readmoreselected: -1 })}>
                Read less
              </span>
            </TableCell>
          ) : (
            <TableCell>
              {val.synopsys.split("").filter((val, index) => index <= 50)}
              <span className="readMore" onClick={() => this.setState({ readmoreselected: index })}>
                ReadMore
              </span>
            </TableCell>
          )}
          <TableCell align="center" style={{ width: "60px" }}>
            {val.jadwal.map((val, index) => {
              return (
                <button className="btn btn-dark my-1" style={{ height: "2rem", lineHeight: "14px", cursor: "text" }}>
                  {val}:00
                </button>
              );
            })}
          </TableCell>
          <TableCell>{val.sutradara}</TableCell>
          <TableCell>{val.genre}</TableCell>
          <TableCell>{val.durasi}</TableCell>
          <TableCell>{val.produksi}</TableCell>
          <TableCell>
            <button
              className="btn btn-dark mb-2 mr-3 mt-2"
              onClick={() => {
                this.setState({ modaledit: true, indexedit: index });
              }}
            >
              Edit
            </button>
            <button onClick={() => this.deleteMovie(index)} className="btn btn-dark">
              Delete
            </button>
          </TableCell>
        </TableRow>
      );
    });
  };

  renderAddCheckbox = () => {
    return this.state.jadwal.map((val, index) => {
      return (
        <div key={index}>
          <input type="checkbox" ref={`jadwal ${index}`} />
          <span className="mr-2">{val}.00</span>
        </div>
      );
    });
  };

  renderEditCheckbox = indexedit => {
    var indexarr = [];
    var datafilmedit = this.state.dataFilm[indexedit].jadwal;
    // datafilmedit.forEach((val)=>{
    //   indexarr.push(this.state.jadwal.indexOf(val))
    // })
    for (var i = 0; i < datafilmedit.length; i++) {
      for (var j = 0; j < this.state.jadwal.length; j++) {
        if (datafilmedit[i] === this.state.jadwal[j]) {
          indexarr.push(j);
        }
      }
    }
    // console.log(this.state.jadwal.indexOf(datafilmedit[2]));
    var checkbox = this.state.jadwal;
    var checkboxnew = [];
    checkbox.forEach(val => {
      checkboxnew.push({ jam: val, tampiledit: false });
    });
    indexarr.forEach(val => {
      checkboxnew[val].tampiledit = true;
    });
    return checkboxnew.map((val, index) => {
      if (val.tampiledit) {
        return (
          <div key={index}>
            <input type="checkbox" defaultChecked ref={`editjadwal ${index}`} value={val.jam} />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      } else {
        return (
          <div key={index}>
            <input type="checkbox" ref={`editjadwal ${index}`} value={val.jam} />
            <span className="mr-2">{val.jam}.00</span>
          </div>
        );
      }
    });
  };

  render() {
    if (this.props.role !== "admin") {
      return <div>Error</div>;
    }
    const { dataFilm, indexedit } = this.state;
    const { length } = dataFilm;
    if (length === 0) {
      return (
        <div>
          <Spinner animation="grow" size="xl" />
          <Spinner animation="grow" />
        </div>
      );
    }
    return (
      <div className="mx-3">
        <Modal isOpen={this.state.modaladd} toggle={() => this.setState({ modaladd: false })}>
          <ModalHeader>Tambah Film</ModalHeader>
          <ModalBody>
            <input type="text" ref="title" placeholder="title" className="form-control mb-3" />
            <input type="text" ref="image" placeholder="image" className="form-control mb-3" />
            <textarea rows="5" type="text" ref="synopsys" placeholder="sinopsis" className="form-control mb-3" />
            Jadwal:
            <div className="d-flex">{this.renderAddCheckbox()}</div>
            <input type="text" ref="trailer" placeholder="trailer" className="form-control mb-3" />
            <select ref="studioId">
              {this.state.datastudio.map(val => {
                return <option value={val.id}>{val.nama}</option>;
              })}
            </select>
            <input type="text" ref="sutradara" placeholder="sutradara" className="form-control mb-3" />
            <input type="number" ref="durasi" placeholder="durasi" className="form-control mb-3" />
            <input type="text" ref="genre" placeholder="genre" className="form-control mb-3" />
            <input type="text" ref="produksi" placeholder="produksi" className="form-control mb-3" />
          </ModalBody>
          <ModalFooter>
            <button onClick={this.onSaveDataClick} className="btn btn-success">
              Save
            </button>
            <button onClick={() => this.setState({ modaladd: false })} className="btn btn-danger">
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modaledit} toggle={() => this.setState({ modaledit: false })}>
          <ModalHeader>Edit Film {dataFilm[indexedit].title}</ModalHeader>
          <ModalBody>
            <input type="text" defaultValue={dataFilm[indexedit].title} ref="edittitle" placeholder="title" className="form-control mb-3" />
            <input type="text" defaultValue={dataFilm[indexedit].image} ref="editimage" placeholder="image" className="form-control mb-3" />
            <textarea rows="5" type="text" defaultValue={dataFilm[indexedit].synopsys} ref="editsynopsys" placeholder="sinopsis" className="form-control mb-3" />
            Jadwal:
            <div className="d-flex">{this.renderEditCheckbox(indexedit)}</div>
            <input ref="edittrailer" defaultValue={dataFilm[indexedit].trailer} placeholder="trailer" className="form-control mb-3 mt-3" />
            Studio :
            <select ref="studio">
              {this.state.datastudio.map(val => {
                return <option value={val.id}>{val.nama}</option>;
              })}
            </select>
            <input type="text" defaultValue={dataFilm[indexedit].sutradara} ref="editsutradara" placeholder="sutradara" className="form-control mb-3 mt-3" />
            <input type="number" defaultValue={dataFilm[indexedit].durasi} ref="editdurasi" placeholder="durasi" className="form-control mb-3" />
            <input type="text" defaultValue={dataFilm[indexedit].genre} ref="editgenre" placeholder="genre" className="form-control mb-3" />
            <input type="text" defaultValue={dataFilm[indexedit].produksi} ref="editproduksi" placeholder="produksi" className="form-control mb-3" />
          </ModalBody>
          <ModalFooter>
            <button onClick={this.onUpdateDataClick} className="btn btn-success">
              Save
            </button>
            <button onClick={() => this.setState({ modaledit: false })} className="btn btn-danger">
              Cancel
            </button>
          </ModalFooter>
        </Modal>

        <Fade>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Image.</TableCell>
                <TableCell>Sinopsis</TableCell>
                <TableCell>Jadwal Tayang</TableCell>
                <TableCell>Sutradara</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Durasi</TableCell>
                <TableCell>Produksi</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.renderMovie()}</TableBody>
          </Table>
        </Fade>
        <center>
          <button
            style={{ alignContent: "start" }}
            className="btn btn-dark mt-5 mb-5"
            onClick={() => {
              this.setState({ modaladd: true });
            }}
          >
            Add film
          </button>
        </center>
      </div>
    );
  }
}

const MapstateToprops = state => {
  return {
    role: state.Auth.role
  };
};

export default connect(MapstateToprops)(ManageAdmin);

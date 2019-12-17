import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const url = "http://localhost:2000/";

class Home extends Component {
  state = {
    dataMovies: [],
    readMore: -1
  };
  
  renderMovies = () => {
    return this.state.dataMovies.map((val, index) => {
      const info = this.state.readMore;

      if (info === 1) {
        return (
          <div key={index} className="col-md-4 py-5 pr-3 pl-1 ">
            <div className="card kartu ap " style={{ width: "100%" }}>
              <div className="gambaar1">
                <img src={val.image} className="card-img-top kartu gambar" alt="..." />
              </div>
              <div className="card-body">
                <h5 className="card-title">{val.title}</h5>
                <p className="card-text">{val.synopsys}</p>
                <p className="card-text">Genre : {val.genre}</p>
                <p className="card-text">durasi : {val.durasi}</p>
                <p className="card-text">Sutradara : {val.genre}</p>
                <span
                  onClick={() => {
                    this.setState({ readMore: -1 });
                  }}
                  href="/#"
                  className="card-text btn btn-success"
                  style={{ color: "white" }}
                >
                  Back
                </span>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="col-md-4 py-5 pr-3 pl-1 ">
            <div className="card kartu" style={{ width: "100%" }}>
              <div className="gambaar1">
                <Link to={"./moviedetail/" + val.id}>
                  <img src={val.image} className="card-img-top kartu gambar" alt="..." />
                </Link>
              </div>
              <div className="card-body App">
                <h5 className="card-title">{val.title}</h5>
                <p> </p>
                <span
                  onClick={() => {
                    this.setState({ readMore: 1 });
                  }}
                  href="/#"
                  className="card-text btn btn-success"
                  style={{ color: "white" }}
                >
                  Read Info
                </span>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  componentDidMount() {
    Axios.get(`${url}movies`)
      .then(res => {
        this.setState({ dataMovies: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    console.log(this.state.readMore);
    return (
      <div>
        <div>
          <img src="" alt=""/>
        </div>
        <div className=" mx-5">
          <div className="row py-5 " style={{ paddingLeft: "10%", paddingRight: "10%" }}>
            {this.renderMovies()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

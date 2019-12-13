import React, { Component } from "react";
import Header from "./components/header";
import "./App.css";
import Home from "./pages/Home";
import { Switch, Route } from "react-router-dom";
import ManageAdmin from "./pages/manageAdmin";
import Login from "./pages/login";
import Axios from "axios";
import { APIURL } from "./support/ApiUrl";
import Slider from "./components/slider";
import RegisterUser from "./pages/RegisterUser";
import WelcomePages from "./components/welcomePages";
import Moviedetail from "./pages/movie-detail"
import Belitiket from './pages/belitiket'
import {connect} from 'react-redux'
import {LoginSuccessAction} from './redux/actions'
import Cart from './pages/cart'

class App extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    var id = localStorage.getItem("fakhran");
    Axios.get(`${APIURL}users/${id}`)
      .then(res => {
        console.log(res.data)
        this.props.LoginSuccessAction(res.data);
        // this.setState({ loading: false });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.setState({ loading: false });
      })
  }

  render() {
    if (this.state.loading) {
      return <div>Loading....</div>;
    } else {
      return (
        <div className="App">
          <Header />
          <Switch>
            <Route path={"/"} exact>
              <Slider />
              <Home />
              <WelcomePages />
            </Route>
            <Route exact path={"/manageAdmin"}>
              <ManageAdmin />
            </Route>
            <Route path='/moviedetail/:id' component={Moviedetail} exact/>
            <Route path="/belitiket" component={Belitiket}></Route>
            <Route path={"/login"} exact component={Login} />
            <Route path={"/RegisterUser"} exact component={RegisterUser} />
            <Route path={'/cart'} component={Cart} exact/>
          </Switch>
        </div>
      );
    }
  }
}

const MapstateToprops=(state)=>{
  return{
    AuthLog:state.Auth.login
  }
}

export default connect(MapstateToprops,{LoginSuccessAction}) (App);

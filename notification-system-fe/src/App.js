import React, { Component } from 'react';
import AuthService from './auth/AuthService';
import './App.css';
import { Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AppTopbar } from './components/navBar/AppTopbar';
import { SideBarLeft } from './components/sideBar/SideBarLeft';
import axios from 'axios';
import './assets/scss/_pro_sidebar.scss'
import './assets/scss/_body_section.scss'
import { SalesDashboard } from './components/sales/SalesDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { SalesDataList } from './components/sales/SalesDataList';
import decode from 'jwt-decode';
import { UserList } from './components/user/UserList';
import { UserProfile } from './components/user/UserProfile';
import io from 'socket.io-client';
import { Notification } from './components/PushNotification/Notification';
import { EmployeeLeaveApplicationList } from './components/user/EmployeeLeaveApplicationList';

const Auth = new AuthService();
const URL = process.env.REACT_APP_BASE_URL

// const socket = io(URL, {
//   auth: {
//     token: Auth.getToken(),
//   },
//   transports: ['polling', 'websocket'],
//   //  "force new connection" : true,
//   //  "reconnection": true,
//   //  "reconnectionDelay": 2000,                  //starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
//   //  "reconnectionDelayMax" : 60000,             //1 minute maximum delay between connections
//   //  "reconnectionAttempts": "Infinity",         //to prevent dead clients, having the user to having to manually reconnect after a server restart.
//   //  "timeout" : 10000,
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      shortedDataList: [],
      userInfo: {}
    };
  }

  componentWillMount() {
    // this.getUserData();
    this.getUserInfo();
  }

  getCurrentMonthDate = (dateValue) => {
    var date = new Date();
    var from = new Date(date.getFullYear(), date.getMonth(), 1);
    var to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // var to = new Date("2020-06-02");

    // console.log("first_date", firstDay);
    // console.log("last_date", lastDay);

    // var currentDate = new Date(dateValue);
    // var from = new Date('2020/01/01');
    // var to = new Date('2020/01/31');
    var check = new Date(dateValue);

    // console.log(check >= from && check < to);
    return check >= from && check < to
  }

  getUserData() {
    const Auth = new AuthService();
    let url = process.env.REACT_APP_BASE_URL + "/user/list"   //'http://frontend.interview.dingi.work/user/data'
    let header = {
      headers: {
        Authorization: "Bearer " + Auth.getToken()
      }
    }

    axios.get(url, header)
      .then(res => {
        if (res.status === 200) {
          let shortedData = res.data.sort(function (a, b) {
            var dateA = new Date(a.date), dateB = new Date(b.date);
            return dateA - dateB;
          });

          this.setState({ shortedDataList: shortedData })

          let newShortedData = []
          shortedData.map((item, index) => {
            if (this.getCurrentMonthDate(item.date)) {
              newShortedData.push(item)

              // for (let i = 0 ; i<15000 ; i++){
              //   newShortedData.push(item)
              // }
            }
          })
          this.setState({
            userData: newShortedData
          })
          // console.log("newShortedData", newShortedData);
        }
        else {
          console.log("Data not found");
        }
      }).catch(error => {
        console.log('Please check connection')
      });
  }

  getUserInfo() {
    const Auth = new AuthService();
    let token = decode(Auth.getToken())
    let url = process.env.REACT_APP_BASE_URL + "/user/info/by/" + token._id   //'http://frontend.interview.dingi.work/user/data'
    let header = {
      headers: {
        Authorization: "Bearer " + Auth.getToken()
      }
    }

    axios.get(url, header)
      .then(res => {
        if (res.status === 200) {
          console.log("res", res);
          this.setState({
            userInfo: res.data.data.user
          })
        }
      })
  }


  render() {
    const { props } = this.props;
    const { userData, shortedDataList, userInfo } = this.state;

    return (
      <div className="App layout-main">
        <AppTopbar history={props.history} userInfo={userInfo} />
        <SideBarLeft />
        <Route path="/" exact component={() => <Dashboard />} />
        <Route path="/sales-dashboard" exact component={() => <SalesDashboard userData={userData} />} />
        <Route path="/customer-dashboard" exact component={() => <CustomerDashboard userData={userData} />} />
        <Route path="/sales-item-list" exact component={() => <SalesDataList userData={shortedDataList} />} />

        <Route path="/user-list" exact component={() => <UserList userInfo={userInfo} />} />
        <Route path="/profile-info" exact component={() => <UserProfile userInfo={userInfo} />} />
        <Route path="/notification" exact component={() => <Notification userInfo={userInfo} />} />
        <Route path="/leave" exact component={() => <EmployeeLeaveApplicationList userInfo={userInfo} />} />
      </div>
    );
  }
}

export default App;

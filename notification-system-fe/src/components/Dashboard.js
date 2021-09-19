import React, { Component } from 'react';
// import axios from 'axios';
// import AuthService from '../auth/AuthService';
// import { Chart } from "react-google-charts";

export class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
            userData:{...props.userData},
            dashboardViewObj:{
                salesDataProductWise:[
                    {"Title": "Value"}
                ],
                salesDataDateWise:[
                    {"Title": "Value"}
                ],
            }
        }
    }

    

	render() {
        
		return (
            <div className="main-section dashBoard-wrapper">
                <section>
                    <div className="container-fluid">
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 my-4">
                                    <h1>Dashboard</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
		    </div>
        )
	}
}
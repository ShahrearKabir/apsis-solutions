import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

export class SalesDataList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
        }
    }

    componentDidMount(){
        this.setState({ userData : this.props.userData })

        // var filter = {
        //     district: 'Dhaka',
        //     // product: 'CarTracker'
        // };

        // let usersDataArray = this.state.userData.filter(function(item) {
        //     for (var key in filter) {
        //         if (item[key] === undefined || item[key] != filter[key]){
        //             return false;
        //         }  
        //     }
        //     return true;
        // });
          
        // console.log("usersDataArray::::::",usersDataArray)
    }

    render() {
        let { userData } = this.state

        // function performReset() {
            // document.getElementById("inputName").value = "";
            // document.getElementById("inputCity").value = "";
            // document.getElementById("inputCountry").value = "";
            // this.filterTable(event, 0);
        // }

        let filterTable = (event, index) => {
            var filter = event.target.value.toUpperCase();
            var rows = document.querySelector("#myTable tbody").rows;
            for (var i = 0; i < rows.length; i++) {
                var firstCol = rows[i].cells[2].textContent.toUpperCase();
                var secondCol = rows[i].cells[3].textContent.toUpperCase();
                var thirdCol = rows[i].cells[4].textContent.toUpperCase();
                if ((firstCol.indexOf(filter) > -1 && index == 0) 
                    || (secondCol.indexOf(filter) > -1 && index == 1) 
                    || (thirdCol.indexOf(filter) > -1 && index == 2)) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }

        document.querySelectorAll('input.w3-input').forEach((el, idx) => {
            el.addEventListener('keyup', (e) => {
                filterTable(e, idx);
            }, false);
        });
        
        // var filter = {
        //     district: 'Dha',
        //     product: 'CarTracker'
        // };

        // let usersDataArray = this.state.userData.filter(function(item) {
        //     for (var key in filter) {
        //         if (item[key] === undefined || item[key] != filter[key]){
        //             return false;
        //         }  
        //     }
        //     return true;
        // });
          
        // console.log("usersDataArray::::::",usersDataArray)

        return (
            <div className="main-section dashBoard-wrapper">
                <section>
                    <div className="container-fluid">
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 mt-4" style={{ textAlign: 'left'}}>
                                    <h3>Sales Data List</h3>
                                    <div className="custom-title-border-left"></div>
                                </div>
                                <div className="col-md-12 my-2">
                                    <Table striped bordered hover id="myTable">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer Name</th>
                                                <th>Product
                                                    <input id="inputName" className="w3-input" placeholder="Product..."/>
                                                </th>
                                                <th>District
                                                    <input id="inputCity" className="w3-input" placeholder="District..."/>
                                                </th>
                                                <th>Area
                                                    <input id="inputCity" className="w3-input" placeholder="Area..."/>
                                                </th>
                                                <th>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                userData.map((item, index) =>
                                                    <tr className="item">
                                                        <td style={{ width: '150px' }}>{item.date}</td>
                                                        <td>{item.customer_name}</td>
                                                        <td>{item.product}</td>
                                                        <td>{item.district}</td>
                                                        <td>{item.customer_work_area}</td>
                                                        <td>{item.order_quantity}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
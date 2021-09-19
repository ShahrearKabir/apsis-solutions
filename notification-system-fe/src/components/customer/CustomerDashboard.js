import React, { Component } from 'react';
// import axios from 'axios';
// import AuthService from '../auth/AuthService';
import { Chart } from "react-google-charts";

export class CustomerDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
            userData:{...props.userData},
            dashboardViewObj:{
                districtWiseCustomerData:[
                    {"Title": "Value"}
                ],
                areaWiseCustomerData:[
                    {"Title": "Value"}
                ],
            }
        }
    }

    getChartData = (stateUserData, viewObj) =>{
        if(stateUserData){
            let columnsHeader = ["Title", "Value"];
            let salesDataArray = []
            let keyNames = []
            let finalObj = {}
            salesDataArray.push(columnsHeader)

            stateUserData.forEach((data) => {
                let customer_work_area = data.customer_work_area
                if (finalObj[customer_work_area]) {
                    finalObj[customer_work_area].customer_work_area=customer_work_area
                    finalObj[customer_work_area].push(data);
                } else {
                    finalObj[customer_work_area] = [data];
                }
            })
            // console.log("finalObj", finalObj)
            keyNames = Object.keys(finalObj);

            let numOr0 = n => isNaN(n) ? 0 : n
            keyNames.map((item, index) => {
                let sum = finalObj[item].length
                let itemObj = [ item, sum ]
                salesDataArray.push(itemObj);
                // console.log("SUM", itemObj);
            })

            
            viewObj.districtWiseCustomerData = salesDataArray
            
        }
    }

    getChartDataDate = (stateUserData, viewObj) =>{
        if(stateUserData){
            let columnsHeader = ["Title", "Value"];
            let salesDataArray = []

            let keyNames = []
            let finalObj = {}
            
            let productNames = []
            let productNameObj = {}

            let proFinal = {}


            stateUserData.forEach((data) => {
                let district = data.district
                if (productNameObj[district]) {
                    productNameObj[district].district=district
                    productNameObj[district].push(data.order_quantity);
                } else {
                    productNameObj[district] = [data];
                }
                
            })

            // console.log("productNameObj", productNameObj)
            productNames = Object.keys(productNameObj);
            // console.log("productNames", productNames)


            // salesDataArray.push(productNames)
            
            // let newArray = ["Date", ...salesDataArray[0]]

            let newArray = ["Date", "Dhaka", "Chittagong", "Rangpur", "Sylhet"]
            salesDataArray.push(newArray)
            // console.log("salesDataArray", newArray)

            stateUserData.forEach((data) => {
                let date = data.date
                if (finalObj[date]) {
                    finalObj[date].date=date
                    finalObj[date].push(data);
                } else {
                    finalObj[date] = [data];
                }
            })
            // console.log("finalObj", finalObj)
            keyNames = Object.keys(finalObj);
            // console.log("keyNames", keyNames)

            let getDateWiseProduct
            let finalProductWiseObj = []

            for(let i = 0 ; i < keyNames.length ; i++){
                getDateWiseProduct = stateUserData.filter(function(item) {
                    let filterByDate = { date: keyNames[i] }
                    for (var key in filterByDate) {
                        if (item[key] === undefined || item[key] != filterByDate[key]){
                            return false;
                        }  
                    }
                    return true;
                });

                finalProductWiseObj.push(getDateWiseProduct)
                // console.log("finalProductWiseObj::::::",finalProductWiseObj)                
            }
            // console.log("finalProductWiseObj::::::",finalProductWiseObj)
            
            let result
            let resultArray=[]
            finalProductWiseObj.map((item, index) => {
                result = Object.values(item.reduce((acc, { date, customer_name, order_quantity, district}) => {
                    const key = JSON.stringify(district);
                    acc[key] = (acc[key]  || {date, district, customer_name, order_quantity: 0, count: 0});
                    return (acc[key].count += 1, acc);
                  }, {}));
                
                // console.log("Test",result);
                resultArray.push(result)
            })

            // console.log("resultArray", resultArray);
            
            let sumValue1=0
            let sumValue2=0
            let sumValue3=0
            let sumValue4=0
            let numOr0 = n => isNaN(n) ? 0 : n
            keyNames.map((item, index) => {

                resultArray[index].forEach(data =>{
                    if(data.district == "Dhaka" ){
                        sumValue1 = data.count
                    }
                    else if(data.district == "Chittagong" ){
                        sumValue2 = data.count
                    }
                    else if(data.district == "Rangpur" ){
                        sumValue3 = data.count
                    }
                    else if(data.district == "Sylhet" ){
                        sumValue4 = data.count
                    }
                })
                

                // let sumValue1 = resultArray[index].reduce((a, b) => numOr0(a.order_quantity) + numOr0(b.order_quantity))
                let itemObj = [ item, sumValue1, sumValue2, sumValue3, sumValue4 ]
                salesDataArray.push(itemObj);
                // console.log("SUM", itemObj);
                sumValue1 = sumValue2 = sumValue3 = 0
            })

            viewObj.areaWiseCustomerData = salesDataArray
            
        }
        
    }

	render() {
        let { dashboardViewObj } = this.state
        let {  userData } = this.props

        this.getChartData(userData, dashboardViewObj);
        this.getChartDataDate(userData, dashboardViewObj);


        // var filter = {
        //     date: '2020-06-05',
        //     // product: 'MotoTracker'
        // };

        // let users = userData.filter(function(item) {
        //     for (var key in filter) {
        //         if (item[key] === undefined || item[key] != filter[key]){
        //             return false;
        //         }  
        //     }
        //     return true;
        // });
          
        // console.log("users::::::",users)
        

        

		return (
            <div className="main-section dashBoard-wrapper">
                <section>
                    <div className="container-fluid">
                        <div className="container bg-white">
                            <div className="row">
                                <div className="col-md-12 my-2">
                                    <center>
                                        <Chart
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={<div>Loading Chart</div>}
                                            data={dashboardViewObj.areaWiseCustomerData}
                                            options={{
                                                // Material design options
                                                chart: {
                                                    title: 'District Wise Customer',
                                                    // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </center>
                                    
                                </div>

                                <div className="col-md-12 my-2">
                                    <center>
                                        <Chart
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="PieChart"
                                            loader={<div>Loading Chart</div>}
                                            data={dashboardViewObj.districtWiseCustomerData}
                                            options={{
                                                title: 'Area Wise Customer',
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
		    </div>
        )
	}
}
import React, { Component } from 'react';
// import axios from 'axios';
// import AuthService from '../auth/AuthService';
import { Chart } from "react-google-charts";

export class SalesDashboard extends Component {
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

    getPieChartData = (stateUserData, viewObj, chartType) =>{
        if(stateUserData){
            let columnsHeader = ["Title", "Value"];
            let salesDataArray = []
            let keyNames = []
            let finalObj = {}
            salesDataArray.push(columnsHeader)

            stateUserData.forEach((data) => {

                if( chartType == "productWise" ){
                    let product = data.product
                    if (finalObj[product]) {
                        finalObj[product].product=product
                        finalObj[product].push(data.order_quantity);
                    } else {
                        finalObj[product] = [data.order_quantity];
                    }
                }
                else if( chartType == "dateWise" ){
                    let date = data.date
                    if (finalObj[date]) {
                        finalObj[date].date=date
                        finalObj[date].push(data.order_quantity);
                    } else {
                        finalObj[date] = [data];
                    }
                }
                
            })
            console.log("finalObj", finalObj)
            keyNames = Object.keys(finalObj);

            let numOr0 = n => isNaN(n) ? 0 : n
            keyNames.map((item, index) => {
                console.log('item', item);
                
                let sum = finalObj[item].reduce((a, b) => a + b)
                let itemObj = [ item, sum ]
                salesDataArray.push(itemObj);
                // console.log("SUM", itemObj);
            })

            if( chartType == "productWise" ){
                viewObj.salesDataProductWise = salesDataArray
            }
            else if( chartType == "dateWise" ){
                viewObj.salesDataDateWise = salesDataArray
            }
        }
    }

    getBarChartDataDate = (stateUserData, viewObj, chartType) =>{
        if(stateUserData){
            // let columnsHeader = ["Title", "Value"];
            let salesDataArray = []

            let keyNames = []
            let finalObj = {}
            
            let productNames = []
            let productNameObj = {}

            // let proFinal = {}


            stateUserData.forEach((data) => {
                let product = data.product
                if (productNameObj[product]) {
                    productNameObj[product].product=product
                    productNameObj[product].push(data.order_quantity);
                } else {
                    productNameObj[product] = [data];
                }
                
            })

            // console.log("productNameObj", productNameObj)
            productNames = Object.keys(productNameObj);
            // console.log("productNames", productNames)


            // salesDataArray.push(productNames)
            
            // let newArray = ["Date", ...salesDataArray[0]]
            let newArray = ["Date", "MotoTracker", "CarTracker", "EagleCam", "AssetLock"]
            salesDataArray.push(newArray)
            // console.log("salesDataArray", salesDataArray)

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
                result = Object.values(item.reduce((acc, { date ,order_quantity, product}) => {
                    const key = JSON.stringify(product);
                    acc[key] = (acc[key]  || {date, product, order_quantity: 0});
                    return (acc[key].order_quantity += order_quantity, acc);
                  }, {}));
                
                // console.log("Test",result);
                resultArray.push(result)
            })

            // console.log("resultArray", resultArray);
            
            let sumValue1=0
            let sumValue2=0
            let sumValue3=0
            let sumValue4=0
            // let numOr0 = n => isNaN(n) ? 0 : n
            keyNames.map((item, index) => {

                resultArray[index].forEach(data =>{
                    if(data.product == "MotoTracker" ){
                        sumValue1 = data.order_quantity
                    }
                    else if(data.product == "CarTracker" ){
                        sumValue2 = data.order_quantity
                    }
                    else if(data.product == "EagleCam" ){
                        sumValue3 = data.order_quantity
                    }
                    else if(data.product == "AssetLock" ){
                        sumValue4 = data.order_quantity
                    }
                })
                

                // let sumValue1 = resultArray[index].reduce((a, b) => numOr0(a.order_quantity) + numOr0(b.order_quantity))
                let itemObj = [ item, sumValue1, sumValue2, sumValue3, sumValue4 ]
                salesDataArray.push(itemObj);
                // console.log("SUM", itemObj);
                sumValue1 = sumValue2 = sumValue3 = 0
            })

            viewObj.salesDataDateWise = salesDataArray
            
        }
        
    }

	render() {
        let { dashboardViewObj } = this.state
        let {  userData } = this.props

        this.getPieChartData(userData, dashboardViewObj, 'productWise');
        this.getBarChartDataDate(userData, dashboardViewObj, 'dateWise');

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
                                            data={dashboardViewObj.salesDataDateWise}
                                            options={{
                                                // Material design options
                                                chart: {
                                                    title: 'Date Wise Products Quantity',
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
                                            data={dashboardViewObj.salesDataProductWise}
                                            options={{
                                                title: 'Month Wise Product Sales',
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
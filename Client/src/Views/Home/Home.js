import { Menu } from "semantic-ui-react";
import React, { useEffect, useState } from 'react';
import Search from '../Search/Search.js';
import { Container, Grid, Header, Input, Form, Button, Modal, Dropdown } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { GridColumn } from "semantic-ui-react";
import CanvasJSReact from "../../Assets/canvasjs.stock.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Home = (props) => {

    const [showStockModal, setShowStockModal] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [goHome, setGoHome] = useState(false);
    const [goCalculator, setGoCalculator] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [stockNames, setStockNames] = useState(null);
    const [startYear, setStartYear] = useState(null);
    const [startMonth, setStartMonth] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [endMonth, setEndMonth] = useState(null);
    const [dataPoints, setDataPoints] = useState([]);
    const [dataFormatted, setDataFormatted] = useState(false);
    const [performers, setPerformers] = useState([]);
    const [performerData, setPerformerData] = useState([]);
    const [pDataPoints, setPDataPoints] = useState([]);
    const [showSectorGraph, setShowSectorGraph] = useState(false)
    const [sectorDataPoints, setSectorDataPoints] = useState([])
 

    let graphOptions = {
        theme: "light2",
        title: {
            text: `Stock Price of ${stocks}`
        },
        axisY: {
            title: "Price per share of USD",
            prefix: "$"
        },
        data: [{
            type: "line",
            xValueFormatString: "MMM-DD-YYYY",
            //yValueFormatString: "$#,###.##",
            dataPoints: dataPoints
        }]
    }

    const updateGraphData = () => {
        console.log(dataPoints)
        graphOptions.data.dataPoints = dataPoints;
        console.log(graphOptions)
        setDataFormatted(true)
        return;
    } 

    const formatGraphData = (data) => {
        //setDataPoints([])
        for (var i = 0; i < data.length; i++) {
                let formattedDate = new Date (data[i][1])
                formattedDate = formattedDate.toString();
                let month = formattedDate.substring(4,7)
                let day = formattedDate.substring(8,10)
                let year = formattedDate.substring(11,16)
                formattedDate = month + "-" + day + "-" + year
            dataPoints.push({
                x: new Date(formattedDate),
                y: Number((data[i][0].toFixed(2)))
            });
        }
    console.log(dataPoints)
    updateGraphData();
    }



    const getGraphData = async() => {
        let apiRes = null;
        //console.log(stocks)
        //stockIDs = stocks[0]
        apiRes = await axios.get(`http://localhost:3001/api/sector/${stocks}/${startMonth}/${startYear}/${endMonth}/${endYear}`)
        .then((response) => {
            console.log('in then block')
            setStockData(response.data)
            formatGraphData(response.data);
            return;
        })
        .catch((error) => {
            console.log('sent here in catch')
            console.log(error)

            if (error.response) {
                console.log('im in here?')
                return { error: error.response.data.error };
              }
              return {
                error: "Unable to upload to database!"
              };
              
        });
    };
    
    let sectorGraph = {
        theme: "light2",
        title: {
            text: `Stock Prices of Industry Leaders and Losers`
        },
        axisY: {
            title: "Price per share USD",
            prefix: "$"
        },
        data: [{
            type: "spline",
            name: "2016",
            showInLegend: true,
            dataPoints: null
                
            
        },
        {
            type: "spline",
            name: "2017",
            showInLegend: true,
            dataPoints: null
        }]
    }

    const getPerformerData = async(pList) => {
        let pData = [];
        console.log(pList)
        for (var i = 0; i < pList.length; i++) {
            let apiRes = null;
            let id = pList[i][0];
            apiRes = await axios.get(`http://localhost:3001/api/sector/${id}/01/${startDate}/01/${endDate}`)
                .then((response) => {
                    console.log('in then block')
                    //console.log(response.data)
                    //pData = performerData;
                    pData.push(response.data)
                    //setPerformerData(pData);
                })
                .catch((error) => {
                    console.log('sent here in catch')
                    console.log(error)

                    if (error.response) {
                        console.log('im in here?')
                        return { error: error.response.data.error };
                    }
                    return {
                        error: "Unable to upload to database!"
                    };
                    
                });
        }
        console.log(sectorGraph)
        formatPerformerData(pData, pList);
    }

    //Maybe just initialize a here as an object array of the correct structrue name: string...then fill it in?

    const formatPerformerData = async(pData, pList) => {
        
        console.log(sectorGraph)
        console.log(pList)
        console.log(pData)
        let gData = JSON.parse(JSON.stringify(sectorGraph));
        console.log(gData)
        console.log(gData.data[0])
        let a = gData.data[0];
        


        for (var i = gData.data.length; i < pData.length; i++) {
            gData.data.push(a)
        }
        console.log("gData data lgnth" + gData.data.length)
        console.log(gData.data)
        for (var i = 0; i < pData.length; i++) {
                
                //console.log(gData.data)
                let b = gData.data[i];
                console.log(pList[i][1] + "/" + pList[i][2])
                b.type = "line";
                b.name = pList[i][1] + "/" + pList[i][2];
                
                b.showInLegend = true;
                b.dataPoints = []
                console.log(b)
                    for (var j = 0; j < pData[i].length; j++) {
                        let formattedDate = new Date (pData[i][j][1])
                        formattedDate = formattedDate.toString();
                        let month = formattedDate.substring(4,7)
                        let day = formattedDate.substring(8,10)
                        let year = formattedDate.substring(11,16)
                        formattedDate = month + "-" + day + "-" + year
                    b.dataPoints.push({
                        x: new Date(formattedDate),
                        y: Number((pData[i][j][0].toFixed(2)))
                    });
                }
                console.log(b)
                console.log(gData.data[i])
                gData.data[i] = b;
                console.log(gData.data[i])
                //console.log(gData.data)
        }
        
        console.log(gData.data);
        updateSectorGraph(gData)
    }

    const updateSectorGraph = (c) => {
        //console.log(sectorGraph.data)
        setSectorDataPoints(c)
        setShowSectorGraph(true)
    }

    const getPerformers = async() => {
        console.log(sectorGraph)
        let apiRes = null;
        let sD = String(startDate)
        let dateData = sD.concat(String(endDate))
        console.log(dateData)
        apiRes = await axios.get(`http://localhost:3001/api/sector/performance/${dateData}`)
                .then((response) => {
                    console.log('in then block')
                    getPerformerData(response.data);
                })
                .catch((error) => {
                    console.log('sent here in catch')
                    console.log(error)

                    if (error.response) {
                        console.log('im in here?')
                        return { error: error.response.data.error };
                    }
                    return {
                        error: "Unable to upload to database!"
                    };
                    
                });
                console.log('the end of getPerformers called')
                console.log(sectorGraph)
            };

    const addStock = (data) => {
        setSelectedStock(data)
        console.log(data)
        /* let temp = []
        temp = stocks
        temp.push(data) */
        setStocks(data)
    }

    if (goCalculator) {
        return <Redirect to="/Calculator" />;
    }

    if (goHome) {
        console.log(goHome)
        //return <Redirect to="/Home"/>;
        window.location.reload();
        setGoHome(false)
    }

    const OpenStockModal = () => {
        setShowStockModal(true);
    }

    const CloseStockModal = () => {
        setShowStockModal(false);
    }
    const OpenMonthModal = () => {
        setShowMonthModal(true);
    }

    const CloseMonthModal = () => {
        setShowMonthModal(false);
        console.log(startDate);
    }

    const checkDateValues = () => {
        if ((startDate != null && endDate != null) && (startDate < endDate)) {
            CloseMonthModal();
            getPerformers();
            console.log(sectorGraph)
        }
        else if (startDate >= endDate){
            alert('The start date must be before the end date')
        }
        else {
            alert('You need to submit values')
        }
    }

    const checkDates = () => {
        if ((startYear != null && endYear != null) && (startYear <= endYear)) {
            CloseTimeModal();
            getGraphData();
            return;
        }
        else if (startYear >= endYear){
            alert('The start date must be before the end date')
        }
        else {
            alert('You need to submit values')
        }
    }

    const OpenTimeModal = () => {
        setShowTimeModal(true);
    }

    const CloseTimeModal = () => {
        setShowTimeModal(false);
    }


    if (dataFormatted) {
        //graphOptions.data.dataPoints = dataPoints
        console.log(graphOptions.data)
        return (
            <div className="Home">
    
                <Container className="Container" text style={{ marginTop: '7em' }}>
                    <Grid textAlign="center" verticalAlign="middle" centered>
                        <Grid.Row centered>
                            <Grid.Column>
                                <Header textAlign='center' size='huge'>
                                    Stocks Simplified
                            </Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Search/>
                            <Button onClick={OpenMonthModal}>sectorPerformance </Button>
                        </Grid.Row>
                        <Grid.Row>
                            <h>Selected Stock: {stocks} </h>
    
                        </Grid.Row>
                        <Grid.Row>
                        <CanvasJSChart options = {graphOptions} 
				 
			                    />
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
            )
    }

    else {
       console.log(sectorDataPoints)
    return (
        <div className="Home">

            <Container className="Container" text style={{ marginTop: '7em' }}>
                <Grid textAlign="center" verticalAlign="middle" centered>
                    <Grid.Row centered>
                        <Grid.Column>
                            <Header textAlign='center' size='huge'>
                                Stocks Simplified
                        </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Search stockNames = {stockNames}
                            addStock={addStock}
                            CloseStockModal={CloseStockModal} />
                    </Grid.Row>
                    <Grid.Row>
                        <Button onClick={OpenMonthModal}>sectorPerformance </Button>
                    </Grid.Row>
                    <Grid.Row>
                        <h>Selected Stock: {stocks} </h>

                    </Grid.Row>
                    <Grid.Row>
                        <Button onClick={OpenTimeModal}>Select Time Period</Button>
                    </Grid.Row>
                    <Grid.Row>
                    {showSectorGraph ? <CanvasJSChart options = {sectorDataPoints}/> : null}
                    </Grid.Row>
                    
                    
                    <Modal open={showStockModal}
                        onClose={CloseStockModal}
                        closeIcon
                        centered
                    >
                        <Modal.Header> Search for a Stock </Modal.Header>
                        <Search
                            stockNames = {stockNames}
                            addStock={addStock}
                            CloseStockModal={CloseStockModal}
                        />
                    </Modal>
                    <Modal open={showMonthModal}
                        onClose={CloseMonthModal}
                        closeIcon
                        centered
                        size="large"
                    >
                        <Modal.Header> What Time Period Are You Interested In? </Modal.Header>
                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field
                                            control={Input}
                                            label="Start Year"
                                            placeholder="Start Year"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setStartDate(event.target.value)}
                                            />
                                        </Form>
                                    </Grid.Column>
                                        
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field
                                            control={Input}
                                            label="End Year"
                                            placeholder="End Year"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setEndDate(event.target.value)}
                                            />
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn>
                                    <Button centered="true"
                                    onClick={checkDateValues}
                                    >Ok</Button>    
                                    </GridColumn>
                                    
                                </Grid.Row>
                            
                        </Grid>
                    </Modal>
                    <Modal open={showTimeModal}
                        onClose={CloseTimeModal}
                        closeIcon
                        centered
                        size="large"
                    >
                        <Modal.Header> What Time Period Are You Interested In? </Modal.Header>
                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                    <Form>
                                        <Form.Field
                                        control={Input}
                                        label="Start Month"
                                        placeholder="Start Month"
                                        fluid
                                        required = {true}
                                        onChange={(event) => setStartMonth(event.target.value)}
                                        />
                                        </Form>
                                    </Grid.Column>
                                        
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field
                                            control={Input}
                                            label="End Month"
                                            placeholder="End Month"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setEndMonth(event.target.value)}
                                            />
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form>
                                            
                                            <Form.Field
                                            control={Input}
                                            label="Start Year"
                                            placeholder="Start Year"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setStartYear(event.target.value)}
                                            />

                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field
                                            control={Input}
                                            label="End Year"
                                            placeholder="End Year"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setEndYear(event.target.value)}
                                            />
                                        </Form>
                                    </Grid.Column>    
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn>
                                    <Button centered="true"
                                    onClick={checkDates}
                                    >Load Graph</Button>    
                                    </GridColumn>
                                    
                                </Grid.Row>
                            
                        </Grid>
                    </Modal>
                </Grid>
            </Container>
        </div>
    )
    }
}

export default Home;
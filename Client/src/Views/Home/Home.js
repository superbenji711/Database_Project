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
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [goHome, setGoHome] = useState(false);
    const [goCalculator, setGoCalculator] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [stockData, setStockData] = useState(null);
    const [stockNames, setStockNames] = useState(null);
    const [startYear, setStartYear] = useState(null);
    const [startMonth, setStartMonth] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [endMonth, setEndMonth] = useState(null);
    const [dataPoints, setDataPoints] = useState([]);
    const [dataFormatted, setDataFormatted] = useState(false);
    
 

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
                        <h>Selected Stock: {stocks} </h>

                    </Grid.Row>
                    <Grid.Row>
                        <Button onClick={OpenTimeModal}>Select Time Period</Button>
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
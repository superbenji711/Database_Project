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
    const [goHome, setGoHome] = useState(false);
    const [goCalculator, setGoCalculator] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [stockNames, setStockNames] = useState(null);
    const [showCorrelatedPeaksGraph, setShowCorrelatedPeaksGraph] = useState(false);
    const [correlatedPeaksGraphData, setCorrelatedPeaksGraphData] = useState(false);
    const [showCorrelatedFallsGraph, setShowCorrelatedFallsGraph] = useState(false);
    const [correlatedFallsGraphData, setCorrelatedFallsGraphData] = useState(false);
    const [isLoaded, setLoaded] = useState(false);

    const getCorrelatedPeaksData = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
        }
        if (showCorrelatedPeaksGraph) {
            setShowCorrelatedPeaksGraph(false);
            return;
        }
        setLoaded(false);
        setShowCorrelatedFallsGraph(false);
        let apiRes = null;
        let peaksData = [];
        apiRes = await axios.get(`http://localhost:3001/api/stock/data/${selectedStock}`)
        .then((response) => {
            console.log(response.data)
            peaksData.push(response.data);
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
        let peaks = []
        apiRes = await axios.get(`http://localhost:3001/api/stock/correlatedPeaks/${selectedStock}`)
        .then((response) => {
            peaks = response.data;
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
        for(let i= 0; i < peaks.length; i++){
            apiRes = await axios.get(`http://localhost:3001/api/stock/data/${peaks[i][0]}`)
            .then((response) => {
                peaksData.push(response.data);
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
        let correlatedPeaksGraphOption = [];
        for(let i = 0; i < peaksData.length; i++){
            let graphData = {type: 'spline',name:`${peaksData[i][0][0]}`,showInLegend:true,dataPoints:[]}
            for(let j = 0; j < peaksData[i].length; j++){
                let formattedDate = new Date (peaksData[i][j][1])
                formattedDate = formattedDate.toString();
                let month = formattedDate.substring(4,7)
                let day = formattedDate.substring(8,10)
                let year = formattedDate.substring(11,16)
                formattedDate = month + "-" + day + "-" + year
                graphData.dataPoints.push({
                    x: new Date(formattedDate),
                    y: Number((peaksData[i][j][2].toFixed(2)))
            });
            }
            correlatedPeaksGraphOption.push(graphData);
        }
        setCorrelatedPeaksGraphData(correlatedPeaksGraphOption);
        setShowCorrelatedPeaksGraph(true);
        setLoaded(true);
    };
    

    const getCorrelatedFallsData = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
        }
        if (showCorrelatedFallsGraph) {
            setShowCorrelatedFallsGraph(false);
            return;
        }
        setLoaded(false);
        setShowCorrelatedPeaksGraph(false);
        let apiRes = null;
        let fallsData = [];
        apiRes = await axios.get(`http://localhost:3001/api/stock/data/${selectedStock}`)
        .then((response) => {
            fallsData.push(response.data);
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
        let falls = []
        apiRes = await axios.get(`http://localhost:3001/api/stock/correlatedFalls/${selectedStock}`)
        .then((response) => {
            falls = response.data;
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
        for(let i= 0; i < falls.length; i++){
            apiRes = await axios.get(`http://localhost:3001/api/stock/data/${falls[i][0]}`)
            .then((response) => {
                fallsData.push(response.data);
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
        let correlatedFallsGraphOption = [];
        for(let i = 0; i < fallsData.length; i++){
            let graphData = {type: 'spline',name:`${fallsData[i][0][0]}`,showInLegend:true,dataPoints:[]}
            for(let j = 0; j < fallsData[i].length; j++){
                let formattedDate = new Date (fallsData[i][j][1])
                formattedDate = formattedDate.toString();
                let month = formattedDate.substring(4,7)
                let day = formattedDate.substring(8,10)
                let year = formattedDate.substring(11,16)
                formattedDate = month + "-" + day + "-" + year
                graphData.dataPoints.push({
                    x: new Date(formattedDate),
                    y: Number((fallsData[i][j][2].toFixed(2)))
            });
            }
            correlatedFallsGraphOption.push(graphData);
        }
        setCorrelatedFallsGraphData(correlatedFallsGraphOption);
        setShowCorrelatedFallsGraph(true);
        setLoaded(true);
    };
    

    const correlatedPeaksGraph = {
        theme: "light2",
        title: {
            text: `Correlated Stock Peaks`
        },
        axisY: {
            title: "Closing Price",
            prefix: "$"
        },
        data: correlatedPeaksGraphData
    }
    const correlatedFallsGraph = {
        theme: "light2",
        title: {
            text: `Correlated Stock Falls`
        },
        axisY: {
            title: "Closing Price",
            prefix: "$"
        },
        data: correlatedFallsGraphData
    }

    const addStock = (data) => {
        setSelectedStock(data)
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
                    <Grid.Row centered>
                        <Header  textAlign='center' size='medium'>Selected Stock: {selectedStock} </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Button style={{width: 200,textAlign: 'center'}} onClick={getCorrelatedFallsData}>Correlated Falls</Button>
                        <Button style={{width: 200,textAlign: 'center'}} onClick={getCorrelatedPeaksData}>Correlated Peaks</Button>
                    </Grid.Row>
                    <Grid.Row>
                        {isLoaded ? null : <Header>Loading...</Header>}
                        {showCorrelatedFallsGraph ? <CanvasJSChart options = {correlatedFallsGraph}/> : null}
                        {showCorrelatedPeaksGraph ? <CanvasJSChart options = {correlatedPeaksGraph}/> : null}
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
                </Grid>
            </Container>
        </div>
    )
}

export default Home;
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
    const [showDModal, setShowDModal] = useState(false);
    const [DModalYear, setDModalYear] = useState(false);
    const [distribData, setDistribData] = useState([]);
    const [showDistributionGraph, setShowDistributionGraph] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showSectorGraph, setShowSectorGraph] = useState(false);
    const [sectorDataPoints, setSectorDataPoints] = useState([]);
    const [mean, setMean] = useState(null)

    //displays number of tuples in database
    const getCount = async() => {
        let apiRes = null;
        try {
            apiRes = await axios.get(`http://localhost:3001/api/gdp/count`);
          } catch (err) {
            apiRes = err.response;
            console.log("mf sucka");
  
          } finally {
              console.log(apiRes.data); // Could be success or error
          }
          alert(`There are ${apiRes.data[0]} many tuples of stock values in the database. That is over 250,000!!`);
          return;
    }

    const distribGraph = {
        title: {
            text: `Distribution of ${DModalYear} Stock Values with Mean = ${mean}`
        },
        axisX: {
            title: "Price per share in USD",
            prefix: "$"
        },
        axisY: {
            title: "Probability of having share value of x value",
            
        }, 
        data: [
        {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: "spline",
            dataPoints: distribData
        }
        ]
    }
    //get data for distrib graph
    const DistributionData = async() => {
        console.log(DModalYear)
        if (DModalYear < 1983){
            alert('Select a later day please')
            return
        }

         if (showDistributionGraph) {
            setShowDistributionGraph(false)
            return;
        } 
        setLoaded(false);
        setShowDistributionGraph(false);
        let apiRes = null;
        let data = []
        try {
          apiRes = await axios.get(`http://localhost:3001/api/sector/distrib/${DModalYear}`);
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
            console.log(apiRes.data); // Could be success or error
        }

        console.log(apiRes.data[0][0])
        let mean = apiRes.data[0][0];
        let m = 1/mean
        mean = mean.toFixed(0)

        for (var i = 0; i < 20; i++) {
            console.log(i)
            let xVal =  Math.pow(2,i)
            let yVal = m * Math.exp(-m*xVal)
            console.log(xVal)
            data.push({
                label: xVal,
                y: yVal*100
            })
        }
        console.log(data) 

        setMean(mean)
        setDistribData(data);
        setLoaded(true)
        setShowDistributionGraph(true) 

    }
    //open Modal for Distrib graph
    const OpenDModal = () => {
        if (showDistributionGraph) {
            return setShowDistributionGraph(false)
        }
        setShowDModal(true);
        
    }
    //close modal for sector perf
    const CloseDModal = () => {
        DistributionData();
        setShowDModal(false);
    }

    //get data for sector performance graph
    const getPerformers = async() => {
        let apiRes = null;
        let sD = String(startDate)
        let dateData = sD.concat(String(endDate))
        console.log(dateData)
        apiRes = await axios.get(`http://localhost:3001/api/sector/performance/${dateData}`)
                .then((response) => {
                    console.log('in then block')
                    //getPerformerData(response.data);
                    console.log(response.data)
                    formatSectorGraph(response.data);
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
                //console.log('the end of getPerformers called')
                //console.log(sectorGraph)
                
    };

    //format data for sector performance graph
    const formatSectorGraph = (data) => {
        let secOptions = {
			//animationEnabled: true,
			exportEnabled: true,
			theme: "light2", //"light1", "dark1", "dark2"
			title:{
				text: `Best/Worst Performers by Sector in ${startDate}-${endDate}`
			},
			axisY: {
				includeZero: true,
                title: "Relative change in growth",
                prefix: "%"
			},
            axisX: {
                
            },
			data: [{
				type: "column", //change type to bar, line, area, pie, etc
				//indexLabel: "{y}", //Shows y value on all Data Points
				indexLabelFontColor: "#5A5757",
				indexLabelPlacement: "outside",
				dataPoints: []
			}]
		}
        let dp = []
        console.log(data)
        data.sort(function(a, b) {
            return a[2].localeCompare(b[2]);
          })
        console.log(data)
        data.map(d=>(
            dp.push({label: String(d[1] + "-" + d[2] ),
                    y: (Math.round(Number(d[3])))
                })
                
        ))
        console.log(dp)
        
        secOptions.data[0].dataPoints = dp
        console.log(secOptions.data)
        updateSectorGraph(secOptions)
    };
    //update graph for sector performance
    const updateSectorGraph = (c) => {
        //console.log(sectorGraph.data)
        setLoaded(true);
        setSectorDataPoints(c)
        setShowSectorGraph(true)
    }
    //open modal for sector perf
    const OpenMonthModal = () => {
        console.log(showSectorGraph)
        if (showSectorGraph) {
            console.log('here')
            setShowSectorGraph(false);
        }
        else {
        setShowMonthModal(true);
        }
    }
    //close modal for sector perf
    const CloseMonthModal = () => {
        setShowMonthModal(false);
    }

    //check Date values for sector performance
    const checkDateValues = () => {
        if ((startDate != null && endDate != null) && (startDate < endDate)) {
            CloseMonthModal();
            setLoaded(false);
            getPerformers();
        }
        else if (startDate >= endDate){
            alert('The start date must be before the end date')
        }
        else {
            alert('You need to submit values')
        }
    }

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
                            <Header textAlign='center' size='small'>
                                Calculations and correlations performed are based on historical NASDAQ stock values.
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row fluid>
                        <Button style={{width: 200,textAlign: 'center',}} onClick={getCount}>Woa, like how many tuples are there?</Button>
                    </Grid.Row>
                    <Header textAlign='center' size='medium'>
                        Stock Market Performance Based On Time Periods
                    </Header>
                    <Grid.Row>
                        <Button style={{width: 200,textAlign: 'center',}} onClick={OpenDModal}>Stock Value Distribution</Button>
                        <Button style={{width: 200,textAlign: 'center',}} onClick={OpenMonthModal}>Best Peformers by Sector </Button>
                    </Grid.Row>
                    <Header textAlign='center' size='medium'>
                        Specific Stock Performance Correlations
                    </Header>
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
                        {isLoaded ? null : <Header>Waiting for data...</Header>}
                        {showCorrelatedFallsGraph ? <CanvasJSChart options = {correlatedFallsGraph}/> : null}
                        {showCorrelatedPeaksGraph ? <CanvasJSChart options = {correlatedPeaksGraph}/> : null}
                        {showSectorGraph ? <CanvasJSChart options = {sectorDataPoints}/> : null}
                        {showDistributionGraph ? <CanvasJSChart options = {distribGraph}/> : null}
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
                    <Modal open={showDModal}
                        onClose={CloseDModal}
                        closeIcon
                        centered
                        size="large"
                    >
                        <Modal.Header> What Year are you interested in? </Modal.Header>
                            <Grid columns={2} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field
                                            control={Input}
                                            label="Start Year"
                                            placeholder="Year"
                                            fluid
                                            required = {true}
                                            onChange={(event) => setDModalYear(event.target.value)}
                                            />
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn>
                                    <Button centered="true"
                                    onClick={CloseDModal}
                                    >Ok</Button>    
                                    </GridColumn>
                                    
                                </Grid.Row>
                            
                        </Grid>
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
                </Grid>
            </Container>
        </div>
    )
}

export default Home;
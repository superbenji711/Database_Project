import React, {useState} from 'react';

import {Container,Header,Grid,Button, Input, Form, Modal, GridColumn} from 'semantic-ui-react';
import Search from '../Search/Search';
import axios from 'axios';
import CanvasJSReact from "../../Assets/canvasjs.react";
var { jStat } = require('jstat');
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Correlator = () =>{
    let chart = null;
    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [dataPoints, setDataPoints] = useState([]);
    const [additionalData, setAdditionalData] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [showMSChart, setShowMSChart] = useState(false);
    const [showCPIChart, setShowCPIChart] = useState(false);
    const [showGDPChart, setShowGDPChart] = useState(false);
    const [showGDPChart2, setShowGDPChart2] = useState(false);

    const [showMonthModal, setShowMonthModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showSectorGraph, setShowSectorGraph] = useState(false);
    const [sectorDataPoints, setSectorDataPoints] = useState([]);
    const [stockGDPCORR, setStockGDPCORR] = useState(null);
    const [stockGDPData, setStockGDPData] = useState(false);
    const [GDPData, setGDPData] = useState(false);
    const [showDModal, setShowDModal] = useState(false);
    const [DModalYear, setDModalYear] = useState(false);
    const [distribData, setDistribData] = useState([]);
    const [showDistributionGraph, setShowDistributionGraph] = useState(false);
    const[mean, setMean] = useState(null)

    

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

    //does correlation for gdp vs. stock
    const gdpCorrelator = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
        }

        if (showGDPChart) {
            setShowGDPChart(false)
            setShowGDPChart2(false)
            return;
        }
        setLoaded(false);
        setShowGDPChart(false);
        let apiRes = null;
        let stock = selectedStock[1];
        console.log(stock)
        let data = []
        //correlation score
        try {
          apiRes = await axios.get(`http://localhost:3001/api/gdp/corr/${stock}`);
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
            console.log(apiRes.data); // Could be success or error
            setStockGDPCORR(apiRes.data)
        }
        //stock data vs GDP data
        try {
            apiRes = await axios.get(`http://localhost:3001/api/gdp/${stock}`);
          } catch (err) {
            apiRes = err.response;
            console.log("mf sucka");
  
          } finally {
              console.log(apiRes.data); // Could be success or error
              data = apiRes.data
          }
        
          let d = new Date(data[0][0], data[0][1])
          console.log(d)

          let stockData = []
          let GDPData = []
        for (var i = 0; i < data.length; i++) {
            let date = new Date(data[i][0], data[i][1])
            stockData.push({
                x: date,
                y: data[i][2]
            })
            GDPData.push({
                x: date,
                y: data[i][3]
            })
        }
        console.log(stockData);
        console.log(GDPData);
        setStockGDPData(stockData);
        setGDPData(GDPData);
        
        setLoaded(true);
        setShowGDPChart(true); 
        setShowGDPChart2(true);
        return;
    };
    //graph data for stock graph 
     const gdpCorrelatorGraph = {
        theme: "light2",
        title: {
            text: `Stock Price of ${selectedStock}: Correlation Score w/ GDP = ${stockGDPCORR}`
        },
        axisY: {
            title: "Price per share of USD",
            prefix: "$"
        },
        data: [{
            type: "line",
            //xValueFormatString: "MMM-DD-YYYY",
            //yValueFormatString: "$#,###.##",
            dataPoints: stockGDPData
        }]
    }
    //graph data for gdp graph
    const gdpGraph = {
        theme: "light2",
        title: {
            text: `Value of GDP Over Time`
        },
        axisY: {
            title: "Price per share of USD",
            prefix: "$"
        },
        data: [{
            type: "line",
            //xValueFormatString: "MMM-DD-YYYY",
            //yValueFormatString: "$#,###.##",
            dataPoints: GDPData
        }]
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
        setSectorDataPoints(c)
        setShowSectorGraph(true)
    }
    //open modal for sector perf
    const OpenMonthModal = () => {
        console.log(showSectorGraph)
        if (showSectorGraph) {
            console.log('here')
            setShowSectorGraph(false)
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
            getPerformers();
        }
        else if (startDate >= endDate){
            alert('The start date must be before the end date')
        }
        else {
            alert('You need to submit values')
        }
    }



    const cpiCorrelator = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
        }
        if (showCPIChart) {
            setShowCPIChart(false);
            return;
        }
        setLoaded(false);
        setShowMSChart(false);
        let apiRes = null;
        let stock = selectedStock[1];
        console.log(stock);
        try {
          apiRes = await axios.get(`http://localhost:3001/api/cpi/${stock}`);
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
          console.log(apiRes.data); // Could be success or error
        }
        let datapoints = []
        let additionalData = []
        apiRes.data.map(d=>
            {// check if significant
            let pvalue = jStat.ttest(d[2],d[3],2);
            let sig = '';
            if (pvalue < 0.10) {sig = '*'}
            datapoints.push({
                label:d[0],
                y:d[1],
            })
            additionalData.push({
                label:d[0],
                y:d[2],
                indexLabel: `${sig}`, 
                indexLabelFontColor: "white", 
                indexLabelOrientation: "horizontal", 
                indexLabelPlacement: "inside"
            })
            }
        )
        setDataPoints(datapoints);
        setAdditionalData(additionalData);
        setLoaded(true);
        setShowCPIChart(true);
    };
    const msCorrelator = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
        }

        if (showMSChart) {
            setShowMSChart(false)
            return;
        }
        setLoaded(false);
        setShowCPIChart(false);
        let apiRes = null;
        let stock = selectedStock[1];
        try {
          apiRes = await axios.get(`http://localhost:3001/api/moneystock/${stock}`);
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
            console.log(apiRes.data); // Could be success or error
        }
        let datapoints = []
        apiRes.data.map(d=>(
            datapoints.push({label:d[0],y:d[1]})
        ))
        setDataPoints(datapoints);
        try {
            apiRes = await axios.get(`http://localhost:3001/api/moneystock/`);
          } catch (err) {
            apiRes = err.response;
            console.log("mf sucka");
  
          } finally {
              console.log(apiRes.data); // Could be success or error
          }
        datapoints = []
        apiRes.data.map(d=>(
            datapoints.push({label:d[0],y:d[1]})
        ))
        setAdditionalData(datapoints);
        setLoaded(true);
        setShowMSChart(true);
    };
    const addStock = async(data) => { 
        let stock = data;
        let apiRes = null;
        console.log(stock);
        try {
          apiRes = await axios.get(`http://localhost:3001/api/sector/'${stock}'`);
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
          console.log(apiRes); // Could be success or error
        }
        setSelectedStock(apiRes.data[0])
    }
    const CloseStockModal = () => {
        setShowStockModal(false);
    }
    const cpiChart = {
        title: {
            text: "Correlation Between Avg Monthly Stock Value and Monthly % Change In CPI By Category"
        },
        data: 
        [
        {
            showInLegend: true, 
            name: "series1",
            legendText: "Correlation Coefficient",
            indexLabelFontSize: 40,
            type: "column",
            dataPoints: dataPoints
        },
        {
            showInLegend: true, 
            name: "series2",
            legendText: "T-test Score",
            indexLabelFontSize: 40,
            type: "column",
            dataPoints: additionalData
        }
        ]
    }
    const msChart= {
        title: {
            text: "Money Stock Correlation By Year"
        },
        data: [
        {
            showInLegend: true, 
            name: "series1",
            legendText: "Correlation Coefficient",
            type: "line",
            dataPoints: dataPoints
        },
        {
            showInLegend: true, 
            name: "series2",
            lineThickness: 0.5,
            lineDashType: 'dot',
            axisXType: "secondary",
            legendText: "Money Stock as Weekly Percent Changes",
            type: 'line',
            dataPoints: additionalData
        }
        ]
    }

    
    return(       
        <Container className="Container" style={{ marginTop: '7em' }}>
            <Grid textAlign="center" verticalAlign="middle" centered>
                <Grid.Row centered>
                    <Grid.Column>
                        <Header style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>
                            Stock Correlator
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Search addStock={addStock} CloseStockModal={CloseStockModal}/>
                </Grid.Row>
                <Header textAlign='center'>Based on Economic Indicators</Header>
                <Grid.Row fluid>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={cpiCorrelator}>Consumer Price Index</Button>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={msCorrelator}>Money Stock</Button>       
                     <Button style={{width: 200,textAlign: 'center',}} onClick={OpenMonthModal}>Best Peformers by Sector </Button>
                </Grid.Row>
                <Grid.Row fluid>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={gdpCorrelator}>Stock/GDP Correlation</Button>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={getCount}>Woa, like how many tuples are there?</Button>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={OpenDModal}>Stock Value Distribution</Button>

                </Grid.Row>
                <Grid.Row style={{paddingTop:50}}>
                    <Grid.Column>
                        <Header style={{fontSize: 25, fontWeight: 'bold' }} textAlign='center'>Stock Selected: {selectedStock ? selectedStock[0] : ''}</Header>
                        <Header style={{fontSize: 25, fontWeight: 'bold' }} textAlign='center'>Industry Sector: {selectedStock ? selectedStock[2] : ''}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{paddingTop:50}}>
                    {isLoaded ? null : <Header>Loading...</Header>}
                    {showCPIChart ? <div style={{width:'100%'}}><CanvasJSChart options = {cpiChart}/><Header>*Statistically Significant: T-test score of correlation coefficient has p-value {"< 0.10"}</Header></div> : null}
                    {showMSChart ? <CanvasJSChart options = {msChart}/> : null}
                    {showSectorGraph ? <CanvasJSChart options = {sectorDataPoints}/> : null}
                    {showGDPChart ? <CanvasJSChart options = {gdpCorrelatorGraph}/> : null}
                    {showGDPChart2 ? <CanvasJSChart options = {gdpGraph}/> : null}
                    {showDistributionGraph ? <CanvasJSChart options = {distribGraph}/> : null}
                </Grid.Row>
            </Grid>
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
        </Container>
    )
}
export default Correlator;
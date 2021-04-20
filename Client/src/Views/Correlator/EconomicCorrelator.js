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

    const [stockGDPCORR, setStockGDPCORR] = useState(null);
    const [stockGDPData, setStockGDPData] = useState(false);
    const [GDPData, setGDPData] = useState(false);

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
            text: `Correlation Score w/ GDP = ${stockGDPCORR}`
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
                    <Header textAlign='center' size='huge'>
                        Economic Correlator.
                    </Header>
                    <Header textAlign='center'>Calculations and correlations performed are based on specific stock values and economic indicators.</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Search addStock={addStock} CloseStockModal={CloseStockModal}/>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Header  textAlign='center' size='medium'>Stock Selected: {selectedStock ? selectedStock[0] : ''}</Header>
                        <Header  textAlign='center' size='medium'>Industry Sector: {selectedStock ? selectedStock[2] : ''}</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row fluid>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={cpiCorrelator}>Consumer Price Index</Button>
                    <Button style={{width: 200,textAlign: 'center',}} onClick={msCorrelator}>Money Stock</Button>  
                    <Button style={{width: 200,textAlign: 'center',}} onClick={gdpCorrelator}>Gross Domestic Product</Button>     
                </Grid.Row>
                <Grid.Row style={{paddingTop:50}}>
                    {isLoaded ? null : <Header>Waiting for data...</Header>}
                    {showCPIChart ? 
                    <div style={{width:'100%'}}>
                        <CanvasJSChart options = {cpiChart}/>
                        <Header>*Statistically Significant: T-test score of correlation coefficient has p-value {"< 0.10"}</Header>
                        <Header>So what?</Header>
                        <Header size='small'>This shows the correlation of your stock's average monthly value compared to the monthy percent changes in the different categories of the economy's CPI over time...{<br/>}
                            You can use this to make decisions on your stock based on the current economy's CPI value{<br/>}
                            Example: If your stock has a statistically significant positive correlation with rises in monthly Communication CPI values; than if the Communication CPI values are currently rising it may be good to hold on to your stock.
                        </Header>
                    </div> 
                    : null}
                    {showMSChart ? 
                    <div style={{width:'100%'}}>
                        <CanvasJSChart options = {msChart}/>
                        <Header>So what?</Header>
                        <Header size='small'>This shows the correlation of your stock's average weekly value compared to the weekly money supply throughout time...{<br/>}
                            You can use this to evaluate how correlated your stock's performance behavior is with the changes in the economy's money supply{<br/>}
                            Example: If your stock tends to have negative correlations when money supply has peaked throught the economy's history than you may infer the value of your stock falls when money supply in the economy increases.
                        </Header>
                    </div> 
                    : null}
                    {showGDPChart ? <CanvasJSChart options = {gdpCorrelatorGraph}/> : null}
                    {showGDPChart2 ? 
                        <div style={{width:'100'}}>
                            <CanvasJSChart options = {gdpGraph}/> 
                            <Header>So what?</Header>
                            <Header size='small'>This shows the correlation with your stock's average quarterly value compared to the economy's GDP value over time...{<br/>}
                            You can use this to make decisions on your stock based on the current economy's GDP value{<br/>}
                            Example: If your stock has a strong positive correlation with GDP and the GDP is currently declining than it may be a good time to sell.
                            </Header>
                        </div>
                    : null}
                </Grid.Row>
            </Grid>
        </Container>
    )
}
export default Correlator;
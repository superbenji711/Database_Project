import React, {useState} from 'react';
import {Container,Header,Grid,Button} from 'semantic-ui-react';
import Search from '../Search/SearchSectors';
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

    const cpiCorrelator = async() => {
        if (selectedStock == null){
            alert('You did not select a stock')
            return
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
                </Grid.Row>
            </Grid>
        </Container>
    )
}
export default Correlator;
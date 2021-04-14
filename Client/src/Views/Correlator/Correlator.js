import React,{ useState, useEffect } from 'react';
import {Container,Header,Grid,Button,Label} from 'semantic-ui-react';
import Search from '../../Component/SearchBar';
import CanvasJSReact from '../../Assets/canvasjs.stock.react';
import axios from 'axios';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const Correlator = () =>{
    
    const CPI = async() => {
        let apiRes = null;
        try {
          apiRes = await axios.get('http://localhost:3001/api/CPI');
        } catch (err) {
          apiRes = err.response;
        } finally {
        //   console.log(apiRes); // Could be success or error
        }
      };
    
    const [dataPoints, setDataPoints] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [risesActive, setRisesActive] = useState(true);
    const [risesColor, setRisesColor] = useState('light green');
    const [fallsActive, setFallsActive] = useState(false);
    const [fallsColor, setFallsColor] = useState('#E6E6E6');
    const [GDPActive, setGDPActive] = useState(false);
    const [GDPColor, setGDPColor] = useState('#E6E6E6');
    const [CPIActive, setCPIActive] = useState(false);
    const [CPIColor, setCPIColor] = useState('#E6E6E6');
    const [MSActive, setMSActive] = useState(false);
    const [MSColor, setMSColor] = useState('#E6E6E6');
    const [SPActive, setSPActive] = useState(false);
    const [SPColor, setSPColor] = useState('#E6E6E6');
    const [sectorsActive, setSectorsActive] = useState(false);
    const [sectorsColor, setSectorsColor] = useState('#E6E6E6');
    const handleClickRises = () => {
        setRisesActive(true);
        setFallsActive(false);
        setGDPActive(false);
        setCPIActive(false);
        setMSActive(false);
        setSPActive(false);
        setSectorsActive(false);
        setRisesColor('light green');
        setFallsColor('#E6E6E6');
        setGDPColor('#E6E6E6');
        setCPIColor('#E6E6E6');
        setMSColor('#E6E6E6');
        setSPColor('#E6E6E6');
        setSectorsColor('#E6E6E6');
    }
    const handleClickFalls = () => {
        setRisesActive(false);
        setFallsActive(true);
        setGDPActive(false);
        setCPIActive(false);
        setMSActive(false);
        setSPActive(false);
        setSectorsActive(false);
        setRisesColor('#E6E6E6');
        setFallsColor('light green');
        setGDPColor('#E6E6E6');
        setCPIColor('#E6E6E6');
        setMSColor('#E6E6E6');
        setSPColor('#E6E6E6');
        setSectorsColor('#E6E6E6');
    }
    const handleClickGDP = () => {
        setRisesActive(false);
        setFallsActive(false);
        setGDPActive(true);
        setCPIActive(false);
        setMSActive(false);
        setSPActive(false);
        setSectorsActive(false);
        setRisesColor('#E6E6E6');
        setFallsColor('#E6E6E6');
        setGDPColor('light green');
        setCPIColor('#E6E6E6');
        setMSColor('#E6E6E6');
        setSPColor('#E6E6E6');
        setSectorsColor('#E6E6E6');
    }
    const handleClickCPI = () => {
        setRisesActive(false);
        setFallsActive(false);
        setGDPActive(false);
        setCPIActive(true);
        setMSActive(false);
        setSPActive(false);
        setSectorsActive(false);
        setRisesColor('#E6E6E6');
        setFallsColor('#E6E6E6');
        setGDPColor('#E6E6E6');
        setCPIColor('light green');
        setMSColor('#E6E6E6');
        setSPColor('#E6E6E6');
        setSectorsColor('#E6E6E6');
    }
    const handleClickMS = () => {
        setRisesActive(false);
        setFallsActive(false);
        setGDPActive(false);
        setCPIActive(false);
        setMSActive(true);
        setSPActive(false);
        setSectorsActive(false);
        setRisesColor('#E6E6E6');
        setFallsColor('#E6E6E6');
        setGDPColor('#E6E6E6');
        setCPIColor('#E6E6E6');
        setMSColor('light green');
        setSPColor('#E6E6E6');
        setSectorsColor('#E6E6E6');
    }
    const handleClickSP = () => {
        setRisesActive(false);
        setFallsActive(false);
        setGDPActive(false);
        setCPIActive(false);
        setMSActive(false);
        setSPActive(true);
        setSectorsActive(false);
        setRisesColor('#E6E6E6');
        setFallsColor('#E6E6E6');
        setGDPColor('#E6E6E6');
        setCPIColor('#E6E6E6');
        setMSColor('#E6E6E6');
        setSPColor('light green');
        setSectorsColor('#E6E6E6');
    }
    const handleClickSectors = () => {
        setRisesActive(false);
        setFallsActive(false);
        setGDPActive(false);
        setCPIActive(false);
        setMSActive(false);
        setSPActive(false);
        setSectorsActive(true);
        setRisesColor('#E6E6E6');
        setFallsColor('#E6E6E6');
        setGDPColor('#E6E6E6');
        setCPIColor('#E6E6E6');
        setMSColor('#E6E6E6');
        setSPColor('#E6E6E6');
        setSectorsColor('light green');
    }
    useEffect(()=>{
        //Reference: https://reactjs.org/docs/faq-ajax.html#example-using-ajax-results-to-set-local-state
        fetch("https://canvasjs.com/data/gallery/react/btcusd2017-18.json")
        .then(res => res.json())
        .then(
        (data) => {
            var dps = [];
            for (var i = 0; i < data.length; i++) {
            dps.push({
                x: new Date(data[i].date),
                y: Number(data[i].close)
            });
            }
            setLoaded(true);
            setDataPoints(dps);
        }
        )
    })
    const options = {
        charts: [{
            data: [{
            type: "line",
            dataPoints: [
              { x: new Date("2018-01-01"), y: 71 },
              { x: new Date("2018-02-01"), y: 55 },
              { x: new Date("2018-03-01"), y: 50 },
              { x: new Date("2018-04-01"), y: 65 },
              { x: new Date("2018-05-01"), y: 95 },
              { x: new Date("2018-06-01"), y: 68 },
              { x: new Date("2018-07-01"), y: 28 },
              { x: new Date("2018-08-01"), y: 34 },
              { x: new Date("2018-09-01"), y: 14 },
              { x: new Date("2018-10-01"), y: 71 },
              { x: new Date("2018-11-01"), y: 55 },
              { x: new Date("2018-12-01"), y: 50 },
              { x: new Date("2019-01-01"), y: 34 },
              { x: new Date("2019-02-01"), y: 50 },
              { x: new Date("2019-03-01"), y: 50 },
              { x: new Date("2019-04-01"), y: 95 },
              { x: new Date("2019-05-01"), y: 68 },
              { x: new Date("2019-06-01"), y: 28 },
              { x: new Date("2019-07-01"), y: 34 },
              { x: new Date("2019-08-01"), y: 65 },
              { x: new Date("2019-09-01"), y: 55 },
              { x: new Date("2019-10-01"), y: 71 },
              { x: new Date("2019-11-01"), y: 55 },
              { x: new Date("2019-12-01"), y: 50 }
              ]
            }]
            }],
            navigator: {
            slider: {
              minimum: new Date("2018-07-01"),
              maximum: new Date("2019-06-30")
            }
        }
    };
    const containerProps = {
        width: "80%",
        height: "450px",
        margin: "auto"
    };
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
                    <Search />
                </Grid.Row>
                <Header textAlign='center'>Based on Stocks</Header>
                <Grid.Row centered >
                    <Button style={{width: 200,textAlign: 'center',}} color={risesColor} onClick={handleClickRises}>Rise Together</Button>
                    <Button style={{width: 200,textAlign: 'center',}} color={fallsColor} onClick={handleClickFalls}>Fall Together</Button>
                    <Button style={{width: 200,textAlign: 'center',}} color={sectorsColor} onClick={handleClickSectors}>Sectors</Button>
                </Grid.Row>
                <Header textAlign='center'>Based on Economic Indicators</Header>
                <Grid.Row fluid>
                    <Button style={{width: 200,textAlign: 'center',}} color={GDPColor} onClick={handleClickGDP}>Gross Domestic Product</Button>
                    <Button style={{width: 200,textAlign: 'center',}} color={CPIColor} onClick={handleClickCPI}>Consumer Price Index</Button>
                    <Button style={{width: 200,textAlign: 'center',}} color={MSColor} onClick={handleClickMS}>Money Stock</Button>
                    <Button style={{width: 200,textAlign: 'center',}} color={SPColor} onClick={handleClickSP}>SP500 Index</Button>
                </Grid.Row>
                <Grid.Row style={{paddingTop:50}}>
                    {
                    isLoaded && 
                    <CanvasJSStockChart
                        options={options}
                        containerProps = {containerProps}
                    />
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
}
export default Correlator;
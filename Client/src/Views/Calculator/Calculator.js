import { Button, Input, Menu, Segment } from "semantic-ui-react";
import React, { useState } from 'react';
import Search from '../../Component/SearchBar';
import { Redirect } from "react-router-dom";
import { Container, Grid, Header, Dropdown, Icon } from "semantic-ui-react";
import data from '../../Test_Data/csvjson.json'
import timeData from './months.json'
import axios from 'axios';




const Calculator =  (props) => {

    const [showStockModal, setShowStockModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [goHome, setGoHome] = useState(false);
    const [goCalculator, setGoCalculator] = useState(false);
    


    const sector = async() => {
        let apiRes = null;
        try {
          apiRes = await axios.get('http://localhost:3001/api/sector');
        } catch (err) {
          apiRes = err.response;
          console.log("mf sucka");

        } finally {
          console.log(apiRes); // Could be success or error
        }
      };
     
    return (

        
        <div className="Calculator">

            <Container className="Container" style={{ marginTop: '7em' }}>
                <Container className={'title'}>
                <Header style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}> Stock Transaction Calculator</Header>
                </Container>
                <Search />
                <Button  size={'big'}>
                    <Segment>

                    </Segment>
                </Button>
                <Segment>
                    <Input>
                    {/* {()=>console.log(res)} */}
                    </Input>
                </Segment>
                <Container className={'container1'} >
                    <Segment>
                        <Grid columns={4} centered>
                            <Grid.Row color={'light green'} >
                                <Grid.Column width={3}>
                                    <Header># Shares</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }} />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Header>Month</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.months} />}
                                        labelPosition='right'
                                        placeholder='Month'
                                    />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header>Day</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.days} />}
                                        labelPosition='right'
                                        placeholder='Month' />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header>Year</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.days} />}
                                        labelPosition='right'
                                        placeholder='Month'
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Header style={{}}>Purchase Date</Header>
                </Container>

                <Container className={'container2'}>
                    <Segment>
                        <Grid columns={4} centered>
                            <Grid.Row color={'light red'} >
                                <Grid.Column width={3}>
                                    <Header># Shares</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }} />
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Header>Month</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.months} />}
                                        labelPosition='right'
                                        placeholder='Month'
                                    />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header>Day</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.days} />}
                                        labelPosition='right'
                                        placeholder='Month' />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header>Year</Header>
                                    <Input size={'tiny'} style={{ width: "97px" }}
                                        label={<Dropdown defaultValue="January" options={timeData.days} />}
                                        labelPosition='right'
                                        placeholder='Month'
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    <Header >Selling Date</Header>
                </Container>

                <Container className={'container3'}>
                    <Header style={{ textAlign: 'center', fontSize: 30, color: 'blue' }}>Calculate <Icon size={12} circular name={"angle double right"} /></Header>

                    <Button style={{ width: 650, textAlign: 'center', }} color={'blue'} > Profit: ${111.55}</Button>
                </Container>
            </Container>
        </div>
    )
}

export default Calculator;
import { Menu } from "semantic-ui-react";
import React, { useState } from 'react';
import Search from '../Search/Search.js';
import { Redirect } from "react-router-dom";
import { Container, Grid, Header, Icon, Card, Button, Modal } from "semantic-ui-react";
import data from '../../Test_Data/csvjson.json'

const Calculator = (props) => {
    
    const [showStockModal, setShowStockModal] = useState(false); 
    const [selectedStock, setSelectedStock] = useState(null);
    const [goHome, setGoHome] = useState(false);
    const [goCalculator, setGoCalculator] = useState(false);

    const addStock = (data) => {
        setSelectedStock(data)
        console.log(data)
    }

    if (goCalculator) {
        return <Redirect to="/Calculator"/>;
    }

    if (goHome) {
        console.log(goHome)
        return <Redirect to="/Home"/>;   
    }

    const OpenStockModal = () => {
        setShowStockModal(true);
    }
    
    const CloseStockModal = () => {
        setShowStockModal(false);
    }

    return (
    <div className="Calculator">
        {/* <Menu fixed='top'>
            
            <Menu.Item onClick={setGoHome}> Home</Menu.Item> 
            <Menu.Item onClick={setGoCalculator}> Calculator </Menu.Item> 
            <Menu.Item> Correlator </Menu.Item> 
        
        </Menu> */}
        <Container className="Container" text style={{ marginTop: '7em' }}>
            <Grid textAlign="center" verticalAlign="middle" centered>
                <Grid.Row centered> 
                    <Grid.Column>
                        <Header textAlign='center' size='huge'>
                            Investment Calculator
                        </Header>
                    </Grid.Column>
                    
                </Grid.Row>
                <Grid.Row>
                    <Button onClick={OpenStockModal}>Add a Stock to Analyze </Button>
                </Grid.Row>
                    <Modal open={showStockModal}
                        onClose={CloseStockModal}
                        closeIcon
                        centered
                        >
                            <Modal.Header> Search for a Stock </Modal.Header>
                            <Search 
                            addStock = {addStock} 
                            CloseStockModal = {CloseStockModal}
                            />
                            
                    </Modal>
            </Grid>
      </Container>
    </div>
    )
}

export default Calculator;
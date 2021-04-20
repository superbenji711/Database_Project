import React, { Container, useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';

import { Menu, Segment } from 'semantic-ui-react';
import './NavBar.css';
const NavBar = () => {

    const [view, setView] = useState("");
  
    return (
        <div>
            <Menu>
                <Menu.Menu position='right'>
                <Link  to="/Home">
                    <Menu.Item 
                        onClick={(view) => { setView("Home") }}>Home</Menu.Item>
                </Link>
                <Link to="/Stock Correlator">
                    <Menu.Item 
                        onClick={(view) => { setView("StockCorrelator") }}>Stock Correlator</Menu.Item>
                </Link>
                <Link to="/Correlator">
                    <Menu.Item 
                        onClick={(view) => { setView("Correlator") }}>Economic Correlator</Menu.Item>
                        </Link>
                </Menu.Menu>
            </Menu>
        </div>

    );

}

export default NavBar;
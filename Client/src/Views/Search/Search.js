import React, {useState, useEffect} from 'react';
import { Dropdown, Button} from 'semantic-ui-react'
import data from '../../Test_Data/csvjson.json'

const Search = (props) => {
    

    //You will need to save the value from the textbox and update it as it changes
    //You will need the onChange value for the input tag to capture the textbox value
    const [preSelectedStock, setPreSelectedStock] = useState(null);
    const [addStockPage, setAddStockPage] = useState(false);
    
    const addStockTime = () => {
       if (preSelectedStock != null) {
           props.addStock(preSelectedStock)
           props.CloseStockModal()
       }
       else {
           alert('You did not select a stock')
       }

    }

    const handleDropdown = (event, data) => {
        setPreSelectedStock(data.value)
    } 


    const stockOptions = data.map(currentStock => ({
        key: currentStock.abbreviation,
        text: currentStock.name,
        value: currentStock.abbreviation
    }));

    return (
        <div style={{padding:25}}>
                <Dropdown
                    placeholder='Stock'
                    fluid
                    search
                    selection
                    options={stockOptions}
                    onChange={handleDropdown}
                />
            <br/>
                <Button grey onClick={addStockTime}> Add Stock </Button>
            </div>
            
        );

    
};

export default Search;
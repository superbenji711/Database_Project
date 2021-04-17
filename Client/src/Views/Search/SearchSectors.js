import React, {useState, useEffect} from 'react';
import { Dropdown, Button, Grid, Header} from 'semantic-ui-react'
import axios from 'axios';

const Search = (props) => {
    //You will need to save the value from the textbox and update it as it changes
    //You will need the onChange value for the input tag to capture the textbox value
    const [data, setData] = useState([[]]);
    const [preSelectedStock, setPreSelectedStock] = useState(null);
    
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
        setPreSelectedStock(data.value);
    } 

    const fetchData = async() => {
            let apiRes = null;
            try {
            apiRes = await axios.get(`http://localhost:3001/api/sector`);
            } catch (err) {
            apiRes = err.response;
            console.log("mf sucka");

            } finally {
            console.log(apiRes); // Could be success or error
            }
            const stocks = apiRes.data;
            setData(stocks); 
    }

    useEffect(() => {     
        fetchData();
    },[])

    const stockOptions = data.map(currentStock => ({
        key: currentStock[1],
        text: currentStock[0],
        value: currentStock[1]
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

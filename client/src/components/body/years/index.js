import axios from 'axios'
import { PromiseProvider } from 'mongoose'
import React,{useState, useEffect} from 'react'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function Years(prop) {
    const [years, setYears] = useState([])
    useEffect(()=>{
        const getYears = async ()=>{
            const response = await axios.get('/year/all')
            if(response.status === 200){
                setYears(response.data)
            }
        }
        getYears()
    },[])

    const updateYear = (e) => {
        const { value } = e.target
        prop.updateYear(value)
    }
    return (
        <div>
            <h2>Selectați anul de învățământ</h2>
<div className="sel">
            <InputLabel id="lbl">Anul</InputLabel>
        <Select
          labelId="lbl"
          id="lbl-select"
          onChange={(e)=> updateYear(e)} name="year" id="year"
        >
          <MenuItem value={2021}>2021</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
        </Select>
        
        </div>
            <select onChange={(e)=> updateYear(e)} name="year" id="year" style={{width:'200px'}}>
                {
                    years.map((year, i) =>
                        <option key={i} value={year.value}>{year.value}</option>
                    )
                }
            </select>
        </div>
    )
}
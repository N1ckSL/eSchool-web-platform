import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Years(prop) {
  const [years, setYears] = useState([]);
  useEffect(() => {
    const getYears = async () => {
      const response = await axios.get("/year/all");
      if (response.status === 200) {
        setYears(response.data);
      }
    };
    getYears();
  }, []);

  const updateYear = (e) => {
    const { value } = e.target;
    prop.updateYear(value);
  };
  return (
    <div>
      <h2>Selectați anul de învățământ</h2>
    
      <span className="select">
      <select onChange={(e)=> updateYear(e)} name="year" id="year" style={{width:'200px'}}>
                {
                    years.map((year, i) =>
                        <option key={i} value={year.value}>{year.value}</option>
                    )
                }
            </select>
            </span>
    </div>
  );
}

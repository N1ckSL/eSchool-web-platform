import axios from "axios";
import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function Subjects(props) {
  const { subjects, saveSubject, success } = props;
  const [subjectArray, setSubjectArray] = useState([]);
  const [dataSubject, setDataSubject] = useState({
    name: "",
  });

  useEffect(() => {
    setSubjectArray(subjects);
  }, [subjects]);

  const handleChange = (ev) => {
    const { id, value } = ev.target;
    setDataSubject({ ...dataSubject, [id]: value });
  };
  const saveSubjectLocal = async () => {
    const responsePost = await axios.post("/subject/create", {
      name: dataSubject.name,
    });
    if (responsePost.status === 200) {
      saveSubject();
      setDataSubject({ ...dataSubject, name: "" });
    }
    if (responsePost.status === 500){
      console.error("Nu este ok");
    }
  };

  return (
    <div>
      <h2>Materii</h2>
      <div className="user__form">
        <TextField
          required
          id="name"
          size="small"
          name="name"
          value={dataSubject.name}
          label="Materie Noua"
          type="search"
          variant="outlined"
          onChange={handleChange}
          className="materie__input"
          style={{ marginRight: 10, marginBottom: 15 }}
        />
        {/* <input
                    type="text"
                    name="name"
                    id="name"
                    value={dataSubject.name}
                    placeholder="Materie noua"
                    onChange={handleChange}
                    /> */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => saveSubjectLocal(dataSubject)}
        >
          Adauga
        </Button>
        {/* <button
          className={"btn-black"}
          onClick={() => saveSubjectLocal(dataSubject)}
        >
          Save
        </button> */}
      </div>
      <table className="table__date" style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Denumire Materie</th>
          </tr>
        </thead>
        <tbody>
          {subjectArray.length > 0 &&
            subjectArray.map((subject, i) => {
              return (
                <tr key={i}>
                  <td>{subject.name}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

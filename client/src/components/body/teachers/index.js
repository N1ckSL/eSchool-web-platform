import React, { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function Teachers(props) {
  const { teachers, subjects, teacherSubjects, year } = props;
  const [teachersArray, setTeachersArray] = useState([]);
  const [teacherSubjectsState, setTeachersSubjectsState] = useState([]);
  const [dataTeacher, setDataTeacher] = useState({
    id: "",
    name: "",
    subject: "",
    previousSubject: "",
    nameSubject: "",
  });

  useEffect(() => {
    setTeachersArray(teachers);
  }, [teachers]);
  useEffect(() => {
    setTeachersSubjectsState(teacherSubjects);
  }, [teacherSubjects]);

  const assingSubject = (item) => {
    const subject = teacherSubjectsState.find(
      (sub) => sub.user._id === item._id && sub.year === Number(year)
    );
    if (subject) {
      setDataTeacher({
        ...dataTeacher,
        nameSubject: subject.subject.name,
        id: item._id,
        name: item.name,
        previousSubject: subject._id,
        subject: subject.subject._id,
      });
    } else {
      setDataTeacher({
        ...dataTeacher,
        id: item._id,
        name: item.name,
        nameSubject: null,
        previousSubject: null,
        subject: "null",
      });
    }
  };
  const cancelSubject = () => {
    setDataTeacher({ ...dataTeacher, id: "", name: "", subject: "" });
  };

  const handleChange = async (ev) => {
    if (ev.target.value === "null") {
      setDataTeacher({ ...dataTeacher, subject: "null", nameSubject: null });
    } else {
      setDataTeacher({
        ...dataTeacher,
        subject: ev.target.value,
        nameSubject: ev.target.options[ev.target.selectedIndex].text,
      });
    }
  };

  const saveSubject = async () => {
    let resp;
    if (dataTeacher.previousSubject) {
      if (dataTeacher.subject) {
        resp = await axios.patch(`userSubject/update`, {
          subject: dataTeacher.subject,
          id: dataTeacher.previousSubject,
        });
      } else {
        resp = await axios.delete(
          `userSubject/delete/${dataTeacher.previousSubject}`
        );
      }
    } else {
      if (dataTeacher.subject) {
        resp = await axios.post(`userSubject/create`, {
          user: dataTeacher.id,
          subject: dataTeacher.subject,
          year,
        });
      } else {
        resp.status = 200;
      }
    }
    if (resp.status === 200) {
      if (dataTeacher.previousSubject) {
        setTeachersSubjectsState((array) =>
          array.map((item, indexMap) =>
            item.user._id === dataTeacher.id
              ? {
                  ...item,
                  subject: {
                    ...item.subject,
                    name: dataTeacher.nameSubject,
                    _id: dataTeacher.subject,
                  },
                }
              : item
          )
        );
      } else {
        setTeachersSubjectsState((array) => [
          {
            subject: {
              name: dataTeacher.nameSubject,
              _id: dataTeacher.subject,
            },
            user: { _id: dataTeacher.id },
          },
          ...array,
        ]);
      }
      cancelSubject();
    }
  };
  const getSubject = (teacherId) => {
    const subjectDescription = teacherSubjectsState.find(
      (sub) => sub.user._id === teacherId
    )?.subject?.name;
    return subjectDescription || "Nu are Materie";
  };

  return (
    <div>
      <h2>Profesori</h2>
      <div className="user__form">
        <TextField
          id="name"
          size="small"
          name="name"
          value={dataTeacher.name}
          label="Nume Profesor"
          type="text"
          disabled
          variant="outlined"
          onChange={handleChange}
          style={{ marginRight: 10, marginBottom: 15 }}
        />
        <span className="select">
          <select
            name="subject"
            id="subject"
            value={dataTeacher.subject}
            onChange={handleChange}
          >
            <option value={"null"}>{"Selectati materia"}</option>
            {subjects.map((subject, i) => {
              return (
                <option key={i} value={subject._id}>
                  {subject.name}
                </option>
              );
            })}
          </select>
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={saveSubject}
          disabled={dataTeacher.id === ""}
          style={{ marginRight: 10, marginLeft: 25, marginBottom: 15 }}
        >
          Salvează
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={cancelSubject}
          disabled={dataTeacher.id === ""}
          style={{ marginRight: 10, marginBottom: 15 }}
        >
          Renunță
        </Button>
      </div>
      <table className="table__date">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Email</th>
            <th>Materia predată</th>
            <th>Atribuire</th>
          </tr>
        </thead>
        <tbody>
          {teachersArray.map((subject, i) => {
            return (
              <tr key={i}>
                <td>{subject.name}</td>
                <td>{subject.email}</td>
                <td>{getSubject(subject._id)}</td>
                <td style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="default"
                    onClick={() => assingSubject(subject)}
                  >
                    Atribuie Materie
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

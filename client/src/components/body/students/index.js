import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { showErrMsgElev } from "../../utils/notifications/Notifications";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export default function Students(props) {
  const { students, subjects, studentSubjects, year, showMessage, err, showErrMsgElev } = props;
  const [studentsArray, setStudentsArray] = useState([]);
  const [subjectsState, setSubjectsState] = useState([]);
  const [studentSubjectsState, setStudentSubjectsState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataStudents, setDataStudent] = useState({
    id: "",
    name: "",
    subject: "",
    previousSubject: "",
    nameSubject: "",
  });

  const nodeRef = useRef(null);

  useEffect(() => {
    setStudentsArray(students);
  }, [students]);
  useEffect(() => {
    setStudentSubjectsState(studentSubjects);
  }, [studentSubjects, year]);
  useEffect(() => {
    if (dataStudents.id !== "") {
      setSubjectsState(subjects);
    }
  }, [subjects, dataStudents.id]);

  const handleChange = (ev) => {
    setLoading(true);
    if (ev.target.value === "") {
      setDataStudent({ ...dataStudents, id: "" });
      setSubjectsState([]);
    } else {
      //console.log(ev.target.options[ev.target.selectedIndex].text);
      setDataStudent({ ...dataStudents, id: ev.target.value });
      setSubjectsState(subjects);
    }
    setLoading(false);
  };
  const handleCheck = async (ev, subject) => {
    setLoading(true);
    try {
      let resp;
      if (ev.target.checked) {
        resp = await axios.post(`userSubject/create`, {
          user: dataStudents.id,
          subject: subject._id,
          year,
        });
      }
      if (resp.status === 200) {
        setStudentSubjectsState((array) => [
          {
            _id: resp.data._id,
            user: { _id: dataStudents.id },
            subject: { _id: subject._id },
            year: year,
          },
          ...array,
        ]);
      }
    } catch {
      const ids = [];
      for (let i = 0; i < studentSubjectsState.length; i++) {
        if (
          studentSubjectsState[i].user._id == dataStudents.id &&
          studentSubjectsState[i].subject._id == subject._id &&
          studentSubjectsState[i].year == year
        )
          ids.push(studentSubjectsState[i]._id);
      }
      const gradesSubject = await axios.post(`/subjectGrade/all`, {
        ids,
      });
      let isExist = false;
      let userSubjectId;

      if (gradesSubject.data.length > 0) isExist = true;

      if (isExist) {
        showMessage(
          false,
          "Elevul are note la aceasta materie. Nu poate fi sters"
        );
      } else {
        const res = await axios.delete(`/userSubject/delete/${ids[0]}`);
        for (let i = 0; i < studentSubjectsState.length; i++) {
          if (studentSubjectsState[i]._id == ids[0])
            studentSubjectsState.splice(i, 1);
        }

        showMessage(true, "Materia a fost deselectata");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Elevi</h2>
      {err && showErrMsgElev(err)}
      <div className="user__form">
        <InputLabel id="lbl-elevi">Selecteaza Elevi</InputLabel>
        <Select
          noderef={nodeRef}
          labelId="lbl-elevi"
          name="subject"
          id="subject"
          value={dataStudents.id}
          disabled={loading}
          onChange={handleChange}
          variant="filled"
          style={{
            marginRight: 200,
            marginBottom: 15,
            marginTop: 5,
            paddingBottom: 10,
            width: 220,
            height: 40,
          }}
        >
          <MenuItem value="">
            <em>Renunta</em>
          </MenuItem>

          {students.map((subject, i) => {
            return (
              <MenuItem ref={nodeRef} key={i} value={subject._id}>
                {subject.name}
              </MenuItem>
            );
          })}
        </Select>
        <div></div>
      </div>
      <table className="table__date">
        <thead>
          <tr>
            <th>Materii</th>
            <th>Înrolare</th>
          </tr>
        </thead>
        <tbody>
          {subjectsState.map((subject, i) => {
            return (
              <tr key={i}>
                <td className="alignRight">
                  <span>{subject.name}</span>
                </td>
                <td>
                  <input
                    className="check__box"
                    type="checkbox"
                    id="assing_subject"
                    disabled={loading}
                    checked={
                      studentSubjectsState.find(
                        (a) =>
                          a.user._id === dataStudents.id &&
                          a.subject._id === subject._id
                      ) !== undefined
                    }
                    onChange={(ev) => handleCheck(ev, subject)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

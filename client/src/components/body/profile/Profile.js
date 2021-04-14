import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { isLength, isMatch } from "../../utils/validation/Validation";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/notifications/Notifications";
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../../../redux/actions/usersAction";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

function Profile() {
  const auth = useSelector((state) => state.login);
  const token = useSelector((state) => state.token);

  const users = useSelector(state => state.users)

  const {user, isAdmin, isProfessor, isSecretar } = auth;
  const [data, setData] = useState(initialState);
  const {name, password, cf_password, err, success } = data;
  const [loading, setLoading] = useState(false)
  const [callback, setCallback] = useState(false)

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
    }
  }, [token, isAdmin, dispatch, callback]);

  const updateInfor = () => {
    try {
      axios.patch(
        "user/update",
        {
          name: name ? name : user.name,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Modificat cu succes!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleUpdate = () => {
    if (name) updateInfor();
    if (password) updatePassword();
  };
  
  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (window.confirm("Are you sure you want to delete this account?")) {
          setLoading(true);
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          });
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>

      <div className="profile__page">
        <div className="col-left">
          <h2> { isAdmin && "Admin Profile" || isProfessor && "Profesor Profile"|| isSecretar && "Secretar Profile"  || "Elev Profile"}</h2>

          <div className="user__form">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user.name}
              placeholder="Numele"
              onChange={handleChange}
            />
          </div>

          <div className="user__form">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Parola"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="user__form">
            <label htmlFor="cf_password">Confirm</label>
            <input
              type="password"
              name="cf_password"
              id="cf_password"
              value={cf_password}
              placeholder="Confirma parola"
              onChange={handleChange}
            />
          </div>

          <div>
            <em style={{ color: "crimson" }}>
              * If you update your password here, you will not be able to login
              quickly using google and facebook.
            </em>
          </div>

          <button disabled={loading} onClick={handleUpdate}>
            Modifica
          </button>
        </div>

        <div className="col-right">
          <h2>{isAdmin ? "Users" : "Note"}</h2>
          <div className="table__wrapper">
            <table className="table__date">
              <thead>
                  {
                      isAdmin 
                      ? <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      : <tr>
                          <th>Materie</th>
                          <th>Profesor</th>
                          <th>Note</th>
                          <th>Nota Semestru I</th>
                          <th>Nota Semestru II</th>
                          <th>Media</th>
                        </tr>
                  }
              </thead>
              <tbody>
                { users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="td__role">
                      {user.role === 0 && "Elev"}
                      {user.role === 1 && "Admin"}
                      {user.role === 2 && "Profesor"}
                      {user.role === 3 && "Secretar"}
                    </td>
                    <td>
                      <Link to={`/edit_user/${user._id}`}>
                      <i className="far fa-edit" title="Edit"></i>
                      </Link>
                      <i className="fas fa-user-times" title="Delete" onClick={() => handleDelete(user._id)}></i> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

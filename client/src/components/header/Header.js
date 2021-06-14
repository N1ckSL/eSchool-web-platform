import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Menu, MenuItem } from "@material-ui/core";

function Header() {
  const auth = useSelector((state) => state.login);

  const { user, isLogged, isAdmin, isProfessor, isSecretar } = auth;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const userLink = () => {
    return (
      <div className="drop__nav">
        <Button
          color="primary"
          variant="contained"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {user.name}
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem ><Link to="/profile">Profil</Link></MenuItem>
          <MenuItem  onClick={handleLogout}>Delogare</MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <>
      <header>
        <Link to="/" className="round__logo" />
        <div className="nav">
          {isLogged ? (
            userLink()
          ) : (
            <Button
              variant="contained"
              size="medium"
              color="primary"
              style={{ fontSize: 12 }}
              endIcon={<AccountCircleIcon />}
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>
      <div className="nav__menu">
        <div className="menu__items">
          <ul className="menu left">
            <li>
              <Link to="/">Acasă</Link>
            </li>
            <li>
              <Link to="/personal">Personal</Link>
            </li>
          </ul>
          <ul className="menu right">
            <li>
              <Link to="/orar">Orar</Link>
            </li>
            {isLogged ? (
              <li>
                <Link to="/profile">
                  {(isAdmin && "Dashboard") ||
                    (isProfessor && "Clase") ||
                    (isSecretar && "Informatii") ||
                    "Note"}
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;

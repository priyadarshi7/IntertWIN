import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import "./Navbar.css"
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import SearchDashboard from '../Search/Search';
const drawerWidth = 260;
const navItems = ['About Us', 'Services','FAQs', 'Team','Login'];

function DrawerAppBar(props) {
  const {userData,setUserData} = useUserContext();
  const handleLogout = () => {
    // Clear user data in context and localStorage
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    setUserData(null);

    // Remove cookies using js-cookie
    Cookies.remove("token"); // replace with your actual cookie name(s)

    // Navigate to login or home page
    navigate("/");
};

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

   const {user,setUser} = useUserContext();
   const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex'}}>
      <AppBar component="nav" sx={{background:'transparent', boxShadow: "0",display:'flex'}} >
        <Toolbar>
          <div className="icon">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            anchor="right"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } ,color:'#6A79FF',fontSize:'3.6rem',paddingTop:'5.5vh',borderRadius:'6rem'}}
          >
            <MenuIcon sx={{fontSize:'inherit',
            borderRadius:'inherit'}}/>
          </IconButton>
          </div>
          <Box sx={{ display: { xs: 'none', sm: 'flex', justifyContent: "space-evenly",alignItems:"center"},margin:"auto",borderWidth:'0.2rem',borderStyle:'solid',borderColor:"#6A79FF", background:"linear-gradient(90deg, #050223 0%, #06054D 100%)",borderRadius: "1.7rem",fontWeight:"500",padding:"5px",marginTop:"3vh"}}>
            {/* {navItems.map((item) => (
              <Button key={item} sx={{ color: "white",fontFamily:"Montserrat"}}>
                {item}
              </Button>
            ))} */}
                <ul style={{display:'flex', justifyContent:"space-between", listStyle:"none", gap:"1.5vh", paddingLeft:"0"}} className='nav-list'>
             <NavLink to="/"><li><Button sx={{ color: "white",fontFamily:"afacad"}}>HOME</Button></li></NavLink>
             <NavLink to="/calendar"><li><Button sx={{ color:"white",fontFamily:"afacad"}}>EVENT TRACKER</Button></li></NavLink>
              {user?<NavLink to={`/dashboard/${user.userId}`}><li><Button sx={{ color: "white",fontFamily:"afacad"}}>PROFILE</Button></li></NavLink>:""}
              <li><Button sx={{ color: "white",fontFamily:"afacad"}}>FAQ</Button></li>
              {user?  <li><Button sx={{ color: "white",fontFamily:"afacad"}} onClick={()=>{
              handleLogout();
              }}>LOGOUT</Button></li>:
              <li><Button sx={{ color: "white",fontFamily:"afacad"}} onClick={()=>navigate("/user/login")}>LOGIN</Button></li>
              }
            </ul>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          anchor="right"
          ModalProps={{
            keepMounted: false, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            },background :'#6A79FF'
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      {/* <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box> */}
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
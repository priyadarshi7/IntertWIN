import React from "react"
import "./Profile.css"
import Dashboard_img from "../../assets/Images/dashboard.png"
import { Button } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react"
import Info from "../../components/profile-components/Info/Info"
import Socials from "../../components/profile-components/Socials/Socials"
import Platforms from "../../components/profile-components/Platforms/Platforms"

export default function ProfileSetup(){

    const [menu,setMenu] = React.useState("Info");
    const { user, loginWithRedirect, isAuthenticated, logout  } = useAuth0();

    

    return(
        <div className="profile-container">
            <div className="profile-main">
                <div className="profile-sidebar">
                <Button className="sidebar-btn" sx={{ color: "white",fontFamily:"afacad", fontSize:"20px"}} onClick={()=>{setMenu("Info")}}>Info</Button>
                <Button className="sidebar-btn" sx={{ color: "white",fontFamily:"afacad", fontSize:"20px"}} onClick={()=>{setMenu("Socials")}}>Socials</Button>
                <Button className="sidebar-btn" sx={{ color: "white",fontFamily:"afacad", fontSize:"20px"}} onClick={()=>{setMenu("Platforms")}}>Platforms</Button>
                <Button className="sidebar-btn" sx={{ color: "white",fontFamily:"afacad", fontSize:"20px"}} onClick={()=>{setMenu("Accounts")}}>Accounts</Button>
                </div>
                <div className="profile-edit">
                    {/*Info*/}
                    { menu==="Info" && <Info/>}
                    {/*Socials*/}
                    { menu==="Socials" && <Socials/> }
                    {/*Platforms*/}
                    { menu==="Platforms" && <Platforms/> }
                </div>
            </div>
        </div>
    )
}
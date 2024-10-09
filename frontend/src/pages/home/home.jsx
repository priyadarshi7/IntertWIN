import React from "react"
import "./Home.css"
import img from "../../assets/Logo/Logo.png"
import GLOBE from "vanta/src/vanta.globe"
import Section2 from "./Section2/Section2"
import Section1 from "./Section1/Section1"

export default function Home(){
    React.useEffect(()=>{
        GLOBE({
            el:"#vanta",
            backgroundColor:0x0,
            touchControls:true,
        })
    },[]);
return(
<div id="vanta" className="bg">
{/*Section0*/}
<div className="page">
    <div className="png"><img src={img}/></div>
    <div className="gr"><div className="text1">Codexio</div></div>
</div>

{/*Section1 */}
{/* <Section1/> */}

{/*Section2*/}
<Section2/>

{/*Section3*/}
{/* <div className="box2">
    <div className="text5">What Else CODEXIO Does?</div>
    <div className="text6">The Perfect Place To Connect With People.</div>
</div> */}

</div>
    )
 }
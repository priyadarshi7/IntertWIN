import React from "react"
import "./Home.css"
import img from "../../assets/Logo/Logo.png"
import img2 from "../../assets/Images/home-img-2.png"
import img3 from "../../assets/Images/Portal.png"
export default function Home(){
return(
<div>
{/*Section0*/}
<div className="page">
    <div className="png"><img src={img} width="150vw" /></div>
    <div className="gr"><div className="text1">Codexio</div></div>
</div>

{/*Section1 */}
<div className="box0">
    <div className="img2"><img src={img2} width="80%" id="img2" /></div>
</div>

{/*Section2*/}
<div className="box">
    <div className="text"><div className="text2">codexio</div><div className="text3">Lets You Simplify Everything
         You Need,</div><div className="text4">All In One Place!</div></div>
    <div className="icons">
        <img src={img3} width="100%" />
    </div>
</div>

{/*Section3*/}
{/* <div className="box2">
    <div className="text5">What Else CODEXIO Does?</div>
    <div className="text6">The Perfect Place To Connect With People.</div>
</div> */}

</div>
    )
 }
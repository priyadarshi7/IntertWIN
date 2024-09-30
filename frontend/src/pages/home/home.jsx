import React from "react"
import "./Home.css"
import img from "../../assets/1ae9ba34895d64daac8da1901d84f4cb.png"
import img2 from "../../assets/Screenshot 2024-09-30 145457.png"
import img3 from "../../assets/e649d798d4634b30d3d8ffbe64c25840.png"
 export default function Home(){
    return(<div>
        <div className="page">
<div className="png"><img src={img} width="150vw" /></div>
<div className="gr"><div className="text1">Codexio</div></div>
<div className="img2"><img src={img2} width="1100vw" id="img2" /></div>

</div>
<div className="box">
    <div className="text"><div className="text2">codexio</div><div className="text3">Lets You Simplify Everything
         You Need,</div><div className="text4">All In One Place!</div></div>
    <div className="icons">
        <img src={img3} width="600px" />
    </div>
 
</div>
<div className="box2">
        <div className="text5">What Else CODEXIO Does?</div>
        <div className="text6">The Perfect Place To Connect With People.</div>
    </div>
</div>
    )
 }
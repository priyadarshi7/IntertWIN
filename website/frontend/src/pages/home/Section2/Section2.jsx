import React from "react"
import "./Section2.css"
import img3 from "../../../assets/Images/Portal.png"
import code_icon from "../../../assets/Images/code.png"

export default function Section2(){
    return(
        <div className="box">
    <div className="text"><div className="text2">intertWIN</div><div className="text3">Lets You Simplify Everything
         You Need,</div><div className="text4">All In One Place!</div></div>
    <div className="icons">
        <img src={img3}/>
        <div className="overlay">
            <img src={code_icon}/>
        </div>
    </div>
</div>
    )
}
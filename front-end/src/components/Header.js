import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// components
import styled from "styled-components";
import Button from "./Button";

export default function Header(props) {

    // const {user} = props;
    
    const navigate = useNavigate();
    const {isShown,title,url, onReadUrl} = props;

    const onCategorize=(e)=>{
        let url = e.target.id;
        if(url==='/') {
            onReadUrl(undefined)
        }else {
            onReadUrl(url)
        }
        navigate( url!=='/' ? `/category/${url}`:'/', {
            state: {
                category: url
            }
        })
    }

    return(
        <HeaderStyle>
        <div className="headerWrapper">
            <div className="info">
                <p>게시판 사이트</p>
                {isShown ? <Button title={title} link={url} />:null}
            </div>
            <div className="nav">
                <ul>
                    <li id="/" onClick={(e)=>onCategorize(e)}>전체보기</li>
                    <li id="사내프로젝트"onClick={(e)=>onCategorize(e)}>사내 프로젝트</li>
                    <li id="SI프로젝트"onClick={(e)=>onCategorize(e)}>SI 프로젝트</li>
                    <li id="개인프로젝트"onClick={(e)=>onCategorize(e)}>개인 프로젝트</li>
                </ul>
                
            </div>
        </div>
        </HeaderStyle>
    )
}

const HeaderStyle = styled.div`
ul, li {
    list-style:none;
}
.headerWrapper {
    height: 17vh;
}
.info p {
    font-size: 4em;
}
.nav ul {
    height: 35px; line-height: 34px; display: flex; padding: 0; margin: 0;
}
.nav ul li {
    flex-grow: 1; background-color: black; color: white; border-right: 1px solid white;
}
`
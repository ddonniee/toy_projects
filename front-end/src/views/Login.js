import React, { useState,useContext, useLayoutEffect, useEffect } from "react";

import { AppContext } from "../App";
import styled from "styled-components";
import Header from "../components/Header";

export default function Login(props) {
    const {onChange, onClick} = props;
    
    return (
        <LoginStyle>
        <div className="loginWrapper">
            <Header />
            <h1>로그인</h1>
            <form className="loginInfo">
                <div>
                <input className='login_id' type='text' onChange={onChange} id='id'></input>
                <input className='login_pw' type='password' id='password' autoComplete="on" onChange={onChange}></input>
                </div>
                <div>
                <label htmlFor="login_submit" onClick={onClick}>로그인<input type='button' name='login_submit' value='로그인' /></label>
                </div>
            </form>
        </div>
        </LoginStyle>
    )
}

const LoginStyle = styled.div`

    .loginInfo {
        display: flex; text-align: center; justify-content: center;  height: 150px;
    }
    .loginInfo > div:first-child {
        display: grid;  align-items: center;
    }
    .loginInfo > div:last-child {
        margin-top: auto; margin-bottom: auto;
    }
    .loginInfo > div > input {
        width: 400px; height: 50px; font-size: 20px; padding: 0 10px;
    }
    label {
        width: 100px; height: 50px; background-color: black; color:white;  display:block; text-align: center; line-height: 45px; margin-left: 10px; border-radius: 8px;
    }
    input[type=button]{
        display:none;
    }
    
`
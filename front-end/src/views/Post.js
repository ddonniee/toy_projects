import moment from "moment";
import React, { useEffect, useLayoutEffect, useState,useContext } from "react";
import {useLocation, Link} from 'react-router-dom';
import styled from "styled-components";

import { AppContext } from "../App";
// components
import Header from "../components/Header";
// svgs
import Edit from "../public/images/edit.png"
import Delete from "../public/images/delete.png"

export default function Post(){
    let location = useLocation()
    const user = useContext(AppContext);
    const post_num = location.state.post_num;
    const [posts, setPosts] = useState({})

    const onDeletePost=(e,num)=>{

        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_DELETE+`/${post_num}`, {
            mode:'cors',
            method:'PATCH',
            headers:{
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization':'Bearer ' + user.token,
            }
        })
        .then(res=> {
            console.log(res,'resresee')
            return res.json();
        })
        .then((data)=>{
            if(data.code===200) {
                alert('삭제 완료')
                window.location.replace('/')
            }
        })
        .catch((err)=> 
            console.log(err)
        );
    }

    useLayoutEffect(()=>{
            fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_ADD+`/${post_num}`, {
                mode:'cors',
                headers:{
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization':'Bearer ' + user.token,
                }
            })
            .then(res=> {
                return res.json();
            })
            .then(data=>{
                console.log(data.resdata)
                let temp = data.resdata[0]
                setPosts({...posts,
                    ...temp
                    })
            })
            .catch((err)=> 
                console.log(err)
            );
    },[])
    // 조회수 카운팅 API
    useEffect(()=>{
        if(posts.title==='' || null) {
            return false
        }
        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_HITS+`/${post_num}`, {
                mode:'cors',
                method:'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Access-Control-Allow-Origin':'*',
                },
                body: JSON.stringify({
                    hits: (posts.hits)+1
                })
            })
            .then(res=> {
                return res.json();
            })
            .catch((err)=> 
                console.log(err)
            );
    },[posts])

    console.log('data',user.id, posts.writer)

    return (
        <PostStyle>
        <div className="postWrapper">
            <Header user='guest'/>
            <div className="postTop">
                    <p>{posts.category}</p>
                    <h1>{posts.title}</h1>
                <div className="postInfo">
                    <p>작성자 <span>{posts.writer}</span></p>
                    <p>작성 시간 <span>{moment(posts.insert_date).format("YYYY-MM-DD HH:mm:ss")}</span></p>
                    { user.id===posts.writer 
                    ?
                    <div className="postEdit">
                        <Link to={`/write/`+posts.num}><img src={Edit}></img></Link>
                        <img src={Delete} onClick={onDeletePost}></img>
                    </div>
                    :
                    null}
                </div>
            </div>
            <div className="postMiddle">
                <div>{posts.contents}</div>
            </div>
            <div className="postBottom"></div>
        </div>
        </PostStyle>
    )

}

const PostStyle = styled.div`
    .postInfo {
        display: flex;
    }
    h1 {
        text-align: initial;  padding-left: 1em; font-size: 3em; margin: 0;
    }
    .postTop > p {
        margin: 0; text-align: initial; padding-left: 1.5em; font-size: 2em; color: #B2B0B0;
    }
    .postInfo {
        padding-left: 3em; font-weight: 500; color: #B2B0B0;     width: calc(100vw - 3em);
    }
    .postInfo span {
        padding: 0 8px; color: black;
    }
    .postInfo > p:nth-child(2) {
        flex-grow : 2; text-align: initial;
    }
    .postMiddle {
        min-height: 50vh; height: fit-content; padding: 3em; text-align: initial;
    }
    .postEdit{
        margin-top: auto;
        margin-bottom: auto;
    }
    .postEdit img {
        width: 30px;
    }
`
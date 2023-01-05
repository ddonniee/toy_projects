import moment from "moment";
import React, { useLayoutEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";
import { AppContext } from "../App";

export default function Comments(props) {

    const onComment =props.onReply;
    const params = useParams();
    const [paramId, setParamId] = useState(params.id);
    const [lists, setLists] = useState([])
    const [commentValue, setCommentValue] = useState()
    const user = useContext(AppContext);

    
    const onAddComment=(e)=>{
        console.log(e,'eeeeeeeeeeeeeee')
        let reply = {
            bid:paramId,
            cgroup: 0, // 대댓글일시 parent의 group no,아닐시 maxCgroup
            cdepth: 0, // 본댓글 0, 대댓글1
            cwriter: user.id,
            ccontent: commentValue,
        }
        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_COMMENT+`/${paramId}`, {
            method:'POST',
            mode:'cors',
            headers:{
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization':'Bearer ' + user.token,
            },
            body: JSON.stringify(reply)
        })
        .then((res)=>{
            if(res.ok) {
                setLists({
                    ...lists,
                    reply
                })
            }else {
                alert('댓글 작성이 실패하였습니다.')
                return false;
            }
        })
        .catch((err)=>{console.log(err)})
    }
    const onSaveComment=(e)=>{
        let data = e.target.value;
        setCommentValue(data)
    }
    useLayoutEffect(()=>{
        
        if(commentValue!==undefined) return false;
        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_COMMENT+`/${paramId}`, {
            mode:'cors',
            headers:{
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin':'*',
            }
        })
        .then(res=>{
            console.log(res)
            if(!res.ok) {
               
                setLists([])
            }else {
                 console.log('===================-=-=-=')
                return res.json();
            }
        })
        .then(data=>{
            setLists(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    console.log(lists,'댓글페이지')
    return(
    <CommentStyle>
        <div className="commentWrapper">
            {lists===undefined || lists===[]
            ?
            <div className="commentNone"><p>텅~</p></div>
            :
            <div className="commentLists">
                <ul>
                    {lists.map((list,index)=>{
                        return (
                        <li key={`list`+index} style={
                            (list.depth===2)
                            ?
                            {marginLeft:'2vw'}
                            :
                            null
                        }>
                            <p className="writer" style={
                                (list.depth===2)
                                ?
                                {width:'10vw'}
                                :
                                null
                            }>{list.replier}</p>
                            <p className="content">{list.content}</p>
                            <p className="time">{moment(list.date).format('YYYY-MM-DD HH:mm')}</p>
                        </li>
                        )
                    })}
                </ul>
            </div>
            }
            <form >
                <input onChange={(e)=>onSaveComment(e)}type='text'/>
                <label htmlFor="commentBtn" onClick={(e)=>onAddComment(e)} value="게시"><button id="commentBtn"></button>게시</label>
            </form>
        </div>
    </CommentStyle>
    )
}

const CommentStyle = styled.div`
    ul,li {
        list-style: none;
    }
    ul{
        padding: 0 30px;
    }
    li {
        display: flex; text-align: initial; 
    }
    li p:first-child{
        flex-grouw:1; width: 12vw;
    }
    li p:nth-child(2){
        flex-grow:3; 
    }
    form {
        display: flex; justify-content: space-between; padding: 0 10px 10px 10px;
    }
    input {
        border: none; border-bottom : 2px solid #B2B0B0; width: 80vw; padding: 10px; font-size:20px;
    }
    input:focus {
        outline: none; border-bottom : 2px solid black;
    }
    #commentBtn {
        display:none;
    }
    label {
        width: 100px; height:100px; background-color:black; color:white;
    }
`
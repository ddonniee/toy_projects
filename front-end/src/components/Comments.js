import moment from "moment";
import React, { useLayoutEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";
import { AppContext } from "../App";

export default function Comments() {

    const params = useParams();
    const [paramId, setParamId] = useState(params.id);
    const [lists, setLists] = useState([])
    const [commentValue, setCommentValue] = useState()
    const user = useContext(AppContext);

    
    const onAddComment=(e)=>{
        let reply = {
            bid:paramId,
            cgroup: 3, // 대댓글일시 parent의 group no,아닐시 maxCgroup
            ref:3,
            order:1,
            cdepth: 1, // 본댓글 1, 대댓글2
            cwriter: user.id,
            ccontent: commentValue,
        }
        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ADD_COMMENT, {
            method:'POST',
            mode:'cors',
            headers:{
                'Content-type' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                // 'Authorization':'Bearer ' + user.token,
            },
            body: JSON.stringify(reply)
        })
        .then((res)=>{
            if(res.ok) {
                let now = new Date();
                // let temp = lists.concat({
                //     replier:user.id,
                //     cdepth:1,
                //     cgroup:3,
                //     content:commentValue,
                //     date:now
                // });
                // console.log(temp)
                setLists(lists.concat({
                    replier:user.id,
                    cdepth:1,
                    cgroup:3,
                    content:commentValue,
                    date:now
                }))
                setCommentValue('')
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
            if(!res.ok) {
                setLists([])
            }else {
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

    console.log(lists,'[][][]')
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
                            (list.cdepth===2)
                            ?
                            {marginLeft:'2vw'}
                            :
                            null
                        }>
                            <p className="writer" style={
                                (list.cdepth===2)
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
            {/* <form onSubmit="return false;"> */}
                <input onChange={(e)=>onSaveComment(e)}type='text'/>
                <label htmlFor="commentBtn" value="게시"><button type="button" id="commentBtn" onSubmit={false}  onClick={(e)=>onAddComment(e)}></button>게시</label>
            {/* </form> */}
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
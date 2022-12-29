import React, { useEffect, useLayoutEffect, useState,useContext } from "react";
import { Link,useParams } from "react-router-dom";

// components
import styled from "styled-components";
import Header from "../components/Header";
import { AppContext } from "../App";

export default function Edit() {

    const token = useContext(AppContext);
    const [auth,setAuth] = useState(true)
    const [method, setMethod] = useState('POST') // params.id 존재시 카드 수정, 미존재시 카드 생성으로 나누는 기준
    const [posts,setPosts] = useState({
        num:'',
        writer_num:0,
        title:'',
        writer:'donnie',
        contents:'',
        insert_date:'',
        isShown:'',
        category:'사내프로젝트',
        hits: 0,
    })
    
    let params = useParams();

    const onSavePost = (e) =>{
        let checkData = e.target.id;
        let data = e.target.value;

        if(checkData==='postTitle') {
            setPosts({
                ...posts,
                title:data
            })
        }else if(checkData==='postContent'){
            setPosts({
                ...posts,
                contents:data
            })
        }else {
            setPosts({
                ...posts,
                category: data
            })
        }
    }
    const onSubitPost=()=>{

        if(posts.title===''||posts.contents==='') {
            alert('데이터를 입력해주세요.')
            return false
        }

        let posting = {
            // num:posts.writer_num,
            num:1,
            writer: posts.writer,
            title : posts.title,
            contents: posts.contents,
            category: posts.category
        }
       
        fetch(method==='POST'? process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_ADD:process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_ADD+`/${params.id}`, {
            method: method,
            mode:'cors',
            headers:{
                'Content-type':'application/json',
                'Access-Control-Allow-Origin': '*',
                // 'Authorization':'Bearer ' + token,
            },
            body: JSON.stringify(posting),
        })
        .then((response)=>{
            console.log(posting)
            if(response.ok){
                alert('저장되었습니다.')
            }
        })
        .catch((e)=> {console.log(e)})
    }
    const [contentHeight, setContentHeight] = useState('50px')
    useEffect(()=>{
        if(posts.contents.length > 70) {
            setContentHeight('100px')
        }
    },[posts.contents])
    /**
     * params.id로 글 생성,수정 페이지 확인하여 method update
     */
    useLayoutEffect(()=>{
        console.log(params.id,'params.id')
        if(params.id!==undefined){
            setMethod('PATCH')
        }
    },[])

    /**
     * 글 수정하기 페이지일경우 param.is로 해당 포스팅 정보 불러오기
     */
    useLayoutEffect(()=>{
        if(method==='PATCH') {
            fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_ADD+`/${params.id}`, {
                mode:'cors',
                headers:{
                    'Content-Type' : 'application/json',
                    'Accept' : 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization':'Bearer ' + token,
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
        }
    },[method])

    console.log('data',token)
    return(
        <EditStyle height={posts.contents.length}>
        <div className="editWrapper">
            <Header user={auth ? 'writer':'guest'} />
             <form method={method} encType="multipart/form-data">
            <div className="editTop">
                {/* <label htmlFor="title"> */}
                    <input type="text" maxLength="100" id="postTitle" name="title" onChange={(e)=>onSavePost(e)} value={posts.title} placeholder="제목을 입력하세요."></input>
                {/* </label> */}
                <select className="categories" value='사내 프로젝트' onChange={(e)=>onSavePost(e)}>
                    <option value="사내프로젝트">사내 프로젝트</option>
                    <option value="SI프로젝트">SI 프로젝트</option>
                    <option value="개인프로젝트"> 개인 프로젝트</option>
                </select>
            </div>
            <div className="editMiddle">
                <input type="textarea"  cols="50" rows="8" maxLength="5000" id="postContent" onChange={(e)=>onSavePost(e)} value={posts.contents} ></input>
            </div>
            <div className="editButtom">
                <Link to='/'><label htmlFor="cancelPost"><input type="button" value="나가기" id="cancelPost"></input></label></Link>
                <label htmlFor="tempPost"><input type="button" value="임시저장" id="tempPost"></input></label>
                <label htmlFor="savePost"><input type="button" value="저장하기" id="savePost" onClick={onSubitPost}></input></label>
            </div>
            </form>
        </div>
        </EditStyle>
    )
}

const EditStyle = styled.div`
    ul, li {
        list-style:none;
    }
    #postTitle {
        text-align: initial;  font-size: 3em; margin: 0;
        height: 80px; border: none; border-bottom: 3px solid #B2B0B0; width: 80vw;
    }
    #postContent {
        text-align: initial;  font-size: 1em; margin: 0; white-space:pre-wrap;
        border: none;  width: 80vw; height: 50px; padding: 1em 0;
    }
    input[type=text]:focus,
    input[type=textarea]:focus {
        outline: none;  
    }
    #postTitle:focus {
        border-bottom: 3px solid black;
    }
    .editMiddle {
      border-bottom: 3px solid #B2B0B0; min-height: 50vh; width: 80vw; margin-left: 4.5em;
    }

`
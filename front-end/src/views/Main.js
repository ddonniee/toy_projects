import React,{useState, useEffect, useLayoutEffect, useContext} from "react";
import { useNavigate ,useParams,useLocation, redirect } from "react-router-dom";
import styled from "styled-components";
import moment from "moment/moment";
import { Cookies } from 'react-cookie';
// components
import Button from "../components/Button";
import Header from "../components/Header";
// svgs
import Edit from "../public/images/edit.png"
import Delete from "../public/images/delete.png"
import New from '../public/images/new.png'
import { AppContext } from "../App";

export default function Main(props){

    let location = useLocation();
    let navigate = useNavigate();
    const token = useContext(AppContext);

    const [isLogin, setIsLogin] = useState(false)
    const [posts, setPosts] = useState([])
    const [paramId, setParamId] = useState()
    const [btnDetail, setBtnDetail] = useState({
        title:'',
        url:''
    })
    
    const onClickPost=(e,num)=>{
        let url = num;
        navigate(`/read/${url}`, {
            state: {
                post_num: url
            }
        })
    }
    const onDeletePost=(e,num)=>{

        fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_DEL+`/${num}`, {
            mode:'cors',
            method:'PATCH',
            headers:{
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization':'Bearer ' + token,
            }
        })
        .then(res=> {
            console.log(res,'resresee')
            return res.json();
        })
        .then((data)=>{
            if(data.code===200) {
                alert('삭제 완료')
            }
        })
        .catch((err)=> 
            console.log(err)
        );
    }

    function checkLogin() {
        console.log(token)
        if(token!==null) {
            // if(token==null) {
            setBtnDetail({
                ...btnDetail,
                title:'글 작성하기',
                url:'/write'
            })
            setIsLogin(true)
        }else{
            setBtnDetail({
                ...btnDetail,
                title:'로그인하기',
                url:'/login'
            })
        }
    }

    function getLists() {
        fetch(paramId === undefined ? process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_BOARD : process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_CATEGORY+'/'+paramId, {
            mode:'cors',
            headers:{
                'Accept' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization':'Bearer ' + token,
            }
        })
        .then(res=> {
            console.log(res)
            if(res.statusText==='Unauthorized') {
                alert('인증이 필요합니다.')
                window.location.replace('/login')
            }
            return res.json();
        })
        .then(data=>{
            setPosts(data)
        })
        .catch((err)=> 
            console.log(err)
        );
    }

    function logout() {
        // fetch(process.env.REACT_APP_SERVER_ADDRESS+'/users/logout', {
        //     mode:'cors',
        //     headers:{
        //         'Content-Type' : 'application/json',
        //         'Accept' : 'application/json',
        //         'Access-Control-Allow-Origin':'*',
        //         'Authorization':'Bearer ' + token,
        //     }
        // })
        // .then(res=> {
        //     return res.json();
        // })
        // .then(data=>{
        //     setPosts(data)
        // })
        // .catch((err)=> 
        //     console.log(err)
        // );
    }
    // fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_ACCESS_BOARD, {
         useLayoutEffect(()=>{
            if(location.pathname==='/') {
                setParamId(undefined)
            }else {
                setParamId(location.state.category)
            }
            checkLogin()
            getLists()
        },[])

        useEffect(()=>{
            getLists()
        },[paramId])

    return(
        <MainStyle>
        <div className="mainWrapper">
            {/* <div className="mainTop">게시판</div> */}
            <div className="contents">
                <Header isShown={true} title={btnDetail.title} url={btnDetail.url} onReadUrl={setParamId}/>
                <div className="categoryTitle">{paramId === undefined ? '전체보기': paramId}</div>
                 <table className="lists">
                    <tr >
                        <th>번호</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>작성시간</th>
                        <th>조회수</th>
                    </tr>
                    {
                        posts.map((post,index)=>{
                            return(
                            <tr key={`list`+index} name={post.num} onClick={(e)=>onClickPost(e,post.num)}>
                                <td>{(posts.length)-(index)}</td>
                                <td>{post.title}</td>
                                <td>{post.writer}</td>
                                <td>{moment(post.insert_date).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>{post.hits}</td>
                            </tr>
                            )
                        })
                    }
                    
                </table>
                <input type='button' onClick={(e)=>{logout(e)}} value='로그아웃'></input>
            </div>
        </div>
        </MainStyle>
    )
}

const MainStyle = styled.div`
table {
    width: 100vw;  border-top: 1px solid;table-layout: fixed
}
table th:first-child,
table th:last-child{
    width: 7%;
}
table th:nth-child(2){
    width: 50%;
}
table th:nth-child(3),
table th:nth-child(4){
    width: 16%;
}
.contents {
    height: 100vh;
}
.categoryTitle {
    display: flex; align-items: center; font-size: 2em; padding-left: 1em; border-bottom: 1px black;  
}
.topContent {
    display :flex; justify-content: center;
}
.editContent {
    margin-bottom: auto;
    margin-top: auto;
    position: absolute;
    left: 96%;
}
}
.aContent {
    border : 1px solid red;
}
.editContent img {
    width: 20px;
}
.lists {
    border-collapse: collapse
}
.lists > tr {
    height: 50px;
}
.lists > tr:not(:first-child) {
    border-bottom : 1px solid #B2B0B0;
}
.lists tr > td:nth-child(2) {
    text-align: initial;
}
`
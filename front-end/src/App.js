import './App.css';
import React, {createContext, useEffect} from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
// components
import Main from './views/Main'
import Edit from './views/Edit';
import Post from './views/Post';
import Login from './views/Login';
import { useLayoutEffect, useState } from 'react';

export const AppContext = createContext();

function App() {
  
  const [login, setLogin] = useState({
    id:null,
    password:null,
  })
  const [isLogin, setIsLogin] = useState(false)
  const [token, setToken] = useState(null)
  async function checkAuth() {
    let userInfo = {
        userId: login.id,
        userPw:login.password
    }
    await fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_AUTH, {
        method:'POST',
        mode:'cors',
        headers:{
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Access-Control-Allow-Origin':'*',
        },
        body: JSON.stringify(userInfo)
    })
    .then(res=>{
        return res.json();
    })
    .then(data=>{
      console.log('data',data)
      setToken(data.token)
    })
    .catch(err=>{
        console.log(err)
    })
}
const onSaveInfo=(e)=>{

  console.log(e.target.value)
  let target = e.target.className;
  let values = e.target.value;

  if(target==='login_id'){
      setLogin({
          ...login,
          id:values
      })
  }else {
      setLogin({
          ...login,
          password:values
      })
  }
}
const onSubmitInfo=(e)=>{
  console.log('야호')
}
useEffect(()=>{
  if(token!==null){
    console.log('=====================!!')
    setIsLogin(true)
  }
},[token])

console.log(token,'tokentokentokentoken')
  return (
    <AppContext.Provider value={token}>
        <BrowserRouter>
        <div className="App">
          <div className='content'>
            <Routes>
            {token == undefined || token == null
              ?
              <Route excact path="/" element={<Login onChange={onSaveInfo} onClick={checkAuth}/>}></Route>
              :
              <Route excact path="/" element={<Main/>}></Route>
              }
              <Route excact path="/login" element={<Login onChange={onSaveInfo} onClick={checkAuth}/>}></Route>
              <Route path="/category/:id" element={<Main/>}></Route>
              <Route path="/read/:id" element={<Post/>}></Route>
              <Route path="/write" element={<Edit/>}></Route>
              <Route path="/write/:id" element={<Edit/>}></Route>
          </Routes>
          </div>
        </div> 
        </BrowserRouter>
    </AppContext.Provider>
  );
}
export default App;
  

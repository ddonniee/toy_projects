import './App.css';
import React, {createContext, useEffect,useLayoutEffect,useState} from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cookies } from 'react-cookie';
// components
import Main from './views/Main'
import Edit from './views/Edit';
import Post from './views/Post';
import Login from './views/Login';

export const AppContext = createContext();

function App() {
  
  const cookies = new Cookies();
  const [login, setLogin] = useState({
    id:null,
    password:null,
  })
  const [user, setUser] = useState({
    id:cookies.get('id'),
    name:cookies.get('name'),
    token: cookies.get('token')
  })
  const [isLogin, setIsLogin] = useState(false)

  async function checkAuth() {
    let userInfo = {
        userId: login.id,
        userPw:login.password
    }
    await fetch(process.env.REACT_APP_SERVER_ADDRESS+process.env.REACT_APP_AUTH, {
        method:'POST',
        mode:'cors',
        credentials: 'include',
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
      // setToken(data.accessToken)
      setUser({
        ...user,
        id: data.id,
        name: data.name,
        token: data.accessToken,
      })
    })
    .catch(err=>{
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
  if(user.token!==null){
    setIsLogin(true)
  }
},[user.token])
console.log('ㅇㅇㅇ',user)

  return (
    <AppContext.Provider value={user}>
        <BrowserRouter>
        <div className="App">
          <div className='content'>
            <Routes>
            {!isLogin
              ?
              <Route excact path="/" element={<Login onChange={onSaveInfo} onClick={checkAuth}/>}></Route>
              :
              <Route excact path="/" element={<Main/>}></Route>
              }
              <Route excact path="/" element={<Main/>}></Route>
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
  

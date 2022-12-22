import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
// components
import Main from './views/Main'
import Edit from './views/Edit';
import Post from './views/Post';
// export const AppContext = createContext();

function App() {

  return (
    //<AppContext.Provider value={value}>
        <BrowserRouter>
        <div className="App">
          <div className='content'>
            <Routes>
              <Route excact path="/" element={<Main/>}></Route>
              <Route path="/category/:id" element={<Main/>}></Route>
              <Route path="/read/:id" element={<Post/>}></Route>
              <Route path="/write" element={<Edit/>}></Route>
              <Route path="/write/:id" element={<Edit/>}></Route>
          </Routes>
          </div>
        </div> 
        </BrowserRouter>
    //</AppContext.Provider>
  );
}
export default App;
  

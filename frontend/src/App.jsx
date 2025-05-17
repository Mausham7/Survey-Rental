import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useNavigation } from 'react-router-dom'


const App = () => {
  const navigation = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token || token === null){
        navigation("/");
    }
  },[])

  return (
    <>
      <Outlet />
    </>
  )
}

export default App
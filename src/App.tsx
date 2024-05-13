import React, { useState } from 'react';
import './App.css';
import Form from './components/Form';
import Datas from './components/Datas';

function App() {


  return (
    <div className="App">
      <Form/>
      <hr />
      <Datas/>
    </div>
  );
}

export default App;

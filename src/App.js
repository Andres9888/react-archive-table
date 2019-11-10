import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import BootstrapTable from 'react-bootstrap-table-next';



export default () =>
  <BootstrapTable keyField='id' data={ products } columns={ columns } />

export default App;

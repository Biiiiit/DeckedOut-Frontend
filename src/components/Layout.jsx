import React from 'react';
import TopNavbar from './TopNavbar';
import './Layout.css'; 

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <main>{children}</main>
    </div>
  );
};

export default Layout;

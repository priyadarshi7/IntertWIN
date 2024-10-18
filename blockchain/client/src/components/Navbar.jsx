import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <h1>Project Marketplace</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sell">Sell a Project</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

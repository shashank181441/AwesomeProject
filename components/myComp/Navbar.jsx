// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import VendingIcon from "../../assets/VendingMachine.png";
import CartIcon from "../../assets/Cart.png";

function Navbar() {
  return (
    <nav className="flex w-full justify-between bg-gray-200 p-4 mb-8 px-6 items-center">
      <Link to="/" className="flex items-center font-bold text-2xl">
        <img src={VendingIcon} alt="Vending Machine" />
        <h1>Vending</h1>
      </Link>
      <Link to="/carts">
        <img src={CartIcon} alt="Cart" className="w-8 h-8" />
      </Link>
    </nav>
  );
}

export default Navbar;

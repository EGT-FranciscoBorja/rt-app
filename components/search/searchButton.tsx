import React from 'react'
import { FaSearch } from "react-icons/fa";

function SearchButton() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search hotels..."
        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  )
}

export default SearchButton

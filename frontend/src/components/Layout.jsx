import React from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link to="/">FlightBooker</Link>
          </h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/flights" className="hover:underline">Flights</Link>
            <Link to="/about" className="hover:underline">About</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white p-4 text-center mt-10">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} FlightBooker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Layout;

import React, { Component, Fragment } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Link,
  withRouter,
  RouteComponentProps,
  NavLink
} from 'react-router-dom';
import { Nav, Navbar, NavItem, NavDropdown } from 'react-bootstrap';
import '../App.css';
import { Routes } from '../Routes';
import 'url-search-params-polyfill';

const Header: React.SFC<RouteComponentProps> = props => {
  const [search, setSearch] = React.useState('');
  React.useEffect(() => {
    const searchParams = new URLSearchParams(props.location.search);
    setSearch(searchParams.get('search') || '');
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };
  const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.history.push(`/products?search=${search}`);
  };
  return (
    <header className="header">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/home">{'SASCraft'}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" variant="pills" defaultActiveKey="/home">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/characters">Characters</Nav.Link>
            <Nav.Link href="/items">Items</Nav.Link>
            <NavDropdown title="Admin" id="basic-nav-dropdown">
              <NavDropdown.Item href="/add_item">Add Item</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="search-container">
            <input
              type="search"
              placeholder="search"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeydown}
            />
          </div>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default withRouter(Header);

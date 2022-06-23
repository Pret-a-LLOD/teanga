import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container } from 'react-bootstrap';
function TeangaNav() {
  return (
  <Navbar bg="dark" 
          variant="dark"
          fixed="top"
          expand="lg"
          style={{"height": "50px"}}
      >
    <Container>
    <Navbar.Brand href="#home">
        <a class="navbar-brand" style={{"position":"fixed","left":"5%","marginTop":"-25px"}} href="../platform">
            <img class="pull-left" src="/static/images/teanga-logo-white.svg" height="40"/> &nbsp;
            <span class="name"><span class="beta">MVP</span></span>
        </a>
    </Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="/admin">Go to Airflow</Nav.Link>
    </Nav>
    </Container>
  </Navbar>)
}


export default TeangaNav;


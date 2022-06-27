import React, { useState } from 'react'
import ServiceCard from './ServiceCard' 
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { InputGroup, FormControl } from 'react-bootstrap'; 
import { Container } from 'react-bootstrap'
import './SearchBar.css'
import { ACTIONS } from '../App'


function SearchBar ({ services, input, dispatch }){
        const [selected, setSelected] = useState(services[0]["name"])
        // list of items
        const MenuItem = ({text, selected}) => {
          return <ServiceCard
            key={text}
            name={text}
            className="menu-item"
            selected={selected}
            dispatch={dispatch}
            ></ServiceCard>;
        };
        // All items component
        // Important! add unique key
        const Menu = (list, selected) =>
          list.filter( (service) => service["name"].includes(input)).map(el => {
            const {name} = el;

            return <MenuItem /*onClick={() => handleClick(name) }*/ text={name} key={name} selected={selected} />;
        });
        const Arrow = ({ text, className }) => {
              return (
                <div style={{
                    border: "2px solid black"
                }}
                  className={className}
                >{text}</div>
              );
            };
        const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
        const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });
        function onSelect(key){
                setSelected(key);
        }
        const menu =  Menu(services, selected); 

        return (
            <Container>
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">Search : </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl 
                    className="searchbar-input"
                    aria-label="Small" 
                    aria-describedby="inputGroup-sizing-sm" 
                    type="text" 
                    value={input} 
                    onChange={(e) => 
                        dispatch({
                            "type": ACTIONS.UPDATE_INPUT,
                            "payload": {
                                "input": e.target.value 
                            }
                        })
                    }
            />
          </InputGroup>
            <ScrollMenu
              style={{
                  width: "100%"
              }}
              data={menu}
              arrowLeft={ArrowLeft}
              arrowRight={ArrowRight}
              selected={selected}
              onSelect={onSelect}
            />
            </Container>
        )
}
export default SearchBar;

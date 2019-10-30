
import React, {FormEvent} from 'react';
import styled from 'styled-components';

const NavigationContainer = styled.div `
  display: grid;

  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 30% 40% 30%;
`;

const NavigationButton = styled.button `
`

interface CommandHandler {
  (cmd: any): void;
}

export const Navigation: React.FC<{onCommand?: CommandHandler}> = ({onCommand})=> {

  const ClickHandler = (
    (cmd: any)=>
      function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if(onCommand) {
          onCommand(cmd);
        }
      }
  );

  const look = ClickHandler({name: "look"});
  const go = (
    (direction: string)=>
      ClickHandler({name: "go", direction: direction})
  );

  return (
    <NavigationContainer>
      <NavigationButton onClick={go("northwest") } >NW</NavigationButton>
      <NavigationButton onClick={go("north") } >North</NavigationButton>
      <NavigationButton onClick={go("northeast") } >NE</NavigationButton>
      <NavigationButton onClick={go("west") } >West</NavigationButton>
      <NavigationButton onClick={look} >LOOK</NavigationButton>
      <NavigationButton onClick={go("east") } >East</NavigationButton>
      <NavigationButton onClick={go("southwest") } >SW</NavigationButton>
      <NavigationButton onClick={go("south") } >South</NavigationButton>
      <NavigationButton onClick={go("southeast") } >SE</NavigationButton>
    </NavigationContainer>
  );
};

export default Navigation;

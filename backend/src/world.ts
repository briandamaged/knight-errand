
import {
  Location, Portal,
} from './models';

import GameEngine from './GameEngine';
import { connect } from 'tls';


// Town Hall
// Church
// Clinic
// 

function createWorld(engine: GameEngine) {

  const townSquare: Location = {
    async getDescription(): Promise<string> {
      return `It's really more of a village oval, if we're being perfectly honest.`
    },

    async getPortals(): Promise<Portal[]> {
      // Return the list of Portals that can be seen
      return [];
    }
  };



  const tavern: Location = {
    async getDescription(): Promise<string> {
      return `You are in a tavern`
    },

    async getPortals(): Promise<Portal[]> {
      return [];
    }
  };


}


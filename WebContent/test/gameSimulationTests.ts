import 'mocha';
import { assert } from 'chai';

import { Game } from '../static/src/out/game/Game';

describe('class Game (Simulation)', () => {

  it('game name should be Remote Ball Point Game', () => {
    
    var game = new Game();

    assert.equal(game.gameName, 'Remote Ball Point Game', 'wrong game name!');

  });


  it('initGameSimulation() should init all static game objects', () => {
    
    var game = new Game();
    game.initGameSimulation();

    assert.isNotNull(game.meetingRoom, 'meetingRoom was not initialized!');
    assert.isNotNull(game.ballBaskets[0], 'no ballBasket was initialized!');
    assert.isNotNull(game.flipchart, 'flipchart was not initialized!');
    assert.isNotNull(game.timer, 'timer was not initialized!');
  });


  it('initGameSimulation() should not create any players or balls', () => {
    
    var game = new Game();
    game.initGameSimulation();

    assert.isNull(game.player, 'there should be no player!');
    assert.equal(Object.keys(game.balls).length, 0, 'there should be no ball!');
    assert.equal(Object.keys(game.players).length, 0, 'there should be no player in players!');
    
  });

  

});
import 'mocha';
import { assert } from 'chai';

import { Game } from '../static/src/out/game/Game';

describe('class Game (Client)', () => {

  it('game name should be Remote Ball Point Game', () => {
    
    var game = new Game();

    assert.equal(game.gameName, 'Remote Ball Point Game', 'wrong game name!');

  });


  it('initGame() should init all static game objects', () => {
    
    var game = new Game();
    game.initGame('Test', 'blue', 'm');

    assert.isNotNull(game.meetingRoom, 'meetingRoom was not initialized!');
    assert.isNotNull(game.ballBaskets[0], 'no ballBasket was initialized!');
    assert.isNotNull( game.flipchart, 'flipchart was not initialized!');
    assert.isNotNull(game.timer, 'timer was not initialized!');

  });


  it('initGame() should create client player', () => {
    var playerName = 'Tester';
    var game = new Game();
    game.initGame(playerName, 'blue', 'm');

    assert.isNotNull(game.player, 'there should be a player!');
    assert.equal(game.player.name, playerName, 'Player name shoud be ' + playerName);

  });


  it('initGameSimulation() should not create balls or other players', () => {
    
    var game = new Game();
    game.initGame();

    assert.equal(Object.keys(game.balls).length, 0, 'there should be no ball!');
    assert.equal(Object.keys(game.players).length, 0, 'there should be no player in players!');
    
  });
  

});
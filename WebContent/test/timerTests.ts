import 'mocha';
import { assert } from 'chai';

import { Timer } from '../static/src/out/gameObjects/Timer';
import { Game } from '../static/src/out/game/Game';

describe('class Timer', () => {


  it('Timer can not exist without game :(', () => {
    
    var game = new Game();
    var timer = new Timer(game, 1, 1);

    assert.isNotNull(timer.targetTime, 'target timer should not be null');

  });
  

});
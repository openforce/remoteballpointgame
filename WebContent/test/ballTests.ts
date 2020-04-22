import 'mocha';
import { assert } from 'chai';

import { Ball } from '../static/src/out/gameObjects/Ball';
import { Game } from '../static/src/out/game/Game';

describe('class Ball', () => {


  it('Ball can exist without game :)', () => {
    
    //var game = new Game();
    var ball = new Ball(null, 1, 1, 'blue');

    assert.isNotNull(ball.id, 'ball id should not be null');

  });

  it('Ball can be updated without game :)', () => {

    var ball = new Ball(null, 1, 1, 'blue');

    ball.update(1000);

    assert.isNotNull(ball.id, 'ball id should not be null');

  });
  

});
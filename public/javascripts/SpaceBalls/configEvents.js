let configEvents = (game) => {
    BABYLON.Tools.RegisterTopRootEvents([{
        name: 'gameLoaded',
        handler: () => {
            document.getElementById('lives').innerHTML = 'Lives: ' + game.player.lives;
            document.getElementById('score').innerHTML = 'Score: ' + Math.round(game.score.score);
            document.getElementById('level').innerHTML = 'Level: ' + game.level;
        }
    }, {
        name: 'keydown',
        handler: (e) => {
            if(e.keyCode === 37) {
                game.player.moveRight = false;
                game.player.moveLeft = true;
            }
            else if(e.keyCode === 39) {
                game.player.moveLeft = false;
                game.player.moveRight = true;
            }
            if(e.keyCode === 38) {
                game.player.moveDown = false;
                game.player.moveUp = true;
            }
            else if(e.keyCode === 40) {
                game.player.moveUp = false;
                game.player.moveDown = true;
            }
        }
    }, {
        name: 'keyup',
        handler: (e) => {
            game.player.moveRight = false;
            game.player.moveLeft = false;
            game.player.moveDown = false;
            game.player.moveUp = false;
        }
    }, {
        name: 'decrementLives',
        handler: () => {
            document.getElementById('lives').innerHTML = 'Lives: ' + game.player.lives;
            game.isPaused = true;
        }
    }, {
        name: 'increaseScore',
        handler: () => {
            document.getElementById('score').innerHTML = 'Score: ' + Math.round(game.score.score);
        }
    }, {
        name: 'levelUp',
        handler: () => {
            game.level += 1;
            game.player.levelUp(game.level);
            document.getElementById('level').innerHTML = 'Level: ' + game.level;
        }
    }, {
        name: 'reset',
        handler: () => {
            game.player.resetDefault();
            document.getElementById('lives').innerHTML = 'Lives: ' + game.player.lives;
            document.getElementById('score').innerHTML = 'Score: ' + Math.round(game.score.score);
            document.getElementById('level').innerHTML = 'Level: ' + game.level;
            document.getElementById('game-over').style.visibility = 'visible';
        }
    }, {
        name: 'gameOver',
        handler: () => {
            document.getElementById('game-over').style.visibility = 'visible';
            document.getElementById('game-submit').value = game.score.score;
        }
    }]);
};
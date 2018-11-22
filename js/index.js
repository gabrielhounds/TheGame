$(document).ready( function(e) {
	init();
});
function init() {
	var log = console.log;
	log('init');
	var main = $('main');
	var Application = PIXI.Application,
	loader 			= PIXI.loader,
	resources 		= PIXI.loader.resources,
	Sprite 			= PIXI.Sprite;
	var ticker 			= new PIXI.ticker.Ticker({ autoStart : false});
	var t = TweenMax;
	var Utils = {};
	var app,
		loadingText,
		livesText,
		ground,
		derpHolder,
		derpTextures,
		item,
		enemy,
		derp,
		score = 0,
		lives = 3,
		keyCount = 0,
		backCount = 0,
		groundMoveRate = 4.0,
		itemMoveRate = 5.0;
	//var mainWidth 	= $(main).width();
	//var mainHeight 	= $(main).height();
	var stageW 	= window.innerWidth;
	var stageH 	= window.innerHeight;
	var moving = false;
	var jumping = false;

	Utils = (function(){
		var getMousePosition = function() {
			return app.renderer.plugins.interaction.mouse.global;
		}
		var random = function(min, max) {
			if (max == null) { max = min; min = 0; }
			return Math.round(Math.random() * (max - min) + min);
		}
		return {
			random : random,
			getMousePosition : getMousePosition
		}

	}());

	function handleScore() {
		score += 1;
		log('SCORE = ' + score);
	}

	function handleLifeLost() {
		lives -= 1;
		log('LIFE LOST. LIVES = ' + lives);

		if (lives === 2) {
			livesText.text = 'LIVES X X   ';
		} else if (lives === 1) {
			livesText.text = 'LIVES X     ';
		} else if (lives === 0) {
			livesText.text = 'GAME OVER   ';
			alert('game over');
		}

	}

	function bgScroll(delta) {
		if (moving) {
			ground.tilePosition.x -= groundMoveRate;
		} else {
			ground.tilePosition.x = ground.tilePosition.x;
		}
	}

	function handleItems(delta) {
		if (moving) {
			item.rotation -= 0.05 * delta;
			if (item.position.x > -item.width / 2) {
				item.position.x -= itemMoveRate;
			} else {
				//item.position.x = stageW;
				item.position.set(stageW, Utils.random(0, stageH));
			}
		}
	}

	function handleEnemies(delta) {
		if (moving) {
			enemy.rotation -= 0.05 * delta;
			if (enemy.position.x > -item.width / 2) {
				enemy.position.x -= itemMoveRate;
			} else {
				//item.position.x = stageW;
				enemy.position.set(stageW, Utils.random(stageH /2, stageH));
			}
		}
	}

	function handleCollision(delta) {
		//if (item.x - item.width / 2 < derp.x + derp.width / 2 &&  item.x + item.width / 2 > derp.x - derp.width / 2 ) {
		if (item.x - item.width / 2 < derp.x  &&  item.x + item.width / 2 > derp.x ) {
			//log('left of derp');
			//ticker.stop();
			if (item.y < derp.y + derp.height / 2  && item.y > derp.y - derp.height / 2  ) {
				//log('collision');
				//item.position.x = stageW;
				handleScore();
				item.position.set(stageW, Utils.random(stageH /2, stageH));
			}
		}

		if (enemy.x -  enemy.width / 2 < derp.x  &&  enemy.x + enemy.width / 2 > derp.x ) {
			//log('left of derp');
			//ticker.stop();
			if (enemy.y < derp.y + derp.height / 2  && enemy.y > derp.y - derp.height / 2  ) {
				//log('collision');
				//item.position.x = stageW;
				handleLifeLost();
				enemy.position.set(stageW, Utils.random(stageH /2, stageH));
			}
		}
	}
	function handleMove() {
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);
		function onKeyDown(key) {
			if (key.keyCode === 68 || key.keyCode === 39) {
	            // If the D key or the Right arrow is pressed, move the player to the right.
	            log('move right');
	            derp.play();
	            moving = true;

	            if (groundMoveRate < 12) {
		            keyCount += 0.1;
		            groundMoveRate += keyCount;
					itemMoveRate += keyCount;
					log(groundMoveRate);
	            }


	        }
	        if (key.keyCode === 87 || key.keyCode === 38) {
            	// If the W key or the Up arrow is pressed, move the player up.
            	log('UP');
            	//derp.stop();
            	if (!jumping) {
	            	jumping = true;

					//t.to(derp, 1, {physics2D:{velocity:1100, angle:-90, gravity:2200}, onComplete:function() {log('jump done'); jumping = false;} });

					t.to(derp, 1, {physics2D:{velocity:2000, angle:-90, gravity:4000}, onComplete:function() {log('jump done'); jumping = false;} });
            	}
        	}
        	if (key.keyCode === 65 || key.keyCode === 37) {
            	// If the A key or the Left arrow is pressed, move the player to the left.

            	if (groundMoveRate > 4) {
	            	backCount += 0.1;
		            groundMoveRate -= backCount;
					itemMoveRate -= backCount;
					log(groundMoveRate);
	            }
        	}

        	if (key.keyCode === 83 || key.keyCode === 40) {
            	// If the S key or the Down arrow is pressed, move the player down.
            	log('down');
            	t.set(derp, {pixi:{scaleY:0.5}});
        	}

		}
		function onKeyUp(key) {
			if (key.keyCode === 68 || key.keyCode === 39) {
	            // If the D key or the Right arrow is pressed, move the player to the right.
	            log('move right stop');
	            //derp.stop();
	            //moving = false;
	            //derp.gotoAndStop(10);
	        }

	        if (key.keyCode === 83 || key.keyCode === 40) {
            	// If the S key or the Down arrow is pressed, move the player down.
            	log('down');
            	t.set(derp, {pixi:{scaleY:1.0}});
        	}

		}
	}
	function setUpGame() {
		log('set up game');
		t.to(loadingText, 0.3, {pixi:{alpha:0, y:'+=10'}, ease:Power3.easeOut, delay:0.5});
		ticker.start();
		handleMove();
	}
	function setPosition() {
		log('set position');
		ground.position.set(0, stageH - ground.height);

		derp.position.set(derp.width / 2, stageH  - derp.height / 9);

		livesText.position.set(10, 10);

		item.position.set(stageW + item.width / 2, stageH / 2);

		enemy.position.set(stageW + enemy.width / 2, Utils.random(stageH /2, stageH));




		setUpGame();
	}
	function setUp() {
		log('setup');

		item = new PIXI.Sprite(resources['images/item.png'].texture);
		item.anchor.set(0.5);
		item.scale.set(0.5);

		enemy = new PIXI.Sprite(resources['images/enemy.png'].texture);
		enemy.anchor.set(0.5);
		enemy.scale.set(0.5);

		ground = new PIXI.extras.TilingSprite(resources['images/ground.png'].texture, stageW, 31);

		app.stage.addChild(ground);
		app.stage.addChild(item);
		app.stage.addChild(enemy);

		derpTextures = [resources['images/w_00.png'].texture, resources['images/w_01.png'].texture, resources['images/w_02.png'].texture, resources['images/w_03.png'].texture, resources['images/w_04.png'].texture, resources['images/w_05.png'].texture, resources['images/w_06.png'].texture, resources['images/w_07.png'].texture, resources['images/w_08.png'].texture, resources['images/w_09.png'].texture, resources['images/w_10.png'].texture, resources['images/w_11.png'].texture, resources['images/w_12.png'].texture, resources['images/w_13.png'].texture, resources['images/w_14.png'].texture, resources['images/w_15.png'].texture, resources['images/w_16.png'].texture, resources['images/w_17.png'].texture];
		derp = new PIXI.extras.AnimatedSprite(derpTextures);
		//derp.anchor.set(0.5);
		derp.anchor.set(0.5, 0.7);

		derp.animationSpeed = 0.5;
		app.stage.addChild(derp);
		setPosition();
	}
	function initLoader() {
		log('init loader');
		function loadProgressHandler() {
			loadingText.text = 'LOADING ' + Math.round(loader.progress) + '%';
			loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);
		}
		loader.add([
			'images/ground.png',
			'images/item.png',
			'images/enemy.png',
			'images/w_00.png',
			'images/w_01.png',
			'images/w_02.png',
			'images/w_03.png',
			'images/w_04.png',
			'images/w_05.png',
			'images/w_06.png',
			'images/w_07.png',
			'images/w_08.png',
			'images/w_09.png',
			'images/w_10.png',
			'images/w_11.png',
			'images/w_12.png',
			'images/w_13.png',
			'images/w_14.png',
			'images/w_15.png',
			'images/w_16.png',
			'images/w_17.png',
		]).on('progress', loadProgressHandler).load(setUp);
	}
	function initStage() {
		log('init stage');
		app = new Application({width : stageW, height : stageH});
		app.renderer.backgroundColor = 0xCECECE;
		$(app.view).appendTo(main);
		loadingText = new PIXI.Text('LOADING    ', {fontFamily : 'VT323, monospace', fontSize: 30, fill : 0x000000, align : 'center'});
		loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);

		livesText = new PIXI.Text('LIVES X X X ', {fontFamily : 'VT323, monospace', fontSize: 30, fill : 0x000000, align : 'center'});
		app.stage.addChild(livesText);

		app.stage.addChild(loadingText);
		initLoader();
	}
	ticker.add( function(delta){
		//log('ticker');
		//handleMove();

		bgScroll(delta);
		handleItems(delta);
		handleEnemies(delta);
		handleCollision(delta);
	});

	initStage();

	$( window ).resize(function() {
		log('window resize');
		//var w = window.innerWidth;
		//var h = window.innerHeight;
		stageW = window.innerWidth;
		stageH = window.innerHeight;
		app.renderer.resize(stageW, stageH);
		ground.width = stageW;
		ground.position.set(0, stageH - ground.height);
		derp.position.set(derp.width / 2, stageH  - derp.height / 9);
	});
}
//
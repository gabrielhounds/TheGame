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

	var app,
		loadingText,
		ghost,
		ground,
		derpHolder,
		derpTextures,
		derp;


	var mainWidth 	= $(main).width();
	var mainHeight 	= $(main).height();

	var stageW = mainWidth;
	var stageH = mainHeight;

	var moving = false;
	var jumping = false;

	log(mainWidth);

	function bgScroll(delta) {
		if (moving) {
			ground.tilePosition.x -= 4.0;
		} else {
			ground.tilePosition.x = ground.tilePosition.x;
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
	            if (ghost.x < 915) {
					t.set(ghost, {pixi:{x:'+=25'}});
            	}

	        }

	        if (key.keyCode === 87 || key.keyCode === 38) {
            	// If the W key or the Up arrow is pressed, move the player up.
            	log('UP');
            	//derp.stop();
            	if (!jumping) {
	            	jumping = true;
					t.to(derp, 1, {physics2D:{velocity:1100, angle:-90, gravity:2200}, onComplete:function() {log('jump done'); jumping = false;} });
            	}

        	}

        	if (key.keyCode === 65 || key.keyCode === 37) {
            	// If the A key or the Left arrow is pressed, move the player to the left.
            	if (ghost.x > 45) {
					t.set(ghost, {pixi:{x:'-=25'}});
            	}
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
		}
	}

	function setUpGame() {
		log('set up game');
		t.to(loadingText, 0.3, {pixi:{alpha:0, y:'+=10'}, ease:Power3.easeOut, delay:0.5});
		ticker.start();
		handleMove();
	}

	function setUp() {
		log('setup');

		ghost = new PIXI.Sprite(resources['images/ghost.png'].texture);
		ghost.anchor.set(0.5);
		ghost.scale.set(0.25);
		ghost.position.set(ghost.width / 2, stageH - ghost.height / 2);
		//app.stage.addChild(ghost);

		ground = new PIXI.extras.TilingSprite(resources['images/ground.png'].texture, stageW, 31);
		ground.position.set(0, stageH - ground.height)
		app.stage.addChild(ground);

		derpTextures = [resources['images/w_00.png'].texture, resources['images/w_01.png'].texture, resources['images/w_02.png'].texture, resources['images/w_03.png'].texture, resources['images/w_04.png'].texture, resources['images/w_05.png'].texture, resources['images/w_06.png'].texture, resources['images/w_07.png'].texture, resources['images/w_08.png'].texture, resources['images/w_09.png'].texture, resources['images/w_10.png'].texture, resources['images/w_11.png'].texture, resources['images/w_12.png'].texture, resources['images/w_13.png'].texture, resources['images/w_14.png'].texture, resources['images/w_15.png'].texture, resources['images/w_16.png'].texture, resources['images/w_17.png'].texture];

		derp = new PIXI.extras.AnimatedSprite(derpTextures);
		derp.anchor.set(0.5);
		derp.position.set(derp.width / 2, stageH - derp.height / 3.5);
		derp.animationSpeed = 0.5;
		app.stage.addChild(derp);

		setUpGame();
	}

	function initLoader() {
		log('init loader');

		function loadProgressHandler() {
			loadingText.text = 'LOADING ' + Math.round(loader.progress) + '%';
			loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);
		}

		loader.add([
			'images/ghost.png',
			'images/ground.png',
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

		app = new Application({width : mainWidth, height : mainHeight});
		app.renderer.backgroundColor = 0xCECECE;
		$(app.view).appendTo(main);

		loadingText = new PIXI.Text('LOADING    ', {fontFamily : 'VT323, monospace', fontSize: 30, fill : 0x000000, align : 'center'});
		loadingText.position.set(stageW / 2 - loadingText.width / 2, stageH / 2);
		app.stage.addChild(loadingText);

		initLoader();

	}

	ticker.add( function(delta){
		//log('ticker');
		//handleMove();
		bgScroll(delta);
	});



	initStage();

}

































//
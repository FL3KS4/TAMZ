/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



class EndScene extends Phaser.Scene {
    
    constructor() {
      //https://www.w3schools.com/jsref/jsref_class_super.asp  
      super({ key: 'endScene' });
            this.coins;             
    }    
    
    preload()
    {
        this.load.image('gameover1','assets/GO1.png');
        this.load.image('gameover2','assets/GO2.png');
        this.load.image('gameover3','assets/GO3.png');
                         
    }
    
    create(data) 
    {       
        
        this.anims.create({
            key: 'GOver',
            frames: [
                { key: 'gameover1' },
                { key: 'gameover2' },
                { key: 'gameover3' },
                { key: 'gameover2', duration: 50 }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        this.add.sprite((this.cameras.main.width / 2) - 50,this.cameras.main.height / 2).play('GOver');
        
        this.menuButton = this.make.text({
          x: (this.cameras.main.width / 2) - 100,
          y: this.cameras.main.height / 2 + 100,
          text: 'MENU',
          style: {
            font: '20px fantasy',
            color: '#ffffff'
            //fill: '#ffffff'
            
        }
        });         
        
        this.Score = this.make.text({
          x: (this.cameras.main.width / 2) - 100,
          y: this.cameras.main.height / 2 + 50,
          text: 'score: '+ data.coins,
          style: {
            font: '35px fantasy',
            color: '#ff0000'
            //fill: '#ffffff'
            
        }
        });
        
        
        //https://www.w3schools.com/js/js_arrow_function.asp
        this.menuButton.setInteractive();
        this.menuButton.on('pointerdown', () => this.clickMenu());
        
       
    }
    
    clickMenu()
    {
        this.scene.start('menuScene');
        
    }
}

class MenuScene extends Phaser.Scene {
    
    constructor() {
      //https://www.w3schools.com/jsref/jsref_class_super.asp  
      super({ key: 'menuScene' });
    }    
    
    preload()
    {
        this.load.image('background','assets/pax.jpg');
        
        
    }
    
    create() 
    {
        
        
        
 
        let image = this.add.image(this.cameras.main.width / 1.5, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width  / image.width;
        let scaleY = this.cameras.main.height / image.height;
        let scale = Math.max(scaleX, scaleY);
        image.setScale(scale).setScrollFactor(0);
        
        
        this.HighScore = this.make.text({
          x: 150,
          y: 100,
          text: 'Highscore: '+ localStorage.getItem(1),
          style: {
            font: '75px fantasy',
            color: '#ff0000'
            //fill: '#ffffff'
            
        }
        });
        
        
        this.levelGameButton1 = this.make.text({
          x: (this.cameras.main.width / 2) - 100,
          y: this.cameras.main.height / 2,
          text: 'START',
          style: {
            font: '100px fantasy',
            color: '#ff0000'
            //fill: '#ffffff'
            
        }
        });         

        this.levelGameButton2 = this.make.text({
          x: (this.cameras.main.width / 2) - 300,
          y: 300,
          text: 'LoOTiTSch',
          style: {
            font: '200px fantasy',
            fill: '#ffffff'
          }
        }); 
        
        //https://www.w3schools.com/js/js_arrow_function.asp
        this.levelGameButton1.setInteractive();
        this.levelGameButton1.on('pointerdown', () => this.clickLevelButton1());
        
        //this.levelGameButton2.setInteractive();
        //this.levelGameButton2.on('pointerdown', () => this.clickLevelButton2());
    
        
    
    }
    
    /*getDB()
    {
      
        db = openDatabase('HS', '0.1', 'HighScore', 65536);
        db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM highscore', [], function (tx, results) { 
                
               for (var i = 0; i < 1; i++) { 
                  var item = results.rows.item(i);  
                  var score = item['score'];
                  localStorage.setItem(2, score);            
               } 
            }, null); 
         });
         
          if(localStorage.getItem(1) > localStorage.getItem(2))
            {
              let update_query = 'UPDATE highscore SET score= ' + localStorage.getItem(1) + ' WHERE id = 1';

                db.transaction(function (tx) {
                tx.executeSql(update_query);
            });
            }
    }*/
    
    clickLevelButton1()
    {
        this.scene.start('gameScene', {level: 1});
        
    }
        
    clickLevelButton2() {
        //alert("asd")
        this.scene.start('gameScene', {level: 2});
    }  
}

class GameScene extends Phaser.Scene {
       
    coinsCollected = 0;   
    music;
    death;
    pick;
    mute = 0;
       
    constructor() {
      super({ key: 'gameScene' });
      this.currentLevel = 1;
    }    
      
    preload () {
        
        this.load.spritesheet('robot', 'assets/lego.png',
            { frameWidth: 37, frameHeight: 48 } ); 

        this.load.spritesheet('items', 'assets/items.png',
            { frameWidth: 32, frameHeight: 32 } ); 

        this.load.image('tiles', 'assets/map_tiles.png');
        
        this.load.tilemapTiledJSON('json_map_1', 'assets/json_map.json');
        this.load.tilemapTiledJSON('json_map_2', 'assets/json_map_2.json'); 
        
        this.load.image('bomb', 'assets/bomb.png'); 
        
        this.load.image('Heart', 'assets/heart.png');
        this.load.image('EHeart', 'assets/Eheart.png');
        
        this.load.audio('Music', 'assets/Game.mp3');
        this.load.audio('Pick', 'assets/Gotone.mp3');
        this.load.audio('Death', 'assets/Death.mp3');
        this.load.audio('HarDD', 'assets/HardMode.mp3');
        
    }
    
    create (data)  {
        
        
        console.log(data.level);
        this.lvl = 'json_map_' + data.level;
        console.log(this.lvl);
        this.lifes = 3;
        this.heart1 = this.add.sprite((game.canvas.width/4)-100, -40,'Heart');
        this.heart2 = this.add.sprite((game.canvas.width/4),-40 ,'Heart');
        this.heart3 = this.add.sprite((game.canvas.width/4) + 100, -40,'Heart');
        
       
        
        this.map = this.make.tilemap({ key: this.lvl });
        //'map_tiles' - name of the tilesets in json_map.json
        //'tiles' - name of the image in load.images()
        this.tiles = this.map.addTilesetImage('map_tiles','tiles');

        this.backgroundLayer = this.map.createDynamicLayer('background', this.tiles, 0, 0);
        this.collisionLayer = this.map.createDynamicLayer('collision', this.tiles, 0, 0).setVisible(true);
        this.collisionLayer.setCollisionByExclusion([ -1 ]);

        this.items = this.physics.add.sprite(100, 100, 'items', 0);
        this.items.setBounce(0.1);

        this.player = this.physics.add.sprite(100, 450, 'robot');
        this.player.setBounce(0.1);

        this.bombs = this.physics.add.sprite(100,100, 'bomb');
        this.liffe = 1000;
        this.life = this.liffe;
        this.speedBomb = 4;
        

        this.physics.add.collider(this.player, this.collisionLayer);
        this.physics.add.overlap(this.player, this.backgroundLayer);
        this.physics.add.collider(this.bombs, this.collisionLayer);
        
        
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.cameras.main.startFollow(this.player);
        
        this.physics.add.overlap(this.player, this.items, this.collisionHandler,null,this);
        this.physics.add.overlap(this.player, this.bombs, this.collisionHandlerBomb, null, this);
        
        
        
        
        
        this.text = this.add.text(game.canvas.width/2, 16, '', {
        fontSize: '3em',
        fontFamily: 'fantasy',
        align: 'center',
        boundsAlignH: "center", 
        boundsAlignV: "middle", 
        fill: '#ffffff'
        });
        this.text.setOrigin(0.5);
        this.text.setScrollFactor(0);    
        this.updateText();
        
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 15 }),
            frameRate: 20,
            repeat: -1
        });        
        
        this.music = this.sound.add('Music');
        this.music.loop = true;
        this.music.play();
        
        this.Mutetext = this.add.text(game.canvas.width - 150, 46, 'MUTE MUSIC', {
        fontSize: '3em',
        fontFamily: 'fantasy',
        align: 'center',
        boundsAlignH: "center", 
        boundsAlignV: "middle", 
        fill: '#ffffff'
        });
        this.Mutetext.setOrigin(0.5);
        this.Mutetext.setScrollFactor(0);  
        
        this.Mutetext.setInteractive();
        this.Mutetext.on('pointerdown', () => this.clickMute());
        
        
        this.Hardtext = this.add.text(game.canvas.width - 150, 100, 'HARDMODE: OFF', {
        fontSize: '3em',
        fontFamily: 'fantasy',
        align: 'center',
        boundsAlignH: "center", 
        boundsAlignV: "middle", 
        fill: '#ffffff'
        });
        this.Hardtext.setOrigin(0.5);
        this.Hardtext.setScrollFactor(0);  
        
        this.Hardtext.setInteractive();
        this.Hardtext.on('pointerdown', () => this.hardMode());
        this.hard = 0;
        
    }
    
    hardMode()
    {
      
       
       if(this.hard === 0)
       {
           this.Hardtext.setText('HARDMODE: ON');
           this.speedBomb = 8;
           this.liffe = 250;
           this.hard = 1;
           this.lifes = 1;
           this.heart3.destroy();
           this.heart3 = this.add.sprite((game.canvas.width/4) + 100, -40,'EHeart');
           this.heart2.destroy();
           this.heart2 = this.add.sprite((game.canvas.width/4),-40,'EHeart');    
           
           this.music.stop();
           
           this.music = this.sound.add('HarDD');
           this.music.loop = true;
           this.music.play();
       }
    }


    
    
    clickMute()
    {
        if(this.mute === 0)
        {
            this.music.stop();
            this.mute = 1;
            this.Mutetext.setText('UNMUTE MUSIC');
        }
        else
        {
            this.music.play();
            this.mute = 0;
            this.Mutetext.setText('MUTE MUSIC');
        }
        
    }
    
    updateText ()
    {
	this.text.setPosition(this.game.canvas.width/2 / this.map.scene.cameras.main.zoom, this.text.height+16);
        this.text.setText(
        'Coins collected: ' + this.coinsCollected //+ '    Best result: ' + bestCollected
    );
    this.text.setColor('white');
    }
    
    collisionHandler(player, item)
    {
        //this.currentLevel + 1
        //alert(this.currentLevel);
        //this.scene.start("gameScene", {level: 2});  
        this.pick = this.sound.add('Pick');
        this.pick.play();
        
        this.coinsCollected += 1;
    //if (coinsCollected > bestCollected) { bestCollected = coinsCollected; }
        this.updateText();
        //items.destroy();  
        item.disableBody(true, true);
      
        if (item.body.enable === false)
        {
            var h = this.map.heightInPixels-40;
            var w = this.map.widthInPixels-40;
            var itemX = Phaser.Math.Between(40,w - 200);
            var itemY = Phaser.Math.Between(40, (h-200));
            var itemID = Phaser.Math.Between(0, 118);
            item.setFrame(itemID);
            item.enableBody(true, itemX, itemY, true, true);
        }

        
    }
    
    
    collisionHandlerBomb(player, bomb)
    {
        
        
        this.die = this.sound.add('Death');
        this.die.play();
        
        bomb.disableBody(true,true);
        
        this.lifes -= 1;
        
        if(this.lifes === 2)
        {
            this.heart3.destroy();
            this.heart3 = this.add.sprite((game.canvas.width/4) + 100, -40,'EHeart');
        }
        else if(this.lifes === 1)
        {
            this.heart2.destroy();
            this.heart2 = this.add.sprite((game.canvas.width/4), -40,'EHeart');
        }
        else if(this.lifes === 0)
        {
            this.heart1.destroy();
            this.heart1 = this.add.sprite((game.canvas.width/4) - 100, -40,'EHeart');
             
            if(localStorage.getItem(1) < this.coinsCollected)
            {
               localStorage.setItem(1, this.coinsCollected);
            }
                      
            
            this.music.stop();
            this.scene.start('endScene', {coins: this.coinsCollected});
            this.coinsCollected = 0;
            

        }
        
        
        if (bomb.body.enable === false)
        {
            var h = this.map.heightInPixels-40;
            var w = this.map.widthInPixels-40;
            var itemX = Phaser.Math.Between(40,w - 200);
            var itemY = 40;
            //var itemID = Phaser.Math.Between(0, 118);
            
            bomb.enableBody(true, itemX, itemY, true, true);
        }
        
        
        
        
        
        //this.bombs = this.physics.add.sprite(100,100, 'bomb');
        
        
        
        
    }
    

    
    update() {
        
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-250);
            this.player.angle = 90;
            this.player.anims.play('run', true); 
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(250);
            this.player.angle = 270;
            this.player.anims.play('run', true); 
        }
        else
        {
            this.player.body.setVelocityX(0);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-250);
            this.player.angle = 180;
            this.player.anims.play('run', true); 
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(250);
            this.player.anims.play('run', true); 
            this.player.angle = 0;
        }
        else
        {
           this.player.body.setVelocityY(0);
        }        
        
        
        
        this.bombs.y += this.speedBomb;
        this.life -= 2;
        
        if(this.life === 0)
        {
            this.bombs.disableBody(true,true);        
            if (this.bombs.body.enable === false)
            {
                var h = this.map.heightInPixels-40;
                var w = this.map.widthInPixels-40;
                var itemX = Phaser.Math.Between(40,w);
                var itemY = 40;
                //var itemID = Phaser.Math.Between(0, 118);

                this.bombs.enableBody(true, itemX, itemY, true, true);
                this.life = this.liffe;
            }
        }
        
        
    }
    
    
}

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },           
            debug: false
        }
    },
    debug: true
};




var game = new Phaser.Game(config);

var menuScene = new MenuScene();
var gameScene = new GameScene();
var endScene = new EndScene();
game.scene.add('menuScene', menuScene);
game.scene.add('gameScene', gameScene);
game.scene.add('endScene', endScene);
game.scene.start('menuScene');

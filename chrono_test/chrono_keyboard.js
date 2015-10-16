var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);

renderer.backgroundColor = 0x000000
document.body.appendChild(renderer.view);

loader
  .add("images/chrono.json")
  .add("images/treasureHunter.json")
  .load(setup);

var blobs, camera
var frame_n = 0
var textures

function loadTextures(){
  textures = {up:[], left:[], down:[], right:[]}
  Object.keys(textures).forEach(function (key){
    for (var i=0; i<= 3; i++){
        textures[key].push(Texture.fromFrame("chrono_" + key + "_" + i + ".png"))
    }
  })
}

function setup() {

  Mousetrap.bind('r', function(){
    renderer._backgroundColorRgb[0] += (1/255) 
  })

  Mousetrap.bind('g', function(){
    renderer._backgroundColorRgb[1] += (1/255)
  })

  Mousetrap.bind('b', function(){
    renderer._backgroundColorRgb[2] += (1/255) 
  })

  camera = {position: [0,0] , offset: [400,300]}
  loadTextures();
  var chrono = new Character(textures['down'][0], 0, 0, 0, 0, ['down', 'still'])

  chrono.addControls();
  stage.addChild(chrono);

  blobs = []
  for (var i=0 ; i < 10; i++){
    blob = new Sprite.fromFrame("blob.png");
    blob.abs_x = i*100 - camera['offset'][0]
    blob.abs_y = 0
    blob.v = 1
    stage.addChild(blob);
    blobs.push(blob)
  }



  new Game(chrono).play();
}

function Game(hero){

  this.hero = hero

  this.play = function() {

    var self = this
    var hero = this.hero

    requestAnimationFrame(function(){
        self.play(hero);
      }
    );

    if(frame_n % 10 == 0){
      hero.pick_animation(frame_n / 10);
      if(frame_n == 40){
      hero.pick_animation(0);
        frame_n = 0;
      }
    }
  

    //if ((hero.x > 0 || hero.v['x']!= -1) && (hero.x < 760 || hero.v['x']!=1))
      hero.abs_x += hero.v['x'] * 2;
      hero.x = hero.abs_x + camera['offset'][0] - camera['position'][0]
    //if ((hero.y > 0 || hero.v['y']!= -1) && (hero.y < 530 || hero.v['y']!=1))
      hero.abs_y += hero.v['y'] * 2;
      hero.y = hero.abs_y + camera['offset'][1]
      camera['position'] = [hero.abs_x, hero.abs_y]


    blobs.forEach(function(blob){
      if(blob.y > 575){
        blob.v = -1
      }
      if(blob.y < 0){
        blob.v = 1
      }
      blob.abs_y += blob.v
      blob.x = blob.abs_x + camera['offset'][0] - camera['position'][0]
      blob.y = blob.abs_y + camera['offset'][1] - camera['position'][1]
    })

    frame_n += 1;
    renderer.render(stage);
  }
}
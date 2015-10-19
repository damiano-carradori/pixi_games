function Character(texture, x, y, vx, vy, state){
  
  PIXI.Sprite.call(this, texture)
  
  this.x = x;
  this.y = y;
  this.abs_x = x;
  this.abs_y = y;
  this.v = { x: vx, y: vy };
  this.state = state;

  this.updateStatus = function(controls, others){
    for(var i=0; i<others.length; i++) {
      if(controls[others[i]]['isDown'])
        this.state = [others[i], 'moving']
    }
  }

  this.updatePosition = function(camera){
    //if ((this.x > 0 || this.v['x']!= -1) && (this.x < 760 || this.v['x']!=1))
    this.abs_x += this.v['x'] * 2;
    this.x = this.abs_x + camera['offset'][0] - camera['position'][0]
    //if ((this.y > 0 || this.v['y']!= -1) && (this.y < 530 || this.v['y']!=1))
    this.abs_y += this.v['y'] * 2;
    this.y = this.abs_y + camera['offset'][1] - camera['position'][1]
    camera['position'] = [this.abs_x, this.abs_y]
  }

  this.pick_animation = function(animation_frame){
    var self = this
    if(self.state[1] == 'still'){
      animation_frame = 0;
    }
    Object.keys(textures).forEach(function (key){
      if (self.state[0] == key){
        self.texture = textures[key][animation_frame];
      }
    })
  }

  this.addControls = function (){
    var controls = {
      left:  { isDown: false, axis: 'x', v: -1, others: ['up',   'right', 'down'] },
      up:    { isDown: false, axis: 'y', v: -1, others: ['left', 'right', 'down'] },
      right: { isDown: false, axis: 'x', v:  1, others: ['up',   'left',  'down'] },
      down:  { isDown: false, axis: 'y', v:  1, others: ['up',   'right', 'left'] }
    }

    var self = this
    this.controls = controls

    Object.keys(controls).forEach(function (key){

      Mousetrap.bind(key, function() {
        self.state = [key, 'moving']
        self.v[controls[key]['axis']] = controls[key]['v']
        controls[key]['isDown'] = true
      });

      Mousetrap.bind(key, function() {
        self.state = [key, 'still']
        self.updateStatus(controls, controls[key]['others'])
        self.v[controls[key]['axis']] = 0
        controls[key]['isDown'] = false
      }, 'keyup')
    })


  }
}

Character.prototype = Object.create(PIXI.Sprite.prototype)
Character.prototype.constructor = Character
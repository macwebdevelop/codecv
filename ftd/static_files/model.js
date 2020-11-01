function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

window.onerror = handleErr;
var txt=""
function handleErr(msg,url,l){
	txt="There was an error on this page.\n\n"
	txt+="Error: " + msg + "\n"
	txt+="URL: " + url + "\n"
	txt+="Line: " + l + "\n\n"
	txt+="Click OK to continue.\n\n"
	alert(txt)
	return true
}

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.bullets = [];
		this.characters = [];
		this.equipments = [];
		this.terrains = [];
		this.player=null; // a special actor, the player
		this.player_health_num = 0;
		this.player_ammo_num = 0;
		this.player_max_ammo_num = 0;
		this.player_relative_x = 0;
		this.player_relative_y = 0;
	
		// the logical width and height of the stage
		this.width=canvas.width;
		this.height=canvas.height;

        // the real window width and height
        this.trueWidth = 1500;
        this.trueHeight = 1500;

        this.windowOffset = new Pair(this.trueWidth / 2 - this.width / 2, this.trueHeight / 2 - this.height / 2);

		// Add the player to the center of the stage
		var center_position = new Pair(Math.floor(this.width/2), Math.floor(this.height/2));
		//var center_position = new Pair(Math.floor(this.trueWidth/2), Math.floor(this.trueHeight/2));
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
		//this.addPlayer(new Player(this, center_position, 1, 'rgba(255, 10, 10, 1)', 10));
		var velocity = new Pair(0, 0);
		var radius = 15;
		var colour= 'rgba(255, 0, 0, 1)';
		var speed = 10
		var player = new Player(this, center_position, velocity, colour, radius, speed);
		this.addPlayer(player);


		// Add some Stone
		var total=10;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight)); 
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(128, 128, 128, 1)';
				var position = new Pair(x,y);
				var s = new Stone(this, position, velocity, colour, radius);
				this.addTerrain(s);
				total--;
			}
		}
		// Add some Wall
		var total=15;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(200, 150, 50, 1)';
				var position = new Pair(x,y);
				var w = new Wall(this, position, velocity, colour, radius);
				this.addTerrain(w);
				total--;
			}
		}

		var West= -700;
		var East= 1600;
		var North= 1900;
		var South= -800;

		var colour= 'rgba(128, 128, 128, 1)';
		for (var i = West; i <= East; i+=30) {
			var nw = new Stone(this, new Pair(i, North), new Pair(0,0), colour, 15);	
			var sw = new Stone(this, new Pair(i, South), new Pair(0,0), colour, 15);
			this.addTerrain(nw);
			this.addTerrain(sw);
		}
		for (var j = South; j <= North; j+=30) {
			var ew = new Stone(this, new Pair(East, j), new Pair(0,0), colour, 15);	
			var ww = new Stone(this, new Pair(West, j), new Pair(0,0), colour, 15);
			this.addTerrain(ew);
			this.addTerrain(ww);
		}

		// Add some Grass
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight)); 
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 150;
				var colour= 'rgba(0, 255, 0, 0.3)';
				var position = new Pair(x,y);
				var g = new Grass(this, position, velocity, colour, radius);
				this.addTerrain(g);
				total--;
			}
		}
		
		// Add some Ice
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight)); 
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 150;
				var colour= 'rgba(0, 0, 255, 0.3)';
				var position = new Pair(x,y);
				var i = new Ice(this, position, velocity, colour, radius);
				this.addTerrain(i);
				total--;
			}
		}
		
		// Add some Ammo
		var total=15;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 10;
				var colour= 'rgba(10, 10, 255, 0.75)';
				var position = new Pair(x,y);
				var a = new Ammo(this, position, velocity, colour, radius);
				this.addEquipment(a);
				total--;
			}
		}
		// Add some HealthPack
		var total=15;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 10;
				var colour= 'rgba(10, 255, 10, 0.75)';
				var position = new Pair(x,y);
				var h = new HealthPack(this, position, velocity, colour, radius);
				this.addEquipment(h);
				total--;
			}
		}
		// Add some test unmovable Enemy
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(10, 10, 10, 0.5)';
				var position = new Pair(x,y);
				var speed = 0;
				var e = new Enemy(this, position, velocity, colour, radius, speed);
				this.addCharacter(e);
				total--;
			}
		}

		// Add some AIEnemy, speed is an integer in range [1,3] randomly
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(255, 0, 255, 1)';
				var position = new Pair(x,y);
				var speed_min = Math.ceil(1);
				var speed_max = Math.floor(2);
				var speed = Math.floor(Math.random() * (speed_max - speed_min + 1)) + speed_min;
				//var weapon_min = Math.ceil(0);
				//var weapon_max = Math.floor(1);
				//var weapon_number = Math.floor(Math.random() * (weapon_max - weapon_min + 1)) + weapon_min;
				var weapon_number = 0;
				var aie = new AIEnemy(this, position, velocity, colour, radius, speed, weapon_number);
				this.addCharacter(aie);
				total--;
			}
		}

		// Add some RotateEnemy, speed is an integer in range [1,4] randomly
		// start with 0 speed until it has no ammo, 
		// then will catch player untill it pick and get ammo
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(0, 191, 255, 1)';
				var position = new Pair(x,y);
				var speed_min = Math.ceil(1);
				var speed_max = Math.floor(4);
				var speed = Math.floor(Math.random() * (speed_max - speed_min + 1)) + speed_min;
				//var speed = 0; //fixed sniper
				var weapon_number = 2; //sniper
				var rie = new RotateEnemy(this, position, velocity, colour, radius, speed, weapon_number);
				this.addCharacter(rie);
				total--;
			}
		}

		// Add some CatchEnemy, speed is an integer in range [1,5] randomly
		// start with 0 speed until the player is in its catch range
		var total=2;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			var velocity = new Pair(0, 0);
			if(this.getActor(x,y)===null){
				var radius = 15;
				var colour= 'rgba(255, 191, 0, 1)';
				var position = new Pair(x,y);
				var speed_min = Math.ceil(1);
				var speed_max = Math.floor(5);
				var speed = Math.floor(Math.random() * (speed_max - speed_min + 1)) + speed_min;
				var weapon_number = 1; //shotgun
				var cie = new CatchEnemy(this, position, velocity, colour, radius, speed, weapon_number);
				this.addCharacter(cie);
				total--;
			}
		}

		// Add in some Balls for test
		var total=0;
		while(total>0){
			var x=Math.floor((Math.random()*this.trueWidth)); 
			var y=Math.floor((Math.random()*this.trueHeight));
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(20), rand(20));
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = randint(20);
				var alpha = Math.random();
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var b = new Ball(this, position, velocity, colour, radius);
				this.addActor(b);
				total--;
			}
		}

		//add one house
		var house_colour = 'rgba(200, 200, 200, 1)';
		var house_position = new Pair(0, 0);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(200, 0);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(0, 200);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(0, 400);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(0, 600);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(200, 400);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(600, 0);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(800, 0);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(600, 500);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(600, 700);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(600, 900);
		this.addHouse(house_position, house_colour, 100);
		var house_position = new Pair(400, 900);
		this.addHouse(house_position, house_colour, 100);


		/*
		var velocity = new Pair(0,0);
		var stone_radius = 15;
		var stone_colour = 'rgba(128, 128, 128, 1)';
		for (var i = -180; i <= this.trueWidth + 180; i+=30) {
    		var bst = new Stone(this, new Pair(i, -180), velocity, stone_colour, stone_radius);
    		//this.addTerrain(bst);
		}
		for (var i = -180; i <= this.trueWidth + 180; i+=30) {
    		var bst = new Stone(this, new Pair(i, this.trueHeight+180), velocity, stone_colour, stone_radius);
    		//this.addTerrain(bst);
		}
		for (var i = -180; i <= this.trueHeight + 180; i+=30) {
    		var bst = new Stone(this, new Pair(-180, i), velocity, stone_colour, stone_radius);
    		//this.addTerrain(bst);
		}
		for (var i = -180; i <= this.trueHeight + 180; i+=30) {
    		var bst = new Stone(this, new Pair(this.trueWidth+180, i), velocity, stone_colour, stone_radius);
    		//this.addTerrain(bst);
		}
		*/
	}


	addHouse(position, colour, radius){
		var velocity = new Pair(0,0);
		var hx = position.x;
		var hy = position.y;
		var stone_radius = 15;
		var stone_colour = 'rgba(128, 128, 128, 1)';
		var stone_positions = [new Pair(hx-radius, hy-radius+2*stone_radius), new Pair(hx-radius, hy-radius), new Pair(hx-radius+2*stone_radius, hy-radius), 
							  new Pair(hx+radius, hy-radius+2*stone_radius), new Pair(hx+radius, hy-radius), new Pair(hx+radius-2*stone_radius, hy-radius),
							  new Pair(hx-radius, hy+radius-2*stone_radius), new Pair(hx-radius, hy+radius), new Pair(hx-radius+2*stone_radius, hy+radius),
							  new Pair(hx+radius, hy+radius-2*stone_radius), new Pair(hx+radius, hy+radius), new Pair(hx+radius-2*stone_radius, hy+radius)];

		var arrayLength = stone_positions.length;
		//add stone wall for the house on 4 corners
		
		for (var i = 0; i < arrayLength; i++) {
    		var st = new Stone(this, stone_positions[i], velocity, stone_colour, stone_radius);
    		this.addTerrain(st);
		}
		var htp = new Housetop(this, position, velocity, colour, radius);
		this.addActor(htp);
	}

	addPlayer(player){
		this.addActor(player);
		this.characters.push(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		var index = this.characters.indexOf(this.player);
        if (index != -1) {
            this.characters.splice(index, 1);
        }
		this.player=null;
	}

	addCharacter(character){
		this.characters.push(character);
		this.addActor(character);
	}

	removeCharacter(character){
		if(character == this.player){
			this.removePlayer();
		} else {
			var index = this.characters.indexOf(character);
        	if (index != -1) {
            	this.characters.splice(index, 1);
        	}
        	this.removeActor(character);
        }
	}

	addTerrain(terrain){
		this.terrains.push(terrain);
		this.addActor(terrain);
	}

	removeTerrain(terrain){
		var index = this.terrains.indexOf(terrain);
        if (index != -1) {
            this.terrains.splice(index, 1);
        }
        this.removeActor(terrain);
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	addBullet(bullet) {
        this.bullets.push(bullet);
        this.addActor(bullet);
    }

    removeBullet(bullet) {
        var index = this.bullets.indexOf(bullet);
        if (index != -1) {
            this.bullets.splice(index, 1);
        }
        this.removeActor(bullet);
    }

    addEquipment(equip) {
        this.equipments.push(equip);
        this.addActor(equip);
    }

    removeEquipment(equip) {
        var index = this.equipments.indexOf(equip);
        if (index != -1) {
            this.equipments.splice(index, 1);
        }
        this.removeActor(equip);
    }

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
		if(!(this.player == null)){
			this.player_health_num = this.player.health;
			this.player_ammo_num = this.player.leftAmmo;
			this.player_max_ammo_num = this.player.maxAmmo;
			this.player_x = this.player.x;
			this.player_y = this.player.y;
		}else{
			this.player_health_num = 0;
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0-50, 0-50, this.width+100, this.height+100);


		context.save();
		context.translate(0 - this.player_x + this.width/2, 0 - this.player_y + this.height/2);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		context.restore();


		context.save();
		context.beginPath();
		//context.rect(this.width - 100, 0, 100, 100);
		//context.stroke();
		//context.drawImage(this.canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		//this.canvas
		//context.drawImage(this.canvas, this.width/2 - 500, this.height/2 - 500, 1000, 1000, this.width - 100, 0, 100, 100);
		//context.clearRect(this.width - 100, 0, 100, 100);
		context.arc(this.width-50, 50, 50, 0, Math.PI*2,true); // you can use any shape
		context.clip();
		context.stroke();
		context.drawImage(this.canvas, 0, 0, this.width, this.height, this.width - 100, 0, 100, 100);
		context.closePath();
		context.restore();
		//context.drawImage(this.canvas, 0, 0, this.width, this.height, this.width - 100, 0, 100, 100);
		//context.viewport(100, 0, 100, 100);
		//context.scissor(100, 0, 100, 100);
		//context.enable(context.SCISSOR_TEST);
		//context.closePath();

		//var ppx = this.player.position.x;
		//var ppy = this.player.position.y;
		//var bpx = this.player.x_bias;
		//var bpy = this.player.y_bias;
		context.beginPath();
		context.fillStyle = "green";
		context.textAlign = "left";
		context.font="25px Comic Sans MS";
		context.fillText("Health: " + this.player_health_num.toString() + " / 100" , 0, 25);
		context.fillStyle = "blue";
		context.fillText("Ammo: " + this.player_ammo_num.toString() + " / " +  this.player_max_ammo_num.toString(), 0, 50);
		context.fillStyle = "black";
		context.fillText("Position: " + this.player_x.toString() + " , " +  this.player_y.toString(), 0, 75);
		//context.fillText("Position: " + ppx.toString() + " , " +  ppy.toString(), 0, 75);
		//context.fillText("Position_bias: " + bpx.toString() + " , " +  bpy.toString(), 0, 100);
		if(this.player == null){
			context.textAlign = "center";
			context.fillStyle = "red";
			context.font="50px Comic Sans MS";
			context.fillText("You Die !", Math.floor(this.width/2), Math.floor(this.height/2));
		}
		context.closePath();

	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}
} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
	}

	setDirection(direction) {
        this.direction = direction;
    }

	collide(actor) {
		if (actor instanceof Bullet) {
            if (this.health > 0) {
                if (this.health - actor.damage < 0) {
                    this.health = 0;
                } else {
                    this.health -= actor.damage;
                }
                this.stage.removeBullet(actor);
            }
            if(this.health == 0){
            	this.stage.removeCharacter(this);
            }
        }
        if (actor instanceof Ammo) {
            if (this.leftAmmo < this.maxAmmo) {
                if (this.leftAmmo + 50 > this.maxAmmo) {
                    this.leftAmmo = this.maxAmmo;
                } else {
                    this.leftAmmo += 50;
                }
                this.stage.removeEquipment(actor);
            }
        }
        if (actor instanceof HealthPack) {
            if (this.health < 100) {
                if (this.health + 30 > 100) {
                    this.health = 100;
                } else {
                    this.health += 30;
                }
                this.stage.removeEquipment(actor);
            }
        }
        /*
        if (actor instanceof Stone || actor instanceof Wall) {
        	var character_x = this.preposition.x;
        	var character_y = this.preposition.y;
        	var character_radius = this.radius;
        	var stone_x = actor.position.x;
        	var stone_y = actor.position.y;
        	var stone_radius = actor.radius;
        	if (character_x <= stone_x - stone_radius){
        		this.position.x = stone_x - stone_radius - character_radius;
        	}
        	if (character_x >= stone_x + stone_radius){
        		this.position.x = stone_x + stone_radius + character_radius;
        	}
        	if (character_y <= stone_y - stone_radius){
        		this.position.y = stone_y - stone_radius - character_radius;
        	}
        	if (character_y >= stone_y + stone_radius){
        		this.position.y = stone_y + stone_radius + character_radius;
        	}
        	this.intPosition();
        }
        */
        if (actor instanceof Stone || actor instanceof Wall) {
        	var character_x = this.preposition.x;
        	var character_y = this.preposition.y;
        	//var character_x = this.position.x;
        	//var character_y = this.position.y;
        	var character_radius = this.radius;
        	var stone_x = actor.position.x;
        	var stone_y = actor.position.y;
        	var stone_radius = actor.radius;

        	var abs_dy = Math.abs(character_y-stone_y);
        	var abs_dx = Math.abs(character_x-stone_x)
        	var ddif = stone_radius + character_radius;

        	if ((character_x <= stone_x - stone_radius) && (abs_dy < ddif)){
        		this.position.x = stone_x - stone_radius - character_radius;
        		if (this.stage.player.dx > 0){
        			this.stage.player.dx = 0;
        		}
        	}else if ((character_x >= stone_x + stone_radius) && (abs_dy < ddif)){
        		this.position.x = stone_x + stone_radius + character_radius;
        		if (this.stage.player.dx < 0){
        			this.stage.player.dx = 0;
        		}

        	}
        	if ((character_y <= stone_y - stone_radius) && (abs_dx < ddif)){
        		this.position.y = stone_y - stone_radius - character_radius;
        		if (this.stage.player.dy > 0){
        			this.stage.player.dy = 0;
        		}
        	}else if ((character_y >= stone_y + stone_radius) && (abs_dx < ddif)){
        		this.position.y = stone_y + stone_radius + character_radius;
        		if (this.stage.player.dy < 0){
        			this.stage.player.dy = 0;
        		}
        	}

        	//this.intPosition();
        }
        
        if (actor instanceof Grass) {
        	if(this.original_speed <= this.speed){
        		this.speed = this.speed * 0.5;
        	}
        	this.in_terrain = true;
        }
        if (actor instanceof Ice) {
        	if(this.original_speed >= this.speed){
        		this.speed = this.speed * 2;
        	}
        	this.in_terrain = true;
        }
    }
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		/*
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;

		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
		*/
		this.intPosition();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
}
class Character extends Ball{
	constructor(stage, position, velocity, colour, radius, speed){
		super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0, 0);
		this.speed = speed;
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.preposition = this.position;
		this.original_speed = this.speed;
		this.in_terrain = false;
		this.weapon_number = 0;
	}
	fireWeapon(){
    	switch (this.weapon_number) {
            case 0: // pistol
                if(this.leftAmmo >= 1){
    				var shooter_position = new Pair(this.position.x, this.position.y);
    				var pistol_bullet = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, this.direction, 10, 200, this);
    				this.stage.addBullet(pistol_bullet);
    				this.leftAmmo -= 1;
    			}
                break;
            case 1: // shotgun
                if (this.leftAmmo >= 3) {
                	var dir = this.direction - Math.PI/6;
                	var shooter_position = new Pair(this.position.x+Math.cos(dir), this.position.y+Math.sin(dir));
                	var shotgun_bullet_1 = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, dir, 10, 100, this);
                	this.stage.addBullet(shotgun_bullet_1);
                	var dir = this.direction - Math.PI/12;
                	var shooter_position = new Pair(this.position.x+Math.cos(dir), this.position.y+Math.sin(dir));
                	var shotgun_bullet_2 = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, dir, 10, 100, this);
                	this.stage.addBullet(shotgun_bullet_2);
                	var dir = this.direction;
                	var shooter_position = new Pair(this.position.x+Math.cos(dir), this.position.y+Math.sin(dir));
                	var shotgun_bullet_3 = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, dir, 10, 100, this);
                	this.stage.addBullet(shotgun_bullet_3);
                	var dir = this.direction + Math.PI/12;
                	var shooter_position = new Pair(this.position.x+Math.cos(dir), this.position.y+Math.sin(dir));
                	var shotgun_bullet_4 = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, dir, 10, 100, this);
                	this.stage.addBullet(shotgun_bullet_4);
                	var dir = this.direction + Math.PI/6;
                	var shooter_position = new Pair(this.position.x+Math.cos(dir), this.position.y+Math.sin(dir));
                	var shotgun_bullet_5 = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 5, 15, dir, 10, 100, this);
                	this.stage.addBullet(shotgun_bullet_5);
                    this.leftAmmo -= 3;
                }
                break;
            case 2: //sniper rifle
            	if (this.leftAmmo >= 5) {
            		var shooter_position = new Pair(this.position.x, this.position.y);
            		var sniper_bullet = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 10, 30, this.direction, 30, 500, this);
                    this.stage.addBullet(sniper_bullet);
                    this.leftAmmo -= 5;
                }
                break;
            case 3: // hand
                if(this.leftAmmo >= 0){
    				var shooter_position = new Pair(this.position.x, this.position.y);
    				var hand_bullet = new Bullet(this.stage, shooter_position, this.velocity, this.colour, 7, 10, this.direction, 5, 50, this);
    				this.stage.addBullet(hand_bullet);
    			}
                break;
            default:
            	break;
        }
    }
    draw(context){
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.direction);
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(0, 0, this.radius, 0, 2 * Math.PI, false); 
		context.moveTo(15, 15);
		context.arc(15, 15, 5, 0, 2 * Math.PI, false); 
		context.moveTo(15, -15);
		context.arc(15, -15, 5, 0, 2 * Math.PI, false); 
		context.fill(); 
		context.closePath();
        context.stroke();
        context.restore();
        var health_percentage = this.health / 100;
        var ammo_percentage = this.leftAmmo / this.maxAmmo;
        context.beginPath();
        if(health_percentage > 0.63){
        	context.fillStyle="green";
      	}else if(health_percentage > 0.37){
        	context.fillStyle="gold";
      	}else if(health_percentage > 0.13){
        	context.fillStyle="orange";
      	}else{
        	context.fillStyle="red";
      	}
      	context.fillRect(this.position.x - 15, this.position.y + 18, 30*health_percentage, 5);
      	//context.rect(this.position.x - 15, this.position.y + 18, 30, 5);
      	context.fillStyle="blue";
      	context.fillRect(this.position.x - 15, this.position.y + 25, 30*ammo_percentage, 5);
      	//context.rect(this.position.x - 15, this.position.y + 25, 30, 5);
      	context.closePath();
	}

}

class Player extends Character{
	constructor(stage, position, velocity, colour, radius, speed){
		super(stage, position, velocity, colour, radius, speed);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.dx = 0;
		this.dy = 0;
		this.in_terrain = false;
		this.original_speed = this.speed;
		this.weapon_number = 0;
	}
	move(player, dx, dy){
		this.preposition = this.position;
		this.dx = dx;
		this.dy = dy;

		//this.position.x = this.position.x + dx*this.speed;
        //this.position.y = this.position.y + dy*this.speed;
        //this.intPosition();

		var collide_count = 0;
		var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var ddx = terrain.position.x - this.position.x;
            var ddy = terrain.position.y - this.position.y;
            if ((Math.abs(ddx) <= (this.radius + terrain.radius)) && (Math.abs(ddy) <= (this.radius + terrain.radius))) {
                this.collide(terrain);
                collide_count += 1;
            }
        }
        if((this.in_terrain == true) && (collide_count == 0)){
        	this.in_terrain == false;
        	collide_count = 0;
        	this.speed = this.original_speed;
        }

        this.position.x = this.position.x + this.dx*this.speed;
        this.position.y = this.position.y + this.dy*this.speed;
        this.intPosition();
	}
	switchWeapon(){
		this.weapon_number = (this.weapon_number + 1) % 4;
	}

	draw(context){
		super.draw(context);
		context.beginPath();
		context.fillStyle = this.colour;
		context.textAlign = "center";
		context.font="15px Comic Sans MS";
		context.fillText("Player", this.position.x, this.position.y - 25);
		context.font="10px Comic Sans MS";
		switch (this.weapon_number) {
            case 0:
				context.fillText("Weapon: Pistol", this.position.x, this.position.y + 40);
				break;
			case 1:
				context.fillText("Weapon: Shotgun", this.position.x, this.position.y + 40);
				break;
			case 2:
				context.fillText("Weapon: Sniper", this.position.x, this.position.y + 40);
				break;
			case 3:
				context.fillText("Weapon: Hand", this.position.x, this.position.y + 40);
				break;
			default:
				break;
		}
		context.closePath();
	}

}

class Enemy extends Character{
	constructor(stage, position, velocity, colour, radius, speed){
		super(stage, position, velocity, colour, radius, speed);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.preposition = this.position;
		this.original_speed = this.speed;
		this.in_terrain = false;
	}
	step() {
		if (this.stage.player === null) {
            return
        }

		this.preposition = this.position;

        if (this.health <= 0) {
            this.stage.removeCharacter(this);
        }

        var collide_count = 0
        var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if ((Math.abs(dx) <= (this.radius + terrain.radius)) && (Math.abs(dy) <= (this.radius + terrain.radius))) {
                this.collide(terrain);
                collide_count += 1;
            }
        }
        if((this.in_terrain == true) && (collide_count == 0)){
        	this.in_terrain == false;
        	collide_count = 0;
        	this.speed = this.original_speed;
        }
    }
}

class AIEnemy extends Enemy{
	constructor(stage, position, velocity, colour, radius, speed, weapon_number){
		super(stage, position, velocity, colour, radius, speed);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.fire_timer = 0;
		this.fire_interval = 50;
		this.start_fire_range = 250;
		this.original_speed = this.speed;
		this.in_terrain = false;
		this.weapon_number = weapon_number;
	}
	step() {
		if (this.stage.player === null) {
            return
        }

		this.preposition = this.position;

		var player_x = stage.player.position.x;
        var player_y = stage.player.position.y;
        var dx = player_x - this.position.x;
        var dy = player_y - this.position.y;
        var self_direction = Math.atan2(dy, dx);
        this.direction = self_direction;

        this.fire_timer += 1;

        if((this.fire_timer >= this.fire_interval) && (Math.sqrt(dx*dx + dy*dy) <= this.start_fire_range)){
        	this.fireWeapon();
        	this.fire_timer = 0;
        }

        this.preposition = this.position;
        this.position.x = this.position.x + this.speed * Math.cos(this.direction);
        this.position.y = this.position.y + this.speed * Math.sin(this.direction);

        var collide_count = 0;
        var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if ((Math.abs(dx) <= (this.radius + terrain.radius)) && (Math.abs(dy) <= (this.radius + terrain.radius))) {
                this.collide(terrain);
                collide_count += 1;
            }
        }
        if((this.in_terrain == true) && (collide_count == 0)){
        	this.in_terrain == false;
        	collide_count = 0;
        	this.speed = this.original_speed;
        }


        if (this.health <= 0) {
            this.stage.removeCharacter(this);
        } else {
        	this.intPosition();
        }
    }
}
class RotateEnemy extends Enemy{
	constructor(stage, position, velocity, colour, radius, speed, weapon_number){
		super(stage, position, velocity, colour, radius, speed, weapon_number);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.fire_timer = 0;
		this.fire_interval = 50;
		this.start_fire_range = 400;
		this.original_speed = this.speed;
		this.in_terrain = false;
		this.weapon_number = weapon_number;
	}
	step() {
		if (this.stage.player === null) {
            return
        }

		this.preposition = this.position;

		var player_x = stage.player.position.x;
        var player_y = stage.player.position.y;
        var dx = player_x - this.position.x;
        var dy = player_y - this.position.y;
        var self_direction = Math.atan2(dy, dx);
        this.direction = self_direction;

        this.fire_timer += 1;

        if((this.fire_timer >= this.fire_interval) && (Math.sqrt(dx*dx + dy*dy) <= this.start_fire_range)){
        	this.fireWeapon();
        	this.fire_timer = 0;
        }

        if(this.leftAmmo < 5){
        	this.speed = this.original_speed;
        	this.weapon_number = 3;
        }else{
        	this.speed = 0;
        	this.weapon_number = 2;
        }

        this.preposition = this.position;
        this.position.x = this.position.x + this.speed * Math.cos(this.direction);
        this.position.y = this.position.y + this.speed * Math.sin(this.direction);

        var collide_count = 0;
        var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if ((Math.abs(dx) <= (this.radius + terrain.radius)) && (Math.abs(dy) <= (this.radius + terrain.radius))) {
                this.collide(terrain);
                collide_count += 1;
            }
        }
        if((this.in_terrain == true) && (collide_count == 0)){
        	this.in_terrain == false;
        	collide_count = 0;
        	this.speed = this.original_speed;
        }


        if (this.health <= 0) {
            this.stage.removeCharacter(this);
        } else {
        	this.intPosition();
        }
    }
}

class CatchEnemy extends Enemy{
	constructor(stage, position, velocity, colour, radius, speed, weapon_number){
		super(stage, position, velocity, colour, radius, speed, weapon_number);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 100;
		this.fire_timer = 0;
		this.fire_interval = 50;
		this.start_fire_range = 200;
		this.original_speed = this.speed;
		this.in_terrain = false;
		this.weapon_number = weapon_number;
	}
	step() {
		if (this.stage.player === null) {
            return
        }

		this.preposition = this.position;

		var player_x = stage.player.position.x;
        var player_y = stage.player.position.y;
        var dx = player_x - this.position.x;
        var dy = player_y - this.position.y;
        var self_direction = Math.atan2(dy, dx);
        this.direction = self_direction;

        this.fire_timer += 1;

        var diff_distance = Math.sqrt(dx*dx + dy*dy);

        if((this.fire_timer >= this.fire_interval) && (diff_distance <= this.start_fire_range)){
        	this.fireWeapon();
        	this.fire_timer = 0;
        }

        if(diff_distance <= this.start_fire_range + 50){
        	this.speed = this.original_speed;
        }else{
        	this.speed = 0;
        }

        this.preposition = this.position;
        this.position.x = this.position.x + this.speed * Math.cos(this.direction);
        this.position.y = this.position.y + this.speed * Math.sin(this.direction);

        var collide_count = 0;
        var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if ((Math.abs(dx) <= (this.radius + terrain.radius)) && (Math.abs(dy) <= (this.radius + terrain.radius))) {
                this.collide(terrain);
                collide_count += 1;
            }
        }
        if((this.in_terrain == true) && (collide_count == 0)){
        	this.in_terrain == false;
        	collide_count = 0;
        	this.speed = this.original_speed;
        }


        if (this.health <= 0) {
            this.stage.removeCharacter(this);
        } else {
        	this.intPosition();
        }
    }
}

class Bullet extends Ball {
    constructor(stage, position, velocity, colour, radius, speed, direction, damage, range, shooter) {
        super(stage, position, velocity, colour, radius);
        this.radius = radius;
        this.range = range;
        this.velocity = new Pair(0, 0); // speed
        this.speed = speed;   // speed
        this.direction = direction; // in terms of pi
        this.shooter = shooter;
        this.damage = damage;
    }

    step() {
    	if (this.stage.player === null) {
            return
        }

        this.position.x = this.position.x + this.speed * Math.cos(this.direction);
        this.position.y = this.position.y + this.speed * Math.sin(this.direction);

        this.range -= this.speed;
        if (this.range <= 0) {
            this.delete_bullet();
        }

        this.intPosition();
        /*
        if (this.position.x > 0 && this.position.x < this.stage.width && this.position.y > 0 && this.position.y < this.stage.height) {
            this.intPosition();
        } else {
            this.delete_bullet();
        }
        */


        var characters = this.stage.characters;
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var dx = this.position.x - character.position.x;
            var dy = this.position.y - character.position.y;
            if ((Math.sqrt(dx * dx + dy * dy) < (this.radius + character.radius)) && (character != this.shooter)) {
                character.collide(this);
            }
        }
        
        var terrains = this.stage.terrains;
        for (var i = 0; i < terrains.length; i++) {
            var terrain = terrains[i];
            var dx = terrain.position.x - this.position.x;
            var dy = terrain.position.y - this.position.y;
            if (!((terrain instanceof Grass)||(terrain instanceof Ice))){
            	if ((Math.abs(dx) < (this.radius + terrain.radius)) && (Math.abs(dy) < (this.radius + terrain.radius))) {
            	    if (terrain instanceof Wall) {
            	        terrain.health -= this.damage;
            	    	if (this.health <= 0) {
            				this.stage.removeTerrain(this);
        				}
            	    }
            	    this.delete_bullet();
            	}
            }
        }
        
    }

	draw(context){
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.direction);
		context.fillStyle = this.colour;
		context.beginPath(); 
		context.arc(0, 0, this.radius, 0, 2 * Math.PI, false); 
		context.fill();
		context.moveTo(-2*this.radius, -this.radius);
		context.fillRect(-2*this.radius, -this.radius, this.radius * 2, this.radius * 2);
		context.closePath();
        //context.stroke();
        context.restore();
	}

    delete_bullet() {
        this.stage.removeBullet(this);
    }
}

class Equipment extends Ball{
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.velocity = new Pair(0, 0);
		this.colour = colour;
		this.radius = 10;
	}
	step() {
		if (this.stage.player === null) {
            return
        }

        var characters = this.stage.characters;
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var dx = this.position.x - character.position.x;
            var dy = this.position.y - character.position.y;
            if (Math.sqrt(dx * dx + dy * dy) < (this.radius + character.radius)) {
                character.collide(this);
            }
        }

        this.intPosition();
    }
    draw(context){
    	context.fillStyle = this.colour;
    	context.fillStyle = 'rgba(255, 255, 255, 0.5)';
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill(); 
	}
}

class Ammo extends Equipment{
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		//this.colour = 'rgba(10, 10, 255, 0.75)';
	}
	draw(context){
    	context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill(); 
	}
}

class HealthPack extends Equipment{
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		//this.colour = 'rgba(10, 255, 10, 0.75)';
	}
	draw(context){
    	context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill(); 
	}
}
class Terrain extends Ball {
    constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
		this.maxAmmo = 200;
		this.leftAmmo = 50;
		this.health = 20;
	}
    step() {
    	if (this.stage.player === null) {
            return
        }

        this.intPosition();
    }
    draw(context){
    	context.fillStyle = this.colour;
		context.beginPath(); 
		context.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
		context.fill(); 
	}
}
class Grass extends Terrain{
	constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
	}
}

class Ice extends Terrain{
	constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
	}
}

class Stone extends Terrain {
    constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
	}
}

class Wall extends Terrain {
    constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
		this.health = 30;
	}
    step() {
    	super.step();

    	if (this.health <= 0) {
            this.stage.removeTerrain(this);
        }
        /*
    	var characters = this.stage.characters;
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var dx = this.position.x - character.position.x;
            var dy = this.position.y - character.position.y;
            if ((Math.abs(dx) <= (this.radius + character.radius)) && (Math.abs(dy) <= (this.radius + character.radius))) {
                character.collide(this);
            }
        }
        */
    }
}

class Housetop extends Terrain{
	constructor(stage, position, velocity, colour, radius){
    	super(stage, position, velocity, colour, radius);
		this.velocity = new Pair(0,0);
		this.player_is_in = false;
		this.player_in_colour = 'rgba(255, 248, 225, 0.1)';
		this.original_colour = colour;
	}
	step() {
		if (this.stage.player === null) {
            return
        }
        var character = this.stage.player;
        var dx = this.position.x - character.position.x;
        var dy = this.position.y - character.position.y;
        if ((Math.abs(dx) <= (this.radius + character.radius)) && (Math.abs(dy) <= (this.radius + character.radius))) {
            this.colour = this.player_in_colour;
        } else {
        	this.colour = this.original_colour;
        }

        this.intPosition();
    }
	draw(context) {
    	context.fillStyle = this.colour;
    	context.beginPath(); 
    	context.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    	context.closePath(); 
    }

}






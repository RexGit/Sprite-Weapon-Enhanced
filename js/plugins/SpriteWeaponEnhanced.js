//=============================================================================
// SpriteWeaponEnhanced.js
// Version: 1.1 - Big (fancy) Weapon Edition
//=============================================================================

var Imported = Imported || {};
Imported.SpriteWeaponEnhanced = true;

var Rexal = Rexal || {};
Rexal.SWE = Rexal.SWE || {};
/*:
 * @plugindesc Makes the Weapon's battle image much more customizable.
 * @author Rexal
 *
 * @help
 
 Notetags:
 
 [EnhancedSprite]
 
 Enables the use of Sprite Weapon Enhanced Tags. Implemented to ensure compatibility with other scripts that modify Sprite_Weapon, and
 to allow you to also use regular weapons.
 
 WeaponImage: img
 
 Sets the weapon image. Default is weapons1.
 
 
 WeaponID: id
 
 Sets the weapon ID. Default is 1. Do not use zero.
 
 WeaponHue: hue
 
 Shifts the weapon's hue.
 
 WeaponMotion: motion
 
 Plays the specified attack motion. This isn't limited to the basic attack motions found in SV motions. Default is swing.
 
 WeaponFrames: frames
 
 Sets the amount of frames the weapon image uses. Default is 3.
 
 WeaponSize: widthxheight
 
 Doesn't seem to work yet, but when/if it does, it'll allow you to set an arbitrary size for the weapon. So if you wanted rediculously huge katana or something, this would be the way to do it. Potentially. Default is 96x64.

 WeaponSound: se, pan, pitch, volume
 
 Plays a sound whenever the actor uses the weapon's attack motion.
 
 WeaponOffset: x,y
 
 This will offset the weapon's position by the specified value.
 
 ex:
 [EnhancedSprite]
 WeaponImage: weapons2
 WeaponID: 2
 WeaponHue: 155
 WeaponMotion: skill
 WeaponSound: ice2,0,100,100
 
 This will make the weapon a blue staff and have the actor play the skill SV motion while playing the Ice2 SE when attacking.
 
 
 Version Log:
 
 v1 - Initial Version
 
 v1.01 - 
 
 -Fixed error when using barehanded.
 
 -Fixed the weapon not showing an animation when its Weapon Type's SV motion is undefined.
 
 -Removed the Sprite_Weapon.prototype.initMembers overwrite function as there was no point to it 
 and it made certain plugins incompatible.
 
 -WeaponSize is itegrated but most likely not in working condition.
 Use at your discretion.
 
 v1.1 -
 
 - Added WeaponSound. It'll have the weapon play a sound whenever the actor attacks.
 - Added WeaponOffset. This allows you to set the position of the weapon.
 - WeaponSize actually works as it's supposed to now.
 - cleaned up the script a bit to make it easier to read.
 - Had no choice but to Overwrite Sprite_Weapon.prototype.update. Fingers crossed that didn't actually do anything negative.
 
 */

   //-----------------------------------------------------------------------------
// Game_Actor
//=============================================================================

Game_Actor.prototype.performAttack = function() {
	
	Rexal.SWE.processWeaponNoteTag(this.weapons()[0]);
	
	if(Rexal.SWE.EnhancedSprite){
		this.performAttackRex();
		return;
	}
	
    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
	
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};

Game_Actor.prototype.performAttackRex = function() {
	
	if(Rexal.SWE._playSound){AudioManager.playSe(Rexal.SWE._sound);}
	
            this.requestMotion(Rexal.SWE._attackMotion);
        this.startWeaponAnimation(1);
	
}
 
  //-----------------------------------------------------------------------------
// Sprite_Actor
//=============================================================================
 
 Sprite_Actor.prototype.setupWeaponAnimation = function() {
    if (this._actor.isWeaponAnimationRequested()) {

		var weapon = $gameParty.battleMembers()[this._actor.index()].weapons()[0];

        this._weaponSprite.setupRex(weapon,this._actor.weaponImageId());
        this._actor.clearWeaponAnimation();
    }
};

  //-----------------------------------------------------------------------------
// Sprite_Weapon										
//=============================================================================



Sprite_Weapon.prototype.setupRex = function(weapon,id) {
	this._frames = 3;
	if(!Rexal.SWE.EnhancedSprite)
	{
	this.setup(id);
	return;
	}
	this._weaponWidth = Rexal.SWE._width;
	this._weaponHeight = Rexal.SWE._height;
	this.x = -(this._weaponWidth/6)+Rexal.SWE._x;
	this.y = (this._weaponWidth/12)+Rexal.SWE._y;
	this._weaponImage = Rexal.SWE._image;
	this._weaponImageId = Rexal.SWE._ID;
	this._weaponImageHue = Rexal.SWE._hue;
	this._frames = Rexal.SWE._frames;
    this._animationCount = 0;
    this._pattern = 0;
    this.loadBitmapRex();
    this.updateFrameRex();
};

Sprite_Weapon.prototype.loadBitmapRex = function() {
      this.bitmap = ImageManager.loadSystem(this._weaponImage,this._weaponImageHue);

};

Sprite_Weapon.prototype.updateFrameRex = function() {
    if (this._weaponImageId > 0) {
        var index = (this._weaponImageId - 1);
        var w = this._weaponWidth;
        var h = this._weaponHeight;
        var sx = (Math.floor(index / 6) * this._frames + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};
Sprite_Weapon.prototype.animationWait = function() {
    return 30/this._frames;
};

Sprite_Weapon.prototype.update = function() {
 Sprite_Base.prototype.update.call(this);
	
	if(Rexal.SWE.EnhancedSprite)
	{
	this.updateRex();
	return;
	}
	

    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
	
}


	Sprite_Weapon.prototype.updateRex = function() {
    this._animationCount++;
    
	if (this._animationCount >= this.animationWait()) {
        this.updatePatternRex();
        this.updateFrameRex();
        this._animationCount = 0;
    }
	
	}
	
Sprite_Weapon.prototype.updatePatternRex = function() {
    this._pattern++;
    if (this._pattern >= this._frames) {
        this._weaponImageId = 0;
    }
};

  //-----------------------------------------------------------------------------
// Rex Functions - New Stuff
//=============================================================================


Rexal.SWE.processWeaponNoteTag = function(obj) {

Rexal.SWE._image = 'weapons1';
Rexal.SWE._attackMotion = "swing";
Rexal.SWE._hue = 0;
Rexal.SWE._ID = 1;
Rexal.SWE._frames = 3;
Rexal.SWE.EnhancedSprite = false;
Rexal.SWE._width = 96;
Rexal.SWE._height = 64;
Rexal.SWE._sound = AudioManager.makeEmptyAudioObject();
Rexal.SWE._sound.name = 'wind7';
Rexal.SWE._sound.pan = 0;
Rexal.SWE._sound.pitch = 100;
Rexal.SWE._sound.volume = 90;
Rexal.SWE._x = 0;
Rexal.SWE._y = 0;


if(obj == null)return;
	

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0]) {
		case 'WeaponImage' :
        Rexal.SWE._image = lines[1];
		break;
					
		case 'WeaponID' :
        Rexal.SWE._ID = parseInt(lines[1]);
		break;
		
		case 'WeaponHue' :
        Rexal.SWE._hue = parseInt(lines[1]);
		break;
		
		case 'WeaponMotion' :
		Rexal.SWE._attackMotion = lines[1].toLowerCase();
		break;
		
		case 'WeaponFrames' :
		Rexal.SWE._frames = parseInt(lines[1]);
		break;
		
		
		case '[EnhancedSprite]' :
		Rexal.SWE.EnhancedSprite = true;

		break;
		
		case 'WeaponSize' :
		var wh = lines[1].split('x');

		Rexal.SWE._width = parseInt(wh[0]);
		Rexal.SWE._height = parseInt(wh[1]);
		
		break;
		
				case 'WeaponSound' :
		var sound = lines[1].split(', ');
		Rexal.SWE._playSound = true;
		Rexal.SWE._sound.name = sound[0];
		Rexal.SWE._sound.pan = parseInt(sound[1]);
		Rexal.SWE._sound.pitch = parseInt(sound[2]);
		Rexal.SWE._sound.volume = parseInt(sound[3]);
		break;
		
				case 'WeaponOffset' :
		var xy = lines[1].split(',');

		Rexal.SWE._x = parseInt(xy[0]);
		Rexal.SWE._y = parseInt(xy[1]);
		
		break;
		
		}
		
			
		}
		

};
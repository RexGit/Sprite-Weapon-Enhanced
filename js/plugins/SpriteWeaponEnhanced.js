//=============================================================================
// SpriteWeaponEnhanced.js
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
 
 Plays the specified SV motion. This isn't limited to the basic attack motions. Default is swing.
 
 WeaponFrames: frames
 
 Sets the amount of frames the weapon image uses. Default is 3.
 
 ex:
 [EnhancedSprite]
 WeaponImage: weapons2
 WeaponID: 2
 WeaponHue: 155
 WeaponMotion: skill
  
 This will make the weapon a blue staff and have the actor play the skill animation when attacking.
 
 
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
	    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
	
            this.requestMotion(Rexal.SWE._weaponMotion);
        this.startWeaponAnimation(attackMotion.weaponImageId);
	
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

Sprite_Weapon.prototype.initMembers = function() {
    this._weaponImageId = 0;
    this._animationCount = 0;
	this._frames = 3;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = -16;
};


Sprite_Weapon.prototype.setupRex = function(weapon,id) {

	if(!Rexal.SWE.EnhancedSprite)
	{
	this.setup(id);
	return;
	}
	
	
	this._weaponImage = Rexal.SWE._weaponImage;
	this._weaponImageId = Rexal.SWE._weaponID;
	this._weaponImageHue = Rexal.SWE._weaponHue;
	this._frames = Rexal.SWE._weaponFrames;
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
        var index = this._weaponImageID-1;
        var w = 96;
        var h = 64;
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_Weapon.prototype.animationWait = function() {
    return 30/this._frames;
};

Sprite_Weapon.prototype.updatePattern = function() {
    this._pattern++;
    if (this._pattern >= this._frames) {
        this._weaponImageId = 0;
    }
};


  //-----------------------------------------------------------------------------
// Rex Functions - New Stuff
//=============================================================================


Rexal.SWE.processWeaponNoteTag = function(obj) {

Rexal.SWE._weaponImage = 'weapons1';
Rexal.SWE._weaponMotion = "swing";
Rexal.SWE._weaponHue = 0;
Rexal.SWE._weaponID = -1;
Rexal.SWE._weaponFrames = 3;
Rexal.SWE.EnhancedSprite = false;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0]) {
		case 'WeaponImage' :
        Rexal.SWE._weaponImage = lines[1];
		break;
					
		case 'WeaponID' :
        Rexal.SWE._weaponID = parseInt(lines[1]);
		break;
		
		case 'WeaponHue' :
        Rexal.SWE._weaponHue = parseInt(lines[1]);
		break;
		
		case 'WeaponMotion' :
		Rexal.SWE._weaponMotion = lines[1].toLowerCase();
		break;
		
		case 'WeaponFrames' :
		Rexal.SWE._weaponFrames = parseInt(lines[1]);
		break;
		
		
		case '[EnhancedSprite]' :
		Rexal.SWE.EnhancedSprite = true;

		break;
		
		}
		
			
		}
		

};
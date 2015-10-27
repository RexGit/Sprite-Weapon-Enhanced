//=============================================================================
// SpriteWeaponEnhanced.js
// Version: 1.01
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


 
 ex:
 [EnhancedSprite]
 WeaponImage: weapons2
 WeaponID: 2
 WeaponHue: 155
 WeaponMotion: skill
  
 This will make the weapon a blue staff and have the actor play the skill animation when attacking.
 
 
 Version Log:
 
 v1 - Initial Version
 
 v1.01 - 
 
 -Fixed error when using barehanded.
 
 -Fixed the weapon not showing an animation when its Weapon Type's SV motion is undefined.
 
 -Removed the Sprite_Weapon.prototype.initMembers overwrite function as there was no point to it 
 and it made certain plugins incompatible.
 
 -WeaponSize is itegrated but most likely not in working condition.
 Use at your discretion.
 
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

	//attackMotion.weaponImageId = 1;
	
            this.requestMotion(Rexal.SWE._weaponMotion);
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
	
	this._weaponWidth = Rexal.SWE._weaponW;
	this._weaponHeight = Rexal.SWE._weaponH;
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
        var w = this._weaponWidth;
        var h = this._weaponHeight;
        var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        var sy = Math.floor(index % 6) * h;
        this.setFrame(sx*10, sy, w, h);
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
Rexal.SWE._weaponID = 1;
Rexal.SWE._weaponFrames = 3;
Rexal.SWE.EnhancedSprite = false;
Rexal.SWE._weaponW = 96;
Rexal.SWE._weaponH = 64;

if(obj == null)return;
	

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
		
		case 'WeaponSize' :
		var wh = lines[1].split('x');

		Rexal.SWE._weaponW = parseInt(wh[0]);
		Rexal.SWE._weaponH = parseInt(wh[1]);
		
		break;
		
		}
		
			
		}
		

};
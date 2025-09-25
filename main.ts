enum SpriteFlag {
    DisableFollow = 1 << 14
}

class SpriteCollisionsEngine {
    flags: number

    constructor(sprite: Sprite, otherSprite: Sprite) {
        this.flags = 0
        this.__update(sprite, otherSprite)
    }

    setFlag(flag: SpriteFlag, on: boolean) {
        if (on) this.flags |= flag
        else this.flags = ~(~this.flags | flag);
    }

    __update(sprite: Sprite, otherSprite: Sprite) {
        this.spriteCollisions(sprite, otherSprite)
    }

    spriteCollisions(sprite: Sprite, otherSprite: Sprite) {
       // the reason why you 2 sets of different pairs of flags because one is meant for disabling the sprite follow from its flag but I also need to create a flag for mine because the flag does not exist so that is why there is 2 different flags there.
        this.setFlag(SpriteFlag.DisableFollow, true)
        this.setFlag(SpriteFlag.DisableFollow, true)
        sprite.setFlag(SpriteFlag.DisableFollow, true)
        otherSprite.setFlag(SpriteFlag.DisableFollow, true)
      // for updating the sprite collisions 
       game.onUpdate(() => {
         if(sprite.overlapsWith(otherSprite)) {
             if (sprite.x <= otherSprite.x) {
                 sprite._x = sprite._lastX
             } else if (sprite.x >= otherSprite.x) {
                 sprite._x = sprite._lastX
             }  if (sprite.y <= otherSprite.y) {
                 sprite._y = sprite._lastY
             } else if (sprite.y >= otherSprite.y) {
                 sprite._y = sprite._lastY
             }
         } 
       })

     // for disabling the follow for keeping the game not crashed
        game.onUpdate(() => {
            // this is for disabling it from the other sprite  
            this.__disableFollow(SpriteKind.Player, otherSprite)
            this.__disableFollow(SpriteKind.Enemy, otherSprite)
            this.__disableFollow(SpriteKind.Projectile, otherSprite)
            this.__disableFollow(SpriteKind.Food, otherSprite)
            this.__disableFollow(undefined, otherSprite)
            // maybe unncessary but just for extra case
            this.__disableFollow(SpriteKind.Player, sprite)
            this.__disableFollow(SpriteKind.Enemy, sprite)
            this.__disableFollow(SpriteKind.Projectile, sprite)
            this.__disableFollow(SpriteKind.Food, sprite)
            this.__disableFollow(undefined, sprite)
        }) 
    }


    __disableFollow(spriteKind: number, otherSprite: Sprite) {
     // I did it on purpose if it is on or off it is disabled because I do not want the game crash, but if some reson you found it to work it will throw an error to tell you the big issue you have it really can follow you.
      if(this.flags & (SpriteFlag.DisableFollow)) {
          for (const sprite of sprites.allOfKind(spriteKind)) {
              const follow = new sprites.FollowingSprite(sprite, otherSprite, 0, 0)
          }
      } else if(!(this.flags & (SpriteFlag.DisableFollow))){
          for (const sprite of sprites.allOfKind(spriteKind)) {
              const follow = new sprites.FollowingSprite(sprite, otherSprite, undefined, undefined)
          }
      // why I have a extra else this is just for more precise if it escapes the else if then in case of a crash I add a throw here.
      } else {
          throw "Do not use follow it can make the game crash and collisions are wrong, instead use positions and velocities and acclerations."
      }
    }

    private allSprites: Sprite[]

    __canDisableEverythingOfASprite(enabled: boolean) {
        if(enabled) {
            for(const sprite of this.allSprites) {
                const scene = game.currentScene()
                scene.physicsEngine.removeSprite(sprite)
            }
        } else if(!enabled) {
            // no code here because it is not enabled for disabling stuff here
        }
    }
} 
 

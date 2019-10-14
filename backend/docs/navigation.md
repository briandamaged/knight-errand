# Navigation #

Just trying to wrap my brain around how navigation will work in this game.




## Indicating a Portal ##

* By direction
  * Go north
  * Go up
  * Climb up

* By destination
  * Go to the inn
  * Go to the tavern
  * Go tavern


(Note: what if "Inn" and "Tavern" actually refer to the same destination?  This implies that there are synonyms of some kind)


## General Notes ##

* Sometimes, players cannot see portals until certain conditions are met.
  * Ex: The room is dark.  (But... you can still move through the portal even without seeing it)
  * Ex: A passageway is hidden.  (If you try to go that direction, the feedback will indicate that the path is blocked)


* Sometimes, players can see a portal, but they cannot cross it
  * Ex: Door is locked.
  * Ex: Gotta knock on the door to get somebody to open it from the other side.
  * Ex: Bridge is not extended.  (Flipping a switch in a room extends the bridge?)
  * Ex: It's not the right time of day.  (Ex: can't enter the bank in the middle of the night)


* Sometimes, a portal's destination will change:
  * Ex: Each player gets their own room at the Inn. (Lazily-generated Locations?  Would need to figure out a lifecycle for this)
  * Ex: Bridge occasionally collapses while it is being crossed.  (Player takes damage and ends up in a different location)
    * What if the Player is not allowed to enter the destination for some reason?  Does the bridge just not collapse???


* How can a Player learn a Portal's destination?
  * Reading signs
  * Reading maps
  * Traversing the portal.
    * But: problematic when the Portal can take you to random destinations?


* Can there be fake portals that don't actually lead to any destination?
  * Ex: a glass wall.  If you attempt to walk through it, then BAM
  * Ex: a really convincing painting.  Same thing.
  * Actually, this ties in nicely to the "multiple destinations" idea.
    Instead of "canEnter", perhaps Portals get chained until you
    arrive at a destination?  (And, return `undefined` when they
    don't lead anywhere?)


* If an action is dangerous, then the game can politely decline.
  * Ex: there is a cliff to the north.
    * If you type "go north", the game will say "I don't think that's a good idea..."
    * If you type "go north!!!", then the game will allow you to take the action anyway

* Let's say there's a portal that is "up".
  * You can't "climb up" unless there is something to climb
  * You can't "jump up" unless you have really good acrobatic skills
  * You can't "fly up" unless you are flying
  * ... perhaps all of these options need to be created via a factory of some kind?  (For consistency)


## Pseudo-code ##


```
class Portal {

  // When true, the Portal will not be mentioned when listing Portals.
  // However, the player is still allowed to traverse it.  (Ex: room is dark)
  async isHidden({character}) {
    return false;
  }


  async canEnter({character}) {
    return true;
  }

  // Provides an opportunity to do stuff like:
  //   - Damage the player
  //   - Have the bridge collapse behind the player
  //   - Etc.
  async enter({character}) {

  }


}
```


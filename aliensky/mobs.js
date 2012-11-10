
function MOB(id, x, y, icon, map, subMapId) {
  if (id) {
    this._init(id, x, y, icon, map, subMapId);
  }
}
MOB.prototype = {
  _init: function(id, x, y, icon, map, subMapId) {
    // NOTE id is not yet used for anything.
    this._id = id;
    this._x = x;
    this._y = y;
    this._subMap = subMapId;
    this._icon = icon;
    this._worldMap = map;

    this._name = "Generic Mobile Sprite";

    this._layer = $("<div></div>").attr("class", "mob-transparency");
    let myImg = $("<img/>").attr("src", this._icon);
    let self = this;
    myImg.bind("click", function() {self.handleClick();});
    this._layer.append(myImg);
    $("#the-body").append(this._layer);

    // Register myself with turn clock so I will get turns:
    TurnClock.addMOB(this);
  },

  get name() {
    return this._name;
  },

  get subMapId() {
    return this._subMap;
  },

  handleClick: function() {
    /* Clicking on a mob's image can mean one of 3 things.  Either
     * there's a pending ability targeting a mob, in which case the
     * click means activating the ability; or there's a pending
     * ability targeting a square, in which case apply it to the
     * square under the mob; or there's neither, in which case we
     * 'select' the mob, showing the menu of whatever stats or
     * abilities this mob has available. */
    let handled = CommandAbilityInterface.handleClickOnMob(this);
    if (!handled) {
      let square = this.getSquareUnderfoot();
      handled = CommandAbilityInterface.handleClickOnSquare(square);
    }
    if (!handled) {
	// TODO all of the showStatsAndCmds call 
	// CommandAbilityInterface.show(), maybe move that outside?
        // (not the player showStatsAndCmds, though, that's completely
	// different)
      handled = this.showStatsAndCmds();
    }
    return handled;
  },

  showStatsAndCmds: function() {
    // Default action is to do nothing.  Override in subclasses.
  },

  plot: function() {
    // don't draw if offscreen or on a different map:
    if (this._worldMap.getCurrentSubMapId() != this._subMap) {
      this._layer.css("display", "none");
      return;
    }
    if (!this._worldMap.isOnScreen(this._x, this._y)) {
      this._layer.css("display", "none");
      return;
    }

    var screenCoords = this._worldMap.transform(this._x, this._y);
    var x = screenCoords[0];
    var y = screenCoords[1];
    this._layer.css("display", "block");
    this._layer.css("left", x + "px");
    this._layer.css("top", y + "px");
  },

  move: function( deltaX, deltaY ) {
    let newX = this._x + deltaX;
    let newY = this._y + deltaY;
    if (!this._worldMap.pointInBounds(newX, newY)) {
      return false;
    }
    if (!this._worldMap.getPassable(this, this._x, this._y, newX, newY)) {
      return false;
    }
    this._x += deltaX;
    this._y += deltaY;

    // Any effects of stepping on the new square:
    this.getSquareUnderfoot().onEnter(this);
    this.plot();
    return true;
  },

  enterNewSubMap: function(subMapId, x, y) {
    this._x = x;
    this._y = y;
    this._subMap = subMapId;
  },

  takeTurn: function() {
    // Default is to do nothing; override this.
  },

  getSquareUnderfoot: function() {
    return this._worldMap.getSubMap(this._subMap).getSquareAt(this._x, this._y);
  },

  likesEnteringBuildings: function() {
    return false;
  }
};

function PlayerCharacter(id, x, y, icon, map, subMapId) {
  this._init(id, x, y, icon, map, subMapId);
  this._playerInit();
}
PlayerCharacter.prototype = {
  _playerInit: function() {
    this._name = "Macho Space Babe";
    this._moneys = 100;
    this._weightCapacity = 35;
    this._inventory = [];
    this.screenFollowsMe = true;
    let self = this;
    this._skills = [
      new CommandAbility(self, "Shoot", TGT_MOB,
                         function(user, targetMob) {
                           // TODO hit/miss chances, cover, line of sight,
                           // defense, wounds, etc.
                           logMsg("You shot the " + targetMob.name);
                         }),
      new CommandAbility(self, "Survey", TGT_CURR_SQUARE,
                         function(user, targetSquare) {
                           logMsg("You analyze the land here.");
                           logMsg("Minerals: " + targetSquare.minerals);
                           logMsg("Moisture: " + targetSquare.moisture);
                           logMsg("Sunlight: " + targetSquare.sunlight);
                         }),
      new CommandAbility(self, "Research", TGT_ITEM,
                         function(user, targetItem) {
                           logMsg("You do SCIENCE! to the " + targetItem.name);
                         })
    ];
  },

  showStatsAndCmds: function() {
    /* TODO make this a tabbed interface: Tab for skills, tab for
     * items, tab for tech tree, and tab for any facility/robot/store
     * you're interacting with.  Your main stats (money, health,
     * experience meter) go up top above all tabs.*/
    let statsArea = $("#player-status").empty();
    statsArea.append($("<p></p>").html("You are <b>" + this._name + "</b>"));
    statsArea.append($("<p></p>").html("Yenpesos: " + this._moneys));
    if (this._inventory.length > 0) {
      statsArea.append($("<p></p>").html("You has items:"));
      statsArea.append(CommandAbilityInterface.makeAbilityMenu(this._inventory));
    }
    if (this._skills.length > 0) {
      statsArea.append($("<p></p>").html("You has skills:"));
      statsArea.append(CommandAbilityInterface.makeAbilityMenu(this._skills));
    }
  },

  get totalWeight() {
    let weight = 0;
    for (let i = 0; i < this._inventory.length; i++) {
      weight += this._inventory[i].weightTotal;
    }
    return weight;
  },

  _gainItem: function(item) {
    // Returns false if you can't carry this item.
    if (this.totalWeight + item.weightTotal > this._weightCapacity) {
      logMsg("You can't carry any more.");
      return false;
    }
    let alreadyHaveItem = this._getItemByName(item.name);
    if (alreadyHaveItem != null) {
      alreadyHaveItem.increase(item.number);
    } else {
      this._inventory.push(item);
    }
    this.showStatsAndCmds();
    return true;
  },

  _loseItem: function(itemName) {
    let item = this._getItemByName(itemName);
    item.increase(-1); // this may leave you holding 0 of an item...
    if (item.number == 0) {
      this.loseAllOfItem(itemName);
    }
    this.showStatsAndCmds();
  },

  buyAThing: function(cost, item) {
    // Returns false if you can't afford or can't carry.
    if (this._moneys >= cost) {
      if (this._gainItem(item)) {
        this._moneys -= cost;
        this.showStatsAndCmds();
        return true;
      }
    } else {
      logMsg("You can't afford that.");
    }
    return false;
  },

  sellAThing: function(cost, itemName) {
    // Returns false if you don't have any to sell
    // TODO allow you to pass in a number to sell multiple
    let item = this._getItemByName(itemName);
    if (!item) {
      logMsg("You don't have any to sell.");
      return false;
    } else {
      this._moneys += cost;
      this._loseItem(itemName);
      return true;
    }
  },

  _getItemByName: function(itemName) {
    for (let i = 0; i < this._inventory.length; i++) {
      if (this._inventory[i].name == itemName) {
        return this._inventory[i];
      }
    }
    return null;
  },

  getItemQuantity: function(itemName) {
    let item = this._getItemByName(itemName);
    if (item != null) {
      return item.number;
    } else {
      return 0;
    }
  },

  gainMoney: function(amount) {
    this._moneys = this._moneys + amount;
    this.showStatus();
  },

  loseAllOfItem: function(itemName) {
    for (let i = 0; i < this._inventory.length; i++) {
      if (this._inventory[i].name == itemName) {
        this._inventory.splice(i, 1);
        this.showStatsAndCmds();
        return;
      }
    }
  },

  plot: function() {
    this._worldMap.autoScrollToPlayer( this._x, this._y );
    this.__proto__.__proto__.plot.call(this);
  },

  likesEnteringBuildings: function() {
    return true;
  }
};
PlayerCharacter.prototype.__proto__ = new MOB();


function Alien(id, x, y, map, subMapId) {
  let icon = "images/xenobiosphere/lifeform-01.png";
  this._init(id, x, y, icon, map, subMapId);
  this._alienInit();
}
Alien.prototype = {
  _alienInit: function() {
    // TODO: instead of wandering randomly, give this guy some
    // motivations, even if they're only to approach or retreat from
    // humans or to graze on plant matter or something.
    this._name = "Mysterious Alien Life Form";
  },
  takeTurn: function() {
    let direction = Math.floor(Math.random()*4);
    switch (direction) {
    case 0:
      this.move(0, -1);
      break;
    case 1:
      this.move(1, 0);
      break;
    case 2:
      this.move(-1, 0);
      break;
    case 3:
      this.move(0, 1);
    }
  },

  showStatsAndCmds: function() {
    CommandAbilityInterface.show( function() {
      return { infoText: "This is definitely an alien life form.",
               commands: [] };
      });
  }
};
Alien.prototype.__proto__ = new MOB();
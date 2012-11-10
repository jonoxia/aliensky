
var g_messageLog = [];
function logMsg(msg) {
  if ($("#msg-log")) {
    // When there's more than 10 messages, the oldest one scrolls
    // off the top.  (TODO: Actual scroll bar?)
    if (g_messageLog.length > 10) {
      g_messageLog.splice(0, 1);
    }
    g_messageLog.push(msg);
    $("#msg-log").empty();
    for (let i = 0; i < g_messageLog.length; i++) {
      $("#msg-log").append( g_messageLog[i] + "<br/>");
    }
  }
}

// Codes for CommandAbility.targetType:
const TGT_CURR_SQUARE = 1;
const TGT_SELF = 2;
const TGT_ITEM = 3;
const TGT_PLAYER = 4;
const TGT_SQUARE = 5;
const TGT_MOB = 6;
const TGT_BUILDING = 7;

var CommandAbilityInterface = {
  _pendingSkill: null,
  lastControlPanelContents: null,

  setPendingSkill: function(skill) {
    this._pendingSkill = skill;
    // TODO show cancel button... (or intercept escape key)
    // Need somme visual indicator of what pending ability is
    // and what legal targets are!
  },

  clearPendingSkill: function() {
    this._pendingSkill = null;
    // TODO hide cancel button...
  },

  handleClickOnSquare: function(square) {
    if (this._pendingSkill) {
      if (this._pendingSkill.targetType == TGT_SQUARE){
        this._pendingSkill.onUse(square);
        this.clearPendingSkill();
        return true;
      }
    }
    return false;
  },

  handleClickOnMob: function(mob) {
    if (this._pendingSkill) {
      if (this._pendingSkill.targetType == TGT_MOB) {
        this._pendingSkill.onUse(mob);
        this.clearPendingSkill();
        return true;
      }
    }
    return false;
  },

  handleClickOnItem: function(item) {
    if (this._pendingSkill) {
      if (this._pendingSkill.targetType == TGT_ITEM) {
        this._pendingSkill.onUse(item);
        this.clearPendingSkill();
        return true;
      }
    }
    return false;
  },

  handleClickOnBuilding: function(bldg) {
    if (this._pendingSkill) {
      if (this._pendingSkill.targetType == TGT_BUILDING){
        this._pendingSkill.onUse(bldg);
        this.clearPendingSkill();
        return true;
      }
    }
    return false;
  },

  makeAbilityMenu: function(skills) {
    let skillList = $("<ul></ul>");
    for (let i = 0; i < skills.length; i++) {
      let skill = skills[i];
      let skillLink = $("<a></a>");
      skillLink.html( skill.makeHtml() );
      skillLink.bind("click", function() {skill.onClick();});
      skillList.append($("<li></li>").append(skillLink));
    }
    return skillList;
  },

  show: function(controlPanelContents) {
    this.lastControlPanelContents = controlPanelContents;
    this.refresh();
  },
 
  refresh: function() {
    if (this.lastControlPanelContents) {
      let div = $("#order-menu-div");
      let stuff = this.lastControlPanelContents();
      div.empty();
      div.append(stuff.infoText);
      div.append(this.makeAbilityMenu(stuff.commands));
    }
  }
};

function CommandAbility(user, name, targetType, onUseFunc) {
  // Any activated ability of a player, machine, or building which
  // may or may not require a further click to select a target.
  this._init(user, name, targetType, onUseFunc);
}
CommandAbility.prototype = {
  _init: function(user, name, targetType, onUseFunc) {
    this._user = user;
    this._name = name;
    this._targetType = targetType,
    this._onUseFunc = onUseFunc;
  },

  get targetType() {
    return this._targetType;
  },

  onClick: function() {
    // Called when player clicks link to activate this skill...
    // what we do next depends on the required target type.
    CommandAbilityInterface.clearPendingSkill(null);
    switch (this._targetType) {
    case TGT_CURR_SQUARE:
      let square = this._user.getSquareUnderfoot();
      this.onUse(square);
      break;
    case TGT_SELF:
      this.onUse(this._user);
      break;
    case TGT_SQUARE:
      CommandAbilityInterface.setPendingSkill(this);
      logMsg("Click on the map in the place where you want to " + this._name);
      break;
    case TGT_BUILDING:
      CommandAbilityInterface.setPendingSkill(this);
      logMsg("Click on the building where you want to " + this._name);
      break;
    case TGT_ITEM:
      // An item in your inventory pane, which may include a tech tree advance?
      CommandAbilityInterface.setPendingSkill(this);
      logMsg("Click on the inventory item that you want to " + this._name);
      // (to think about: skills that involve using one item on another?)
      break;
    case TGT_PLAYER: case TGT_MOB:
      CommandAbilityInterface.setPendingSkill(this);
      logMsg("Click on the player or creature you want to " + this._name);
      break;
    }
  },

  onUse: function(clickTarget) {
    this._onUseFunc(this._user, clickTarget);
  },

  makeHtml: function() {
    return this._name;
  }
};

function Item(name, number, weight, icon, useCmd) {
  this._init(name, number, weight, icon, useCmd);
}
Item.prototype = {
  // TODO item should know who its owner is.  Also this owner should
  // be able to change if the item changes hands!  (That might mean we
  // destroy one item and create another identical one)
  _init: function(name, number, weight, icon, useCmd) {
    this._name = name;
    this._number = number;
    this._weight = weight;
    this._icon = icon;
    this._useCmd = useCmd;
  },
  increase: function(number) {
    this._number += number;
  },
  get name() {
    return this._name;
  },
  get number() {
    return this._number;
  },
  get weightPer() {
    return this._weight;
  },
  get weightTotal() {
    return this._weight * this._number;
  },
  get icon() {
    return this._icon;
  },
  makeHtml: function() {
    return this._name + " x " + this._number;
  },
  onClick: function() {
    let handled = CommandAbilityInterface.handleClickOnItem(this);
    if (!handled) {
      if (this._useCmd) {
        handled = this._useCmd.onClick();
        // TODO actually onClick() doesn't return anything... why are we catching/returning the value?
      }
    }
    return handled;
  }
};

var TurnClock = {
  _mobList: [],
  start: function() {
    let self = this;
    setInterval(function() { self.processTurns(); }, 1000 );
  },

  addMOB: function( mob ) {
    this._mobList.push(mob);
  },

  removeMOB: function( mob ) {
    // TODO
  },

  redrawAllMobs: function() {
    for (let i = 0; i < this._mobList.length; i++) {
      this._mobList[i].plot();
    }
  },

  processTurns: function() {
    for (let i = 0; i < this._mobList.length; i++) {
      this._mobList[i].takeTurn();
    }

    if (gBuildingManager) {
      // TODO combine building manager and turnclock into one class.
      gBuildingManager.takeBldgTurns();
    }
  }
};

function ProgressBar(layer, max) {
  this.init(layer, max); //borrow a mob's layer
}
ProgressBar.prototype = {
  init: function(layer) {
    this._layer = layer;
    this._div = $("<div></div>").attr("class", "progress-bar-outer");
    this._innerDiv = $("<div></div>").attr("class", "progress-bar-inner");
    this._div.append(this._innerDiv);
    this._layer.append(this._div);
    this.update(0);
  },

  hide: function() {
    this._div.css("display", "none");
  },

  show: function() {
    this._div.css("display", "block");
  },

  update: function(progress, max) {
    this._innerDiv.css("width", (64 * progress / max ) + "px");
  }
};

function smooth( bigArray, numTimes) {
  let x, y;
  let height = bigArray.length;
  let width = bigArray[0].length;
  for (let t = 0; t < numTimes; t++) {
    let newBigArray = [];
    for (y = 0; y < height; y++) {
      newBigArray.push( [] );
      for ( x = 0; x < width; x++) {
        let cellsToAvg = [];
        if ( x > 0 ) {
          cellsToAvg.push( bigArray[y][x-1] );
        } else {
          cellsToAvg.push( bigArray[y][width-1] );
        }

        if (x < width - 1) {
          cellsToAvg.push( bigArray[y][x+1] );
        } else {
          cellsToAvg.push( bigArray[y][0] );
        }

        if ( y > 0 ) {
          cellsToAvg.push( bigArray[y-1][x] );
        } else {
          cellsToAvg.push( bigArray[height-1][x] );
        }

        if (y < height - 1) {
          cellsToAvg.push( bigArray[y+1][x] );
        } else {
          cellsToAvg.push( bigArray[0][x] );
        }
        cellsToAvg.push( bigArray[y][x]);
        let total = 0;
        for ( let z in cellsToAvg ) {
          total += cellsToAvg[z];
        }
        let avg = total / cellsToAvg.length;
        newBigArray[y][x] = avg;
      }
    }
    bigArray = newBigArray;
  }
  return bigArray;
}

function randomMap(width, height, generationFunc, smoothness) {
  let dataArray = [];
  let x, y;
  for (y = 0; y < height; y++) {
    let row = [];
    for (x = 0; x < width; x++) {
      row.push(generationFunc());
    }
    dataArray.push(row);
  }

  dataArray = smooth(dataArray, smoothness);
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
	dataArray[y][x] = Math.floor(dataArray[y][x]);
    }
  }
  return dataArray;
}

function makeMap() {
    let heightMap = randomMap(20, 20, function() {
	    let table = [-6, -6, -4, -4, -2, -2, -2, 0, 0, 0, 0, 0, 2, 2, 2, 4, 4, 6, 6];
       let roll = Math.floor( Math.random() * table.length );
       return table[roll];
    }, 3);

    let resourceMap = randomMap(20, 20, function() {
	    if (Math.floor( Math.random() * 10 + 1) == 1) {
		return Math.floor(Math.random() * 10);
	    } else {
		return 0;
	    }
	}, 0);
    let moistureMap = randomMap(20, 20, function() {
       let height = Math.floor( Math.random() * 10 + 1);
       if (height == 10) {
	   return 3;
       } else if (height > 7) {
	   return 2;
       } else if (height > 4) {
	   return 1;
       } else {
	   return 0;
       }
	}, 10);

  // make room for the crashed ship at 4,4
    for (let x = 3; x < 6; x++) {
	for (let y = 3; y < 6; y++) {
	    heightMap[y][x] = 0;
	}
    }
    resourceMap[4][4] = 0;
  let worldMap = new WorldMap(heightMap, resourceMap, moistureMap);

  let ship = new CrashedShipBuilding();
  ship.setUp(worldMap, 4, 4);

  let alien = new Alien(7, 9, 9, worldMap, 0);

  TurnClock.start();

  worldMap.redraw();
  return worldMap;
}

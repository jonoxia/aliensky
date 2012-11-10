var cBotCmds = {
  IDLE: 0,
  EXTRACT_RESOURCE: 2,
  TRANSPORT_RESOURCE: 3,
  LAY_CABLE: 4,
  LAY_ROAD: 5,
  FOLLOW_ME: 8,
  CLEAR_AREA: 9,
  TERRAFORM_AREA: 10,
  BUILD_BUILDING: 11,
  RAISE_GROUND: 12,
  LOWER_GROUND: 13
};

function Robot(id, x, y, icon, map, subMapId, owner) {
  if (id) {
    this._init(id, x, y, icon, map, subMapId);
    this._robotInit(owner);
  }
}
Robot.prototype = {
  _robotInit: function(owner) {
    this._owner = owner;
    this._currentOrder = cBotCmds.IDLE;
    this._currentOrderSquare = null;
    this._taskProgress = 0;
    this._progressBar = new ProgressBar(this._layer);
    this._progressBar.hide();
  },

  _setOrders: function( order, square ) {
    this._currentOrder = order;
    this._currentOrderSquare = square;
    this._taskProgress = 0;
    logMsg(this._name + ": " + order + " order acknowledged.");
  },

  _stop: function() {
    this._currentOrder =  cBotCmds.IDLE;
    this._currentOrderSquare = null;
    this._taskProgress = 0;
  },

  showStatsAndCmds: function() {
    let self = this;
    CommandAbilityInterface.show( function() {
      return { infoText: "Constructobot ready",
               commands: self._commandAbilities }});
  },

  _moveTowardTargetSquare: function() {
    // intentionally naiive!
    let delX = this._currentOrderSquare.x - this._x;
    let delY = this._currentOrderSquare.y - this._y;
    if (delX ==0 && delY == 0) {
      return false;
    }

    let moved = false;

    if (Math.abs(delX) > Math.abs(delY)) {
      if (delX > 0) {
        moved = this.move(1, 0);
      } else if (delX < 0 ) {
        moved = this.move(-1, 0);
      }
      if (!moved) {
        if (delY > 0) {
          moved = this.move(0, 1);
        } else if (delY < 0) {
          moved = this.move(0, -1);
        }
      }
    } else {
      if (delY > 0) {
        moved = this.move(0, 1);
      } else if (delY < 0) {
        moved = this.move(0, -1);
      }
      if (!moved) {
        if (delX > 0) {
          moved = this.move(1, 0);
        } else if (delX < 0) {
          moved = this.move(-1, 0);
        }
      }
    }
    return moved;
  },

  takeTurn: function() {
    if (this._currentOrder == cBotCmds.IDLE) {
      // If idling, do nothing.
      return;
    }

    if (this._currentOrder == cBotCmds.FOLLOW_ME) {
      // follow your owner
      if (this._owner) {
        this._currentOrderSquare = this._owner.getSquareUnderfoot();
        let sq = this._currentOrderSquare;
        if (this._owner.subMapId != this._subMap) {
          // What if owner is on a different submap?  Teleport!  Note,
          // this is a really bad hack (would be better to teach the
          // bot to actually follow you through doors) but for now
          // it'll make the game playable by letting you get your
          // constructobots outside.
          this.enterNewSubMap(this._owner.subMapId, sq.x, sq.y);
        } else {
          if (sq) {
            if ( Math.abs(sq.x - this._x) + Math.abs(sq.y - this._y) > 1) {
              this._moveTowardTargetSquare();
            }
          }
        }
      }
      return;
    }

    // If we have orders on a particular square, move towards it:
    let sq = this._currentOrderSquare;
    if (sq) {
      if ( sq.x != this._x || sq.y != this._y ) {
        this._moveTowardTargetSquare();
        return;
      }
    }

    this.executeOrders();
  },

  executeOrders: function() {
    // Override me in subclass.
  }
};
Robot.prototype.__proto__ = new MOB();


function Constructobot(id, x, y, map, subMapId, owner) {
  let icon = "images/characters/constructobot.png";
  this._init(id, x, y, icon, map, subMapId);
  this._robotInit(owner);
  this._constructobotInit();
}
Constructobot.prototype = {
  _constructobotInit: function() {
    this._name = "Constructobot";
    // TODO: constructobot's ability to build depends on its owner's
    // skill level, and it gives its owner XP when it finishes
    // building something.
    let self = this;

    // instead of knowing every building plan from the beginning, have
    // constructobot only know the building plans you've installed.
    // Three ways to do this: 1. player knows who all their
    // constructobots are; using the plan adds cmd to all those bots
    // 2. player has list of known plans, bots query their owner for
    // plans 3. (currently implemented) use a plan, it's targeted to a
    // certain bot, only that bot can use it.

    this._commandAbilities = [
      new CommandAbility(self, "Build Pipe", TGT_SQUARE,
        function(bot, square) {
          bot._setOrders("pipe", square);
        }),
      new CommandAbility(self, "Build Wire", TGT_SQUARE,
        function(bot, square) {
          bot._setOrders("wire", square);
        }),
      new CommandAbility(self, "Follow Me", TGT_SELF,
        function(bot, square) {
          bot._setOrders(cBotCmds.FOLLOW_ME, null);
        })
      ];
  },

  learnPlan: function(planName) {
    // Returns false if this bot already knows this plan.
    let buildName = "Build " + planName;
    for (let i = 0; i < this._commandAbilities.length; i++) {
      if (this._commandAbilities[i]._name == buildName) {
        return false;
      }
    }
    let self = this;
    this._commandAbilities.push(
      new CommandAbility(self, buildName, TGT_SQUARE,
        function(bot, square) {
          bot._setOrders(planName, square);
        })
    );
    logMsg("Constructobot learned " + buildName + "!");
    return true;
  },

  executeOrders: function() {
    let subMap = this._subMap;

    if ( ! (this.getSquareUnderfoot().buildable) ) {
      logMsg("Can't build here.");
      this._stop();
      return;
    }

    if (this._currentOrder == "pipe" || this._currentOrder == "wire") {
      let bldg = new Connection( this._currentOrder);
      this._worldMap.putBuilding(subMap, this._x, this._y, bldg);
      logMsg(this._name + " : " + this._currentOrder + " complete!");
      if (gBuildingManager) {
        gBuildingManager.registerBldg(bldg);
        gBuildingManager.drawAll();
      }
      this._stop();
      return;
    }

    let plan = buildingPlans[this._currentOrder];

    if (this._taskProgress < plan.timeToBuild) {
      this._taskProgress++;
      this._progressBar.show();
      this._progressBar.update(this._taskProgress, plan.timeToBuild);
      return;
    } else {
      logMsg(this._name + " : " + this._currentOrder + " complete!");
      this._progressBar.hide();
      this._stop();
      let bldg = new Building(plan.img);
      this._worldMap.putBuilding(subMap, this._x, this._y, bldg);
      if (plan.floorPlan) {
        bldg.setIndoorMap(plan.floorPlan, plan.entrance, plan.exit);
      }
      if (plan.waterSupply || plan.waterDemand || plan.elecSupply ||
          plan.elecDemand) {
        bldg.setElecWaterProperties(plan.waterSupply,
                                    plan.waterDemand,
                                    plan.elecSupply,
                                    plan.elecDemand);
      }
      if (plan.setUp) {
        plan.setUp(bldg);
      }
      // Registration with building manager must come last.  This whole
      // business should probably go in a single building initializer
      // function.
      if (gBuildingManager) {
        gBuildingManager.registerBldg(bldg);
        gBuildingManager.drawAll();
      }
    }
    CommandAbilityInterface.refresh();
  }
};
Constructobot.prototype.__proto__ = new Robot();


function Miningbot(id, x, y, map, subMapId, owner) {
    /* Miningbot handles raising/lowering ground, as opposed to building
       buildings which is constructobot's job. Lowering ground gives you
       Dirt. Raising ground costs Dirt.  Whenever you lower ground, the
       Dirt you gain contains some Minerals (a hidden variable) based
       on the resource score of the square.  (Also deplete's squares
       resource score?) If you dump dirt containing minerals into a
       Refinery, you get Plasteel. 

       This means that for now all mining is strip mining.  The
       future:  Dig tunnels (creates an "indoor" cave screen) ?
    */
  let icon = "images/characters/miningbot.png";
  this._init(id, x, y, icon, map, subMapId);
  this._robotInit(owner);
  this._miningbotInit();
}
Miningbot.prototype = {
  _miningbotInit: function() {
    this._name = "Miningbot";
    this._dirtLoad = 0;
    this._maxDirtLoad = 4;
    this._mineralCargo = 0;
    let self = this;
    this._commandAbilities = [
      new CommandAbility(self, "Raise Ground", TGT_SQUARE,
        function(bot, square) {
          bot._setOrders("raise", square);
        }),
      new CommandAbility(self, "Lower Ground", TGT_SQUARE,
        function(bot, square) {
          bot._setOrders("lower", square);
        }),
      new CommandAbility(self, "Follow Me", TGT_SELF,
        function(bot) {
          bot._setOrders(cBotCmds.FOLLOW_ME, null);
        }),
      new CommandAbility(self, "Deliver Dirt to Refinery", TGT_BUILDING,
        function(bot, building) {
          if (bot._dirtLoad == 0) {
            logMsg("No dirt to deliver");
          } else {
            bot._setOrders("deliver", building);
          }
        })
    ];
  },

  showStatsAndCmds: function() {
    let self = this;
    CommandAbilityInterface.show( function() {
	    return {infoText: "Dirt: " + self._dirtLoad + " / " +
		    self._maxDirtLoad,
                    commands: self._commandAbilities }});
  },

  _getDeliveryBuilding: function() {
    let bldgs = this.getSquareUnderfoot().getBuildings();
    for (let i = 0; i < bldgs.length; i++) {
      if (bldgs[i].receiveMinerals) {
        return bldgs[i];
      }
    }
    return null;
  },

  executeOrders: function() {
    let subMap = this._worldMap.getSubMap(this._subMap);
    if (this._currentOrder == "raise" || this._currentOrder == "lower") {
      if ( ! (this.getSquareUnderfoot().raisable) ) {	
        logMsg("Can't " + this._currentOrder + " here.");
        this._stop();
        return;
      }
      if (this._currentOrder == "raise" && this._dirtLoad == 0) {
        logMsg("Can't raise unless I have dirt. Lower to get dirt.");
        this._stop();
        return;
      }
      if (this._currentOrder == "lower" &&
          this._dirtLoad == this._maxDirtLoad) {
        logMsg("Dirt storage is full. Got to drop it before I dig more.");
        this._stop();
        return;
      }
      if (this._currentOrder == "deliver" &&
        !this._getDeliveryBuilding()) {
        logMsg("There is no refinery here to deliver my load to.");
        this._stop();
        return;
      }
      if (this._taskProgress < 5) { // 5 = turns to raise/lower
        this._taskProgress++;
        this._progressBar.show();
        this._progressBar.update(this._taskProgress, 5);
        return;
      }
      logMsg(this._name + " : " + this._currentOrder + " complete!");
      this._progressBar.hide();
      let height = this.getSquareUnderfoot().height;
      if (this._currentOrder == "raise") {
        // spend dirt, raise square
        height += 1;
	this._dirtLoad -= 1;
      } else if (this._currentOrder == "lower") {
        // lower square, get dirt
        height -= 1;
	this._dirtLoad += 1;
	// Take away minerals if there are any in this square:
	let mins =  subMap.getMineralsAt(this._x, this._y);
	if (mins > 0) {
          this._mineralCargo += 1;
	  subMap.setMineralsAt(this._x, this._y, mins - 1);
	}
      }
      subMap.setHeightAt(this._x, this._y, height);
      this._worldMap.redraw();
      this._stop();
    } else if (this._currentOrder == "deliver") {
      let bldg = this._getDeliveryBuilding();
      if (bldg && bldg.receiveMinerals) {
        logMsg("Delivered " + this._mineralCargo + " minerals.");
        bldg.receiveMinerals(this._mineralCargo);
	this._dirtLoad = 0;
        this._mineralCargo = 0;
      }
      this._stop();
    }
    CommandAbilityInterface.refresh();
  }
};
Miningbot.prototype.__proto__ = new Robot();

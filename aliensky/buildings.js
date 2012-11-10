
var roundMap = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, 2, 2, 2, 2, -1, -1, -1],
    [-1, -1, 2, 2, 0, 0, 2, 2, -1, -1],
    [-1, 2, 2, 0, 0, 0, 0, 2, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 2, 0, 0, 0, 0, 2, 2, -1],
    [-1, -1, 2, 2, 0, 0, 2, 2, -1, -1],
    [-1, -1, -1, 2, 2, 2, 2, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];

var squareMap = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 2, 2, 2, 2, 2, 2, 2, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 0, 0, 0, 0, 0, 0, 2, -1],
    [-1, 2, 2, 2, 2, 2, 2, 2, 2, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];

var shipFloorPlan = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, -1, -1, -1, 2, 2, 2, -1, -1, -1],
  [-1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, -1, -1, 2, 0, 2, 2, -1, -1],
  [-1, -1, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, -1],
  [-1, -1, -1, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1],
  [-1, -1, -1, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1],
  [-1, -1, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, -1],
  [-1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, -1, -1, 2, 0, 2, 2, -1, -1],
  [-1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, -1, -1, -1, 2, 2, 2, -1, -1, -1],
  [-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];

// TODO - resource (plasteel) costs for each building
// TODO - this is important game data in global variable.  Global naming convention?
var buildingPlans = {
  "Solar Cell": {
    img: "solar_panel_2",
    timeToBuild: 5,
    elecSupply: 1
  },

  "Hab Unit": {
    img: "hab_unit",
    floorPlan: roundMap,
    entrance: [4, 7],
    exit: [4, 8],
    timeToBuild: 10,
    elecDemand: 1 //8
  },

  "Hydro Farm": {
    img: "hydro_farm",
    floorPlan: roundMap,
    entrance: [4, 7],
    exit: [4, 8],
    timeToBuild: 12,
    waterDemand: 2
  },

  "Factory": {
    img: "factory",
    floorPlan: squareMap,
    entrance: [4, 7],
    exit: [4, 8],
    timeToBuild: 15,
    elecDemand: 5,
    waterDemand: 2
  },

  "Refinery": {
    img: "warehouse",
    floorPlan: squareMap,
    entrance: [4, 7],
    exit: [4, 8],
    timeToBuild: 8,
    elecDemand: 2,
    waterDemand: 1
  },

  "Research Lab": {
    img: "research_lab",
    floorPlan: squareMap,
    entrance: [4, 7],
    exit: [4, 8],
    timeToBuild: 20,
    elecDemand: 5,
    waterDemand: 1
  },

  "Moisture Condenser": {
    img: "condenser",
    timeToBuild: 5,
    waterSupply: 1
  }

};

buildingPlans["Refinery"].setUp = function refinerySetUp(bldg) {
  bldg._supply = {
    iron: 0,
    hydrocarbons: 0,
    copper: 0,
    silicon: 0,
    uranium: 0
  };
  // TODO have receiveMinerals specify which mineral it is!
  bldg.receiveMinerals = function(minerals) {
    /* TODO future - if you don't own the refinery you could
       have a contract with them that they pay you when you deliver
       minerals here */
    bldg._supply.iron += minerals;
  };
  bldg._worldMap.putSpecialSquare(bldg._insideMapId, 4, 1,
    new Console(bldg._worldMap, "console",
      function(player, console) {
        if (!bldg._elecDemandMet) {
          return {infoText: "Can't refine without electricity.",
                  commands: []};
        }
        if (!bldg._waterDemandMet) {
          return {infoText: "Can't refine without water.",
                  commands: []};
        }
        return {
          infoText: bldg._supply.iron + " iron and " +
		bldg._supply.hydrocarbons + " hydrocarbons in supply",
          commands: [
            new CommandAbility(player, "Make Plasteel", TGT_SELF,
              function(user) {
                if (bldg._supply.iron < 1) {
                  logMsg("Not enough iron.");
                  return;
                }
		/* TODO future - if you don't own this refinery
		 * you would need to have a contract with the
                 * owner and pay money to take the products */
                if (user.buyAThing(0, new Item("plasteel", 1, 10))) {
                  bldg._supply.iron -= 1;
                }
              }
            )
          ]
        };
      }
    )
  );
};


function Building(icon) {
  this._buildingInit(icon);
}
Building.prototype = {
  _buildingInit: function(icon) {
    this._worldMap = null;
    this._mapSquare = null;
    this._name = icon; // for debugging purposes
    if (icon) {
      this._imgSrc = "images/buildings/" + icon + ".png";
    } else {
      this._imgSrc = "";
    }
    this._hasInside = false;
    this._insideMapId = 0;
    this._insideMapStartPoint = null;

    this._waterSupply = 0;
    this._waterDemand = 0;
    this._elecSupply = 0;
    this._elecDemand = 0;

    this._waterDemandMet = false;
    this._elecDemandMet = false;

    this.elecCircuitId = null;
    this.waterCircuitId = null;

    // TODO this chunk of code duplicated from MOB -- share a base class?
    this._layer = $("<div></div>").attr("class", "bldg-transparency");
    this._imgTag = $("<img/>").attr("src", this._imgSrc);
    let self = this;

    // Most click handlers probably belong on consoles, not buildings,
    // but a building can still be an ability target.
    this._imgTag.bind("click", function() {
      /* This building will try to handle clicks; but if its
       * click handler returns false, then pass the click on to
       * the square beneath me.
       */
       let handled = CommandAbilityInterface.handleClickOnBuilding(self);
       if (!handled) {
         if (gPlayerCharacter) {
           handled = self.handleClick(gPlayerCharacter);
           if (!handled) {
             self._worldMap.handleClickAtWorldCoords(
               self._x, self._y,
               gPlayerCharacter);
           }
         }  
       }
    });

    this._layer.append(this._imgTag);
    this._conditionSign = $("<img/>").attr("class", "condition-mark");
    this._conditionSign.css("display", "none");
    this._layer.append(this._conditionSign);
    $("#the-body").append(this._layer);
  },

  setLocation: function(worldMap, subMapId, x, y) {
    this._worldMap = worldMap;
    this._subMapId = subMapId;
    this._x = x;
    this._y = y;
    let subMap = worldMap.getSubMap(subMapId);
    this._mapSquare = subMap.getSquareAt(x, y);
  },

  get waterSupply() {
    return this._waterSupply;
  },

  get waterDemand() {
    return this._waterDemand;
  },

  get elecSupply() {
    return this._elecSupply;
  },

  get elecDemand() {
    return this._elecDemand;
  },

  get conductsWater() {
    return this.waterSupply || this.waterDemand;
  },

  get conductsElectricity() {
    return this.elecSupply || this.elecDemand;
  },

  get imgSrc() {
    return this._imgSrc;
  },

  get x() {
    return this._x;
  },

  get y() {
    return this._y;
  },

  leavable: function(toDirection) {
    return false;
  },

  enterable: function(fromDirection) {
    return this._hasInside;
  },

  get buildable() {
    return false;
  },

  hasWaterSupply: function(val) {
      // this is a setter
    this._waterDemandMet = val;
    this._updateImage();
  },

  hasElecSupply: function(val) {
      // this is a setter
    this._elecDemandMet = val;
    this._updateImage();
  },

  _updateImage: function() {
    if (this.elecDemand && !this._elecDemandMet) {
      this._conditionSign.css("display", "block");
      this._conditionSign.attr("src", "images/buildings/need-energy.png");
    } else if (this.waterDemand && !this._waterDemandMet) {
      this._conditionSign.css("display", "block");
      this._conditionSign.attr("src", "images/buildings/need-water.png");
    } else {
      this._conditionSign.css("display", "none");
    }
  },

  resourceStatusToHtml: function() {
    let str = "";
    if (this.elecDemand > 0 ) {
      if (this._elecDemandMet) {
        str += this._name + " is powered!<br/>";
      } else {
        str += this._name + " is unpowered!<br/>";
      }
    }
    if (this.waterDemand > 0 ) {
      if (this._waterDemandMet) {
        str += this._name + " has water!<br/>";
      } else {
        str += this._name + " doesn't have water!<br/>";
      }
    }
    return str;
  },

  handleClick: function(player) {
    // Return true if the click was handled, false to pass it on
    return false;
  },

  setIndoorMap: function(map, insideMapStartPoint, insideMapExit) {
    let mapId = this._worldMap.addSubMap(map);
    this._hasInside = true;
    this._insideMapId = mapId;
    this._insideMapStartPoint = insideMapStartPoint;

    // Create an airlock on the sub map at insideMapExit point that is
    // linked back to my outside location.

    let exit = new Airlock(this._worldMap, 0, this.x, this.y);
    this._worldMap.getSubMap(mapId).setHeightAt(insideMapExit[0], insideMapExit[1], 0);
    this._worldMap.putSpecialSquare(mapId, insideMapExit[0], insideMapExit[1],
                                    exit);
  },

  onEnter: function(mob) {
    if (this._hasInside && mob.likesEnteringBuildings()) {
      this._worldMap.goToMap(mob, this._insideMapId,
                             this._insideMapStartPoint);
    }
  },

  // TODO combine setElecWaterProperties, setIndoorMap, and
  // worldMap.putBUilding into one building class method that takes
  // (plan, x, y, submap)?
  setElecWaterProperties: function(waterSupply, waterDemand,
                                   elecSupply, elecDemand) {
    if (waterSupply != undefined) {
      this._waterSupply = waterSupply;
    }
    if (waterDemand != undefined) {
      this._waterDemand = waterDemand;
    }
    if (elecSupply != undefined) {
      this._elecSupply = elecSupply;
      //logMsg("Set elec demand to " + this._elecSupply);
    }
    if (elecDemand != undefined) {
      this._elecDemand = elecDemand;
      //logMsg("Set elec demand to " + this._elecDemand);
    }
  },

  takeTurn: function() {
    // Override this in subclasses.
  },

  plot: function() {
    // Totally duplicated code from MOB...  Share a base class?
    // don't draw if offscreen or on a different map:
    if (this._worldMap.getCurrentSubMapId() != this._subMapId) {
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

  getNeighborsAt: function(x, y) {
    let map = this._worldMap.getSubMap(this._subMapId);
    if (map.pointInBounds(x, y)) {
      let square = map.getSquareAt(x, y);
      return square.getBuildings();
    } else {
      return [];
    }
  }
};

function Connection(type) {
  if (!(type=="pipe" || type=="wire")) {
    logMsg("Invalid connection type: " + type);
  }
  this._type = type;
  this._buildingInit(type);
}
Connection.prototype = {
  // they're flat, so we can walk on them, and we can build more than one
  // in the same space -- although it doesn't do anything unless they're
  // different types i.e. one wire and one pipe.

  enterable: function() {
    return true;
  },
  get buildable() {
    return true;
  },
  get conductsElectricity() {
    return (this._type == "wire");
  },
  get conductsWater() {
    return (this._type == "pipe");
  },
  recalculateConnection: function() {
    let self = this;

    let hasConnection  = function (x, y) {
      let bldgs = self.getNeighborsAt(x, y);
      for each (bldg in bldgs) {
        if (self.conductsElectricity && bldg.conductsElectricity) {
          return true;
        }
        if (self.conductsWater && bldg.conductsWater) {
          return true;
        }
      }
      return false;
    };

    let east = hasConnection(this._x + 1, this._y);
    let west = hasConnection(this._x - 1, this._y);
    let north = hasConnection(this._x, this._y - 1);
    let south = hasConnection(this._x, this._y + 1);

    let icon = this._type + "_";
    if (north)
      icon += "n";
    if (east)
      icon += "e";
    if (west)
      icon += "w";
    if (south)
      icon += "s";

    this._imgSrc = "images/buildings/" + icon + ".png";
    this._imgTag.attr("src", this._imgSrc);
  }
};
Connection.prototype.__proto__ = new Building();


// Airlock is a Special Square, not a building.
function Airlock(worldMap, subMapId, x, y) {
  this._worldMap = worldMap;
  this._toMapId = subMapId;
  this._toPoint = [x, y];
}
Airlock.prototype = {
  get imgSrc() {
    return "images/buildings/airlock.png";
  },

  enterable: function() {
    return true;
  },

  onEnter: function(player) {
    this._worldMap.goToMap(player, this._toMapId, this._toPoint);
  }
};
Airlock.prototype.__proto__ = new MapSquare();

function Console(worldMap, imgName, menuFunction) {
  this._worldMap = worldMap;
  this._imgName = imgName;
  if (menuFunction) {
    this._menuFunc = menuFunction;
  } else {
    this._menuFunc = null;
  }
}
Console.prototype = {
  get imgSrc() {
    return "images/buildings/" + this._imgName + ".png";
  },

  enterable: function() {
    return false;
  },

  handleClick: function(player) {
    if (this._menuFunc != null) {
      let self = this;
      CommandAbilityInterface.show(function() {
	      return self._menuFunc(player, self);
	  });
    }
  }
};
Console.prototype.__proto__ = new MapSquare();



var TheBank = {
  init: function() {
    this.supply = { water: 20000,
                    food: 10000,
                    corpsicles: 400,
                    energy: 1000,
                    plasteel: 2000,
                    constructobots: 60,
                    seeds: 5000 };
    this.baseSupply = {};
    for (let x in this.supply) {
      this.baseSupply[x] = this.supply[x];
    }
    this.basePrice = { water: 2,
                       food: 1,
                       energy: 10,
                       plasteel: 20,
                       constructobots: 40,
                       seeds: 5 };
    this.energyProduction = 100;

    // TODO randomly lose some of each resource during the landing
  },

  getSupply: function(resource) {
    return this.supply[resource];
  },

  getPrice: function(resource) {
    if (this.supply[resource] == 0) {
      return False;
    } else {
      let price = this.basePrice[resource] * this.baseSupply[resource] / this.supply[resource];
      return Math.ceil(price);
    }
  },

  getSellPrice: function(resource) {
    // You can sell to the bank at 90% of the price
    let price = this.basePrice[resource] * this.baseSupply[resource] / this.supply[resource];
    return Math.ceil(price * 0.9);
  },

  changeSupply: function(resource, delta) {
    this.supply[resource] += delta;
  },

  getDescription: function(resource) {
    return "The ship's supply of " + resource + " stands at " + this.supply[resource] + " units." +
      "<br/>We are selling at " + this.getPrice(resource) + " yenpesos per unit." +
      "<br/>We are buying at " + this.getSellPrice(resource) + " yenpesos per unit.<br/>";
  },

  makeBuyFunc: function(resource, console) {
    return function(user) {
      if (TheBank.getSupply(resource) < 1) {
        logMsg("Can't buy that, we're all out.");
        return;
      }
      if (user.buyAThing(TheBank.getPrice(resource), new Item(resource, 1, 0))) {
        TheBank.changeSupply(resource, -1);
        CommandAbilityInterface.refresh();
      }
    };
  },

  makeSellFunc: function(resource, console) {
    return function(user) {
      if (user.sellAThing(TheBank.getSellPrice(resource), resource)) {
        TheBank.changeSupply(resource, 1);
        CommandAbilityInterface.refresh();
      }
    };
  }
};

function CrashedShipBuilding() {
  this._buildingInit("landing-site");
}
CrashedShipBuilding.prototype = {

  // TODO right now you can shop long-distance... make it so the player has to be
  // up next to the building to use it... or else maybe you activate the building by
  // walking into it?

  _energyConsoleMenu: function(player, console) {
    let price = TheBank.getPrice("energy");
    return {
      infoText: TheBank.getDescription("energy"),
      commands: [
        new CommandAbility(player, "Buy Energy", TGT_SELF, TheBank.makeBuyFunc("energy", console)),
        new CommandAbility(player, "Sell Energy", TGT_SELF, TheBank.makeSellFunc("energy", console))
      ]};
  },

  _waterConsoleMenu: function(player, console) {
    let price = TheBank.getPrice("water");
    return {
      infoText: TheBank.getDescription("water"),
      commands: [
        new CommandAbility(player, "Buy Water", TGT_SELF, TheBank.makeBuyFunc("water", console)),
        new CommandAbility(player, "Sell Water", TGT_SELF, TheBank.makeSellFunc("water", console)),
        new CommandAbility(player, "Refill Suit Water Supply", TGT_SELF, function(user) {
                             logMsg("Refilled Suit Water");
                           })
      ]};
  },

  _foodConsoleMenu: function(player, console) {
    return {
      infoText: TheBank.getDescription("food") + TheBank.getDescription("seeds"),
      commands: [
        new CommandAbility(player, "Buy Seeds", TGT_SELF, TheBank.makeBuyFunc("seeds", console)),
        new CommandAbility(player, "Sell Seeds", TGT_SELF, TheBank.makeSellFunc("seeds", console)),
        new CommandAbility(player, "Buy Nutrient Paste", TGT_SELF, TheBank.makeBuyFunc("food", console)),
        new CommandAbility(player, "Sell Food", TGT_SELF, TheBank.makeSellFunc("food", console))
      ]};
  },

  _corpsicleMenu: function(player, console) {
    return {
      infoText: "There are " + TheBank.getSupply("corpsicles") + " humans in cold sleep.",
      commands: [
      new CommandAbility(player, "Thaw Corpsicle", TGT_SELF,function(user) {
                           logMsg("Thawed a corpsicle!");
                           TheBank.changeSupply("corpsicles", -1);
                         })
      ]};
  },

  _toolConsoleMenu: function(player, console) {
    return {
      infoText: TheBank.getDescription("plasteel") + TheBank.getDescription("constructobots"),
      commands: [
        new CommandAbility(player, "Buy Plasteel", TGT_SELF, TheBank.makeBuyFunc("plasteel", console)),
        new CommandAbility(player, "Sell Plasteel", TGT_SELF, TheBank.makeSellFunc("plasteel", console)),
        new CommandAbility(player, "Buy Constructobot", TGT_SELF, function(user) {
                             let cost = TheBank.getPrice("constructobots");
                             let completelyArbitraryId = 7; // TODO
                             if (user.buyAThing(cost, new Item("Deed To Constructobot", 1, 0))) {
                               let bot = new Constructobot(completelyArbitraryId,
                                                           console.x,
                                                           console.y + 1,
                                                           user._worldMap,
                                                           user._subMap,
                                                           user);
                               bot.plot();
                               TheBank.changeSupply("constructobots", -1);
                               console.handleClick(user);
                               logMsg("Enjoy your new constructobot. Thank you, come again.");
                             }
                           }),
        new CommandAbility(player, "Upgrade Suit", TGT_SELF, function(user) {
                             logMsg("Upgraded!");
                           })
      ]};
  },

  _planConsoleMenu: function(player, console) {
    let planPrice = 10;
    return {
      infoText: "Buy some plans? They direct your constructobot to build buildings.",
      commands: [x for (x in buildingPlans)].map(
                 function(plan) {
                   let planName = plan + " Plan";
                   return new CommandAbility(player, "Buy " + planName, TGT_SELF, function(user) {
                     if (user.buyAThing(planPrice,
                       new Item(planName, 1, 0, null,
                         new CommandAbility(player, "Use Plan", TGT_MOB,
                           function(user, targetMob) {
                             if (targetMob.learnPlan) {
                               if (targetMob.learnPlan(plan)) {
                                 user._loseItem(planName); // single-use
                               }
                             }
                           }), false)
                         )) {
                       logMsg("Thank you, don't forget to use it on your constructobot.");
                     }
                   });
                 })
    };
  },

  setUp: function(worldMap) {
    worldMap.putBuilding(0, 4, 4, this);
    this.setIndoorMap(shipFloorPlan, [6, 9], [6, 10]);
    gBuildingManager.registerBldg(this);

    let self = this;

    worldMap.putSpecialSquare(this._insideMapId, 6, 7, (new Console(worldMap, "sign-energy")));
    worldMap.putSpecialSquare(this._insideMapId, 7, 7,
                              (new Console(worldMap, "console", self._energyConsoleMenu)));

    worldMap.putSpecialSquare(this._insideMapId, 2, 1, (new Console(worldMap, "sign-water")));
    worldMap.putSpecialSquare(this._insideMapId, 3, 1,
                              (new Console(worldMap, "console", self._waterConsoleMenu)));

    worldMap.putSpecialSquare(this._insideMapId, 4, 1, (new Console(worldMap, "sign-seeds")));
    worldMap.putSpecialSquare(this._insideMapId, 5, 1,
                              (new Console(worldMap, "console", self._foodConsoleMenu)));

    worldMap.putSpecialSquare(this._insideMapId, 6, 1,
                              (new Console(worldMap, "corpsicle", self._corpsicleMenu)));

    worldMap.putSpecialSquare(this._insideMapId, 7, 1, (new Console(worldMap, "sign-tools")));
    worldMap.putSpecialSquare(this._insideMapId, 8, 1,
                              (new Console(worldMap, "console", self._toolConsoleMenu)));

    worldMap.putSpecialSquare(this._insideMapId, 12, 4, (new Console(worldMap, "corpsicle")));
    worldMap.putSpecialSquare(this._insideMapId, 13, 4, (new Console(worldMap, "corpsicle")));

    worldMap.putSpecialSquare(this._insideMapId, 6, 4, (new Console(worldMap, "corpsicle")));
    worldMap.putSpecialSquare(this._insideMapId, 7, 4, (new Console(worldMap, "corpsicle")));

    worldMap.putSpecialSquare(this._insideMapId, 15, 2,
                              (new Console(worldMap, "console", self._planConsoleMenu)));

    TheBank.init();
    gBuildingManager.drawAll();
  }
};
CrashedShipBuilding.prototype.__proto__ = new Building();


function BuildingCircuitGroup(id, type) {
  this._id = id;
  this._type = type;
  this._bldgList = [];
}
BuildingCircuitGroup.prototype = {
  get id() {
    return this._id;
  },
  addBldg: function(bldg) {
    if (this._type == "water") {
      bldg.waterCircuitId = this._id;
    } else if (this._type == "elec") {
      bldg.elecCircuitId = this._id;
    }
    this._bldgList.push(bldg);
  },
  mergeInto: function(otherGroup) {
    for (let i = 0; i < this._bldgList.length; i++) {
      otherGroup.addBldg(this._bldgList[i]);
    }
    this._bldgList = [];
  },

  get totalSupply() {
    let total = 0;
    for (let i = 0; i < this._bldgList.length; i++) {
      if (this._type == "water") {
        total += this._bldgList[i].waterSupply;
      } else if (this._type == "elec") {
        total += this._bldgList[i].elecSupply;
      }
    }
    return total;
  },

  get totalDemand() {
    let total = 0;
    for (let i = 0; i < this._bldgList.length; i++) {
      if (this._type == "water") {
        total += this._bldgList[i].waterDemand;
      } else if (this._type == "elec") {
        total += this._bldgList[i].elecDemand;
      }
    }
    return total;
  },

  takeTurn: function() {
    let supply = this.totalSupply;
    let excess = supply - this.totalDemand;
    if (excess > 0) {
      // TODO 1. attempt to sell extra via any contracts we have.
      // 2. with whatever amount can't be sold, see if we have storage
      // capacity in which to put the extra.  3. any surplus that
      // can't be sold or stored is wasted.
    } else if (excess < 0) {
      // TODO 1. see if we have energy in storage to make up the
      // deficit.  2. if stored energy is insufficient, attempt to buy
      // from our contracts 3. if there's still a deficit, some of our
      // buildings don't get powered.
    }

    // buildings get supplied first-come first-served in order of
    // ID... highly arbitrary but easy to implement and good enough
    // for now. (Maybe should be by distance from suppliers?)
    for (let i = 0; i < this._bldgList.length; i++) {
      let demand = (this._type == "water")? this._bldgList[i].waterDemand : this._bldgList[i].elecDemand;
      if (supply >= demand) {
        if (this._type == "water") {
          this._bldgList[i].hasWaterSupply(true);
        } else {
          this._bldgList[i].hasElecSupply(true);
        }
        supply -= demand;
      } else {
        if (this._type == "water") {
          this._bldgList[i].hasWaterSupply(false);
        } else {
          this._bldgList[i].hasElecSupply(false);
        }
      }
    }

    // How often does this turn get called?  If demand exceeds supply by 1,
    // then we draw down reserves by one per... minute? an hour? a day?
  },

  toHtml: function() {
    return this._type + " circuit id " + this._id + ": " + this.totalDemand + " / " + this.totalSupply;
  }

};

var gBuildingManager = {
  /* Handles drawing all buildings, keeping track of connections
   * between buildings, and running building "turns" during which
   * buildings generate or consume resources.
   */

  /* TODO combine with timeClock?*/

  bldgList: [],

  nextElecCircuitId: 0,
  nextWaterCircuitId: 0,

  elecCircuits: [],
  waterCircuits: [],

  getElecCircuitById: function(id) {
    for (let i = 0; i < this.elecCircuits.length; i++) {
      if (this.elecCircuits[i].id == id) {
        return this.elecCircuits[i];
      }
    }
    return null;
  },

  getWaterCircuitById: function(id) {
    for (let i = 0; i < this.waterCircuits.length; i++) {
      if (this.waterCircuits[i].id == id) {
        return this.waterCircuits[i];
      }
    }
    return null;
  },

  deleteElecCircuit: function(circuit) {
    logMsg("Deleting elec circuit " + circuit.id);
    let index = this.elecCircuits.indexOf(circuit);
    this.elecCircuits.splice(index, 1);
    logMsg("Remaining elec circuits: " + [x.id for each (x in this.elecCircuits)]);
  },

  deleteWaterCircuit: function(circuit) {
    logMsg("Deleting water circuit " + circuit.id);
    let index = this.waterCircuits.indexOf(circuit);
    this.waterCircuits.splice(index, 1);
    logMsg("Remaining water circuits: " + [x.id for each (x in this.waterCircuits)]);
  },

  registerBldg: function(bldg) {
    this.bldgList.push(bldg);

    if (bldg.recalculateConnection) {
      bldg.recalculateConnection();
    }

    let neighboringWaterCircuitIds = [];
    let neighboringElecCircuitIds = [];

    let recalculateNeighborConnections  = function (b, x, y) {
      let neighbors = b.getNeighborsAt(x, y);
      for each (neighbor in neighbors) {
        if (b.conductsElectricity && neighbor.conductsElectricity) {
          neighboringElecCircuitIds.push(neighbor.elecCircuitId);
        }
        if (b.conductsWater && neighbor.conductsWater) {
          neighboringWaterCircuitIds.push(neighbor.waterCircuitId);
        }
        if (neighbor.recalculateConnection) {
          neighbor.recalculateConnection();
        }
      }
    };

    recalculateNeighborConnections(bldg, bldg.x, bldg.y - 1);
    recalculateNeighborConnections(bldg, bldg.x, bldg.y + 1);
    recalculateNeighborConnections(bldg, bldg.x - 1, bldg.y);
    recalculateNeighborConnections(bldg, bldg.x + 1, bldg.y);

    // Add this connector to a subgroup; then see if it's touching any
    // connectors or buildings from a different sugroup and, if so,
    // merge the subgroups.

    // TODO there seems to be a kind of infinite loop it gets into if you build a complete
    // loop of wire - is it trying to connect a subgroup to itself and going crazy?
    // make sure to de-dupe neighboringElecCircuitIds and neighboringWaterCircuitIds!

    if (bldg.conductsWater) {
      if (neighboringWaterCircuitIds.length == 0) {
        // Not touching anything: create new circuit.
        let circuit = new BuildingCircuitGroup(this.nextWaterCircuitId, "water");
        this.nextWaterCircuitId += 1;
        circuit.addBldg(bldg);
        this.waterCircuits.push(circuit);
      } else if (neighboringWaterCircuitIds.length == 1) {
        // touching exactly one circuit; add it to that circuit.
        let circuit = this.getWaterCircuitById(
          neighboringWaterCircuitIds[0]);
        circuit.addBldg(bldg);
      } else if (neighboringWaterCircuitIds.length > 1) {
        let circuit = this.getWaterCircuitById(
          neighboringWaterCircuitIds[0]);
        circuit.addBldg(bldg);
        // Touching multiple circuits: Merge the circuits!
        for (let i = 1; i < neighboringWaterCircuitIds.length; i++) {
          let otherCircuit = this.getWaterCircuitById(
            neighboringWaterCircuitIds[i]);
          otherCircuit.mergeInto(circuit);
          this.deleteWaterCircuit(otherCircuit);
        }
      }
    }

    if (bldg.conductsElectricity) {
      if (neighboringElecCircuitIds.length == 0) {
        // Not touching anything: create new circuit.
        let circuit = new BuildingCircuitGroup(this.nextElecCircuitId, "elec");
        this.nextElecCircuitId += 1;
        circuit.addBldg(bldg);
        this.elecCircuits.push(circuit);
      } else if (neighboringElecCircuitIds.length == 1) {
        // touching exactly one circuit; add it to that circuit.
        let circuit = this.getElecCircuitById(
          neighboringElecCircuitIds[0]);
        circuit.addBldg(bldg);
      } else if (neighboringElecCircuitIds.length > 1) {
        let circuit = this.getElecCircuitById(
          neighboringElecCircuitIds[0]);
        circuit.addBldg(bldg);
        // Touching multiple circuits: Merge the circuits!
        for (let i = 1; i < neighboringElecCircuitIds.length; i++) {
          let otherCircuit = this.getElecCircuitById(
            neighboringElecCircuitIds[i]);
          otherCircuit.mergeInto(circuit);
          this.deleteElecCircuit(otherCircuit);
        }
      }
    }
  },

  takeBldgTurns: function() {
    let i;
    let debugOutput = "";
    for (i = 0; i < this.elecCircuits.length; i++) {
      this.elecCircuits[i].takeTurn();
      debugOutput +=  this.elecCircuits[i].toHtml() + "<br/>";
    }
    for (i = 0; i < this.waterCircuits.length; i++) {
      this.waterCircuits[i].takeTurn();
      debugOutput += this.waterCircuits[i].toHtml() + "<br/>";
    }
    for (i = 0; i < this.bldgList.length; i ++ ) {
      debugOutput += this.bldgList[i].resourceStatusToHtml();
    }
    $("#circuit-status").html(debugOutput);
  },

  drawAll: function() {
    for (let i = 0; i < this.bldgList.length; i ++ ) {
      this.bldgList[i].plot();
    }
  },

  start: function() {
  }
};
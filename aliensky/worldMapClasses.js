function SubMap(heightMap, isIndoor, mineralMap, moistureMap) {
  this._init(heightMap, isIndoor, mineralMap, moistureMap);
}
SubMap.prototype = {
  _init: function(heightMap, isIndoor, mineralMap, moistureMap) {
    this._xLimit = heightMap[0].length;
    this._yLimit = heightMap.length;
    this._heightMap = heightMap;
    if (mineralMap) {
      this._mineralMap = mineralMap;
    } else {
      this._mineralMap = null;
    }
    if (moistureMap) {
      this._moistureMap = moistureMap;
    } else {
      this._moistureMap = null;
    }
    this._mapSquares = [];

    if (isIndoor) {
      this._tileset = "indoor";
    } else {
      this._tileset = "outdoor";
    }

    let x, y;
    for (y = 0; y < this._yLimit; y++) {
      let mapSquareRow = [];
      for (x = 0; x < this._xLimit; x++) {
        let square = new MapSquare(this, x, y, heightMap[y][x]);
        mapSquareRow.push(square);
      }
      this._mapSquares.push(mapSquareRow);
    }
  },

  get xLimit() {
    return this._xLimit;
  },

  get yLimit() {
    return this._yLimit;
  },

  get tileset() {
    return this._tileset;
  },

  get isIndoor() {
    return (this._tileset == "indoor");
  },

  pointInBounds: function(x, y) {
    if (x < 0 || x >= this._xLimit) {
      return false;
    }
    if (y < 0 || y >= this._yLimit) {
      return false;
    }

    return true;
  },

  getPassable: function(mob, oldX, oldY, newX, newY) {
    if (!this._mapSquares[oldY][oldX].exitable(mob, 5)) {
      // TODO pass a real direction in here instead of "5"
      return false;
    }
    if (!this._mapSquares[newY][newX].enterable(mob, 5)) {
      // TODO pass a real direction in here instead of "5"
      return false;
    }
    
    let oldHeight = this.getHeightAt(oldX, oldY);
    let newHeight = this.getHeightAt(newX, newY);
    if ( Math.abs( oldHeight - newHeight ) > 1) {
      return false;
    }
    // special case walking south so the cliffs that look impassible
    // will be impassible:
    if (!this.isIndoor) {
      if (this.pointInBounds(newX, newY + 1)) {
        let southHeight = this.getHeightAt(newX, newY + 1);
        if ( newHeight - southHeight > 1) {  // not abs, only applies down
          return false;
        }
      }
    } 
    return true;
  },

  neighborIsBelowMe: function(x, y, neighborX, neighborY) {
    if (!this.pointInBounds(neighborX, neighborY)) {
      return false;
    }
    let thisHeight = this._heightMap[y][x];
    let thatHeight = this._heightMap[neighborY][neighborX];
    if (thisHeight > thatHeight) {
	return thisHeight - thatHeight;
    } else {
	return 0;
    }
  },

  getHeightAt: function(x, y) {
    if (!this.pointInBounds(x, y)) {
      logMsg("Can't get height, point out of bounds.");
      return 0;
    }
    return this._heightMap[y][x];
  },

  setHeightAt: function(x, y, newHeight) {
    if (!this.pointInBounds(x, y)) {
      logMsg("Can't get height, point out of bounds.");
      return;
    }
    this._heightMap[y][x] = newHeight;
    this.getSquareAt(x, y).setHeight(newHeight);
    // since height changed, regen the images for this and all neighboring
    // squares:
    for (let y1 = y - 1; y1 <= y +1; y1++) {
      for (let x1 = x - 1; x1 <= x +1; x1++) {
        if (this.pointInBounds(x1, y1)) {
          this.getSquareAt(x1, y1).resetImage(this._tileset);
        }
      }
    }
  },

  getMineralsAt: function(x, y) {
    if (this._mineralMap && this.pointInBounds(x, y) ) {
      return this._mineralMap[y][x];
    } else {
      return 0;
    }
  },

  setMineralsAt: function(x, y, newMin) {
    if (this._mineralMap && this.pointInBounds(x, y) ) {
      this._mineralMap[y][x] = newMin;
    }
    this.getSquareAt(x, y).setMinerals(newMin);
  },

  getMoistureAt: function(x, y) {
    if (this._moistureMap && this.pointInBounds(x, y) ) {
      return this._moistureMap[y][x];
    } else {
      return 0;
    }
  },

  getSquareAt: function(x, y) {
    if (!this.pointInBounds(x, y)) {
      logMsg("Point out of bounds: " + x + ", " + y);
    }
    return this._mapSquares[y][x];
  },

  replace: function(x, y, newSquare) {
    this._mapSquares[y][x] = newSquare;
    // TODO do we want to put the newSquare at the same height as the old
    // square?  For now, let's assume so.
  }

};

function WorldMap(heightmap, mineralMap, moistureMap) {
  this._init(heightmap, mineralMap, moistureMap);
}
WorldMap.prototype = {
  _init: function(heightMap, mineralMap, moistureMap) {
    this._colorTable = [];
    for (let h = 0; h <= 12; h++) {
      this._colorTable.push( "rgb(0," + Math.floor(h * 255/12) + ",0)");
    }

    this._subMapList = [];
    this._currentSubMap = 0;
    this._scrollX = 0;
    this._scrollY = 0;

    let mainMap = new SubMap(heightMap, false, mineralMap, moistureMap);
    this._subMapList.push(mainMap); // main map is id = 0
  },

  getSubMap: function(id) {
    return this._subMapList[id];
  },

  getCurrentSubMapId: function() {
    return this._currentSubMap;
  },

  get xLimit() {
    return this._subMapList[this._currentSubMap].xLimit;
  },

  get yLimit() {
    return this._subMapList[this._currentSubMap].yLimit;
  },

  pointInBounds: function(x, y) {
    return this._subMapList[this._currentSubMap].pointInBounds(x, y);
  },

  getPassable: function(mob, oldX, oldY, newX, newY) {
    let subMap = this._subMapList[mob.subMapId];
    return subMap.getPassable(mob, oldX, oldY, newX, newY);
  },

  getImgAt: function(x, y) {
    return this.getSquareAt(x, y).imgSrc;
  },

  getColorAt: function(x, y) {
    return this._colorTable[ this.getHeightAt(x, y) + 6];
  },

  neighborIsBelowMe: function(x, y, neighborX, neighborY) {
    return this._subMapList[this._currentSubMap].neighborIsBelowMe(
      x, y, neighborX, neighborY);
  },

  getHeightAt: function(x, y) {
    return this._subMapList[this._currentSubMap].getHeightAt(x, y);
  },

  getMineralsAt: function(x, y) {
    return this._subMapList[this._currentSubMap].getMineralsAt(x, y);
  },

  getMoistureAt: function(x, y) {
    return this._subMapList[this._currentSubMap].getMoistureAt(x, y);
  },

  getSquareAt: function(x, y) {
    let square = this._subMapList[this._currentSubMap].getSquareAt(x, y);
    if (!square) {
      logMsg("Error - null square on map " + this._currentSubMap
             + "at " + x + ", " + y);
    }
    return square;
  },

  handleClickAtWorldCoords: function(x, y, player) {
    let square = this.getSquareAt(x, y);
    let handled;
    handled = CommandAbilityInterface.handleClickOnSquare(square);
    if (!handled) {
      handled = square.handleClick(player);
    }
    return handled;
  },

  handleClickAt: function(x, y, player) {
    // x, y is provided in screen coordinates -- convert to world coords.
    return this.handleClickAtWorldCoords(
      x + this._scrollX, y + this._scrollY, player);
  },

  putBuilding: function(subMapId, x, y, building) {
    let square = this.getSubMap(subMapId).getSquareAt(x, y);
    if (square.buildable) {
      building.setLocation(this, subMapId, x, y);
      square.addBuilding(building);
      return true;
    }
    logMsg("Error - attempt to put building on unbuildable square.");
    return false;
  },

  putSpecialSquare: function(subMapId, x, y, specialSquare) {
    let subMap = this.getSubMap(subMapId);
    specialSquare._mapSquareInit(subMap, x, y, subMap.getHeightAt(x, y));
    subMap.replace(x, y, specialSquare);
  },

  transform: function( worldX, worldY ) {
    // transforms world coords to screen coords:
    var screenX = 64 * (worldX - this._scrollX) + 10;
    var screenY = 64 * (worldY - this._scrollY) + 10;
    /* NOTE  the above hard-coded  magic numbers are very brittle and will
     *  break if the layout of the page changes at all. */
    return [screenX, screenY];
  },
  isOnScreen: function( worldX, worldY ) {
    var screenX = worldX - this._scrollX;
    var screenY = worldY - this._scrollY;
    return (screenX > -1 && screenX <10 && screenY > -1 && screenY < 10);
  },
  autoScrollToPlayer: function( x, y ) {
    // plotAt, but also scrolls screen if this is too close to the edge and it's
    // possible to scroll.
    var screenX = x - this._scrollX;
    var screenY = y - this._scrollY;
    var scrollVal = 0;
    if (screenX < 3) {
      this.scroll( (screenX - 3), 0 );
    } else if (screenX > 7) {
      this.scroll( (screenX - 7), 0 );
    }
    if (screenY < 3) {
      this.scroll( 0, (screenY - 3) );
    } else if (screenY > 7) {
      this.scroll( 0, (screenY - 7 ) );
    }
  },

  scroll: function( deltaX, deltaY ) {
    var scrollX = this._scrollX + deltaX;
    var scrollY = this._scrollY + deltaY;
    if (scrollX < 0)
      scrollX = 0;
    if ( scrollX + 10 > this.xLimit)
      scrollX = this.xLimit - 10;
    if (scrollY < 0)
      scrollY = 0;
    if (scrollY + 10 > this.yLimit)
      scrollY = this.yLimit - 10;

    if (scrollX != this._scrollX || scrollY != this._scrollY) {
      this._scrollX = scrollX;
      this._scrollY = scrollY;
      //only redraw if we actually scrolled!
      this.redraw();
    }
  },

  redraw: function() {
    let table = $("#maptable");
    if (!table) {
      // There's no such table if we're on the unit tests page, for example
      return;
    }
    table.empty();
    for (let y = 0; y < 10; y++) {
      let row = $("<tr></tr>");
      table.append(row);
      for ( let x = 0; x < 10; x++ ) {
        let worldX = x + this._scrollX;
        let worldY = y + this._scrollY;
        let cell = $("<td></td>");
        row.append(cell);
	cell.css("background", this.getColorAt(worldX, worldY));
	cell.css("width", "64px");
	cell.css("height", "64px");
        let image = $("<img/>");
        cell.append(image);
        var imgSrc = this.getImgAt( worldX, worldY);
        image.attr("src", imgSrc);
        image.attr("id", "worldmapimg_" + x + "_" + y );
	// TODO use bind here instead of this string fugliness
        image.attr("onclick",
	"clickHandler(" + x + "," + y + ");");
      }
    }
    if (TurnClock) {
      TurnClock.redrawAllMobs();
    }
    if (gBuildingManager) {
      gBuildingManager.drawAll();
    }
  },

  addSubMap: function(subMapData) {
    // "true" means it's indoor, which we're assuming it is here.
    this._subMapList.push(new SubMap(subMapData, true));
    // return new map id
    return this._subMapList.length - 1;
  },

  goToMap: function(mob, mapId, point) {
    mob.enterNewSubMap(mapId, point[0], point[1]);

    // other mobs can go through doors, but
    // only change the map view if mob is the player!
    if (mob.screenFollowsMe) {
      this._currentSubMap = mapId;
      this._scrollX = 0;
      this._scrollY = 0;
      this.autoScrollToPlayer(point[0], point[1]);
      this.redraw();
      mob.plot();
    } else {
      mob.plot();
    }
  }
};

function MapSquare(subMap, x, y, height) {
  if (subMap) {
    this._mapSquareInit(subMap, x, y, height);
  }
}
MapSquare.prototype = {
  _mapSquareInit: function(subMap, x, y, height) {
    this._subMap = subMap;
    this._x = x;
    this._y = y;
    this._height = height;
    this._isWater = (height <= -2);
    this._bldgs = [];
    this._minerals = subMap.getMineralsAt(x, y);
    if (this._isWater) {
      this._moisture = 100;
    } else {
      this._moisture = subMap.getMoistureAt(x, y);
    }
    this._imgSrc = this._pickImageForTerrain(subMap.tileset);
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

  get height() {
    return this._height;
  },

  setHeight: function(newHeight) {
      this._height = newHeight;
  },

  enterable: function(mob, fromDirection) {
      // For now (i.e. until boats and swimming) water is impassible
    if (this._isWater) {
      return false;
    }
    // If it contains any non-enterable buildings...
    for (let i = 0; i < this._bldgs.length; i++) {
      if (!this._bldgs[i].enterable(fromDirection)) {
        return false;
      }
    }
    return true;
  },

  exitable: function(mob, toDirection) {
    /* for now, exitable is always true (if you somehow got onto
     * an "impassible" square - like if you're a bot and you just
     * built an impassible building - you should still be able
     * to walk out!*/
    return true;
  },

  get buildable() {
    if (this._subMap.isIndoor) {
      return false; // can't build a building in an indoor map!
    }

    if (this._isWater) {
      return false;
    }

    // Can't build on a square that already has a building...
    for (let i = 0; i < this._bldgs.length; i++) {
      if (!this._bldgs[i].buildable) {
        return false;
      }
    }

    // Can't build on rough ground or slopes, so look for flatness:
    // TODO this shares some logic with neighborIsBelowMe, refactor it
    for (let y1 = this._y -1; y1 <= this._y + 1; y1++) {
      for (let x1 = this._x -1; x1 <= this._x + 1; x1++) {
        if (this._subMap.pointInBounds(x1, y1)) {
          if (this._subMap.getHeightAt(x1, y1) != this._height) {
            return false;
          }
        }
      }
    }

    // can't build on mineral heavy square:
    return (this._minerals == 0);
  },

  get raisable() {
    // means raisable/lowerable
    if (this._subMap.isIndoor) {
      return false; // can't raise/lower in an indoor map!
    }

    if (this._isWater) {
      return false;
    }

    // Can't raise/lower a square that already has a building...
    for (let i = 0; i < this._bldgs.length; i++) {
      if (!this._bldgs[i].buildable) {
        return false;
      }
    }
    return true;
  },

  get minerals() {
    return this._minerals;
  },

  setMinerals: function(newMin) {
    this._minerals = newMin;
  },

  get sunlight() {
    // calculate sunlight hitting square:
    let sunlight = 5 + this._height;
    let x = this._x;
    let y = this._y;
    // reduced for any square higher than me:
    if (this._subMap.getHeightAt(x +1, y) > this._height) {
      sunlight -= 1;
    }
    if (this._subMap.getHeightAt(x -1, y) > this._height) {
      sunlight -= 1;
    }
    if (this._subMap.getHeightAt(x, y+1) > this._height) {
      sunlight -= 1;
    }
    if (this._subMap.getHeightAt(x, y-1) > this._height) {
      sunlight -= 1;
    }
    return sunlight;
  },

  get moisture() {
    return this._moisture;
  },

  handleClick: function(player) {
    return false;
  },

  _pickImageForTerrain: function(tileset) {
    /* Something that's slightly wonky about my current icon set is
     * that due to the 'fake 3d' hill drawings, the cliff-to-south
     * images imply a whole square of impassible terrain while
     * cliff-to-north/east/west do not.  If the heightmap-generating
     * algorithm doesn't treat n/e/w/s differently, this is going to
     * result in pathing problems.  Would be easier to wrangle if
     * either all directions implied an impassible square or if none
     * of them did.*/

    let subMap = this._subMap;
    let x = this._x;
    let y = this._y;
    let dropEast = subMap.neighborIsBelowMe(x, y, x + 1, y);
    let dropWest = subMap.neighborIsBelowMe(x, y, x - 1, y);
    let dropNorth = subMap.neighborIsBelowMe(x, y, x, y - 1);
    let dropSouth = subMap.neighborIsBelowMe(x, y, x, y + 1);

    switch (tileset) {
    case "indoor":
      return this.getIndoorImage(dropEast, dropWest, dropNorth, dropSouth);
      break;
    case "outdoor":
      return this.getOutdoorImage(dropEast, dropWest, dropNorth, dropSouth);
      break;
    }
    return "";
  },

  resetImage: function(tileset) {
    this._imgSrc = this._pickImageForTerrain(tileset);
  },

  addBuilding: function(building) {
    this._bldgs.push(building);
    // add this building to a list, and then apply its
    // .enterable, .buildable, .handleClick, and .onEnter methods to this square.
  },

  getBuildings: function() {
    return this._bldgs;
  },

  getIndoorImage: function(dropEast, dropWest, dropNorth, dropSouth) {
    let imgName;
    if (this._subMap.getHeightAt(this._x, this._y) == -1) {
      imgName = "nothing";
    } else if (dropEast && dropWest) {
      imgName = "interior_wall_ns";
    } else if (dropNorth && dropSouth) {
      imgName = "interior_wall_ew";
    } else if (dropWest && dropSouth) {
      imgName = "interior_wall_en";
    } else if (dropWest && dropNorth) {
      imgName = "interior_wall_es";
    } else if (dropEast && dropSouth) {
      imgName = "interior_wall_wn";
    } else if (dropNorth && dropEast) {
      imgName = "interior_wall_ws";
    } else {
      imgName = "tech_floor";
    }
    return "images/buildings/" + imgName + ".png";
  },

  getOutdoorImage: function(dropEast, dropWest, dropNorth, dropSouth) {
    let imgName;
    let subMap = this._subMap;
    let x = this._x;
    let y = this._y;

    if (this._isWater) {
      return "images/xenobiosphere/water.png";
    }

    if (dropEast && dropWest && dropNorth && dropSouth) {
	if (dropEast == 1 && dropWest == 1 && dropNorth == 1 &&
	    dropSouth == 1) {
	    imgName = "hill";
	} else {
          imgName = "peak";
	}
    } else if (dropEast && !dropWest && !dropNorth && !dropSouth) {
      imgName = "cliff-east";
    } else if (!dropEast && dropWest && !dropNorth && !dropSouth) {
      imgName = "cliff-west";
    } else if (!dropEast && !dropWest && dropNorth && !dropSouth) {
      imgName = "cliff-north";
    } else if (!dropEast && !dropWest && !dropNorth && dropSouth) {
      if (dropSouth == 1) {
        imgName = "hill-south";
      } else {
        imgName = "cliff-south";
      }
    } else if (dropEast && dropNorth && !dropWest && !dropSouth) {
      imgName = "cliff-northeast";
    } else if (!dropEast && dropNorth && dropWest && !dropSouth) {
      imgName = "cliff-northwest";
    } else if (dropEast && !dropNorth && !dropWest && dropSouth) {
	if (dropSouth == 1) {
	    imgName = "hill-southeast";
	} else {
	    imgName = "cliff-southeast";
	}
    } else if (!dropEast && !dropNorth && dropWest && dropSouth) {
	if (dropSouth == 1) {
	    imgName = "hill-southwest";
	} else {
	    imgName = "cliff-southwest";
	}
    } else if (!dropEast && dropNorth && dropWest && dropSouth) {
	if (dropWest == 1) {
	    imgName = "hill-pen-west";
	} else {
	    imgName = "cliff-pen-west";
	}
    } else if (dropEast && dropNorth && !dropWest && dropSouth) {
	if (dropEast == 1) {
	    imgName = "hill-pen-east";
	} else {
	    imgName = "cliff-pen-east";
	}
    } else if (dropEast && dropNorth && dropWest && !dropSouth) {
      imgName = "cliff-pen-north";
    } else if (dropEast && !dropNorth && dropWest && dropSouth) {
      if (dropSouth == 1) {
        imgName = "hill-pen-south";
      } else {
        imgName = "cliff-pen-south";
      }
    } else if (dropEast && !dropNorth && dropWest && !dropSouth) {
      imgName = "cliff-eastwest";
    } else if (!dropEast && dropNorth && !dropWest && dropSouth) {
	if (dropNorth == 1 && dropSouth == 1) {
	    imgName = "hill-northsouth";
	} else {
	    imgName = "cliff-northsouth";
	}
    } else {
      if (subMap.neighborIsBelowMe(x, y, x + 1, y-1)) {
        imgName = "cliff-inner-southwest";
      }else if (subMap.neighborIsBelowMe(x, y, x + 1, y+1) > 1) {
        imgName = "cliff-inner-northwest";
      } else if (subMap.neighborIsBelowMe(x, y, x + 1, y+1) == 1) {
        imgName = "hill-inner-northwest";
      } else if (subMap.neighborIsBelowMe(x, y, x - 1, y-1)) {
        imgName = "cliff-inner-southeast";
      } else if (subMap.neighborIsBelowMe(x, y, x - 1, y+1) > 1) {
        imgName = "cliff-inner-northeast";
      } else if (subMap.neighborIsBelowMe(x, y, x - 1, y+1) == 1) {
        imgName = "hill-inner-northeast";
      } else {
        if (this._minerals > 0 ) {
          imgName = "plains-resource";
        } else {
          imgName = "plains" + Math.abs(((y * y - 2 * x) % 7) % 5);
        }
      }
    }
    return "images/xenobiosphere/" + imgName + ".png";
  },

  onEnter: function(player) {
    // do something if player steps here?
    for (let i = 0; i < this._bldgs.length; i++) {
      this._bldgs[i].onEnter(player);
    }
  }
};


// Global singleton instance:

//var WorldMapManager = new MapManager()
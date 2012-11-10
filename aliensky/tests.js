/* Unit test suite*/

// World Map Tests
TestsAhoy.register(
  {
    setUp: function() {
        let heightMap = [
    [0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 1, 1, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 1, 1, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0],
    [0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0]
  ];

  let resourceMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 7, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 7, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  let moistureMap = [
    [0, 0, 0, 0, 1, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [1, 1, 0, 0, 1, 1, 2, 3, 3, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 1, 1, 1, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 1, 1, 2, 2, 2, 1, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 2, 2, 1, 2, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [1, 1, 0, 0, 1, 1, 2, 3, 3, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 1, 1, 1, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 1, 1, 2, 2, 2, 1, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 2, 2, 1, 2, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1],
    [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 2, 2, 1]
  ];
      this.worldMap = new WorldMap(heightMap, resourceMap, moistureMap);
    },

    testMapProperties: function() {
      TestsAhoy.assertEqual(this.worldMap.xLimit, 20);
      TestsAhoy.assertEqual(this.worldMap.yLimit, 20);
      TestsAhoy.assertEqual(this.worldMap.getCurrentSubMapId(), 0);
      TestsAhoy.assertTrue(this.worldMap.pointInBounds(0, 0));
      TestsAhoy.assertTrue(this.worldMap.pointInBounds(19, 19));
      TestsAhoy.assertFalse(this.worldMap.pointInBounds(-1, 0));
      TestsAhoy.assertFalse(this.worldMap.pointInBounds(0, 20));
    },

    testMapScroll: function() {

    },

    testSubMaps: function() {
      let indoorMap = [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 1, 1]];
      let subMapId = this.worldMap.addSubMap(indoorMap);
      TestsAhoy.assertEqual(subMapId, 1, "Id should be 1");

      let subMap = this.worldMap.getSubMap(subMapId);

      TestsAhoy.assertEqual(subMap.getHeightAt(0, 0), 1, "Height here should be 1");
      TestsAhoy.assertEqual(subMap.getMineralsAt(0, 0), 0, "Should be 0 minerals");
      TestsAhoy.assertEqual(subMap.getMoistureAt(0, 0), 0, "Should be 0 moisture");

      this.worldMap._currentSubMap = subMapId;
      TestsAhoy.assertEqual(this.worldMap.xLimit, 4, "Submap limit should be 4");
      TestsAhoy.assertEqual(this.worldMap.yLimit, 4, "Submap limit should be 4");

      this.worldMap._currentSubMap = 0;
      TestsAhoy.assertEqual(this.worldMap.xLimit, 20);
      TestsAhoy.assertEqual(this.worldMap.yLimit, 20);
    },

    testPutBuilding: function() {
      let habUnit = new Building("hab_unit");
      let result = this.worldMap.putBuilding(0, 18, 19, habUnit);
      TestsAhoy.assertFalse(result, "shouldn't be able to build there");

      TestsAhoy.assertTrue(this.worldMap.getSquareAt(2, 4).buildable,
                           "Square should be buildable.");
      result = this.worldMap.putBuilding(0, 2, 4, habUnit);
      TestsAhoy.assertTrue(result, "should be able to build there");

      TestsAhoy.assertEqualArrays(
        this.worldMap.getSquareAt(2, 4).getBuildings(),
        [habUnit], "Square should contain hab unit.");
      TestsAhoy.assertFalse(this.worldMap.getSquareAt(2, 4).buildable,
                           "Square should no longer be buildable.");

      TestsAhoy.assertEqual(habUnit.x, 2);
      TestsAhoy.assertEqual(habUnit.y, 4);
      TestsAhoy.assertEqual(habUnit._mapSquare,
                            this.worldMap.getSquareAt(2, 4),
                           "Building should know what square it's on");
    },

    // Methods of WorldMap that still need testing:

    tearDown: function() {
    }
  });


// Building electric/water connectivity tests
TestsAhoy.register(
  {
    setUp: function() {
      let heightMap = [[0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0],
                       [0, 0, 0, 0]];
      let resourceMap = heightMap;
      let moistureMap = heightMap;
      this.worldMap = new WorldMap(heightMap, resourceMap, moistureMap);
    },

    testCircuitMerge: function() {
      let solarCell = new Building("solar_cell_2");
      this.worldMap.putBuilding(0, 0, 0, solarCell);
      solarCell.setElecWaterProperties(0, 0, 1, 0);
      gBuildingManager.registerBldg(solarCell);
      TestsAhoy.assertEqual(solarCell.elecSupply, 1, "should have 1 supply");
      TestsAhoy.assertEqual(solarCell.elecCircuitId, 0, "should be circuit 0");

      let habUnit = new Building("hab_unit");
      this.worldMap.putBuilding(0, 2, 0, habUnit);
      habUnit.setElecWaterProperties(0, 0, 0, 1);
      gBuildingManager.registerBldg(habUnit);
      TestsAhoy.assertEqual(habUnit.elecDemand, 1, "should have 1 demand");
      TestsAhoy.assertEqual(habUnit.elecCircuitId, 1, "should be circuit 1");

      let wire = new Connection("wire");
      this.worldMap.putBuilding(0, 1, 0, wire);
      gBuildingManager.registerBldg(wire);
      TestsAhoy.assertEqual(solarCell.elecCircuitId, 0, "solar cell circuit should be merged");
      TestsAhoy.assertEqual(habUnit.elecCircuitId, 0, "habunit circuit should be merged");
      TestsAhoy.assertEqual(wire.elecCircuitId, 0, "wire circuit should be merged");

      TestsAhoy.assertEqual(gBuildingManager.elecCircuits[0].totalSupply, 1,
                           "merged circuit should have 1 supply");
      TestsAhoy.assertEqual(gBuildingManager.elecCircuits[0].totalDemand, 1,
                           "merged circuit should have 1 demand");

      TestsAhoy.assertEqual(gBuildingManager.elecCircuits.length, 1,
                            "Other circuit should be gone now.");
    },

    // TODO test the rare edge case of merging 3 circuits with one connector
      // (Even 4 circuits is possible)

    tearDown: function() {
    }

  });

function doSomeStuff(callback) {
  callback(5);
}

TestsAhoy.register(
  {
    setUp: function() {
      this.foo = 2;
    },

    testAsyncTests: function() {
      let self = this;

      TestsAhoy.addAsyncCheck(function() {
        doSomeStuff( function(data) {
          TestsAhoy.assertEqual(data, 5);
          TestsAhoy.assertEqual(self.foo, 2);
          TestsAhoy.proceed();
        });
      });
      TestsAhoy.addAsyncCheck(function() {
        doSomeStuff( function(data) {
          TestsAhoy.assertDefined(data);
          TestsAhoy.assertEqual(self.foo, 2);
          TestsAhoy.proceed();
        });
      });
    },

    tearDown: function() {
    }
  });
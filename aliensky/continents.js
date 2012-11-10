const width = 100;
const height = 100;


function getValueFromRadio( radioName ) {
  let elems = document.getElementsByTagName( "input" );
  for each ( let elem in elems ) {
    if (elem.name == radioName && elem.checked == true) {
      return elem.value;
    }
  }
  return 1.0;
}

function smooth( bigArray, numTimes ) {
  let x, y;

  for (let t = 0; t < numTimes; t++) {
    let newBigArray = [];
    for (y = 0; y < height; y++) {
      newBigArray.push( [] );
      for ( x = 0; x < height; x++) {
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

function fault( bigArray, amplitude, length, numTimes ) {
  let x, y, z, dx, dy, duration;
  for (let t= 0; t< numTimes; t++) {
    x = Math.random() * width;
    y = Math.random() * height;
    z = amplitude * (Math.random() - 0.5);
    dx = 2* (Math.random() - 0.5);
    dy = 2 * (Math.random() - 0.5);
    duration = length * ( Math.random() * 20 + Math.random() * 20 );
    for (let i = 0; i < duration; i ++ ) {
      let intx = parseInt(Math.floor(x));
      let inty = parseInt(Math.floor(y));
      if (intx > width - 1) {
        intx = width - 1;
      }
      if (inty > height - 1) {
        inty = height - 1;
      }
      if (intx < 0 ) {
        intx = 0;
      }
      if (inty < 0 ) {
        inty = 0;
      }
      bigArray[inty][intx] = bigArray[inty][intx] + z;
      x += dx;
      y += dy;
      if (x < 0 ) {
        x += width;
      }
      if (x > width -1 ) {
        x -= width;
      }
      if (y < 0 ) {
        y += height;
      }
      if (x > width -1 ) {
        y -= height;
      }
    }
  }
  return bigArray;
}

function spike( bigArray, amplitude, numTimes ) {
  let x, y, z;

  for (let t= 0; t< numTimes; t++) {
    x = Math.floor( Math.random() * width );
    y = Math.floor( Math.random() * height );
    z = amplitude * (Math.random() - 0.5);
    bigArray[y][x] = bigArray[y][x] + z;
  }
  return bigArray;
}

function shake( bigArray, amplitude ) {
  let x, y, z;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      bigArray[y][x] += amplitude * (Math.random() - 0.5);
    }
  }
  return bigArray;
}

function bias( bigArray, amplitude ) {
  let x, y, z;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      bigArray[y][x] += amplitude;
    }
  }
  return bigArray;
}

function eraseOldTable(elementId) {
  let elem = document.getElementById( elementId );
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function doStuff( elementId ) {
  document.getElementById('msg').innerHTML = "Now working.  Please be patient...";
  window.setTimeout(function() {
                      makeContinents(elementId);
                    }, 500);
  eraseOldTable(elementId);
}

function makeContinents( elementId ) {
  let noise = getValueFromRadio("noise");
  let volcanic = getValueFromRadio("volcanic");
  let erosion = getValueFromRadio("erosion");
  let seaLevel = getValueFromRadio("sea");
  let faults = getValueFromRadio("fault");

  let elem = document.getElementById( elementId );
  let bigArray = [];
  let x, y;
  for (y = 0; y < height; y++) {
    bigArray.push( [] );
    for (x = 0; x < width; x++) {
      bigArray[y][x] = 0; //Math.random();
    }
  }

  bigArray = fault(bigArray, faults, 3 * faults, 5 * faults );
  bigArray = shake(bigArray, 2 * noise);
  bigArray = spike(bigArray, 100 * volcanic, 2 * volcanic);
  bigArray = smooth(bigArray, 20 * erosion);
  bigArray = shake(bigArray, 1 * noise);
  bigArray = spike(bigArray, 20 * volcanic, 10 * volcanic);
  bigArray = smooth(bigArray, 10 * erosion);
  bigArray = shake(bigArray, 0.5 * noise);
  bigArray = spike(bigArray, 10 * volcanic, 20 * volcanic);
  bigArray = fault(bigArray, faults, faults, 20 * faults );
  bigArray = smooth(bigArray, 5 * erosion);
  bigArray = spike(bigArray, 5 * volcanic, 50 * volcanic);
  bigArray = smooth(bigArray, 2 * erosion);
  bigArray = spike(bigArray, 1 * volcanic, 100 * volcanic);
  bigArray = smooth(bigArray, 1 * erosion);

  // Bias based on sea level:
  bigArray = bias(bigArray, (1.0 - seaLevel));


  for (y = 0; y < height; y++) {
    let row = document.createElement("tr");
    elem.appendChild(row);
    for (x = 0; x < width; x++) {
      let cell = document.createElement("td");
      //cell.innerHTML = bigArray[y][x];
      cell.width = "5px";
      cell.height = "5px";
      let z = bigArray[y][x];
      if (z > 0.2) {
        cell.setAttribute("class", "ice");
      } else if (z > 0.08) {
        cell.setAttribute("class", "mountain");
      } else if (z > 0.06) {
        cell.setAttribute("class", "upland");
      } else if (z > 0.04) {
        cell.setAttribute("class", "grass");
      } else if (z > 0) {
        cell.setAttribute("class", "swamp");
      } else if (z > -0.1) {
        cell.setAttribute("class", "water");
      } else {
        cell.setAttribute("class", "deepwater");
      }
      row.appendChild(cell);

    }
  }
  document.getElementById( "msg" ).innerHTML = "Ta-daaa!";
}
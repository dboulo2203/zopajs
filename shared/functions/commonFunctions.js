
/**
 * Get a json string array (yeshe backend format) and convert to an array
 * @param {*} jsonString 
 * @returns 
 */
export function getArrayFromjson(jsonString) {
  let newArray = [];
  let index = 0;
  let endLoop = false;
  if (jsonString) {
    do {
      if (jsonString[index]) {
        newArray.push(jsonString[index]);
      } else {
        endLoop = true;
      }
      ++index;
    } while (!endLoop);
  }
  return newArray;
}

/**
 * NOt used
 * @param {*} n 
 * @returns 
 */
const secondsToMidnight = (n) => {
  return (
    ((24 - n.getHours() - 1) * 60 * 60) + ((60 - n.getMinutes() - 1) * 60) + (60 - n.getSeconds())
  )
}

/**
 * 
 * @returns Get current app path http://host/app
 */
export function getAppPath() {
  let appName = '';
  var path = location.pathname.split('/');
  if (path[0] == "")
    appName = path[1]
  else
    appName = path[0]

  return window.location.protocol + "//" + window.location.hostname + '/' + appName;

}

/**
 * Add an event listened  to  a list of HTML document (by class name)
 * @param {*} elementClass  : the .XXXX class identifier of the element list 
 * @param {*} functionOfEvent  = the function used when the event is fired
 */
export function addMultipleEnventListener(elementClass, functionOfEvent) {
  const cbox = document.querySelectorAll(elementClass);
  for (let i = 0; i < cbox.length; i++) {
    cbox[i].addEventListener("click", functionOfEvent);


  }
}

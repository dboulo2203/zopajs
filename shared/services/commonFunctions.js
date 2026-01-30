
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
  // let appName = '';
  var path = location.pathname.split('/');
  const found = path.indexOf('views');
  if (found === 2)
    return window.location.protocol + "//" + window.location.hostname + '/' + path[1];
  else
    return window.location.protocol + "//" + window.location.hostname;
}

/**
 * 
 * @returns Get current app path http://host/app
 * @deprecated
 */
export function getAppPathRemote() {
  let appName = '';
  var path = location.pathname.split('/');
  if (path[0] == "")
    appName = path[1]
  else
    appName = path[0]

  return window.location.protocol + "//" + window.location.hostname + '/';

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

// /**
//  * Parse a markdown string and return the HTML
//  * @param  text : string to parse
//  * @returns string
//  */
// export function parseMarkdown(text) {
//   // const markdownParser = (text) => {
//   const toHTML = text
//     .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
//     .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
//     .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
//     .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
//     .replace(/\*(.*)\*/gim, '<i>$1</i>'); // italic text
//   return toHTML.trim(); // using trim method to remove whitespace
// }



/**
 * Re route the page demending on
 * @param {} link 
 * @param {*} withctrl 
 */
export function getLinkWithctrl(link, withctrl) {
  if (withctrl)
    window.open(link, '_blank');
  else
    window.location.href = link;
}

/**
 * Retunrs a link to a class of entity
 * @param {*} buttonType 
 * @param {*} entityName 
 * @param {*} searId 
 * @param {*} withUnderline allow to display an underline
 * @returns 
 */
export function getEntityLinkClass(buttonType, entityName, searId, withUnderline = true) {
  if (!withUnderline === false)
    return `<span class="text-danger-emphasis ${buttonType}" style="cursor:pointer"  searid="${searId}" 
  onpointerenter="this.setAttribute('style', 'cursor:pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid  rgb(159, 158, 158)')" 
  onpointerleave="this.setAttribute('style', 'color:text-danger-emphasis')">
        ${entityName === null ? '' : entityName}
    </span>`;
  else
    return `<span class="text-danger-emphasis ${buttonType}" style="cursor:pointer"  searid="${searId}" 
  onpointerenter="this.setAttribute('style', 'cursor:pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid  rgb(159, 158, 158)')" 
  onpointerleave="this.setAttribute('style', 'color:text-danger-emphasis')">
        ${entityName === null ? '' : entityName}
    </span>`;
}

/**
 * Retunrs a link to an entity
 * @param { } buttonType 
 * @param {*} entityName 
 * @param {*} withUnderline  allow to display an underline
 * @returns 
 */
export function getEntityLink(buttonType, entityName, withUnderline = true) {
  if (!withUnderline === false)
    return `<span class="text-danger-emphasis" style="cursor: pointer" 
    id="${buttonType}" onpointerenter="this.setAttribute('style', 'cursor: pointer;color: rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158)')" 
    onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;')">
        ${entityName === null ? '' : entityName}
    </span>`;
  else
    return `<span class="text-danger-emphasis" style="cursor: pointer" 
    id="${buttonType}" onpointerenter="this.setAttribute(color:rgb(159, 158, 158); border-bottom: 0.1em solid rgb(159, 158, 158);cursor: pointer')"
     onpointerleave="this.setAttribute('style', 'color: text-danger-emphasis;'))">
        ${entityName === null ? '' : entityName}
    </span>`;
}



/**
 * Retunrs a link to a class of entity
 * @param {*} buttonType 
 * @param {*} entityName 
 * @param {*} searId 
 * @param {*} withUnderline allow to display an underline
 * @returns 
 */
export function getEntityLinkClassV1(buttonType, entityName, searId, withUnderline = true) {
  if (!withUnderline === false)
    return `<span style="cursor:pointer; border-bottom: 0.1em solid #dddbdbff" class="${buttonType}" searid="${searId}" 
  onpointerenter="this.setAttribute('style', 'cursor:pointer;color: #8B2331;border-bottom: 0.1em solid #8B2331')" 
  onpointerleave="this.setAttribute('style', 'color: bs-body-color;border-bottom: 0.1em solid #dddbdbff')">
        ${entityName === null ? '' : entityName}
    </span>`;
  else
    return `<span style="cursor:pointer" class="${buttonType}" searid="${searId}" 
  onpointerenter="this.setAttribute('style', 'cursor:pointer;color: #8B2331;border-bottom: 0.1em solid #8B2331')" 
  onpointerleave="this.setAttribute('style', 'color: bs-body-color')">
        ${entityName === null ? '' : entityName}
    </span>`;
}
/**
 * Retunrs a link to an entity
 * @param { } buttonType 
 * @param {*} entityName 
 * @param {*} withUnderline  allow to display an underline
 * @returns 
 */
export function getEntityLinkV1(buttonType, entityName, withUnderline = true) {
  if (!withUnderline === false)
    return `<span style="cursor: pointer; border-bottom: 0.1em solid #dddbdbff" 
    id="${buttonType}" onpointerenter="this.setAttribute('style', 'color: #8B2331;border-bottom: 0.1em solid #8B2331;cursor:pointer')" 
    onpointerleave="this.setAttribute('style', 'color: bs-body-color;border-bottom: 0.1em solid #dddbdbff')">
        ${entityName === null ? '' : entityName}
    </span>`;
  else
    return `<span style="cursor: pointer" 
    id="${buttonType}" onpointerenter="this.setAttribute('style', 'color: #8B2331;cursor:pointer')" onpointerleave="this.setAttribute('style', 'color: bs-body-color')">
        ${entityName === null ? '' : entityName}
    </span>`;
}



export function encodeHTML(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, function (m) { return map[m]; });
}


/**
 * Find tibetan characters in a string and enclose the string in a <span>
 * @param {} text 
 * @returns 
 */
export function findTibetanChars(text) {
  const tibetanRegex = /[\u0F00-\u0FFF]+/g;
  let output = '';
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }
  const matches = text.match(tibetanRegex);

  if (Array.isArray(matches)) {
    matches.forEach((matche) => {
      text = text.replace(matche, "<span class='tibetanChars'>" + matche + "</span>")
    });
  } else {
    text = text.replace(matches, "<span class='tibetanChars'>" + matches + "</span>")
  }
  return text; // Return empty array if no matches
}
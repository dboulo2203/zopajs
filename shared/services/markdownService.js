
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
 * Parse a markdown string and return the HTML
 * @deprecated
 * @param  text : string to parse
 * @returns string
 */
export function parseMarkdown(text) {
    // const markdownParser = (text) => {
    const toHTML = text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
        .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
        .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
        .replace(/\*(.*)\*/gim, '<i>$1</i>'); // italic text
    return toHTML.trim(); // using trim method to remove whitespace
}

export function simpleMarkdown(mdText) {

    // first, handle syntax for code-block
    mdText = mdText.replace(/\r\n/g, '\n');
    mdText = mdText.replace(/\n~~~ *(.*?)\n([\s\S]*?)\n~~~/g, '<pre><code title="$1">$2</code ></pre > ')
    mdText = mdText.replace(/\n``` *(.*?)\n([\s\S]*?)\n```/g, '<pre><code title="$1">$2</code></pre>')

    // split by "pre>", skip for code-block and process normal text
    var mdHTML = ''
    var mdCode = mdText.split('pre>')

    for (var i = 0; i < mdCode.length; i++) {
        if (mdCode[i].substr(-2) == '</') {
            mdHTML += '<pre>' + mdCode[i] + 'pre>'
        } else {
            mdHTML += mdCode[i].replace(/(.*)<$/, '$1')
                .replace(/^##### (.*?)\s*#*$/gm, '<h5>$1</h5>')
                .replace(/^#### (.*?)\s*#*$/gm, '<h4 id="$1">$1</h4>')
                .replace(/^### (.*?)\s*#*$/gm, '<h3 id="$1">$1</h3>')
                .replace(/^## (.*?)\s*#*$/gm, '<h2 id="$1">$1</h2>')
                .replace(/^# (.*?)\s*#*$/gm, '<h1 id="$1">$1</h1>')
                .replace(/^-{3,}|^\_{3,}|^\*{3,}/gm, '<hr/>')
                .replace(/``(.*?)``/gm, '<code>$1</code>')
                .replace(/`(.*?)`/gm, '<code>$1</code>')
                .replace(/^\>> (.*$)/gm, '<blockquote><blockquote>$1</blockquote></blockquote>')
                .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
                .replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>')
                .replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>')
                .replace(/!\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<img alt="$1" src="$2" $3 />')
                .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" />')
                .replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
                .replace(/<http(.*?)\>/gm, '<a href="http$1">http$1</a>')
                .replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
                .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
                .replace(/^[\*|+|-][ |.](.*)/gm, '<ul><li>$1</li></ul>').replace(/<\/ul\>\n<ul\>/g, '\n')
                .replace(/^\d[ |.](.*)/gm, '<ol><li>$1</li></ol>').replace(/<\/ol\>\n<ol\>/g, '\n')
                .replace(/\*\*\*(.*)\*\*\*/gm, '<b><em>$1</em></b>')
                .replace(/\*\*(.*)\*\*/gm, '<b>$1</b>')
                .replace(/\*([\w \d]*)\*/gm, '<em>$1</em>')
                .replace(/___(.*)___/gm, '<b><em>$1</em></b>')
                .replace(/__(.*)__/gm, '<u>$1</u>')
                .replace(/_([\w \d]*)_/gm, '<em>$1</em>')
                .replace(/~~(.*)~~/gm, '<del>$1</del>')
                .replace(/\^\^(.*)\^\^/gm, '<ins>$1</ins>')
                .replace(/ +\n/g, '\n<br/>')
                .replace(/\n\s*\n/g, '\n<p>\n')
                .replace(/^ {4,10}(.*)/gm, '<pre><code>$1</code></pre>')
                .replace(/^\t(.*)/gm, '<pre><code>$1</code></pre>')
                .replace(/<\/code\><\/pre\>\n<pre\><code\>/g, '\n')
                .replace(/\\([`_\\\*\+\-\.\(\)\[\]\{\}])/gm, '$1')
        }
    }

    return mdHTML.trim()
}



export function loadFile(filePath) {
    var result = null;
    var xmlhttp = new HttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

export async function loadFileFetch(filePath) {
    // let myObject = await fetch(filePath);
    // let myText = await myObject.text();

    let responsefr = await fetch(filePath);

    if (responsefr.ok) {
        // *** Get the data and save in the sessionStorage
        const data = await responsefr.text();

        return (data);

    } else {
        console.log(`loadFileFetch Error : ${JSON.stringify(responsefr)}`);
        throw new Error("loadFileFetch Error message : " + responsefr.status + " " + responsefr.statusText);
    }

    return myText.value;
}
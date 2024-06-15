function loadChildrenMap(map, elementOrId) {
    if(!(map instanceof Map)) {
        throw new Error("Document util get children array should not be null.");
    }
    let element;
    if(typeof elementOrId === "object") {
        element = elementOrId;
    } else if(typeof elementOrId === "string") {
        element = document.getElementById(elementOrId);
    } else {
        throw new Error("Document util get children element or id should not be null.");
    }
    for (const child of element.children) {
        const keyObj = child.dataset;
        if(Object.keys(keyObj).length > 0) {
            map.set(keyObj, child);
        }
        if (element.hasChildNodes()) {
            loadChildrenMap(map, child);
        }
    }
}

function fetchHtmlDocument(url, targetNodeOrId) {
    fetch(url).then(function(res) {
        return res.text();
    }).then(function(text) {
        if(typeof targetNodeOrId === "string") {
            document.getElementById(targetNodeOrId).innerHTML = text;
        } else if(typeof targetNodeOrId === "object") {
            targetNodeOrId.innerHTML = text;
        } else {
            console.log("Fetch html document invalid : " + targetNodeOrId);
        }
    });
}

function fetchHtmlToDataUrl(elementOrId) {
    const elementMap = new Map();
    loadChildrenMap(elementMap, elementOrId);
    elementMap.forEach(function (ele, key) {
         if(typeof key['url'] === "string") {
             fetchHtmlDocument(key['url'], ele);
         }
    });
}

function doPrintPreviewActionEvent(contentNode) {
    const prefix = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LTA - BTDS - Project</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="../favicon.ico">
    <link rel="stylesheet" href="css/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="css/paper-css/0.4.1/paper.css">
    <link rel="stylesheet" href="css/paper-css/0.4.1/paper-custom.css">
    <link rel="stylesheet" href="css/doc.css">
</head>
<body>`;

    const aLink = window.open('', '', 'height=500, width=500');
    aLink.document.write(prefix);
    aLink.document.write(contentNode.innerHTML);
    aLink.document.write('</body></html>');
    aLink.document.close();
}

function performPrintPreviewWindow(actionId, contentId) {
    if(typeof actionId !== "string") {
       throw new Error('performPrintPreviewWindow action id null');
    }
    if(typeof contentId !== "string") {
        throw new Error('performPrintPreviewWindow content id null');
    }
    const actionNode = document.getElementById(actionId);
    actionNode.addEventListener('click', function (evt) {
        evt.preventDefault();
        const contentNode = document.getElementById(contentId);
        doPrintPreviewActionEvent(contentNode);
    });
}
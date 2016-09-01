/*
 * This is a quick script to align within the page -- if this can be
 * done without javascript I would be ecstatic!!!
 */

var refClass = "footref"
var defClass = "footdef"

var cumulativeOffset = function(element) {
    // stolen from prototype.js
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};

function repositionFootnotes() {
    var refs  = document.getElementsByClassName("footref")
    var definitions = document.getElementsByClassName("footdef")

    if (refs.length !== definitions.length) {
        console.error("Could not uniformly assign refs -> defs, aborting")
        return
    }

    var lastBottom = 0;
    var eltAbsoluteTop;
    for (var i = 0; i < definitions.length; i++) {
        var ref = refs[i]
        var def = definitions[i]
        var top = cumulativeOffset(ref).top
        def.className += " footnote-definition"
        eltAbsoluteTop = (top > lastBottom) ? top : lastBottom
        def.style.top = eltAbsoluteTop + "px"
        lastBottom = eltAbsoluteTop + def.scrollHeight
    }


    removeFootnoteHeader()
}

function removeFootnoteHeader() {
    var bottomNotes = document.querySelector("h2.footnotes");
    if (bottomNotes) {
        bottomNotes.remove();
    }
}

if (window.innerWidth >= 1024) {
    window.addEventListener("load", repositionFootnotes)
}

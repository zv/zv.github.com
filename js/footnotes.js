"use strict";

/*
 * This is a quick script to align within the page -- if this can be
 * done without javascript I would be ecstatic!!!
 */


/*
  Moves each footnote to it's 'correct' layout position by doing the following:
    For each footnote definition:
      - calculate a footnote definition's position from the top
      - lookup corresponding footnote reference, add an appropriate style & 'position: top'
      - remove footnote reference from footer
     Hide footnote container
 */
export default function reposition_footnotes(refSelector = "footref", defSelector = "footdef") {
    var refs  = document.getElementsByClassName(refSelector)
    var definitions = document.getElementsByClassName(defSelector)

    if (refs.length !== definitions.length) {
        console.error("Could not uniformly assign footref -> footdef, aborting")
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

/*
 * Calculates the total offset from the top of the page.
 */
function cumulativeOffset(element) {
    // stolen from prototype.js
    var top = 0, left = 0
    do {
        top += element.offsetTop  || 0
        left += element.offsetLeft || 0
        element = element.offsetParent
    } while(element)

    return {
        top: top,
        left: left
    }
}

/*
 * Find and remove a footnote from the footer of the page (where footnotes live
 * prior to repositioning)
 */
function removeFootnoteHeader(selector = "h2.footnotes") {
    var bottomNotes = document.querySelector(selector)
    if (bottomNotes) {
        bottomNotes.remove()
    }
}

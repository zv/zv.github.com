/*
 * This is a quick script to align within the page -- if this can be
 * done without javascript I would be ecstatic!!!
 */

// builtin org-mode footnote reference classes
var refClass = "footref"
var defClass = "footdef"

/*
 * Calculates the total offset from the top of the page.
 */
var cumulativeOffset = function(element) {
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
  Moves each footnote to it's 'correct' layout position by doing the following:
    For each footnote definition:
      - calculate a footnote definition's position from the top
      - lookup corresponding footnote reference, add an appropriate style & 'position: top'
      - remove footnote reference from footer
     Hide footnote container
 */
function repositionFootnotes() {
    var refs  = document.getElementsByClassName("footref")
    var definitions = document.getElementsByClassName("footdef")

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
 * Find and remove a footnote from the footer of the page (where footnotes live
 * prior to repositioning)
 */
function removeFootnoteHeader() {
    var bottomNotes = document.querySelector("h2.footnotes")
    if (bottomNotes) {
        bottomNotes.remove()
    }
}

if (window.innerWidth >= 1024) {
    window.addEventListener("load", repositionFootnotes)
}

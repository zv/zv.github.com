/*
 * This is a quick script to align within the page -- if this can be
 * done without javascript I would be ecstatic!!!
 */

export type ElementCollection = HTMLCollectionOf<HTMLElement>

/*
  Moves each footnote to it's 'correct' layout position by doing the following:
    For each footnote definition:
      - calculate a footnote definition's position from the top
      - lookup corresponding footnote reference, add an appropriate style & 'position: top'
      - remove footnote reference from footer
     Hide footnote container
 */
export const reposition_footnotes = (refNode: HTMLCollectionOf<HTMLElement>, defNode: HTMLCollectionOf<HTMLElement>) => {
  let refs = refNode;
  let definitions = defNode;

  if (refs.length !== definitions.length) {
    throw new Error("Could not uniformly assign footref -> footdef, aborting")
  }

  let lastBottom = 0;
  let eltAbsoluteTop;
  for (let i = 0; i < definitions.length; i++) {
    let ref = refs[i]
    let def = definitions[i]
    let top = cumulativeOffset(ref).top
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
const cumulativeOffset = (element: HTMLElement) => {
  // stolen from prototype.js
  let top = 0, left = 0
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent as HTMLElement
  } while (element)

  return {
    top: top,
    left: left
  }
}

/*
 * Find and remove a footnote from the footer of the page (where footnotes live
 * prior to repositioning)
 */
const removeFootnoteHeader = (selector = "h2.footnotes") => {
  let bottomNotes = document.querySelector(selector)
  if (bottomNotes) {
    bottomNotes.remove()
  }
}

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
export const repositionFootnotes = (refNodes: HTMLCollectionOf<HTMLElement>) => {
  let lastBottom = 0;
  let eltAbsoluteTop;

  for (let ref of Array.from(refNodes)) {
    const def = findDefinition(ref)
    const { top } = cumulativeOffset(ref)
    def.classList.add("footnote-definition")
    eltAbsoluteTop = (top > lastBottom) ? top : lastBottom
    def.style.top = `${eltAbsoluteTop}px`
    lastBottom = eltAbsoluteTop + def.scrollHeight
  }

  removeFootnoteHeader("h2.footnotes")
}


/*
 * Find a footnote reference's corresponding definition.
 */
const findDefinition = (ref: HTMLElement): HTMLElement =>
  document.querySelector(`.footdef a[href="#${ref.getAttribute('id')}"]`)!.closest('.footdef') as HTMLElement

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

  return {top, left}
}

/*
 * Find and remove a footnote from the footer of the page (where footnotes live
 * prior to repositioning)
 */
const removeFootnoteHeader = (selectors: string) => {
  const bottomNotes = document.querySelector(selectors)
  if (bottomNotes) {
    bottomNotes.remove()
  }
}

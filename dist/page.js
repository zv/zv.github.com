/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./comments.ts":
/*!*********************!*\
  !*** ./comments.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"loadGithubComments\": () => (/* binding */ loadGithubComments)\n/* harmony export */ });\n/* harmony import */ var _github_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./github-api */ \"./github-api.ts\");\n\nvar build_comment_html = function (issue) {\n    return \"<div class=\\\"comment\\\">\\n    <div class=\\\"comment-photo\\\"><img src=\\\"\" + issue.user.avatar_url + \"\\\" /></div>\\n    <div class=\\\"comment-right\\\">\\n      <div class=\\\"comment-header\\\"><b>\" + issue.user.login + \"</b></div>\\n      <hr />\\n      <div class=\\\"body\\\">\" + issue.body_html + \"</div>\\n    </div>\\n   </div>\";\n};\n/*\n * This function loads a list of comments sourced from Github issues into a\n * blogpost (\"page\") by enumerating our github issues, finding which corresponds\n * to our current page, and then fetch & insert those comments.\n *\n * @property {string} github_id\n *    Your github username\n * @property {string} repo_issues_url\n *    The URL of the github issues page for the repository you'd like to use for comments\n *    \"https://github.com/github/metadata-example/issues\",\n * @property {string} issue_id\n *  The \"id\" (github issue title) you'd like to fetch the comments of\n */\nvar loadGithubComments = function (load_into, github_id, repo_issues_url, issue_id) {\n    // Issues must be referenced by their numeric Github ID, `find_comments_url`\n    // resolves a local blogpost/page name to that numeric ID.\n    var find_comments_url = function (repo_issues_url) {\n        // we append 'created' to ensure only we can create comment threads\n        return (0,_github_api__WEBPACK_IMPORTED_MODULE_0__.fetch)(repo_issues_url)\n            .then(function (json) { return json.find(function (issue) { return issue.title === issue_id; }); });\n    };\n    // Insert posts comments into current page\n    var insert_comments = function (_a) {\n        var html_url = _a.html_url, comments_url = _a.comments_url;\n        return (0,_github_api__WEBPACK_IMPORTED_MODULE_0__.fetch)(comments_url)\n            .then(function (comments) { return comments.map(build_comment_html); })\n            .then(function (comments_html) {\n            comments_html.forEach(function (html) {\n                return load_into.insertAdjacentHTML('afterend', html);\n            });\n            // now unhide the container.\n            load_into.style.display = 'block';\n            return comments_html.length;\n        })\n            .then(function (_count) {\n            // set the howto link\n            var howto = document.querySelector(\"a#comment-howto-link\");\n            howto && howto.setAttribute('href', html_url);\n        });\n    };\n    find_comments_url(repo_issues_url + \"?created=\" + github_id)\n        .then(insert_comments)\n        .catch(function (err) { return console.error(\"An error occurred while loading comments: \", err); });\n};\n\n\n//# sourceURL=webpack://zv.github.io/./comments.ts?");

/***/ }),

/***/ "./footnotes.ts":
/*!**********************!*\
  !*** ./footnotes.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"repositionFootnotes\": () => (/* binding */ repositionFootnotes)\n/* harmony export */ });\n/*\n  Moves each footnote to it's 'correct' layout position by doing the following:\n  For each footnote definition:\n  - calculate a footnote definition's position from the top\n  - lookup corresponding footnote reference, add an appropriate style & 'position: top'\n  - remove footnote reference from footer\n  Hide footnote container\n*/\nvar repositionFootnotes = function (refNodes) {\n    var lastBottom = 0;\n    var eltAbsoluteTop;\n    for (var _i = 0, _a = Array.from(refNodes); _i < _a.length; _i++) {\n        var ref = _a[_i];\n        var def = findDefinition(ref);\n        var top_1 = cumulativeOffset(ref).top;\n        console.log('assigning ', ref, ' to ', def);\n        def.classList.add(\"footnote-definition\");\n        eltAbsoluteTop = (top_1 > lastBottom) ? top_1 : lastBottom;\n        def.style.top = eltAbsoluteTop + \"px\";\n        lastBottom = eltAbsoluteTop + def.scrollHeight;\n    }\n    removeFootnoteHeader(\"h2.footnotes\");\n};\n/*\n * Find a footnote reference's corresponding definition.\n */\nvar findDefinition = function (ref) {\n    return document.querySelector(\".footdef a[href=\\\"#\" + ref.getAttribute('id') + \"\\\"]\").closest('.footdef');\n};\n/*\n * Calculates the total offset from the top of the page.\n */\nvar cumulativeOffset = function (element) {\n    // stolen from prototype.js\n    var top = 0, left = 0;\n    do {\n        top += element.offsetTop || 0;\n        left += element.offsetLeft || 0;\n        element = element.offsetParent;\n    } while (element);\n    return { top: top, left: left };\n};\n/*\n * Find and remove a footnote from the footer of the page (where footnotes live\n * prior to repositioning)\n */\nvar removeFootnoteHeader = function (selectors) {\n    var bottomNotes = document.querySelector(selectors);\n    if (bottomNotes) {\n        bottomNotes.remove();\n    }\n};\n\n\n//# sourceURL=webpack://zv.github.io/./footnotes.ts?");

/***/ }),

/***/ "./github-api.ts":
/*!***********************!*\
  !*** ./github-api.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"fetch\": () => (/* binding */ fetch)\n/* harmony export */ });\nvar fetch = function (url) {\n    return new Promise(function (ok, fail) {\n        var xhr = new XMLHttpRequest();\n        xhr.addEventListener(\"load\", function (_progressEvt) {\n            var result = this.responseText;\n            try {\n                result = JSON.parse(result);\n            }\n            catch (e) { }\n            ok(result);\n        });\n        xhr.addEventListener(\"error\", fail);\n        xhr.open(\"GET\", url);\n        xhr.setRequestHeader(\"Accept\", \"application/vnd.github.v3.html+json\");\n        xhr.send();\n    });\n};\n\n\n//# sourceURL=webpack://zv.github.io/./github-api.ts?");

/***/ }),

/***/ "./page.ts":
/*!*****************!*\
  !*** ./page.ts ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _footnotes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footnotes */ \"./footnotes.ts\");\n/* harmony import */ var _comments__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./comments */ \"./comments.ts\");\n\n\n// Reposition footnotes onto right side\nif (window.innerWidth >= 1024) {\n    window.addEventListener('load', function () {\n        console.log('repositioning footnotes...');\n        (0,_footnotes__WEBPACK_IMPORTED_MODULE_0__.repositionFootnotes)(document.getElementsByClassName(\"footref\"));\n    });\n}\n// Fetch & insert comments\ndocument.addEventListener('scroll', function doLoadComments() {\n    // if they are more than halfway done with the article, load our comments.\n    if (((window.innerHeight + window.scrollY)) >= (document.body.offsetHeight >> 1)) {\n        console.log('loading comments...');\n        var CONTAINER_ELT_1 = document.querySelector(\"div.comments-container\");\n        var _a = [\n            'data-github-user',\n            'data-issues-url',\n            'data-issue-id'\n        ].map(function (attr) { return CONTAINER_ELT_1.getAttribute(attr); }), github_id = _a[0], repo_issues_url = _a[1], issue_id = _a[2];\n        (0,_comments__WEBPACK_IMPORTED_MODULE_1__.loadGithubComments)(CONTAINER_ELT_1, github_id, repo_issues_url, issue_id);\n        document.removeEventListener('scroll', doLoadComments);\n    }\n});\n\n\n//# sourceURL=webpack://zv.github.io/./page.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./page.ts");
/******/ 	
/******/ })()
;
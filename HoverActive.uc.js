// ==UserScript==
// @name           Hover Active
// @namespace      lkytal
// @description    Hover Active
// @include        chrome://browser/content/browser.xul
// ==/UserScript==

(function() {
	if (location != 'chrome://browser/content/browser.xul')
		return;
	
	let timer;
	
	gBrowser.tabContainer.addEventListener("mouseover", function(event) {
		timer = setTimeout(function() {
			gBrowser.selectedTab = event.target;
			}, 40);
	}, false);
	
	gBrowser.tabContainer.addEventListener("mouseout", function(event) {
		clearTimeout(timer);
	}, false);
})();

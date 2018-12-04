// ==UserScript==
// @name                 OpenLinkRightClick
// @description          OpenLinkRightClick
// @author               lkytal
// @namespace            lkytal
// @compatibility        Firefox 29+
// @charset              UTF-8
// @version              2018.10.12
// ==/UserScript==

(function() {
	if (location != 'chrome://browser/content/browser.xul')
		return;

	function findLink(element) {
		// Super_start
		if (element.className == 'site-snapshot') {
			return element.parentNode;
		}

		switch (element.tagName) {
			case 'A':
				return element;

			case 'B':
			case 'I':
			case 'SPAN':
			case 'SMALL':
			case 'STRONG':
			case 'EM':
			case 'BIG':
			case 'SUB':
			case 'SUP':
				//case 'IMG':
			case 'S':
			case 'FONT':
				var parent = element.parentNode;
				return parent && findLink(parent);

			default:
				return null;
		}
	}

	function $(id) {
		return document.getElementById(id);
	}

	var toPrevent = false;

	var OpenLinkRightClick = {
		preventMenu: function(event) {
			if (toPrevent == true) {
				toPrevent = false;
				
				$("contentAreaContextMenu").hidePopup();
				event.preventDefault();
				event.stopPropagation();
				return false;	
			}
		},
		OpenLink: function(event) {
			gBrowser.tabpanels.removeEventListener("click", OpenLinkRightClick.OpenLink, false);
				
			if (event.ctrlKey || event.shiftKey || event.altKey) return;
			if (event.button == 2) {
				var href = XULBrowserWindow.overLink;

				var link = findLink(event.target)
				if (link) href = link.href;

				if (href) {
					if (/^javascript:/i.test(href.toString())) return;

					openWebLinkIn(href.toString(), 'tab', {
						inBackground: true
					});
					
					//gBrowser.moveTabTo(tab, gBrowser._selectedTab._tPos + 1);

					toPrevent = true;
					
					$("contentAreaContextMenu").hidePopup();
					event.preventDefault();
					event.stopPropagation();
					return false;
				}
			}
		},
	}

	gBrowser.tabpanels.addEventListener('mousedown', function(event) {
		if (event.ctrlKey || event.shiftKey || event.altKey) return;
		if (event.button == 2) {
			gBrowser.tabpanels.addEventListener("click", OpenLinkRightClick.OpenLink, false);

			setTimeout(function(event) {
				gBrowser.tabpanels.removeEventListener("click", OpenLinkRightClick.OpenLink, false);
			}, 300)
		}
	}, false);

	
	gBrowser.tabpanels.addEventListener('contextmenu', OpenLinkRightClick.preventMenu, false);
})();
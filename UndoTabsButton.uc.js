// ==UserScript==
// @name           UndoTabsButton.uc.js
// @description    最近关闭
// @author         ding
// @include        main
// @version        2018.3.24
// @startup        window.UndoTabButtonHandler.init();
// @shutdown       window.UndoTabButtonHandler.destroy();
// ==/UserScript==

function $(id) {
    return document.getElementById(id);
}

function insertAfter(newEl, targetEl)
{
    var parentEl = targetEl.parentNode;
    
    if(parentEl.lastChild == targetEl)
    {
        parentEl.appendChild(newEl);
    }
    else
    {
        parentEl.insertBefore(newEl,targetEl.nextSibling);
    }            
}
    
function addUndo() {
    const MENU_NAME = "最近关闭";
    const MENU_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABuUlEQVRIib2VL08DQRDFKxANqahErijJte/N5pI2oQlNuA+AqEBUkHAJAkMIAhJERYNBICr4ABUIFKlEIBA4DAJRgUBUIJpgKioqitkry8H9CxcmmeQutzu/eTO5mULhP4xkA0Ar6ruIOCR3SZ4A6JrnRhaAR3JqQ5RSRQDHJMckFxE+JtlzXbccCwDQMRemAFpaa5J8jQkc9ncRaccBfOvw1HjwPhORvjnTAFAB0BGRfkjdXEQOo2rs/5YZgIGIbEUlJiKOAc3MnQ8Ae0kKlvUFsBZb2y9Qm+Tc3Jv86AnJo4ja3lar1fU0EJKXlvLz8MdeTAOHnuetJAFc1y1bPZlkASwAXKVU0bPuuN/ojuOoOE+jAsCOBfDTJJXJarXahqX8NHeA+UEDBd3cASJyYCnYzx0AYBAAtNbNvINvknwxgKd6vb6aK4DkfZB95EyysimJyBmAUprgZkcEwe+SDq8FUgG8kfSizppF9Gg1dpI4vwBUSI7sMUzy2YzsjvELkkNrwAVjfjuN4mCu3GRYOCOtNVMFD6lpkbwOLaDlIiL5AMBPM0ZiTSlVNPX2SHpa66ZSqvinoHnZJ3jLDwknYoRNAAAAAElFTkSuQmCC";
      
    if (window.UndoTabButtonHandler) {
        window.UndoTabButtonHandler.destroy();
        delete window.UndoTabButtonHandler;
    }
    
    var UndoTabButtonHandler = {
        init: function () {
        	let panelview = document.createElement("panelview");
        	panelview.id = "uc-appMenu-library-recentlyClosedTabs";
        	$("appMenu-popup").appendChild(panelview);
        	panelview.addEventListener('ViewShowing', this, false);
        	
            let toolbarbutton = document.createElement("toolbarbutton");
            toolbarbutton.id = "uc-undo-tab-btn"
            toolbarbutton.setAttribute("label", MENU_NAME);
            toolbarbutton.setAttribute("tooltiptext", MENU_NAME);
            toolbarbutton.setAttribute("removable", true);
            toolbarbutton.setAttribute("cui-areatype", "toolbar");
            toolbarbutton.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional subviewbutton-nav");
            toolbarbutton.setAttribute("image", MENU_IMAGE);
						toolbarbutton.setAttribute("oncommand", "UndoTabButtonHandler.showUndoList(this)");
 
            let inspos = $("tabbrowser-tabs"); //$('.titlebar-placeholder[type=post-tabs]')
            //inspos.parentNode.insertBefore(toolbarbutton, inspos);
            insertAfter(toolbarbutton, inspos);
 
        },
        handleEvent: function (event) {
        	 	let panelview = event.target;
			      let document = event.target.ownerDocument;
			      let window = document.defaultView;
			      let viewType = "Tabs";
						let kid = panelview.firstChild;
						while (kid) {
						   let next = kid.nextSibling;
						   kid.remove();
						   kid = next;
						}
			      let utils = RecentlyClosedTabsAndWindowsMenuUtils;
			      let method = `get${viewType}Fragment`;
			      let fragment = utils[method](window, "toolbarbutton", true);
			      let elementCount = fragment.childElementCount;
	 
			      let body = document.createElement("vbox");
			      body.className = "panel-subview-body";
			      body.appendChild(fragment);
			      let footer;
			      while (--elementCount >= 0) {
			        let element = body.childNodes[elementCount];
			        CustomizableUI.addShortcut(element);
			        element.classList.add("subviewbutton");
			        if (element.classList.contains("restoreallitem")) {
			          footer = element;
			          element.classList.add("panel-subview-footer");
			        } else {
			          element.classList.add("subviewbutton-iconic", "bookmark-item");
			          element.style["max-width"] = "none";
			        }
			      }
			      panelview.appendChild(body);
			      panelview.appendChild(footer);
        },
        showUndoList:function(anchor){
        	PanelUI.showSubView('uc-appMenu-library-recentlyClosedTabs', anchor);
        },
        destroy: function () {
            let button = $("uc-undo-tab-btn");
            if (button) {
                button.parentNode.removeChild(button);
            }
            let panelview = $("uc-appMenu-library-recentlyClosedTabs");
            if (panelview) {
            	panelview.removeEventListener('ViewShowing', this, false);
                panelview.parentNode.removeChild(panelview);
            }
        }
    }
    
    window.UndoTabButtonHandler = UndoTabButtonHandler;
    
    UndoTabButtonHandler.init();
}

if (location == "chrome://browser/content/browser.xul")
{
	setTimeout(addUndo, 500);
}

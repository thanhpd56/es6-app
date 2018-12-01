import $ from 'jquery';
import pm from 'post-robot';
import elementSelectorHandler from './elementSelectorHandler';
import elementMoveHandler from './elementMoveHandler';
import helper from './helper';

const CUSTOM_STYLE_ID = 'custom_style';
const CUSTOM_JS_ID = 'custom_js';

class Main {
    constructor(){
        $(document).ready(() => {
            console.log('frame is ready');
            elementMoveHandler.setElementSelectEventHandler = elementSelectorHandler.setEventHandler;
            this.setupListeners();
        });
    }

    setupListeners = () => {
        pm.on('setEditMode', () => {
            elementSelectorHandler.addElementOverlay();
            elementSelectorHandler.setEventHandler();
        });

        pm.on('prepareElementForMove', (event) => {
            pm.send(window.parent, 'removeMenu');
            pm.send(window.parent, 'removePageOverlay');
            elementSelectorHandler.unsetEventHandlers();
            const selectedElement = event.data;
            elementMoveHandler.prepareForMove(selectedElement);
        });
        pm.on('removeElemOverlay', elementSelectorHandler.removeElemOverlay);

        pm.on('setMovePosition', (event) => {
            return elementMoveHandler.setMovePosition(event.data);
        });

        pm.on('removeElement', (event) => {
            return this.removeElement(event.data);
        });

        pm.on('setChangedText', (event) => {
            return this.setChangedText(event.data);
        });

        pm.on('setChangedImage', (event) => {
            return this.setChangedImage(event.data);
        });

        pm.on('setEditHyperLink', (event) => {
            return this.setEditHyperLink(event.data);
        });

        pm.on('setElementAttr', (event) => {
            return this.setElementAttr(event.data);
        });

        pm.on('setInsertHTML', (event) => {
            return this.setInsertHTML(event.data);
        });

        pm.on('setInsertImage', (event) => {
            return this.setInsertImage(event.data);
        });

        pm.on('setCssSettings', (event) => {
            return this.setCssSettings(event.data);
        });

        pm.on('setInteractiveMode', () => {
            this.setInteractiveMode();
        });

        pm.on('injectCSS', (event) => {
            this.injectCSS(event.data);
        });

        pm.on('injectJS', (event) => {
            this.injectJS(event.data);
        });

        pm.on('undoChange', (event) => {
            this.undoChange(event.data);
        });
    };

    removeElement = (data) => {
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        $(data.selectorString).hide();
        return data;
    };

    getNodeHMTL = function (selector) {
        if (typeof selector === 'undefined') {
            return false;
        }
        let html = '';
        if ($(selector)[0].innerHTML !== "") {
            html = $(selector)[0].innerHTML;
        }
        else {
            html = $(selector)[0].outerHTML;
        }
        return html;
    };

    setChangedText =  (data) => {
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            data.parentNodeHTML = this.getNodeHMTL(data.parentNodeSelector);
            data.originalHTML = this.getNodeHMTL(data.selectorString);
            if ($(data.selectorString)[0].innerHTML !== "") {
                $(data.selectorString).html(data.html);
            }
            else {
                $(data.selectorString)[0].outerHTML = data.html;
            }
        }
        return data;
    };

    setChangedImage = (data) => {
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            data.oldSource = $(data.selectorString).attr('src');
            $(data.selectorString).attr('src', data.src);
        }
        return data;
    };

    setEditHyperLink = function (data) {
        console.log('setEditHyperLink 123');
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            if ($(data.selectorString)[0].tagName === 'A') {
                data.oldUrl = $(data.selectorString).attr('href');
                data.oldNewTab = $(data.selectorString).attr('target') || '';
                $(data.selectorString).attr('href', data.linkUrl);
                if (data.newTab === 1) {
                    $(data.selectorString).attr('target', '_blank');
                }
                else {
                    $(data.selectorString).attr('target', '');
                }
            }
            else {
                data.oldUrl = $(data.selectorString).closest('a').attr('href');
                data.oldNewTab = $(data.selectorString).closest('a').attr('target') || '';
                $(data.selectorString).closest('a').attr('href', data.linkUrl);
                if (data.newTab === 1) {
                    $(data.selectorString).closest('a').attr('target', '_blank');
                }
                else {
                    $(data.selectorString).closest('a').attr('target', '');
                }
            }
            data.oldText = $(data.selectorString).html();
            $(data.selectorString).html(data.linkText);
        }
        return data;
    };

    setElementAttr = (data) => {
        console.log('setElementAttr');
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            $(data.attrs).each(function (i, v) {
                if (v.type === 'changed' || v.type === 'added') {
                    $(data.selectorString).attr(v.key, v.val);
                }
                else if (v.type === 'deleted') {
                    $(data.selectorString).removeAttr(v.key);
                }
            });
        }
        return data;
    };

    setInsertHTML = (data) => {
        let tempHTML;
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            data.parentNodeHTML = this.getNodeHMTL(data.parentNodeSelector);
            const tempElem = $(data.html);
            if (tempElem.length > 0 || tempElem.children().length > 0) {
                tempHTML = data.html;
            }
            else {
                tempHTML = '<span>' + data.html + '</span>';
            }
            if (data.insertOption === 'after') {
                $(data.selectorString).after(tempHTML);
            }
            else if (data.insertOption === 'before') {
                $(data.selectorString).before(tempHTML);
            }
            else if (data.insertOption === 'append') {
                if ($(data.selectorString)[0].tagName === 'IMG' || $(data.selectorString)[0].tagName === 'INPUT') {
                    $(data.selectorString).after(tempHTML);
                }
                else {
                    $(data.selectorString).append(tempHTML);
                }
            }
            else if (data.insertOption === 'prepend') {
                if ($(data.selectorString)[0].tagName === 'IMG' || $(data.selectorString)[0].tagName === 'INPUT') {
                    $(data.selectorString).before(tempHTML);
                }
                else {
                    $(data.selectorString).prepend(tempHTML);
                }
            }
        }
        return data;
    };

    setCssSettings = (data) => {
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        let settings = data.settings;
        for (let key in  settings) {
            if (settings.hasOwnProperty(key)) {
                $(data.selectorString).css(key, settings[key]);
            }
        }

        return data;
    };

    setInsertImage = (data) => {
        if (typeof data.editUrl === "undefined") {
            data.editUrl = helper.getCurrentUrl();
        }
        if ($(data.selectorString).length > 0) {
            data.parentNodeHTML = this.getNodeHMTL(data.parentNodeSelector);
            const image = $('<img/>', {src: data.src});
            if (data.insertOption === 'after') {
                $(data.selectorString).after(image);
            }
            else if (data.insertOption === 'before') {
                $(data.selectorString).before(image);
            }
            else if (data.insertOption === 'append') {
                if ($(data.selectorString)[0].tagName === 'IMG' || sQuery(data.selectorString)[0].tagName === 'INPUT') {
                    $(data.selectorString).after(image);
                }
                else {
                    $(data.selectorString).append(image);
                }
            }
            else if (data.insertOption === 'prepend') {
                if ($(data.selectorString)[0].tagName === 'IMG' || $(data.selectorString)[0].tagName === 'INPUT') {
                    $(data.selectorString).before(image);
                }
                else {
                    $(data.selectorString).prepend(image);
                }
            }
        }
        return data;
    };

    setInteractiveMode = () => {
        elementSelectorHandler.unsetEventHandlers();
    };

    injectCSS = (data) => {
        const cssString = data.css;
        const head = document.head || document.getElementsByTagName('head')[0];
        const customStyle = document.getElementById(CUSTOM_STYLE_ID);
        if (customStyle) {
            head.removeChild(customStyle);
        }

        const style = document.createElement('style');
        style.type = "text/css";
        style.id = CUSTOM_STYLE_ID;
        if (style.styleSheet) {
            style.styleSheet.cssText = cssString;
        } else {
            style.appendChild(document.createTextNode(cssString));
        }
        head.appendChild(style);
    };

    injectJS= (data) => {
        console.log('inject js 123', data);
        const jsString = data.js;
        const head = document.head || document.getElementsByTagName('head')[0];
        const customStyle = document.getElementById(CUSTOM_JS_ID);
        if (customStyle) {
            head.removeChild(customStyle);
        }

        const js = document.createElement('script');
        js.type = "text/javascript";
        js.id = CUSTOM_JS_ID;
        js.text = jsString;
        head.appendChild(js);
    };

    undoChange = function (customization) {
        if (customization.type === "slide") {
            window.location.reload();
        }
        else if (customization.type === "css") {
            const settings = customization.settings;
            for (let key in  settings) {
                if (settings.hasOwnProperty(key)) {
                    $(data.selectorString).css(key, settings[key].defaultVal);
                }
            }
        }
        else if (customization.type === "remove") {
            $(customization.selectorString).show();
        }
        else if (customization.type === 'changedText') {
            console.log('changed text', customization.parentNodeHTML);
            $(customization.parentNodeSelector).html(customization.parentNodeHTML);
        }
        else if (customization.type === 'changedImage') {
            $(customization.selectorString).attr('src', customization.oldSource);
        }
        else if (customization.type === 'insertedHTML') {
            $(customization.parentNodeSelector).html(customization.parentNodeHTML);
        }
        else if (customization.type === 'insertImage') {
            $(customization.parentNodeSelector).html(customization.parentNodeHTML);
        }
        else if (customization.type === 'editHyperLink') {
            if ($(customization.selectorString)[0].tagName === 'A') {
                $(customization.selectorString).attr('href', customization.oldUrl);
                $(customization.selectorString).attr('target', customization.oldNewTab);
            }
            else {
                $(customization.selectorString).closest('a').attr('href', customization.oldUrl);
                $(customization.selectorString).closest('a').attr('target', customization.oldNewTab);
            }
            $(customization.selectorString).html(customization.oldText);
        } else if (customization.type === 'makeHyperLink') {
            $(customization.selectorString).html(customization.oldText);
        } else if (customization.type === 'rearrangeElement') {
            const element = $(customization.newPosition.elementSelector);
            const oldPositionHelper = $(customization.oldPosition.helperSelector);
            switch (customization.oldPosition.insertType) {
                case 'prepend':
                    oldPositionHelper.prepend(element);
                    break;
                case 'after':
                    oldPositionHelper.after(element);
                    break;
            }
        } else if (customization.type === 'moveElement') {
            $(customization.selectorString).css(customization.oldPosition);
        } else if (customization.type === 'elementAttr') {
            $(customization.attrs).each(function (i, v) {
                if (v.type === 'changed') {
                    $(customization.selectorString).attr(v.key, v.oldVal);
                }
                else if (v.type === 'added') {
                    $(customization.selectorString).removeAttr(v.key);
                }
                else if (v.type === 'deleted') {
                    $(customization.selectorString).attr(v.key, v.val);
                }
            });
        }
    };
}



export default new Main();

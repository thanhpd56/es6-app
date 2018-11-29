import $ from 'jquery';
import pm from 'post-robot';
import elementSelectorHandler from './elementSelectorHandler';
import elementMoveHandler from './elementMoveHandler';
import helper from './helper';

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
            elementMoveHandler.setMovePosition(event.data);
        });

        pm.on('removeElement', (event) => {
            this.removeElement(event.data);
        });

        pm.on('setChangedText', (event) => {
            this.setChangedText(event.data);
        });

        pm.on('setChangedImage', (event) => {
            this.setChangedImage(event.data);
        });

        pm.on('setElementAttr ', (event) => {
            this.setElementAttr(event.data);
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
                sQuery(data.selectorString).closest('a').attr('href', data.linkUrl);
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
}

export default new Main();

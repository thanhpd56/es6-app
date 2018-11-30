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

        pm.on('setEditHyperLink', (event) => {
            this.setEditHyperLink(event.data);
        });

        pm.on('setElementAttr', (event) => {
            this.setElementAttr(event.data);
        });

        pm.on('setInsertHTML', (event) => {
            this.setInsertHTML(event.data);
        });

        pm.on('setInsertImage', (event) => {
            this.setInsertImage(event.data);
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
}



export default new Main();

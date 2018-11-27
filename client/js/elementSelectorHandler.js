import $ from 'jquery';
import pm from 'post-robot';

class ElementSelectorHandler {
    constructor() {
        console.log('Init element selector handler');
        this.exceptTags = ['html', 'body'];
        this.selectedElement = {};
        this.cssSettings = {
            'text': [{
                'label': 'Font Family',
                'type': 'text',
                'name': 'font-family',
                'advanced': 'false'
            }, {'label': 'Font Size', 'type': 'text', 'name': 'font-size', 'advanced': 'false'}, {
                'label': 'Font Style',
                'type': 'select',
                'values': ["", "normal", "italic", "oblique", "inherit"],
                'name': 'font-style',
                'advanced': 'false'
            }, {
                'label': 'Text Alignment',
                'type': 'select',
                'values': ["", "left", "center", "right", "justify", "start", "end", "inherit"],
                'name': 'text-align',
                'advanced': 'false'
            }, {
                'label': 'Text Decoration',
                'type': 'select',
                'values': ["", "none", "inherit", "underline", "line-through", "overline", "blink"],
                'name': 'text-decoration',
                'advanced': 'false'
            }, {
                'label': 'Font Weight',
                'type': 'select',
                'values': ["", "normal", "bold", "100", "200", "300", "400", "401", "500", "600", "700", "800", "900", "inherit"],
                'name': 'font-weight',
                'advanced': 'false'
            }, {
                'label': 'Font Variant',
                'type': 'select',
                'values': ["", "normal", "small-caps", "inherit"],
                'name': 'font-variant',
                'advanced': 'true'
            }, {'label': 'Line Height', 'type': 'text', 'name': 'line-height', 'advanced': 'true'}, {
                'label': 'Word Break',
                'type': 'select',
                'values': ["", "normal", "break-word"],
                'name': 'word-break',
                'advanced': 'true'
            }, {'label': 'Word Spacing', 'type': 'text', 'name': 'word-spacing', 'advanced': 'true'}, {
                'label': 'Word Wrap',
                'type': 'select',
                'values': ["", "normal", "break-word"],
                'name': 'word-wrap',
                'advanced': 'true'
            }, {
                'label': 'Letter Spacing',
                'type': 'text',
                'name': 'letter-spacing',
                'advanced': 'true'
            }, {
                'label': 'Overflow',
                'type': 'select',
                'values': ["", "visible", "hidden", "scroll", "auto", "clip", "inherit"],
                'name': 'text-overflow',
                'advanced': 'true'
            }, {
                'label': 'Text Transform',
                'type': 'select',
                'values': ["", "none", "capitalize", "uppercase", "lowercase", "inherit"],
                'name': 'text-transform',
                'advanced': 'true'
            }, {'label': 'Text Shadow', 'type': 'text', 'name': 'text-shadow', 'advanced': 'true'}],
            'color-background': [{
                'label': 'Font Color',
                'type': 'colorpicker',
                'name': 'color',
                'advanced': 'false'
            }, {
                'label': 'Background Color',
                'type': 'colorpicker',
                'name': 'background-color',
                'advanced': 'false'
            }, {
                'label': 'Background Image',
                'type': 'text',
                'name': 'background-image',
                'advanced': 'false'
            }, {
                'label': 'Background Position',
                'type': 'text',
                'name': 'background-position',
                'advanced': 'false'
            }, {
                'label': 'Background Repeat',
                'type': 'select',
                'values': ["", "no-repeat", "repeat", "repeat-x", "repeat-y", "inherit"],
                'name': 'background-repeat',
                'advanced': 'false'
            }],
            'dimensions': [{'label': 'Height', 'type': 'text', 'name': 'height', 'advanced': 'false'}, {
                'label': 'Width',
                'type': 'text',
                'name': 'width',
                'advanced': 'false'
            }, {'label': 'Margin', 'type': 'text', 'name': 'margin', 'advanced': 'false'}, {
                'label': 'Padding',
                'type': 'text',
                'name': 'padding',
                'advanced': 'false'
            }, {'label': 'Max Height', 'type': 'text', 'name': 'max-height', 'advanced': 'true'}, {
                'label': 'Min Height',
                'type': 'text',
                'name': 'min-height',
                'advanced': 'true'
            }, {'label': 'Max Width', 'type': 'text', 'name': 'max-width', 'advanced': 'true'}, {
                'label': 'Min Width',
                'type': 'text',
                'name': 'min-width',
                'advanced': 'true'
            }, {'label': 'Margin Top', 'type': 'text', 'name': 'margin-top', 'advanced': 'true'}, {
                'label': 'Margin Bottom',
                'type': 'text',
                'name': 'margin-bottom',
                'advanced': 'true'
            }, {
                'label': 'Margin Left',
                'type': 'text',
                'name': 'margin-left',
                'advanced': 'true'
            }, {
                'label': 'Margin Right',
                'type': 'text',
                'name': 'margin-right',
                'advanced': 'true'
            }, {
                'label': 'Padding Top',
                'type': 'text',
                'name': 'padding-top',
                'advanced': 'true'
            }, {
                'label': 'Padding Bottom',
                'type': 'text',
                'name': 'padding-bottom',
                'advanced': 'true'
            }, {
                'label': 'Padding Left',
                'type': 'text',
                'name': 'padding-left',
                'advanced': 'true'
            }, {'label': 'Padding Right', 'type': 'text', 'name': 'padding-right', 'advanced': 'true'}],
            'borders': [{
                'label': 'Border Color',
                'type': 'colorpicker',
                'name': 'border-color',
                'advanced': 'false'
            }, {
                'label': 'Border Style',
                'type': 'select',
                'values': ["", "none", "solid", "dotted", "dashed", "outset", "inset", "groove", "ridge", "inherit"],
                'name': 'border-style',
                'advanced': 'false'
            }, {
                'label': 'Border Width',
                'type': 'text',
                'name': 'border-width',
                'advanced': 'false'
            }, {'label': 'Border Top', 'type': 'text', 'name': 'border-top', 'advanced': 'true'}, {
                'label': 'Border Bottom',
                'type': 'text',
                'name': 'border-bottom',
                'advanced': 'true'
            }, {
                'label': 'Border Left',
                'type': 'text',
                'name': 'border-left',
                'advanced': 'true'
            }, {'label': 'Border Right', 'type': 'text', 'name': 'border-right', 'advanced': 'true'},],
            'layout': [{'label': 'Top', 'type': 'text', 'name': 'top', 'advanced': 'false'}, {
                'label': 'Bottom',
                'type': 'text',
                'name': 'bottom',
                'advanced': 'false'
            }, {'label': 'Left', 'type': 'text', 'name': 'left', 'advanced': 'false'}, {
                'label': 'Right',
                'type': 'text',
                'name': 'right',
                'advanced': 'false'
            }, {'label': 'Z Index', 'type': 'text', 'name': 'z-index', 'advanced': 'false'}, {
                'label': 'Position',
                'type': 'select',
                'values': ["", "absolute", "fixed", "relative", "static", "inherit"],
                'name': 'position',
                'advanced': 'false'
            }, {
                'label': 'Float',
                'type': 'select',
                'values': ["", "left", "right", "none"],
                'name': 'float',
                'advanced': 'false'
            }, {
                'label': 'Clear',
                'type': 'select',
                'values': ["", "none", "left", "right", "both"],
                'name': 'clear',
                'advanced': 'false'
            }, {
                'label': 'Display',
                'type': 'select',
                'values': ["", "none", "block", "inline", "inline-block", "list-item", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "inherit"],
                'name': 'display',
                'advanced': 'true'
            }, {
                'label': 'Visibility',
                'type': 'select',
                'values': ["", "visible", "hidden", "collapse", "inherit"],
                'name': 'visibility',
                'advanced': 'true'
            }],
            'other': [{
                'label': 'Table Border Collapse',
                'type': 'select',
                'values': ["", "collapse", "separate"],
                'name': 'border-collapse',
                'advanced': 'false'
            }, {
                'label': 'Table Border Spacing',
                'type': 'text',
                'name': 'border-spacing',
                'advanced': 'false'
            }, {
                'label': 'List Style Type',
                'type': 'select',
                'values': ["", "disc", "armenian", "circle", "decimal", "georgian", "hebrew", "hiragana", "hiragana-iroha", "inherit", "katakana", "katakana-iroha", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-latin", "upper-roman"],
                'name': 'list-style-type',
                'advanced': 'false'
            }]
        };
    }

    addElementOverlay = () => {
        $('body').append('' +
            '<div class="insElem" id="insElemOverlay"></div>' +
            '<div class="insElem" id="insElemBorderLeft"></div>' +
            '<div class="insElem" id="insElemBorderRight"></div>' +
            '<div class="insElem" id="insElemBorderTop"></div>' +
            '<div class="insElem" id="insElemBorderBottom"></div>' +
            '').append('' +
            '<div id="insElemShowLeft"></div>' +
            '<div id="insElemShowRight"></div>' +
            '<div id="insElemShowTop"></div>' +
            '<div id="insElemShowBottom"></div>' +
            '');
    };

    setEventHandler = () => {
        console.log('set event handler di may');
        window.document.addEventListener('click', this.clickHandler, true);
        window.document.addEventListener('mouseover', this.overHandler, true);
    };

    getElementTreeSelector = function (element) {
        const paths = [];
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
            let sibling;
            if (element.nodeName === 'HTML') continue;
            let index = 0;
            let hasFollowingSiblings = false;
            for (sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE)
                    continue;
                if (sibling.nodeName === element.nodeName)
                    ++index;
            }
            for (sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
                if (sibling.nodeName === element.nodeName)
                    hasFollowingSiblings = true;
            }
            let tagName;
            let pathIndex;
            if (element.id.length > 0 && element.nodeName !== 'BODY') {
                tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
                pathIndex = '#' + element.id;
                paths.splice(0, 0, tagName + pathIndex);
                break;
            }
            else {
                tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
                pathIndex = (index || hasFollowingSiblings ? ":eq(" + (index) + ")" : "");
                paths.splice(0, 0, tagName + pathIndex);
            }
        }
        return paths.length ? paths.join(" > ") : null;
    };

    elementIsExceptional = (eventTarget) => {
        return !(this.elementIsSvg(eventTarget))
            && (eventTarget.className.indexOf('ui-resizable-handle') > -1 || eventTarget.className.indexOf('insider-overlay') > -1 || $(eventTarget).closest('.insider-slider-button-wrap').length > 0 || $(eventTarget).closest('#insTriggerContent').length > 0);
    };

    elementIsSvg = (eventTarget) => {
        return eventTarget.className instanceof Object;
    };

    elementIsBorder = (eventTarget) => {
        return !this.elementIsSvg(eventTarget) && eventTarget.className.indexOf('insElem') > -1;
    };

    clickHandler = (event) => {
        console.log('clicked');
        const elementTagName = event.target.tagName.toLowerCase();
        const element = event.target;

        if (this.exceptTags.indexOf(elementTagName) > -1) {
            return false;
        }

        if (this.elementIsExceptional(event.target)) {
            return false;
        }

        if (this.elementIsBorder(event.target)) {
            return false;
        }
        const elementData = {};
        elementData.selectorString = this.getElementTreeSelector(element);
        elementData.offset = $(element).offset();
        elementData.height = $(element).outerHeight();
        elementData.width = $(element).outerWidth();
        elementData.tagName = elementTagName;
        elementData.parents = this.getAllParents(element);
        elementData.children = this.getAllChildren(element);
        elementData.attrs = this.getElementAttributes(element);
        elementData.cssSettings = this.getCssSettings(elementData.selectorString);

        if (element.innerHTML !== "") {
            elementData.html = element.innerHTML;
        }
        else {
            elementData.html = element.outerHTML;
        }
        if ($(elementData.selectorString).closest('a').length > 0) {
            elementData.link = $(elementData.selectorString).closest('a').attr('href');
        }
        else {
            elementData.link = '';
        }
        elementData.position = {x: 50, y: 50};
        elementData.parentNodeSelector = this.getElementTreeSelector(element.parentNode);
        if (element.parentNode.innerHTML !== "") {
            elementData.parentNodeHTML = element.parentNode.innerHTML;
        }
        else {
            elementData.parentNodeHTML = element.parentNode.outerHTML;
        }
        if (element.tagName === 'IMG') {
            elementData.imgSrc = $(elementData.selectorString).attr('src');
        }
        elementData.hyperLink = false;
        elementData.linkNewTab = false;
        if ($(elementData.selectorString).closest('a').length > 0) {
            elementData.editHyperLink = true;
            elementData.hyperLink = $(elementData.selectorString).closest('a').attr('href');
            if ($(elementData.selectorString).closest('a').attr('target') === '_blank') {
                elementData.linkNewTab = true;
            }
        }
        else if (!($(elementData.selectorString).children().    length > 0)) {
            elementData.makeHyperLink = true;
        }
        this.selectedElement = elementData;
        $('#insElemOverlay').show().css({
            top: elementData.offset.top,
            left: elementData.offset.left,
            width: elementData.width,
            height: elementData.height
        });

        pm.send(window.parent, 'elementSelected', elementData);
        pm.send(window.parent, 'setCustomMenu', elementData);
        console.log(elementData);
    };


    overHandler = (event) => {
        const elementTagName = event.target.tagName.toLowerCase();
        const element = event.target;
        if (this.elementIsExceptional(event.target)) {
            return false;
        }

        if (this.elementIsBorder(event.target)) {
            return false;
        }
        if (this.exceptTags.indexOf(elementTagName) > -1) {
            return false;
        }

        this.removeShowedElementBorder();
        const elemOffset = $(element).offset();
        const elemHeight = $(element).outerHeight();
        const elemWidth = $(element).outerWidth();
        $('#insElemBorderLeft').show().css({top: elemOffset.top, left: elemOffset.left - 2, height: elemHeight});
        $('#insElemBorderRight').show().css({
            top: elemOffset.top,
            left: elemOffset.left + elemWidth,
            height: elemHeight
        });
        $('#insElemBorderTop').show().css({
            top: elemOffset.top - 2,
            left: elemOffset.left - 2,
            width: elemWidth + 4
        });
        $('#insElemBorderBottom').show().css({
            top: elemOffset.top + elemHeight,
            left: elemOffset.left - 2,
            width: elemWidth + 4
        });
    };

    removeShowedElementBorder = () => {
        $('#insElemShowLeft').hide();
        $('#insElemShowRight').hide();
        $('#insElemShowTop').hide();
        $('#insElemShowBottom').hide();
    };

    removeElemOverlay = function () {
        $('#insElemBorderLeft').hide();
        $('#insElemBorderRight').hide();
        $('#insElemBorderTop').hide();
        $('#insElemBorderBottom').hide();
        $('#insElemOverlay').hide();
    };

    getElementAttributes = (selectorString) => {
        let el = $(selectorString);
        const attrs = [];
        if (el.length > 0) {
            el = el[0];
            let i = 0, atts = el.attributes, n = atts.length, arr = [];
            for (; i < n; i++) {
                attrs.push({'attr': atts[i].nodeName, 'val': atts[i].nodeValue});
            }
        }
        return attrs;
    };

    getCssSettings = (selectorString) => {
        const styles = {};
        for (const key of Object.keys(this.cssSettings)) {
            let settings = this.cssSettings[key];
            for (let setting of settings){
              styles[setting.name] = $(selectorString).css(setting.name)
            }
        }
        return styles;
    };

    getAllParents = (element) => {
        const parents = [];
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
            const parent = {};
            parent.selectorString = this.getElementTreeSelector(element);
            parent.tagName = element.tagName;
            parents.push(parent);
        }
        return parents;
    };

    getAllChildren = (element) => {
        const children = [];
        const eleChildren = $(element).children();
        let i = 0, j = eleChildren.length;
        for (; i < j; i++) {
            const elemChild = eleChildren[i];
            const child = {};
            child.selectorString = this.getElementTreeSelector(elemChild);
            child.tagName = elemChild.tagName;
            children.push(child);
        }
        return children;
    };

    unsetEventHandlers  = () => {
        console.log('unset event handler roi ha');
        document.removeEventListener('click', this.clickHandler, true);
        document.removeEventListener('mouseover', this.overHandler, true);
    };
}

export default new ElementSelectorHandler()

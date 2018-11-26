import $ from 'jquery';

class ElementSelectorHandler {
    constructor(props) {
        console.log('Init element selector handler');
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

    setEventHandler() {
        window.document.addEventListener('click', this.clickHandler, true);
        window.document.addEventListener('mouseover', this.overHandler, true);
    }

    clickHandler(event) {
        console.log('clicked');
    }


    overHandler = (event) => {
        const elementTagName = event.target.tagName.toLowerCase();
        const element = event.target;
        this.removeShowedElementBorder()
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

    removeShowedElementBorder() {
        $('#insElemShowLeft').hide();
        $('#insElemShowRight').hide();
        $('#insElemShowTop').hide();
        $('#insElemShowBottom').hide();
    }
}

export default new ElementSelectorHandler()

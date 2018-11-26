import frametalk from 'frametalk'
import $ from 'jquery';

class ElementSelectorHandler {
    constructor(props) {
        console.log('Init element selector handler');
    }

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

import $ from 'jquery';
import 'jquery-ui';

class ElementMoveHandler {
    constructor(){
        this.moveSelectors = {
            'cancelMove': {prefix: '#', name: 'insCancelMove'},
            'moveHelperOverlay': {prefix: '#', name: 'insMoveOverlay'},
            'moveHelperContainer': {prefix: '#', name: 'insMoveContainer'}
        };
        this.zIndexValues = {'movableElement': 2147483642, 'movableOverlay': 2147483645};
        this.selectedMovableElement = null;

    }

    getSelector = (alias, justName) => {
        const selector = this.moveSelectors[alias];
        return justName ? selector['name'] : selector['prefix'] + selector['name'];
    };

    removeMoveHelpers = () => {
        $(this.getSelector('moveHelperContainer')).remove();
        $(this.getSelector('moveHelperOverlay')).remove();
        $(this.getSelector('cancelMove')).remove();
    };

    appendMoveHelpers = () => {
        $('<div/>', {
            'id': this.getSelector('moveHelperContainer', true),
            'class': 'insElem'
        }).append($('<div/>', {
            'id': this.getSelector('moveHelperOverlay', true),
            'class': 'insElem'
        }).css({'display': 'block'}).append($('<div/>', {'id': this.getSelector('cancelMove', true)}))).appendTo('body');
        this.setEvents();
    };

    setEvents = function () {

    };

    getElementCssSettings = (element) => {
        return {
            top: element.css('top'),
            left: element.css('left'),
            width: element.css('width'),
            height: element.css('height'),
            position: element.css('position'),
            'z-index': element.css('z-index'),
            'max-width': element.css('max-width')
        };
    };

    prepareForMove = (selectedElement) => {
        this.selectedMovableElement = $(selectedElement.selectorString);
        const elementOldSettings = this.getElementCssSettings(this.selectedMovableElement);
        this.removeMoveHelpers();
        this.appendMoveHelpers();
        this.selectedMovableElement.css('position', 'static');
        $(this.getSelector('moveHelperContainer')).css({
            'position': 'absolute',
            'display': 'block',
            'top': this.selectedMovableElement.offset().top,
            'left': this.selectedMovableElement.offset().left,
            'width': this.selectedMovableElement.width(),
            'height': this.selectedMovableElement.height()
        });
        this.selectedMovableElement.css({
            'position': 'relative',
            'z-index': this.zIndexValues['movableElement'],
            'max-width': 'none'
        });
        /*$(this.getSelector('moveHelperOverlay')).adjustHelper({
            top: 0,
            left: 0,
            width: 0,
            height: 0
        }, this.selectedMovableElement);*/
        this.prepareMovableOverlay();
    };

    setMovableElementPosition = ($referenceElement) => {
        this.selectedMovableElement.css({'top': $referenceElement.css('top'), 'left': $referenceElement.css('left')});
    };

    setMovableElementSize = ($referenceElement) => {
        this.selectedMovableElement.css({'width': $referenceElement.width(), 'height': $referenceElement.height()});
    };


    setMovableOverlaySize = ($referenceElement) => {
        $(this.getSelector('moveHelperOverlay')).css({
            'width': $referenceElement.width(),
            'height': $referenceElement.height()
        });
    };

    prepareMovableOverlay = () => {
        const $moveHelperOverlay = $(this.getSelector('moveHelperOverlay'));
        $moveHelperOverlay.draggable({
            containment: 'body',
            cursor: 'move',
            zIndex: this.zIndexValues['movableOverlay'],
            drag: () => {
                this.setMovableElementPosition($moveHelperOverlay);
                this.setMovableOverlaySize(this.selectedMovableElement);
            }
        }).resizable({
            handles: 'n,e,s,w,ne,se,sw,nw', resize: () => {
                this.setMovableElementPosition($moveHelperOverlay);
                this.setMovableElementSize($moveHelperOverlay);
            }
        }).css({
            'position': 'relative',
            'left': this.selectedMovableElement.css('left'),
            'top': this.selectedMovableElement.css('top'),
            'width': this.selectedMovableElement.width(),
            'height': this.selectedMovableElement.height()
        });
        $('.ui-resizable-handle').addClass('movable-resize-handler');
    };
}

export default new ElementMoveHandler();
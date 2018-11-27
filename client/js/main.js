import $ from 'jquery';
import pm from 'post-robot';
import elementSelectorHandler from './elementSelectorHandler';
import elementMoveHandler from './elementMoveHandler';

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
    }
}

export default new Main();
import $ from 'jquery';
import pm from 'post-robot';
import elementSelectorHandler from './elementSelectorHandler';
import elementMoveHandler from './elementMoveHandler';

function setupListeners() {
    pm.on('setEditMode', (event, data) => {
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
}

$(document).ready(function () {
    console.log('frame is ready');
    elementMoveHandler.setElementSelectEventHandler = elementSelectorHandler.setEventHandler;
    setupListeners();
});

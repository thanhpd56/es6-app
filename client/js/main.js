import $ from 'jquery';
import pm from 'post-robot';
import elementSelectorHandler from './elementSelectorHandler';

$(document).ready(function () {
    console.log('frame is ready');
    pm.on('setEditMode', (event, data) => {
        elementSelectorHandler.addElementOverlay();
        elementSelectorHandler.setEventHandler();
    });
});

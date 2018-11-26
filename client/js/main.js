import $ from 'jquery';
import frametalk from 'frametalk';
import elementSelectorHandler from './elementSelectorHandler';

$(document).ready(function () {
    console.log('frame is ready');
    frametalk.on('setEditMode', (event, data) => {
        elementSelectorHandler.setEventHandler();
    });
});

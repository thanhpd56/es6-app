import readingTime from "reading-time";
import pm from 'post-robot';
import $ from 'jquery';
import elementSelectorHandler from './elementSelectorHandler';

function initElements() {
    elementSelectorHandler.addOverlay();
    elementSelectorHandler.clickEvents();
    elementSelectorHandler.setEvents();
}

function setupListeners() {
    pm.on('elementSelected', event => {
        const selectedElement = event.data;
        elementSelectorHandler.handleElementSelected(selectedElement);
    });
    pm.on('setCustomMenu', event => {
        console.log('show custom menu');
        const selectedElement = event.data;
        elementSelectorHandler.setCustomMenu(selectedElement);
    })
}

$(document).ready(function () {
    initElements();
    setupListeners();
    pm.send($('#edit-frame')[0].contentWindow, 'setEditMode');
});

window.calcRT = ev => {
	var stats = readingTime(ev.value).text;

	document.getElementById("readingTime").innerText = stats + 'thanh';
};

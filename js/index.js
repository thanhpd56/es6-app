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
        const selectedElement = event.data;
        elementSelectorHandler.setCustomMenu(selectedElement);
    });

    pm.on('removePageOverlay', () => elementSelectorHandler.removeOverlay());

    pm.on('removeMenu', elementSelectorHandler.removeMenu);
}

$(document).ready(function () {
    let pmTarget = $('#edit-frame')[0].contentWindow;
    elementSelectorHandler.pmTarget = pmTarget;
    initElements();
    setupListeners();
    pm.send(pmTarget, 'setEditMode');
});

window.calcRT = ev => {
	var stats = readingTime(ev.value).text;

	document.getElementById("readingTime").innerText = stats + 'thanh';
};

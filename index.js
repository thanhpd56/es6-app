import readingTime from "reading-time";
import pm from 'post-robot';
import $ from 'jquery';

$(document).ready(function () {
    console.log('document is ready');
    console.log($('#edit-frame').attr('src'));
    $('#myid').addClass('selected');

    $('li').eq(1).click(function () {
        $('#myid').addClass('highlight');
    });
    pm.send($('#edit-frame')[0].contentWindow, 'setEditMode');
    pm.on('elementSelected', event => {
        console.log(event);
    })
});

window.calcRT = ev => {
	var stats = readingTime(ev.value).text;

	document.getElementById("readingTime").innerText = stats + 'thanh';
};

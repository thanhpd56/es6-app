import readingTime from "reading-time";
import frametalk from 'frametalk';
import $ from 'jquery';

$(document).ready(function () {
    console.log('document is ready');
    console.log($('#edit-frame').attr('src'));
    $('#myid').addClass('selected');

    $('li').eq(1).click(function () {
        $('#myid').addClass('highlight');
    })
    frametalk.send($('#edit-frame')[0].contentWindow, 'setEditMode', {mode: 'edit'})
});

window.calcRT = ev => {
	var stats = readingTime(ev.value).text;

	document.getElementById("readingTime").innerText = stats + 'thanh';
};

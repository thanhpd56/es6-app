import $ from 'jquery';

class ElementSelectorHandler {
    constructor() {
        console.log('init main element selector handler');
    }

    addOverlay = () => {
        this.selectElementOverlay = $('<div/>', {
            id: 'selectElementOverlay'
        }).appendTo('body');
    };

    handleElementSelected = (selectedElement) => {
        this.selectedElement = selectedElement;
        this.pageOverlay();
    };

    pageOverlay = () => {
        console.log('show overlay');
        this.selectElementOverlay.show();
    };
}

export default new ElementSelectorHandler();
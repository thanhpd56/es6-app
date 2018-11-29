import readingTime from "reading-time";
import pm from 'post-robot';
import $ from 'jquery';
import '@fancyapps/fancybox';
import elementSelectorHandler from './elementSelectorHandler';


window.calcRT = ev => {
	var stats = readingTime(ev.value).text;

	document.getElementById("readingTime").innerText = stats + 'thanh';
};

class Customization {
    camp = {
        id: 1
    };

    customizationTypes = {
        'css': {'function': 'setCssSettings'},
        'click': {'function': 'setClickSettings'},
        'remove': {'function': 'removeElement', 'closeMenu': true},
        'changedText': {'function': 'setChangedText'},
        'changedImage': {'function': 'setChangedImage'},
        'insertedHTML': {'function': 'setInsertHTML'},
        'insertImage': {'function': 'setInsertImage'},
        'editHyperLink': {'function': 'setEditHyperLink'},
        'makeHyperLink': {'function': 'setMakeHyperLink'},
        'elementAttr': {'function': 'setElementAttr'},
        'slide': {'function': 'setSlideSettings'},
        'rearrangeElement': {'function': 'setRearrangePosition'},
        'moveElement': {'function': 'setMovePosition'}
    };

    pmTarget = null;
    customizationList = [];

    constructor(){
        $(document).ready(() => {
            this.pmTarget = $('#edit-frame')[0].contentWindow;
            elementSelectorHandler.pmTarget = this.pmTarget;
            this.initElements();
            this.setupListeners();
            pm.send(this.pmTarget, 'setEditMode');
        });
    }


    setupListeners = () => {
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

        pm.on('setElementMovedPosition', (event) => {
            return this.setElementMovedPosition(event.data);
        })
    };

    initElements = () => {
        elementSelectorHandler.addOverlay();
        elementSelectorHandler.setEvents();
        this.clickEvents();
    };
    clickEvents = () => {
        const eventWrapper = $('body');

        eventWrapper.on('click', '.select-element-menu-close',  () => {
            this.closeElementMenu();
        });

        eventWrapper.on('click', '.element-move', () => {
            this.moveElement();
        });

        eventWrapper.on('click', '.element-remove', () => {
            this.removeElement();
        });

        eventWrapper.on('click', '.edit-text', () => {
            this.openFancyBox('edit-text', {'height': '450'});
        });


    };

    moveElement = () => {
        pm.send(this.pmTarget, 'prepareElementForMove', elementSelectorHandler.selectedElement)
    };

    setElementMovedPosition = (data) => {
        data.type = 'moveElement';
        this.setChange(data);
    };

    setChange = (customization) => {
        const selectedElement = elementSelectorHandler.selectedElement;
        customization.selectorString = selectedElement.selectorString;
        customization.id = this.createElementClass();
        customization.parentNodeSelector = selectedElement.parentNodeSelector;
        customization.parentNodeHTML = selectedElement.parentNodeHTML;

        this.applyCustomization(customization, 'new');
    };

    createElementClass() {
        return 'sp-custom-' + this.camp.id + '-' + new Date().getTime();
    }

    getCustomizationSettings = (type) => {
        return this.customizationTypes[type];
    };

    applyCustomization = (customization, changeType, customIndex) => {
        const setting = this.getCustomizationSettings(customization.type);

        if (typeof setting === 'undefined') {
            return false;
        }

        pm.send(this.pmTarget, setting.function, customization).then(data => {
            if (changeType === 'new') {
                this.customizationList.push(data);
            }
            else if (changeType === 'update') {
                this.customizationList[customIndex] = data;
            }

            if (typeof setting.closeMenu === 'undefined' || setting.closeMenu === true) {
                this.closeElementMenu();
            }
        }).catch(err => {
            console.log('that bai roi');

        });

        console.log(this.customizationList);

        /*ActionBuilder.sendPM({
            target: that.pmTarget,
            type: setting.function,
            data: customization,
            success: function (data) {
                if (changeType === 'new') {
                    that.customizationList.push(data);
                }
                else if (changeType == 'update') {
                    that.customizationList[customIndex] = data;
                }

                that.updateHistoryList();
                ActionBuilder.MenuHandler_Helper.activeUndo();

                if (typeof setting.closeMenu === 'undefined' || setting.closeMenu === true) {
                    that.closeElementMenu();
                }
            }
        });*/
    };

    closeElementMenu = () => {
        elementSelectorHandler.removeMenu();
        elementSelectorHandler.removeOverlay();
    };

    removeElement = () => {
        const data = {};
        data.type = 'remove';

        this.setChange(data);
    };

    openFancyBox(parameter, dimensions) {
        // default fancybox sizes
        let height = 600;
        let width = 960;

        if (dimensions) {
            if (typeof dimensions.width !== 'undefined') {
                width = dimensions.width;
            }

            if (typeof dimensions.height !== 'undefined') {
                height = dimensions.height;
            }
        }

        $.fancybox({
            padding: 0,
            margin: 0,
            type: 'iframe',
            autoSize: false,
            width: width,
            height: height,
            href: url,
            openSpeed: 'normal',
            closeSpeed: 'fast',
            openEffect: 'none',
            closeEffect: 'none',
            beforeShow: function () {
                elementSelectorHandler.removeMenu();
            },
            afterShow: function () {
                elementSelectorHandler.removeOverlay();
            }
        });
    }
}

export default new Customization();

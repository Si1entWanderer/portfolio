const getElementAttribute = (element, attributePosition, attribute) => {
    if(!element || !attribute || !attributePosition) return;
    attributePosition = attributePosition ? '-' + attributePosition : '';
    let attributeValue = window.getComputedStyle(element, null).getPropertyValue(attribute + attributePosition);
    attributeValue = attributeValue.replace('px', '');
    console.log(attribute + ': ' + attributeValue)
    return attributeValue;
}

const getScrollBarWidth = () => {
    const hiddenBlock = document.createElement('div');
    let scrollBarWidth = 0;
    setHiddenBlockAttrs(hiddenBlock);
    document.body.append(hiddenBlock);
    scrollBarWidth = hiddenBlock.offsetWidth - hiddenBlock.clientWidth;
    hiddenBlock.remove();
    return scrollBarWidth;
}

const setHiddenBlockAttrs = (block) => {
   block.style.padding = 0;
   block.style.margin = 0;
   block.style.border = 'none';
   block.style.overflowY = 'scroll';
}

const cssClassToggle = ({
    target,
    cssClass, 
    onAddExtraAction = false, 
    onRemoveExtraAction = false}
) => {
    if(target){
        if(target.classList.contains(cssClass)){
            target.classList.remove(cssClass);
            if(onRemoveExtraAction){
                onRemoveExtraAction()
            }
        } else {
            target.classList.add(cssClass);
            if(onAddExtraAction){
                onAddExtraAction()
            }
        }
    } else return;
}

const bodyAddScrollPadding = ()=>{
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollBarWidth() + 'px';
}

const bodyRemoveScrollPadding = ()=>{
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = 0;
}
/**
 * Раскрытие/ закрытие меню
 */
const toggleMenu = ({menuSelector, activeClass})=>{
    console.log(menuSelector,activeClass)
    const menu = document.querySelector(menuSelector);
    if(menu){
        menu.classList.toggle(activeClass);
    }
}

/**
 * Открытие/закрытие меню по событию
 */
const openMenu = (event, targetSelector, action, actionArgs)=>{
    const button = document.querySelector(targetSelector);
    if(button){
        button.addEventListener(event, ()=>{
            action(actionArgs);
        })
    }
}
// '.advantages',
// '.advantages',
// '.our-flats',
// '.client-view',
// '.flat-inside',
// '.map-block',
// '.questions',

const sections = [
    '.advantages',
    '.our-flats',
    '.client-view',
    '.flat-inside',
    '.map-block',
    '.questions' ,
];

const getBlocksPositions = (selectors = []) => {
    let positions = {};
    selectors.forEach((selector) => {
        const elem = document.querySelector(selector);
        positions[selector] = elem.getBoundingClientRect().top;
    })
    return positions;
}

const scrollListener = () => {
    let scroll = true;
    const blocks = getBlocksPositions(sections);
    window.addEventListener('scroll', ()=>{
        if(scroll){
            scroll = false;

            scrollCallback({
                blocksSelectors: blocks
            });

            setTimeout(()=>{scroll = true}, 100)
        } else {
            return;
        }
    })
}

const scrollCallback = ({
    blocksSelectors = {}
}) => {
    showBlocks(blocksSelectors);
}

const showBlocks = (blocks) => {
    const currentPosition = window.scrollY + window.innerHeight / 2;
    
    for(let blockSelector in blocks){
        const element = document.querySelector(blockSelector);
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        if(currentPosition > elementPosition) {
            cssClassToggle({
                target: element,
                cssClass: 'animation__hide--active', 
            })
            delete blocks[blockSelector];
            continue;
        } else {
            continue;
        }
    }
}

const videoStop = (videoSelector) => {
    const videoElem = document.querySelector(videoSelector);
    if(videoElem){
        videoElem.pause();
    } else {
        console.log('Элемент "' + videoSelector + '" не найден');
    }
}

const videoPopupOpenCb = ()=>{
    bodyAddScrollPadding();
}

const videoPopupCloseCb = ()=>{
    bodyRemoveScrollPadding();
    videoStop('#overview');
}
const popup = ({
        eventTargetSelector,
        actionClass,
        actionTargetSelector,
        event,
        targetClassContainsRequired = false,
        classAddActionCallback = false,
        classRemoveActionCallback = false
    }) => 
{
    const eventTarget = document.querySelector(eventTargetSelector);
    const actionTarget = document.querySelector(actionTargetSelector);

    if(!eventTarget || !actionTarget) return;

    eventTarget.addEventListener(event, (e)=>{
        const targetClass = eventTargetSelector.substring(1, eventTargetSelector.length);
        if( targetClassContainsRequired && !e.target.classList.contains(targetClass))
        {
            return;
        }

        cssClassToggle({
            target: actionTarget,
            cssClass: actionClass, 
            onAddExtraAction: classAddActionCallback, 
            onRemoveExtraAction: classRemoveActionCallback});
        
    })
    
}

document.addEventListener('DOMContentLoaded',()=>{

    openMenu('click', 
            '.burger',
            toggleMenu,
            { menuSelector: '.mobile-slider',
                activeClass: 'mobile-slider--active'
    });

    openMenu('click', 
            '.mobile-slider .close',
            toggleMenu,
            {   menuSelector: '.mobile-slider',
                activeClass: 'mobile-slider--active'
    });

    popup({
        eventTargetSelector: '.video-preview__play',
        actionClass: 'popup--opened-video',
        actionTargetSelector: '.popup',
        event: 'click',
        classAddActionCallback: videoPopupOpenCb,
        classRemoveActionCallback: videoPopupCloseCb
    });

    popup({
        eventTargetSelector: '.popup',
        actionClass: 'popup--opened-video',
        actionTargetSelector: '.popup',
        event: 'click',
        targetClassContainsRequired: true,
        classAddActionCallback: videoPopupOpenCb,
        classRemoveActionCallback: videoPopupCloseCb
    });

    popup({
        eventTargetSelector: '.popup__close',
        actionClass: 'popup--opened-video',
        actionTargetSelector: '.popup',
        event: 'click',
        classAddActionCallback: videoPopupOpenCb,
        classRemoveActionCallback: videoPopupCloseCb
    });

    showBlocks();

    scrollListener();

})
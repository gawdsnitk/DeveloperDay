$('span.close-button').on('click',function(){
    $('.sidebar').css({
        display: 'none'
    });
    $('.presentation-area').css({
        width: '100%'
    });
    $('div#show-chat').css({
        opacity: 1
    });
});
$('div#show-chat').on('click',function(){
    $('.sidebar').css({
        display: 'block'
    });
    var width = window.innerWidth - $('.sidebar').width();
    $('.presentation-area').css({
        width: width
    });
    $('div#show-chat').css({
        opacity: 0
    });
});

var SlideIndex = parseInt(window.location.href.split('#')[1]);
if (isNaN(SlideIndex)) SlideIndex= 0;
SlideIndex = Math.abs(SlideIndex);

var DOM = {
    curSlide : SlideIndex,
    previousSlide : SlideIndex > 0 ? SlideIndex - 1 : 0 ,
    totalSlides: 0,
    slideMonitor: $('#SlideMonitor')
};

slides = $('.slide').toArray();
DOM.totalSlides = slides.length;
if(DOM.curSlide > slides.length - 1) {
    DOM.curSlide = 0;
    DOM.previousSlide = 0;
    window.history.pushState(DOM.curSlide, 'Slide - ' + DOM.curSlide, window.location.href.split('#')[0] + '#' + DOM.curSlide);
}
DOM.slideMonitor.html((DOM.curSlide+1)+"/"+slides.length);
$(slides[DOM.curSlide]).css({
    display: 'block',
    opacity: 1
});

function slideChange(dir){
    DOM.previousSlide = DOM.curSlide;
    if(DOM.curSlide == 0 && dir == -1)   DOM.curSlide = DOM.totalSlides;
    DOM.curSlide = (DOM.curSlide+dir)%DOM.totalSlides;
    var SlideOut = $(slides[DOM.previousSlide]);
    t.killTweensOf(SlideOut);
    t.to(SlideOut,0.5,{
    marginLeft: ''+(dir>0 ? -20 : 40)+'px',
    opacity: 0,
    onComplete: function(){
            t.set(SlideOut,{
                display: 'none',
                onComplete: function(){
                    var SlideIn = $(slides[DOM.curSlide]);
                    t.killTweensOf(SlideIn);
                    t.staggerFromTo(SlideIn.children(),0.5,{
                        x: ''+(dir>0 ? 100 : -100)+'px',
                        opacity: 0
                    },{
                        x: 0,
                        opacity: 1,
                        ease: Back.easeOut
                    },0.1);
                    t.fromTo(SlideIn,1, {
                        display: 'block',
                        margin: 0,
                        opacity: 0
                    },{
                        opacity: 1
                    });
                    DOM.slideMonitor.html((DOM.curSlide+1)+"/"+slides.length);
                    window.history.pushState(DOM.curSlide, 'Slide - ' + DOM.curSlide, window.location.href.split('#')[0] + '#' + DOM.curSlide);
                }
            });
        }
    });
}
$('span.slide-control-left').on('click',function(){
    slideChange(-1);
});
$('span.slide-control-right').on('click',function(){
    slideChange(1);
});
$(window).bind('keyup',function(e){
    if(e.keyCode == 37)     slideChange(-1);
    else if(e.keyCode == 39)   slideChange(1);
});

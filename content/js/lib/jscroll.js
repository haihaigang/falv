/**
 * Created by IntelliJ IDEA.
 * User: hgwang
 * Date: 13-7-22
 * Time: 下午2:42
 * To change this template use File | Settings | File Templates.
 */

(function (window, doc) {
    var hasTouch = 'ontouchstart' in window,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',

        jScroll = function (el, options) {
            var that = this, i;

            // Default options
            that.options = {
                onBeforeScrollStart: function (e) { //e.preventDefault(); 
                },
                onScrollEnd: null
            };

            for (i in options) that.options[i] = options[i];

            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
            that.scroller = that.wrapper.children[0];

            that.refresh();
            that._bind(START_EV);
        }

    jScroll.prototype = {
        x:0,
        pointX:0,
        pointY:0,
        distX:0,
        absStartX:0,
        dirX:0,
        currPageX:0,
        pagesX:0,
        snapThreshold:1,

        handleEvent:function (e) {
            var that = this;
            switch (e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV:
                    that._move(e);
                    break;
                case END_EV:
                case CANCEL_EV:
                    that._end(e);
                    break;
            }
        },

        _start:function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            that.dirX = 0;
            that.distX = 0;
            that.distY = 0;
            that.pointX = point.pageX;
            that.pointY = point.pageY;
            that.absStartX = that.x;

            that._bind(MOVE_EV);
            that._bind(END_EV);
            that._bind(CANCEL_EV);
        },

        _move:function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX;

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.x + (deltaX / 2);
            }

            that.distX += deltaX;
            that.distY += deltaY;

            if(Math.abs(that.distY) <= Math.abs(that.distX) && Math.abs(that.distX) >= 6){
                e.preventDefault();
                that.scrollTo(newX, 0);
                that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                that.x = newX;
            }
        },

        _end:function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                newPosX = that.x,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                distX;

            that._unbind(MOVE_EV);
            that._unbind(END_EV);
            that._unbind(CANCEL_EV);

            //TODO
            if(hasTouch){
                that.doubleTapTimer = setTimeout(function () {
                    that.doubleTapTimer = null;

                    // Find the last touched element
                    target = point.target;
                    while (target.nodeType != 1) target = target.parentNode;

                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                        ev = doc.createEvent('MouseEvents');
                        ev.initMouseEvent('click', true, true, e.view, 1,
                            point.screenX, point.screenY, point.clientX, point.clientY,
                            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                            0, null);
                        ev._fake = true;
                        target.dispatchEvent(ev);
                    }
                }, that.options.zoom ? 250 : 0);
            }

            var page = that.pagesX - 1;
            for (var i = 0, l = that.pagesX; i < l; i++) {
                if (newPosX >= -that.warpperW * i) {
                    page = i;
                    break;
                }
            }

            distX = newPosX - that.absStartX;
            if (Math.abs(distX) < that.snapThreshold) {
                page = that.currPageX;
            } else {
                if (page == that.currPageX && page > 0 && that.dirX < 0) {
                    page--;
                }
            }
            newPosX = -that.warpperW * page;
            that.currPageX = page;
            that.scrollTo(newPosX, 0, true);

            that.x = newPosX;
        },

        _bind:function (type, el, bubble) {
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind:function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },

        refresh:function () {
            var that = this;
            that.warpperW = that.wrapper.clientWidth;
            that.maxScrollX = that.wrapper.clientWidth - that.scroller.offsetWidth;
            that.pagesX = that.scroller.children.length;
        },

        scrollTo:function (x, y, time) {
            var that = this;

            if (time) {
                that.scroller.style['-webkit-transition'] = '-webkit-transform 200ms cubic-bezier(0.33,0.66,0.66,1)';

                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
            }else{
                that.scroller.style['-webkit-transition'] = '-webkit-transform 0ms ease';
            }
            that.scroller.style['-webkit-transform'] = 'translate(' + x + 'px,' + y + 'px)';
            
            that.x = x;

        }
    };

    window.jScroll = jScroll;
})(window, document);
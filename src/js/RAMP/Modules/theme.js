/*global define, TimelineLite, TweenLite, $ */

/**
* This submodule contains theme-specific classes with animation sequences such as Full Screen transition or tooltip
* setter helper method.
*
* @module RAMP
* @submodule Theme
*
*/

/**
*
*
* @class Canada-Theme
* @uses Util
*/

define(['utils/util', 'utils/popupManager'],
    function (UtilMisc, PopupManager) {
        'use strict';

        var body = $('body');
        var wbCore = $('main');
        var wbFoot = $('footer');
        var footContainer = wbFoot.find('.footer-container');

        var megaMenuDiv = $('#wb-sm');

        //var navigation = $('#wb-bar');
        //var title = navigation.next();

        var header = $('body>header');

        var transitionDuration = 0.5;

        var layout = {
                headerHeight: 194,
                headerHeightCollapsed: 56,

                footerHeight: 84,
                footerHeightCollapsed: 5,

                //subtitleHeight: 35,

                toolbarHeight: 32,
            };

        // height gain from the fullscreening the template
        var heightGain = layout.headerHeight - layout.headerHeightCollapsed +
                         layout.footerHeight - layout.footerHeightCollapsed;

        var footerTimeLine = new TimelineLite(
                {
                    paused: true,
                });

        var isFullScreen = false;
        var fullScreenTimeLine = new TimelineLite({ paused: true });
        var subpanelTimeline = new TimelineLite();

        footerTimeLine
            .to(footContainer, transitionDuration, { height: '471px', ease: 'easeOutCirc' })

            // this is needed to reset scroll when you tab to links in the footer nav
            .set(footContainer, { scrollTop: 0 }, 0)
            .set(wbFoot, { className: '+=expanded' }, 0);

        // tweening wet template parts
        fullScreenTimeLine
            .to(header, transitionDuration, { top: '-99px', position: 'relative', ease: 'easeOutCirc' }, 0)
            .set([megaMenuDiv], { display: 'none !important' })

            //.to(title, transitionDuration, { top: '-22px' }, 0)

            //.fromTo(body, transitionDuration, { 'background-position-y': '43px' },
            //    { 'background-position-y': '-26px', ease: 'easeOutCirc' }, 0)
            .to(wbCore, transitionDuration,
                { top: layout.headerHeightCollapsed, bottom: layout.footerHeightCollapsed, ease: 'easeOutCirc' }, 0)
            .to(wbFoot, transitionDuration, { height: layout.footerHeightCollapsed, ease: 'easeOutCirc' }, 0)

            // set full-screen class here, not in the callback since callbacks can be overwritten
            // by fullScreenCallback function
            .call(function () { body.addClass('full-screen'); })

            .add(subpanelTimeline, 0); // special timeline to tween subpanels

        /**
         * Toggles full screen mode
         *
         * @method _toggleFullScreenMode
         * @param  {Boolean} fullscreen true - full screen on; false - full screen off; undefined - toggle;
         */
        function _toggleFullScreenMode(fullscreen) {
            subpanelTimeline
                .clear() // need to recreate this timeline every time to capture newly created subpanels
                .fromTo('.sub-panel-container.summary-data-details', transitionDuration,
                    {
                        top: layout.headerHeight + layout.toolbarHeight,
                        bottom: layout.footerHeight,
                    },
                    {
                        top: layout.headerHeightCollapsed + layout.toolbarHeight,
                        bottom: layout.footerHeightCollapsed,
                        ease: 'easeOutCirc',
                    }, 0)
                .fromTo('.sub-panel-container.full-data-details', transitionDuration,
                    {
                        top: layout.headerHeight,
                        bottom: layout.footerHeight,
                    },
                    {
                        top: layout.headerHeightCollapsed,
                        bottom: layout.footerHeightCollapsed,
                        ease: 'easeOutCirc',
                    }, 0);

            isFullScreen = UtilMisc.isUndefined(fullscreen) ? !isFullScreen : fullscreen;

            if (isFullScreen) {
                // need to tween datatables separately since it's very cumbersome to calculate their exact height -
                // easier just to adjust height up/down by height gained when fullscreening the template
                TweenLite
                    .to('.full-data-mode .dataTables_scrollBody', transitionDuration,

                        // animate height of the datatable scrollBody since it's explicitly set ,
                        { height: '+=' + heightGain, ease: 'easeOutCirc', delay: 0.02 });

                fullScreenTimeLine.play();

            } else {
                TweenLite
                    .to('.full-data-mode .dataTables_scrollBody', transitionDuration - 0.02,

                        // animate height of the datatable scrollBody since it's explicitly set ,
                        { height: '-=' + heightGain, ease: 'easeInCirc' });

                body.removeClass('full-screen');
                fullScreenTimeLine.reverse();
            }
        }

        // register a popup to open footer navigation on hover and focus
        PopupManager.registerPopup(wbFoot, 'hoverIntent, focus',
            function (d) {
                footerTimeLine.eventCallback('onComplete',
                    function () {
                        d.resolve();
                    });

                footerTimeLine.play();
            },

            {
                targetSelector: '.wb-navcurr, .wb-navcurr a',
                useAria: false,
                timeout: 500,
                closeHandler: function (d) {
                    footerTimeLine.eventCallback('onReverseComplete',
                        function () {
                            // this is needed to reset scroll when you tab to links in the footer nav
                            footContainer.scrollTop(0);
                            d.resolve();
                        });

                    footerTimeLine.reverse();
                },
            }
        );

        // hide footer navigation on load
        TweenLite.to(footContainer, transitionDuration, { height: '84px', ease: 'easeOutCirc' });

        return {
            /**
             * Allows to set callbacks to the full screen transition.
             *
             * @method fullScreenCallback
             * @param  {String} event Event name to set a callback on
             * @param  {Function} func  A callback function
             * @return {Object}     This
             * @chainable
             */
            fullScreenCallback: function (event, func) {
                fullScreenTimeLine.eventCallback(event, func);

                return this;
            },

            /**
             * Returns a boolean indication whether the full screen mode is on.
             *
             * @method isFullScreen
             * @return {Boolean} true / false
             */
            isFullScreen: function () {
                return isFullScreen;
            },

            /**
            * Toggles the FullScreen mode of the application
            *
            * @method toggleFullScreenMode
            * @param  {Boolean} fullscreen true - expand; false - collapse; undefined - toggle;
            * @return {Object} This
            * @chainable
            */
            toggleFullScreenMode: function (fullscreen) {
                _toggleFullScreenMode(fullscreen);

                return this;
            },
        };
    }

);

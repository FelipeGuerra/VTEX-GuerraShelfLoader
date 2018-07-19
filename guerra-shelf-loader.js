/**
*	GuerraShelfLoader - Scroll Infinito com Memória
*	@description Carrega vitrines sem sair da página e grava a ultima vitrine vista  pelo usuário
*	@author Felipe Guerra
*	@version 0.1
*	@date 2016-09-06

    UTILIZAR:
    $('div[id*="ResultItems"]').guerraShelfLoader();
*/

(function ($) {
    $.fn.guerraShelfLoader = function(options) {

        var log = function(msg, type) {
            if (typeof console == "object")
                console.log("[Smart Research - " + (type || "Erro") + "] " + msg);
        };

        var settings = $.extend({
            shelfElement: 'div[id*="ResultItems"]',
            shelfClass: '.prateleira',
            btnLoadPrevious: '.btn-load-previous',
            btnLoadMore: '.btn-load-more'
        }, options );

        var elementPages = "pagecount_"+$('body').find(".pager:first").attr("id").split("_").pop();
            pages = window[elementPages],
            shelfElement = $(settings.shelfElement),
            shelfClass = settings.shelfClass,
            currentPage = 1,
            pageToLoad = currentPage+1,
            previousPage = currentPage-1,
            btnLoadPrevious = settings.btnLoadPrevious,
            btnLoadMore = settings.btnLoadMore,
            btnMoreElmt = '<div class="btn-load-more">Mostrar Mais</div>',
            btnPrevElmt = '<div class="btn-load-previous">Mostrar Anteriores</div>'

        var fn = {
            getSearchUrl: function() {
                var url, content, preg;
                jQuery("script:not([src])").each(function() {
                    content = jQuery(this)[0].innerHTML;
                    preg = /\/buscapagina\?.+&PageNumber=/i;
                    if (content.search(/\/buscapagina\?/i) > -1) {
                        url = preg.exec(content);
                        return false;
                    }
                });

                if (typeof(url) !== "undefined" && typeof(url[0]) !== "undefined")
                    return url[0];
                else {
                    log("Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]");
                    return "";
                }
            }
        }

        shelfElement.append(btnMoreElmt);

		if (sessionStorage.page === undefined) {
			sessionStorage.setItem('page', window.location.pathname);
		} else if ((sessionStorage.getItem('page') != window.location.pathname) && (shelfElement.length)) {
			console.info('elseif')
			$.removeCookie('storedShelfPage');
			$.removeCookie('storedShelfPageScroll');
			$.removeCookie('storedShelfPageLastPrev');
			$.removeCookie('storedShelfPageLastMore');
			sessionStorage.setItem('page', window.location.pathname);
		}


        if ($.cookie('storedShelfPage') != undefined) {
            pageToLoad == parseInt($.cookie('storedShelfPage'));
        }

		// if (sessionStorage.getItem('shelfSession') === null) {
		// 	$.cookie('storedShelfPageLastPrev')
		// 	$.cookie('storedShelfPageLastMore')
		// 	$.cookie('storedShelfPage')
		// 	$.cookie('storedShelfPageScroll')
		// }

		// $(window).scroll(function(){
		// 	var qtdPratelira = $('.prateleira .prateleira').length-1;
		// 	if (qtdPratelira>=1) {
		// 		var heightPratelira = $('.prateleira .prateleira').eq(0).height();
		// 		var scroll = $(window).scrollTop() - (heightPratelira*qtdPratelira+1) -400;
		// 		console.info('scrolltop:'+$(window).scrollTop())
		// 		console.info('heightPratelira:'+heightPratelira)
		// 		console.info('qtdPratelira:'+qtdPratelira)
		// 		console.info('scroll:'+scroll)
		// 		$.cookie('storedShelfPageScroll', scroll);
		// 	}
		// });

        function loadShelf(btnClicked) {

            if (btnClicked == 'more') {
                if ($.cookie('storedShelfPageLastPrev') === undefined) {
                    $.cookie('storedShelfPageLastPrev', parseInt($.cookie('storedShelfPage'))-1);
                }
                if ($.cookie('storedShelfPageLastMore') === undefined) {
                    $.cookie('storedShelfPageLastMore', parseInt($.cookie('storedShelfPage')));
                }

                pageToLoad = parseInt($.cookie('storedShelfPageLastMore'))+1;
                $.cookie('storedShelfPage', pageToLoad);
                $.cookie('storedShelfPageLastMore', pageToLoad);
				sessionStorage.setItem('shelfSession', 'active');
            } else if (btnClicked == 'previous') {
                if ($.cookie('storedShelfPageLastMore') === undefined) {
                    $.cookie('storedShelfPageLastMore', parseInt($.cookie('storedShelfPage'))+1);
                }
                if ($.cookie('storedShelfPageLastPrev') === undefined) {
                    $.cookie('storedShelfPageLastPrev', parseInt($.cookie('storedShelfPage')));
                }

                pageToLoad = parseInt($.cookie('storedShelfPageLastPrev'))-1;
                if (pageToLoad<1) {
                    pageToLoad=1;
                }
                $.cookie('storedShelfPage', pageToLoad);
                $.cookie('storedShelfPageLastPrev', pageToLoad);
                console.info('prev'+pageToLoad)
				sessionStorage.setItem('shelfSession', 'active');
				sessionStorage.setItem('shelfSession', 'active');
            } else {
                $.removeCookie('storedShelfPageLastPrev');
                $.removeCookie('storedShelfPageLastMore');
                if ($.cookie('storedShelfPage') === undefined) {
                    $.cookie('storedShelfPage', 1);
                }  else {
                    pageToLoad = $.cookie('storedShelfPage');
                }
            }

			if ((sessionStorage.getItem('shelfSession') !== null) && (sessionStorage.getItem('page') == window.location.pathname)) {
	            jQuery.ajax({
	                url: fn.getSearchUrl(true)+pageToLoad,
	                success: function(data) {
	                    if (data.trim().length < 1) {
	                        moreResults = false;
	                        log("Não existem mais resultados a partir da página: " + (pageToLoad - 1));
	                        shelfElement.find(btnLoadMore).fadeOut('fast');
	                    } else {
	                        if (btnClicked == 'previous'){
	                            shelfElement.find(shelfClass).first().before(data);
	                        } else if (btnClicked == 'more'){
	                            shelfElement.find(shelfClass).last().after(data);
	                        } else if ($.cookie('storedShelfPage') !== '1') {
	                            shelfElement.html(data);
	                            shelfElement.prepend(btnPrevElmt);
	                            shelfElement.append(btnMoreElmt);

								// setTimeout(function () {
								// 	if ($.cookie('storedShelfPageScroll') !== undefined) {
								// 		$(window).scrollTop($.cookie('storedShelfPageScroll'))
								// 	}
								// }, 2000);

								$(window).load(function(){
									console.info($.cookie('storedShelfPageScroll'))
									if ($.cookie('storedShelfPageScroll') !== undefined) {
										setTimeout(function () {
											if ($.cookie('storedShelfPageScroll') !== undefined) {
												$(window).scrollTop($.cookie('storedShelfPageScroll'))
											}
										}, 500);
									}
								});
	                        }
	                        if (pageToLoad == pages) {
	                            $(btnLoadMore).hide();
	                        }
	                    }

						$('.prateleira .prateleira li').on('click', function(){
							var scroll = ($(this).position().top + $('.prateleira .prateleira').offset().top)-($('.floating-header').height() + $('.left-column.hasBanner').height())
							$.cookie('storedShelfPageScroll', scroll);
							console.info(scroll)
						});

	                }
	            });
			}
        }

        loadShelf();

        $(btnLoadPrevious).live('click', function(){
            loadShelf('previous');
        });
        $(btnLoadMore).live('click', function(){
            loadShelf('more');
        });
    };
}( jQuery ));
$(document).ready(function() {

	/* === catalog li same height == */
	function setEqualHeight(columns){
		var tallestTitle = 0;
		var tallestAttr = 0;
		columns.each(function(){
			currentTitleHeight = $(this).find('a > b').height();
			currentAttrHeight = $(this).find('.attr').height();
			currentTitleHeight > tallestTitle ? tallestTitle = currentTitleHeight : null;
			currentAttrHeight > tallestAttr ? tallestAttr = currentAttrHeight : null;
		});
		
		columns.each(function(){
			$(this).find('.attr').height() != null ? $(this).find('.attr').height(tallestTitle + tallestAttr - $(this).find('a > b').height()) : $(this).find('a > b').height(tallestTitle);
		});
	}
	setEqualHeight($('.catalog li'));
	setEqualHeight($('.results li'));
	/* === /catalog li same height == */

	
	/* === go top btn == */
	$('.gotop').click(
		function(){
			$('html, body').animate({scrollTop: 0},500);
    		return false;
		}
	);
	var goTop = $('.gotop');
	window.pageYOffset > 100 ? goTop.fadeIn('slow') : goTop.fadeOut('slow');
	$(window).scroll(function(){
		$(window).scrollTop() > 100 ? goTop.fadeIn('slow') : goTop.fadeOut('slow');
	});
	/* === /go top btn == */

	/* === help popup == */
	var helperPopUp = $('.helper');
	var helperHeight = helperPopUp.height();
	var visibleHeight = $(document).height()*0.35;
	var helperTop = helperPopUp.css("top");
	function showHelper(){
		helperPopUp.css({height:"0", width:"0", top:"66%", right:"20px", visibility:"visible"})
					.addClass('freeze').animate({height:helperHeight, width:"20%", top:helperTop, right:"90px", opacity:"1"},500);
		return false;
	}
	function hideHelper(){
		helperPopUp.css({visibility:"hidden"}).addClass('freeze').animate({height:"0", width:"0", top:"66%", right:"20px", opacity:"0"},500);		
		return false;
	}
	$(window).scroll(function(){
		if ((!helperPopUp.hasClass('freeze')) && (window.pageYOffset > visibleHeight)){
			showHelper();
		}
	});
	$(document).on('click','.helper .close_help', hideHelper);
	$(document).on('click','.help_btn', function(){helperPopUp.css("opacity") == "0" ? showHelper() : hideHelper();});
	/* === /help popup == */
	
	
	/* === pop ups == */
	var opaq = $('.opaq');
	var currentPopUp;
	
	$(document).on('click','.close, .close_bnt',closePopUp);
	$(document).on('click','.opaq',closePopUp);
	
	function closePopUp(){
		opaq.fadeOut('fast');
		currentPopUp.fadeOut('fast');
		return false;
	}
	$('.popup_link').each(function(){
		$(this).on('click',function(e){
			var
				id = $(this).data('id'),
				url = $(this).data('url');
			if(typeof url != 'undefined'){
				$('#'+id).load(url,function(){
					showPopUp('#'+id);
				})
			}else{	
				showPopUp('#'+id);
			}
			e.preventDefault();
		})
	});
	$('.fb_ask').click(
		function(){
			showPopUp('#popUpAsk');
			return false;
		}
	);
	$('.fb_call').click(
		function(){
			showPopUp('#popUpCall');
			return false;
		}
	);
	$('#takeCards').click(
		function(){
			showPopUp('#popUpCards');
			return false;
		}
	);
	$('#deliveryPrice').click(
		function(){
			showPopUp('#popUpDelivery');
			return false;
		}
	);
	$('#viewBasketList').click(
		function(){
			showPopUp('#popUpBasketList');
			return false;
		}
	);

	$('.choose_other').click(
		function(){
			$('#popUpOther .title').text($(this).parent().parent().find('.basket_item_sm').text());
			showPopUp('#popUpOther');			
			return false;
		}
	);
	$('#favToEmail, #favToEmailLink').click(
		function(){
			showPopUp('#popUpFav');
			return false;
		}
	);
	function showPopUp(obj){
		currentPopUp = $(obj);
		opaq.fadeIn('fast').height($(document).height());
		currentPopUp.fadeIn('fast').css('top', $(window).scrollTop()+100);
		return false;
	}
	/* === /pop ups == */
	
	
	/* === item manipulations == */
	$(document).on('click','.take_also_title',minThis);
	function minThis(){
		//var tHeight = $(this).parent().height();
		//$(this).attr('class') == 'take_also_title' ? $(this).attr('rel',tHeight).toggleClass('take_also_max').parent().find('dl').fadeOut('fast').parent().animate({height: "50px"}, 300) : $(this).toggleClass('take_also_max').parent().find('dl').fadeIn('fast').parent().animate({height: $(this).attr('rel')}, 300);
		var bigHeight = 57;
		$(this).parent().children('dl').each(function(){
			bigHeight+=($(this).height());
			bigHeight+=32;
		});
		$(this).attr('class') == 'take_also_title' ? $(this).addClass('take_also_max').parent().find('dl').fadeOut('fast').parent().animate({height: "50px"}, 300) : $(this).removeClass('take_also_max').parent().find('dl').fadeIn('fast').parent().animate({height:bigHeight}, 300);
		bigHeight = 0;
	}
	
	$(document).on('mouseenter','.basket_item',function(){
		big_img = $(this).find('.basket_item_lt img').attr('rel');
		if(typeof big_img != 'undefined'){
			$(this).before('<div class="item_preview_img"><img src="'+big_img+'" alt="" /></div>');
		}
		$(this).find('.item_add_to_basket').toggleClass('item_add_to_basket_visible');
	})
	$(document).on('mouseleave','.basket_item',function(){
		$(this).parent().find('.item_preview_img').remove();
		$(this).find('.item_add_to_basket').toggleClass('item_add_to_basket_visible');
	})
	
	$(document).on('click', '.item_photo_sm li a',
		function(){
			fancyIndex = $(this).data('index');
			$('.item_photo_sm li').removeClass('active');
			$(this).parent('li').addClass('active');
			$('.item_photo_big img').attr('src', $(this).attr('href')).hide().fadeIn(300);
			return false;
		}
	);
	/* === /item manipulations == */
	
	/* === basket item counter == */
	var maxBasketItemCount = 99999;
	
	$(document).on('click','.basket_item_plus',function(){
			var objInp = $(this).parent().find('.inp_txt');
			var objInpVal = parseFloat(objInp.val());
			var objInpStep = parseFloat(objInp.data('step'));
			console.log(objInpStep)
			if( !objInpStep || typeof objInpStep == 'undefined' ) objInpStep = 1;
			
			
			
			if( (objInpVal + objInpStep) <= maxBasketItemCount ){
				newVal = objInpVal + objInpStep;
				objInp.val( newVal.toFixed(2) ).data('val',( newVal.toFixed(2) ));
				updateCartCount( objInp );
			}
			
			//objInpVal < maxBasketItemCount ? objInp.val(objInpVal+1) : null;
			
			
			return false;
	});
	$(document).on('click','.basket_item_minus',function(){
			var objInp = $(this).parent().find('.inp_txt');
			var objInpVal = parseFloat(objInp.val());
			var objInpStep = parseFloat(objInp.data('step'));
			if( !objInpStep || typeof objInpStep == 'undefined' ) objInpStep = 1;
			
			newVal = objInpVal - objInpStep;
			if( newVal > 0 ){	
				objInp.val( newVal.toFixed(2) ).data('val',( newVal.toFixed(2) ));
				updateCartCount( objInp );
			}
			
			
			return false;
	});
	$(document).on('keyup','.basket_item_count .inp_txt',function(){
			var val = parseFloat($(this).val());
			
			parseInt(val) > maxBasketItemCount ? $(this).val(maxBasketItemCount) : null;	
			
			
			//if(val && parseInt(val)) updateCartCount( $(this) );
	});
	$(document).on('change','.basket_item_count .inp_txt',function(){
		var
			inp = $(this),
			step = parseFloat(inp.data('step')),
			prev = parseFloat(inp.data('val')),
			val = parseFloat(inp.val()),
			note = inp.parent().find('.basket_item_count_note');
		if( (val % step) == 0 ){
			inp.data('val',val);
		}else{

			var multiplier = Math.ceil( val / step );
			if( multiplier == 0 ) multiplier = 1;
			newVal = step * multiplier;
			inp.val( step * multiplier ).data('val',newVal);
			note.fadeIn().delay(3000).fadeOut();
			
		}

		updateCartCount( inp );
		
		
	});
	/* === /basket item counter == */
	
	
	/* === search drop down == */
	$('.head .search_txt').keyup(function() {
		$('.search_dd').fadeIn(300);
	});
	$(document).on('mouseleave','.search_dd',function(){
		$(this).fadeOut(300);
	})
	/* === /search drop down == */

	/* === view basket alert == */
	$('.add_to_cart, .item_add_to_basket, .fav_to_cart').not('.btn_green, .item_in_basket').click(
		function(){
			$('.basket_counter').before('<div class="basket_alert">Добавлено в корзину</div>');
			$('.basket_alert').animate({bottom:40}, 1000, function() {$(this).animate({opacity:0}, 500, function(){$(this).remove();})});
		}
	);
	/* === /view basket alert == */

	/* === view bookmark alert == */
	$(document).on('click','.add_to_bookmark, .item_add_to_fav',function(){
		$('.bookmark_counter').before('<div class="bookmark_alert">Добавлено в избранное</div>');
		$('.bookmark_alert').animate({bottom:40}, 1000, function() {$(this).animate({opacity:0}, 500, function(){$(this).remove();})});
	
	});
	/* === /view bookmark alert == */
	
	/* === catalog drop down == */
	$(document).on('mouseover','#catViewBtn',function(){
		//$('.catalog_dd_menu').css('visibility', 'visible');
		$('.catalog_dd_menu').css('visibility', 'visible').show();
		$('#catViewBtn').addClass('catActive');
	})
	$(document).on('mouseleave','.catalog_top_btn',function(){
		//$('.catalog_dd_menu').css('visibility', 'hidden');
		$('.catalog_dd_menu').css('visibility', 'hidden').hide();
		$('#catViewBtn').removeClass('catActive');
	})
	/* === /catalog drop down == */
	
	/* === promo code == */
	$('#promoBtn').click(
		function(){
			$(this).parent().hide();
			$('.promo_code').addClass('promo_code_visible');
			$('.prom_price').removeClass('hidden'); // delete when prog
			return false;
		}
	);
	$('#promoBtnCancel').click(
		function(){
			$('#promoBtn').parent().show();
			$('.promo_code').removeClass('promo_code_visible');
			$('.prom_price').addClass('hidden'); // delete when prog
			return false;
		}
	);
	/* === /promo code == */

	/* CUSTON SELECT STYLING */
		$('.color-select').each(function(){
			var $this = $(this), numberOfOptions = $(this).children('option').length;
	
			$this.addClass('select-hidden');
			$this.wrap('<div class="color-fake-select"></div>');
			$this.after('<div class="select-styled"><span></span></div>');
	
			var $styledSelect = $this.next('div.select-styled');
			$styledSelect.find('span').text($this.children('option').eq(0).text());
	
			var $list = $('<ul />', {
				'class': 'select-options'
			}).insertAfter($styledSelect);
	
			for (var i = 0; i < numberOfOptions; i++) {
				var $selectedOption = $this.children('option').eq(i);
				if( $selectedOption.is(':selected') ){
					$styledSelect.find('span').text( $selectedOption.text() );
					$this.parents('.part-content')
						.find(".color-block")
						.removeClass()
						.addClass("color-block _c" + $selectedOption.data('color'));					
				}
				$('<li />', {
					text: $selectedOption.text(),
					rel: $selectedOption.val(),
					'data-color': $selectedOption.data().color
				}).appendTo($list);
			}
	
			var $listItems = $list.children('li');
	
			$styledSelect.click(function(e) {
				e.stopPropagation();
				$('div.select-styled.active').each(function(){
					$(this).removeClass('active').next('ul.select-options').hide();
				});
				$(this).toggleClass('active').next('ul.select-options').toggle();
			});
	
			$listItems.click(function(e) {
				e.stopPropagation();
				$styledSelect.find('span').text($(this).text());
	      $styledSelect.removeClass('active');
				$this.val($(this).attr('rel'));
				//$this.find('option[value="'+$(this).attr('rel')+'"]').prop("seleted",true);
				$this.trigger('change');
				$this.closest('.part-content').find(".color-block")
				.removeClass()
				.addClass("color-block _c" + $(this).data().color);
				$list.hide();
				$this.closest('.filter-block__part').find('.colorCheckbox').prop("checked", false);
			});
			$listItems.hover(function(e) {
				$this.closest('.part-content').find(".color-block")
				.removeClass()
				.addClass("color-block _c" + $(this).data().color);
			});
	
			$(document).click(function() {
				$styledSelect.removeClass('active');
				$list.hide();
			});
	
		});
		
		$('.color-select').change(function () {
			var colorId = $(this).find("option").eq(this.selectedIndex).data().color;
			$(this).closest('.part-content').find('.color-block').addClass('_c' + colorId);
		});
	
		$('.colorCheckbox').click(function () {
			$(this).closest('.filter-block__part').find('.color-select').val("");
			$(this).closest('.filter-block__part').find('.color-block').removeClass().addClass("color-block _c1");
			$(this).closest('.filter-block__part').find('.select-styled span').text("все цвета")
		});
	
		$('.materialCheckbox, .shapeCheckbox').click(function () {
			$(this).closest('.filter-block__part').find('input[type="radio"]').prop('checked', false);
		});
	
		$('.materialRadio, .shapeRadio').click(function () {
			$(this).closest('.filter-block__part').find('input[type="checkbox"]').prop('checked', false);
		});
	$('.filter-block__switcher').on('click', function () {
	  $('.filter-block._additional').toggleClass("hidden");
	  if (!$(this).hasClass("toggled")) {
	    $(this).addClass("toggled");
	    $(this).text("Свернуть дополнительные параметры ↑");
	    return;
	  }
	  $(this).removeClass("toggled");
	  $(this).text("Еще параметры →");
	
	});
	
	$('.filter-reset').on('click', function () {
		form = $('.panels-filter')
		window.location.href = form.attr('action');

		
	  //$('.color-fake-select').eq(0).find('.select-options li').eq(0).trigger('click');
	  //$('.color-fake-select').eq(1).find('.select-options li').eq(0).trigger('click');
	});

	
});
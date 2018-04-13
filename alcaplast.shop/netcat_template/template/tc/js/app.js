var $nc = jQuery.noConflict();
		var 
			autocomplete_previous_value = '',
			autocomplete_last_request;		

if (typeof $ == 'undefined') $ = jQuery;
$(function(){

	// Функции для ajax
	$( document ).ajaxSend(function() { $('#cursor').show(); })
	$( document ).ajaxComplete(function() { $('#cursor').hide(); })

	$('body').mousemove(function(ev){
		var x = parseInt(ev.pageX);
		var y = parseInt(ev.pageY);
		$('#cursor').css({left: x+18, top: y-2});
	});
	
	
	$('input.masked_phone').mask('+7 (999) 999-99-99');
	$('form.autosave').sisyphus();
	makeFancybox();
	addToCart();
	delFromCart();
	makeAjaxForms();
	makeFotorama();
	changeGoodsVariant();
	styleSelect();
	AutocompleteInit();
	addToFav();
	delFromFav();
	makeMainNav();	
	makeFilter();
	paymentHTML = $("#payment_selector").html();
})


function makeFilter(){
	
	var
		form = $('form.panels-filter'),
		action = form.attr('action'),
		select = form.find('select.color-select, select, input[type="text"]'),
		chekboxes = form.find('input:radio, input:checkbox')
	
	select.on('change',function(){
		if(!no_ajax_search){
			var params = form.serialize();
			window.history.replaceState(null, null, action+'?'+params);	
			loadFilterResult( '#filter-result', action, params );
		}
	});
	chekboxes.on('click',function(){
		if(!no_ajax_search){
			var params = form.serialize();
			window.history.replaceState(null, null, action+'?'+params);
			loadFilterResult( '#filter-result', action, params );			
		}
	});
	
	$(document).on('click','.filter-result__sort a',function(e){
		var
			link = $(this),
			sort = link.data('sort'),
			form = $('form.panels-filter'),
			sort_field = form.find('input[name="sort"]'),
			action = form.attr('action'),
			params = form.serialize()+'&sort='+sort;
			
		sort_field.val(sort);	
		window.history.replaceState(null, null, action+'?'+params);	
		loadFilterResult( '#filter-result', action, params );
		e.preventDefault();
	})
	
}

function loadFilterResult( resultBlockSelector, action, params ){
	$(resultBlockSelector).load( action+'?'+params+'&isNaked=1' );
}

function makeMainNav(){
	var
		all_sub = $('.sub_structure_block'),
		all_li = $('#mainNavItems li');
	$('#mainNavItems li').each(function(){
		var
			li = $(this),
			sub_id = li.data('sub');
			
		li.mousestop(function() {
				all_li.removeClass('active');
				all_sub.addClass('hidden');
				li.addClass('active');
				$('#sub_structure_block_'+sub_id).removeClass('hidden');
				
				var sub_goods = $('#sub_structure_block_'+sub_id).find('.sub_structure_block_goods'); 
				//if( !sub_goods.text() ) sub_goods.load('/misc/rvars.html?nc_ctpl=2069&section='+sub_id+'&isNaked=1');
		});

		li.on('mouseleave',function(){
		});
	});
	
	$('.sub_structure_block').on('mouseenter',function(){
		$(this).removeClass('hidden');
	})
}

function addToFav(){
	$(document).on('click','.item_add_to_fav, .add_to_bookmark_btn',function(e){
		var
			fav_cont = $('.bookmark_block'),
			fav_counter = fav_cont.find('.bookmark_counter'),
			fav_title = fav_cont.find('.bookmark'),
			btn = $(this),
			url = btn.data('url'),
			alt = btn.data('alt');
			
		if( !btn.hasClass('in_bookmarks_btn') ){
			$.ajax(url,{
				complete:function(response,data){
					btn.addClass('in_bookmarks_btn').removeClass('add_to_bookmark_btn').val(alt);
					fav_title.replaceWith( "<a href='/izbrannoe/' class='bookmark'>" + fav_title.html() + "</a>" );
					fav_counter.removeClass('empty').text(response.responseJSON.count);
				},
				dataType:'json'
			})
		}
		e.preventDefault();
	})
}

function delFromFav(){
	$('.remove_from_fav').on('click',function(e){

		var
			total_price = 0,
			fav_cont = $('.bookmark_block'),
			fav_counter = fav_cont.find('.bookmark_counter'),
			fav_title = fav_cont.find('.bookmark'),
			btn = $(this),
			url = btn.attr('href'),
			rel = btn.attr('rel');
	
		$.alertable.confirm('Вы уверены, что хотите удалить товар из избранного?',{		
            cancelButton: '<button class="alertable-cancel" type="button">Отмена</button>',
            okButton: '<button class="alertable-ok" type="submit">Удалить</button>',
		}).then(function() {
			$.ajax(url,{
				complete:function(response,data){
					var count = parseInt(response.responseJSON.count);
					if(count == 0){
						fav_title.replaceWith( "<span class='bookmark'>" + fav_title.html() + "</span>" );
						fav_counter.addClass('empty');					
					}
					fav_counter.text(count);
					$('#'+rel).slideUp(function(){
						if(count == 0){
							$('.favority_items').after("<div style='padding:5px'>В избранном ни чего нет</div>").remove();
						}else{
							$('#'+rel).remove();
							$('.favority_items .item_price').each(function(){
								total_price = total_price + parseInt( $(this).val() );
							});
							$('.basket_price_total span').text( total_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') );							
						}
					});

				},
				dataType:'json'				
			});
			
		});
	
		e.preventDefault();
	})
}

function AutocompleteInit() {
	$('.search_autocomplete').each(function(){
		$(this).autocomplete({
			position: { my : "left top+3px"},
			minLength: 4,
			source: AutocompleteMakeRequest,
			select: function(event, ui) {
				if(typeof ui.item.URL != 'undefined') document.location.href = ui.item.URL;
			}
		}).autocomplete('instance')._renderItem = AutocompleteRenderItem;
	})
}


function AutocompleteMakeRequest(request, response) {
	// если новое значение отличается только на несущественный символ,
	// запрос не делаем
	var filtered_term = request.term.replace(/[ -\/:-@\[-`{-~]+/g, '');
    if (autocomplete_previous_value == filtered_term) {
		return;
    }
    autocomplete_previous_value = filtered_term;
	if (autocomplete_last_request) {
		autocomplete_last_request.abort();
	}

    autocomplete_last_request = $.ajax({
		url: "/poisk/?nc_ctpl=2164&isNaked=1",
		method: "post",
		dataType: "json",
		data: {
			site_id: 1,
			terms: request.term,
			limit: 100
		},
		success: response
	}).always(function() {
		//autocomplete_input.removeClass('loading');
	});

//    autocomplete_input.addClass('loading');
}

function AutocompleteRenderItem(ul, item) {
	var
		a = $('<a class="basket_item_sm" />'),
		basket_item_price = $('<div class="basket_item_price" />'),
		additional = '';
		
	basket_item_price.html('<span>'+item.ItemPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')+' <i>р.</i></span><p>'+item.Availability+'</p>')
	if(item.Img) a.append('<img src="'+item.Img+'" />');
	a.attr('href',item.URL).append(item.FullName);
	if(item.Article) additional = '<span>Артикул: '+item.Article+'</span>';
	if(item.Size) additional += '<span>Размер: '+item.Size+' мм</span>';
	if(item.Surface) additional += '<span>Поверхность: '+item.Surface+'</span>';
	ul.addClass('search_dd');
	
	if(additional) return $("<li>").append(basket_item_price).append(a).append(additional).appendTo(ul);
}

function makeFancybox(){
	$(document).on('click','.item_photo_big img',function(){
		$.fancybox.open(fancyItems, {
			padding : 0,
            index: fancyIndex,
            helpers    : {
				thumbs : {
					width  : 68,
					height : 68,
					source : function( item ) {
						return item.thumb;
					}
				}
			}
		});                
    })
}

function styleSelect(){
	$('select.select-img').each(function(){
		$(this).selectmenu({
			change: function( event, ui ) {
				$(this).change();
			}
		}).selectmenu('instance')._renderItem = function(ul, item){
			var li = $( "<li>", { text: item.label } );
			if ( item.disabled ) {
			  li.addClass( "ui-state-disabled" );
			}
			
			
			if(item.element.data('img')){
				$( "<img>").attr('class','ui-item-img').attr('src', item.element.data('img') ).prependTo( li );
			}
			
	 
			return li.appendTo( ul );
		};	
	});

}

function changeGoodsVariant(){
	var rel_def = $('select.throughput-field option:selected').data('rel');
	if( rel_def && typeof rel_def != 'undefined'){
		aRel = rel_def.split(',');
		$('dl.toggle_linked').hide();
		aRel.forEach(function(item,i){
			if( item != '' ){
				$('dl.item_'+item).show();
			}
		})
	}	
	
	
	$(document).on('change','.basket_item select',function(e){
		var
			select = $(this),
			rel = select.find('option:selected').data('rel'),
			container = select.parents('.basket_item'),
			design = container.find('.design-field').val(),
			surface = container.find('.surface-field').val(),
			siphon = container.find('.siphon-field').val(),
			draining = container.find('.draining-field').val(),
			size = container.find('.size-field').val(),
			throughput = container.find('.throughput-field').val(),
			height = container.find('.height-field').val(),
			variant = container.find('.var-field').val(),
			color = container.find('.color-field').val(),
			dbl = container.find('.double-field').val(),
			type = container.data('type'),
			ids = container.data('ids'),
			url = '/misc/rvars.html?isNaked=1&type='+type+'&ids='+ids;
		if( typeof size != 'undefined') url = url+'&size='+size;
		if( typeof design != 'undefined') url = url+'&design='+design;
		if( typeof surface != 'undefined') url = url+'&surface='+surface;
		if( typeof siphon != 'undefined') url = url+'&siphon='+siphon;
		if( typeof draining != 'undefined') url = url+'&draining='+draining;
		if( typeof dbl != 'undefined') url = url+'&double='+dbl;
		if( typeof throughput != 'undefined') url = url+'&throughput='+encodeURI(throughput);
		if( typeof height != 'undefined') url = url+'&height='+encodeURI(height);
		if( typeof variant != 'undefined') url = url+'&var='+encodeURI(variant);
		if( typeof color != 'undefined') url = url+'&color='+encodeURI(color);
		container.load(url,
		function(){
			if( rel && typeof rel != 'undefined'){
				aRel = rel.split(',');
				$('dl.toggle_linked').hide();
				aRel.forEach(function(item,i){
					if( item != '' ){
						$('dl.item_'+item).show();
					}
				})
			}
			//console.log(rel);
			styleSelect();
		});	
	})
}

function makeFotorama(){
	/*$('.fotorama').fotorama();*/
}
function makeAjaxForms(){
	$(document).on('submit', 'form.ajax',function(e){
		var
			$oForm = $(this),
			$sErrorSelector = $oForm.data('error'),
			$sMessage = $oForm.data('message'),
			$sURL = $(this).attr('action')+'?isNaked=1&ajax=1&json=1',
			$sMethod = $oForm.attr('method');
		if($sMethod == '') $sMethod = 'get';
		$.blockUI.defaults.css = {};
		$($sErrorSelector).html('').hide();
		$oForm.find('.error').removeClass('error');
		$oForm.block({
			message: '<div style="color:#ffffff;font-size:16px">'+$sMessage+'</div>',
			blockMsgClass: 'block-message'
		});	
		
		$oForm.ajaxSubmit({
			url:$sURL,
			dataType:'json',
			error:function(data){
				$($sErrorSelector).html(data.responseText).show();			
			},
			success:function(data){
				if(data.status == 'error'){
				
					if(data.errorFields){
						aEF = data.errorFields.split('|');
						for (index = 0; index < aEF.length; ++index) {
							$('.'+aEF[index]).addClass('.error');
						}
					}
				
					if(data.errorContainer){
						$(data.errorContainer).html(data.errorMessage).show();
					}else{
						alert(data.errorMessage);
					}
				}
				if(data.status == 'ok'){
					if(data.purchase){
						dataLayer.push({
							"ecommerce": {
								"purchase": {
									"actionField": {
										"id" : data.purchase.order_id,
									},
									"products": data.purchase.items
								}
							}
						});		
					}
					if(data.redirect){
						window.location.href = data.redirect;
					}else if(data.reload){
						window.location.reload(true);
					}else{
						if(data.removeForm) $oForm.html(data.okMessage)
						if(data.removeBlock) $(data.removeBlock).html(data.okMessage);
						if(data.clearForm) $oForm[0].reset();
						if(data.updateCont) $(data.updateCont).html(data.updateValue);
					}
				}
				$oForm.unblock();				
			},
			complete:function(){
				$oForm.unblock();
			}			
		}); 
		
		e.preventDefault();
	})
}


function setTotalCost(add){
	total = parseInt( $('#total_cost').data('total') );
	new_cost = total + add;
	$('#total_cost').text( new_cost.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') );
}

function calcDeliveryCost(el){
	var
		distance = parseInt( $(el).val() ),
		cost = parseInt( $('#delivery_selector option:selected').data('price') );
		
	if(!distance) distance = 0;
	new_cost = cost + distance * distace_price;
	$('#delivery_cost').text(new_cost.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
	setTotalCost( new_cost );

}

function toggleDelivery(){
	var
		selected = $('#delivery_selector option:selected'),
		desc = selected.data('description'),
		price = parseFloat(selected.data('price')),
		val = selected.val();
	$('#delivery_description').html(desc);
	$('.delivery_toggle').addClass('hidden');
	$('.show_delivery_'+val).removeClass('hidden');
	if(!price) {
		price = 0;
		$('#delivery_currency').hide();
	}else{
		$('#delivery_currency').show();
	}
	if(price)
		$('#delivery_cost').text(price);
	else
		$('#delivery_cost').text('бесплатно');

	setTotalCost( price );
	
	/* костылики */
	$('input[name="f_DistanceMKAD"]').val('');
	

	
	var index = $("#delivery_selector").val();
	var payment_index = $("#payment_selector").val();
	if (index === "7" || index === "4" || index === "8") {
		for (var k = 0; k < $("#payment_selector option").length; k++) {
			if ($("#payment_selector option").eq(k).val() !== "1" || $("#payment_selector option").eq(k).val() !== "4") {
			$("#payment_selector option").eq(k).remove();
		  }
		}
	}else {
		$("#payment_selector").html(paymentHTML);
		$('#payment_selector option[value="'+payment_index+'"]').attr('selected','selected').prop('selected',true);
	}
	$('#payment_selector').change();
	
	
	/*
	if(val == 4 || val == 7){
		
		$('#payment_selector option[value="2"]').hide();
		$('#payment_selector option[value="3"]').hide();
		if( $('#payment_selector').val() != '1' ){
			$('#payment_selector option[value="4"]').attr('selected','selected').prop('selected',true);
			$('#payment_selector').change();
		}
	}else{
		$('#payment_selector option[value="2"]').show();
		$('#payment_selector option[value="3"]').show();
	}
	*/
	
}

function togglePayment(){
	var
		selected = $('#payment_selector option:selected'),
		desc = selected.data('description'),
		val = selected.val();
	$('#payment_description').html(desc);
	$('.payment_toggle').addClass('hidden');
	$('.show_payment_'+val).removeClass('hidden');
}




function addToCart(){
	$( document ).on( "submit", ".add_to_cart_form", function(e) {
		e.preventDefault();
	});
	
	
	$( document ).on( "click", ".add_to_cart, .item_add_to_basket, .fav_to_cart", function(e) {
		if( !$(this).hasClass('btn_green') ){
			var
				fav_to_cart = false,
				in_list = false,
				basket_block = $('.basket_block'),		
				basket = basket_block.find('.basket'),
				basket_total = basket_block.find('.basket_total'),
				basket_total_val = basket_block.find('.basket_total span'),
				basket_counter = basket_block.find('.basket_counter'),
				basket_order = basket_block.find('.fb_order'),
				btn = $(this),
				in_cart = btn.data('in-cart'),
				cls = btn.attr('class'),
				text = btn.attr('value'),
				title = btn.attr('title'),
				alt = btn.data('alt'),
				form = btn.parent('form'),
				url = form.attr('action'),
				name = form.data('name'),
				item = form.data('item'),
				item_id = form.data('item_id'),
				article = form.data('article'),
				price = form.data('price'),
				brand = form.data('brand'),
				count = form.find('.items_count').val(),
				category = form.data('category');
			if(cls.indexOf('item_add_to_basket')>-1) in_list = true;
			if( btn.hasClass('fav_to_cart') ) fav_to_cart = true;
			
			$.post(url,
			form.serialize()+'&json=1',
			function(data){
				if(in_list)
					btn.toggleClass('item_add_to_basket').toggleClass('item_in_basket').attr('title',alt).attr('data-alt',title);
				else if(!fav_to_cart)
					btn.toggleClass('btn_green').attr('value',alt).attr('data-alt',text);
				
				if(fav_to_cart){
					$('.item_add_to_basket').toggleClass('item_add_to_basket').toggleClass('item_in_basket').attr('title',alt).attr('data-alt',title);
				}
				
				basket_counter.text(data.TotalCount).removeClass('empty').attr('href','/korzina/');

				data.TotalItemPrice = Math.round(data.TotalItemPrice);
				basket_total_val.html(data.TotalItemPriceF);
				basket_total.show();
				
				basket_order.removeClass('empty').attr('href','/zakaz/oformlenie_zakaza.html');
				basket.replaceWith( "<a href='/korzina/' class='basket'>" + basket.html() + "</a>" );
				
				if( in_cart && typeof in_cart != 'undefined' ){
					$('#cart_form_holder').load('/korzina/?isNaked=1');
					
					var
						dontForget = $('#dont-forget-to-buy'),
						dontForgetURL = dontForget.data('url');
						
					
					if( dontForgetURL && typeof dontForgetURL != 'undefined' ){
						dontForget.slideUp(function(){
							dontForget.load(dontForgetURL,function(){
								dontForget.slideDown();
							})
						})					
					}
				}
				
				//yaCounter34360920.reachGoal('addtocart');
				if(!fav_to_cart){
					dataLayer.push({
						"ecommerce": {
							"add": {
								"products": [
									{
										"id": item_id,
										"name": name,
										"price": price,
										"brand": brand,
										"category": category,
										"quantity": count
									}
								]
							}
						}
					});
				}
				
				sCartCookie = $.cookie('cart_items');
				if( sCartCookie && typeof sCartCookie != 'undefined' ){
					sCartCookie = sCartCookie+','+item;
				}else{
					sCartCookie = item;
					
				}
				$.cookie('cart_items',sCartCookie,{path: '/' });
				
				
				
				
				
			},'json');
		}
		
		
		e.preventDefault();
	});
}

function updateCartCount(el){
	var
		cnt = parseFloat(el.val()),		
		form = $('#cart_form'),
		url = form.attr('action'),
		id = el.data('id'),
		name = el.attr('name'),
		basket_block = $('.basket_block'),		
		basket = basket_block.find('.basket'),
		basket_total = basket_block.find('.basket_total'),
		basket_total_val = basket_block.find('.basket_total span'),
		basket_counter = basket_block.find('.basket_counter'),
		basket_order = basket_block.find('.fb_order');		

		$.post( url,name+'='+cnt+'&json=1', function(data){
			if(cnt <= 0) $('#cart_'+id).slideUp();
			basket_counter.text(data.TotalCount);
			if(data.TotalCount == 0){
				$('.basket_price').after("<div style='padding:5px'>Ваша корзина пуста</div>").remove();
				basket_counter.addClass('empty').attr('href','');
				basket_total_val.text('');
				basket_total.hide();
				basket_order.addClass('empty').attr('href','');
				basket.replaceWith( "<span class='basket'>" + basket.html() + "</span>" );
			}else{
				$.each(data.Items,function(index, value){
					$('#cost_'+value.Class_ID+'_'+value.Message_ID).html(value.TotalPriceF);
				});			
				//data.TotalItemPrice = Math.round(data.TotalItemPrice);
				basket_total_val.html(data.TotalItemPriceF);
				//$('#basket_price_total').text(data.TotalItemPrice.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
				$('#basket_price_total').html(data.TotalItemPriceF);
				
			}
			//console.log(name);
		},'json');		
		
}

function delFromCart(){
	$(document).on('click','.basket_item_kill',function(e){
		if( !$(this).hasClass('remove_from_fav') ){
	
		var
			basket_block = $('.basket_block'),		
			basket = basket_block.find('.basket'),
			basket_total = basket_block.find('.basket_total'),
			basket_total_val = basket_block.find('.basket_total span'),
			basket_counter = basket_block.find('.basket_counter'),
			basket_order = basket_block.find('.fb_order'),			
			form = $('#cart_form'),
			url = form.attr('action'),
			id = $(this).data('id'),
			g_name = $(this).data('name'),
			g_article = $(this).data('article'),
			g_price = $(this).data('price'),
			g_brand = $(this).data('brand'),
			g_category = $(this).data('category'),
			item = $(this).data('item'),
			name = $(this).attr('name');

		$.alertable.confirm('Вы уверены, что хотите удалить товар из корзины?',{		
            cancelButton: '<button class="alertable-cancel" type="button">Отмена</button>',
            okButton: '<button class="alertable-ok" type="submit">Удалить</button>',
		}).then(function() {
				
			$.post( url,name+'=0&json=1', function(data){
			
				dataLayer.push({
					"ecommerce": {
						"remove": {
							"products": [
								{
									"id": g_article,
									"name": g_name,
									"price": g_price,
									"brand": g_brand,
									"category": g_category
								}
							]
						}
					}
				});
			
				var
					dontForget = $('#dont-forget-to-buy'),
					dontForgetURL = dontForget.data('url');	
					
				
				$('#cart_'+id).slideUp();
				basket_counter.text(data.TotalCount);
				if(data.TotalCount == 0){
					dontForget.html('');
					$('.basket_price').after("<div style='padding:5px'>Ваша корзина пуста</div>").remove();
					basket_counter.addClass('empty').attr('href','');
					basket_total_val.text('');
					basket_total.hide();
					basket_order.addClass('empty').attr('href','');
					basket.replaceWith( "<span class='basket'>" + basket.html() + "</span>" );
					
					$.removeCookie('cart_items',{path: '/' });
				}else{
					
					if( dontForget && typeof dontForget != 'undefined' ) dontForget.load( dontForgetURL );

					basket_total_val.html(data.TotalItemPriceF);
					//$('#basket_price_total').text(data.TotalItemPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '));
					$('#basket_price_total').html(data.TotalItemPriceF);
					
					sCartCookie = $.cookie('cart_items');
					if(sCartCookie && typeof sCartCookie != 'undefined'){
						aCartCookie = sCartCookie.split(',');
						aCartCookie.remove(item);
						sCartCookie = aCartCookie.join(',');
						$.cookie('cart_items',sCartCookie,{path: '/' });	
					}				
					
				}
				

				//console.log(sCartCookie);
				
				
			},'json');
		});
		
		e.preventDefault();	
		}
	})
}

//
// jquery.alertable.js - Minimal alert, confirmation, and prompt alternatives.
//
// Developed by Cory LaViska for A Beautiful Site, LLC
//
// Licensed under the MIT license: http://opensource.org/licenses/MIT
//
if(jQuery) (function($) {
    'use strict';

    var modal,
        overlay,
        okButton,
        cancelButton,
        activeElement;

    function show(type, message, options) {
        var defer = $.Deferred();

        // Remove focus from the background
        activeElement = document.activeElement;
        activeElement.blur();

        // Remove other instances
        $(modal).add(overlay).remove();

        // Merge options
        options = $.extend({}, $.alertable.defaults, options);

        // Create elements
        modal = $(options.modal).hide();
        overlay = $(options.overlay).hide();
        okButton = $(options.okButton);
        cancelButton = $(options.cancelButton);

        // Add message
        if( options.html ) {
            modal.find('.alertable-message').html(message);
        } else {
            modal.find('.alertable-message').text(message);
        }

        // Add prompt
        if( type === 'prompt' ) {
            modal.find('.alertable-prompt').html(options.prompt);
        } else {
            modal.find('.alertable-prompt').remove();
        }

        // Add buttons
        $(modal).find('.alertable-buttons')
        .append(type === 'alert' ? '' : cancelButton)
        .append(okButton);

        // Add to container
        $(options.container).append(overlay).append(modal);

        // Show it
        options.show.call({
            modal: modal,
            overlay: overlay
        });

        // Set focus
        if( type === 'prompt' ) {
            // First input in the prompt
            $(modal).find('.alertable-prompt :input:first').focus();
        } else {
            // OK button
            $(modal).find(':input[type="submit"]').focus();
        }

        // Watch for submit
        $(modal).on('submit.alertable', function(event) {
            var i,
                formData,
                values = [];

            event.preventDefault();

            if( type === 'prompt' ) {
                formData = $(modal).serializeArray();
                for( i = 0; i < formData.length; i++ ) {
                    values[formData[i].name] = formData[i].value;
                }
            } else {
                values = null;
            }

            hide(options);
            defer.resolve(values);
        });

        // Watch for cancel
        cancelButton.on('click.alertable', function() {
            hide(options);
            defer.reject();
        });

        // Cancel on escape
        $(document).on('keydown.alertable', function(event) {
            if( event.keyCode === 27 ) {
                event.preventDefault();
                hide(options);
                defer.reject();
            }
        });

        // Prevent focus from leaving the modal
        $(document).on('focus.alertable', '*', function(event) {
            if( !$(event.target).parents().is('.alertable') ) {
                event.stopPropagation();
                event.target.blur();
                $(modal).find(':input:first').focus();
            }
        });

        return defer.promise();
    }

    function hide(options) {
        // Hide it
        options.hide.call({
            modal: modal,
            overlay: overlay
        });

        // Remove bindings
        $(document).off('.alertable');
        modal.off('.alertable');
        cancelButton.off('.alertable');

        // Restore focus
        activeElement.focus();
    }

    // Defaults
    $.alertable = {
        // Show an alert
        alert: function(message, options) {
            return show('alert', message, options);
        },

        // Show a confirmation
        confirm: function(message, options) {
            return show('confirm', message, options);
        },

        // Show a prompt
        prompt: function(message, options) {
            return show('prompt', message, options);
        },

        defaults: {
            // Preferences
            container: 'body',
            html: false,

            // Templates
            cancelButton: '<button class="alertable-cancel" type="button">Cancel</button>',
            okButton: '<button class="alertable-ok" type="submit">OK</button>',
            overlay: '<div class="alertable-overlay"></div>',
            prompt: '<input class="alertable-input" type="text" name="value">',
            modal:
                '<form class="alertable">' +
                '<div class="alertable-message"></div>' +
                '<div class="alertable-prompt"></div>' +
                '<div class="alertable-buttons"></div>' +
                '</form>',

            // Hooks
            hide: function() {
                $(this.modal).add(this.overlay).fadeOut(100);
            },
            show: function() {
                $(this.modal).add(this.overlay).fadeIn(100);
            }
        }
    };
})(jQuery);

// Удаление элемента из массива.
// String value: значение, которое необходимо найти и удалить.
// return: массив без удаленного элемента; false в противном случае.
Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) {
        // Второй параметр - число элементов, которые необходимо удалить
        return this.splice(idx, 1);
    }
    return false;
}
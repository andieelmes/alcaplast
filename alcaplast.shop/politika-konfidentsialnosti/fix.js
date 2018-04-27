function makeRings(){
	var width = 519,
			height = 519;

	var svg = d3.select(".callback-rings").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "white");


  
	svg.append("circle")
			.attr("class", "dot")
			.attr("transform", 'translate(0, 0)')
			.attr("r", 8);

	function draw(){
		svg.append("circle")
				.attr("class", "ring")
				.attr("transform", 'translate(300,300)')
				.attr("r", 6)
				.style("stroke-width", 1)
				.style("stroke", "#2154A7")
			.transition()
				.ease("linear")
				.duration(6000)
				.style("stroke-opacity", 1e-6)
				.style("stroke-width", 1)
				.style("stroke", "white")
				.attr("r", 200)
				.remove();
	}
	draw();
	setInterval(function() {
		draw();
	}, 750);
}

makeRings();

function showCountdown(){
	var $btn = $('.js-callback-button')
	var $countdown = $('.js-callback-countdown')

	$btn.addClass('inactive')
	$countdown.addClass('active')

	makeCountdown()
	
}



function makeCountdown(){
	var $countdownBlock = $('.js-callback-countdown')
	var $numberBlock = $countdownBlock.find('span')
	var number = $numberBlock.html()
	
	setInterval(function(){
		if (number-- > 0){
			$numberBlock.html(number)
		}
		else {
			$countdownBlock.fadeOut(200)
		}
	}, 1000)
}

function validateNumber(number){
	var number = +number.val().replace(/\D/g,'');
	//console.log(number.toString().length)
	return number.toString().length === 11
}

function validateEmail(email){
	var email = email.val()
	return email.indexOf('@') !== -1 && email.indexOf('.') !== -1 && email.lastIndexOf('.') > email.indexOf('@')

}

function showError(message, input, classOuter='partner__form-outer', classInner='partner__form-error js-partner-form-error'){
	var $input = $(input)
	if (!$input.siblings('.' + classOuter).length) {
			var error = '<div class='+ classOuter +'><div class='+ classInner +'>'+ message +'</div></div>'
			$input.after(error)
	}
}
function showText(message, status, btn){
	var $btn = $(btn)
	$btn.siblings('.partner__form-text').remove();

	var text = '<div class="partner__form-text partner__form-text--'+ status+'">'+ message+'</div>'
	$btn.after(text)
}

function validateCallbackForm(){

	var btn = $('.js-callback-button')
	if (!btn.length) return false;

	var input = $('.js-callback-input')
	// $(input).mask('+7 999 999 99 99', {selectOnFocus: false, optional: true});

	input.on( "invalid",
		function(e) {
			e.preventDefault();
	});

	input.on('blur', function(){
		if (input.val() != '' && !validateNumber(input) ) {
				showError('Неправильный формат телефона', input, 'callback__form-outer', 'callback__form-error js-callback-form-error')
			}
	})

	btn.on('click', function(e){
		e.preventDefault();
		if (!validateNumber(input) ) {
			showError('Неправильный формат телефона', input, 'callback__form-outer', 'callback__form-error js-callback-form-error')
		}
		else {
			showCountdown();
		}
		
	})

	input.on('focus', function(){
		$(this).siblings('.callback__form-outer').remove();
	})

}

validateCallbackForm();

function openCallBack(){
	var $button = $('.js-button-do-callback')
	var $callback = $('.callback')

	if (!$('.callback').length) return false;

	var $body = $('.all')
	var ESCAPE_KEYCODE = 27

	$button.on('click', function(){
			 $callback.removeClass('is-closed')
			 $body.removeClass('overlay-is-closed')
			 var scrollBottom = $(document).height()
			 $callback.css({'height': scrollBottom})
			
			 $(document).on('keydown.paymentPopup', function(e) {
				if (e.keyCode == ESCAPE_KEYCODE) {
					e.preventDefault()
					$callback.addClass('is-closed')
					$body.addClass('overlay-is-closed')
					$(document).off( "keydown.paymentPopup" )
				}
			});
			 
	})
	$('.callback-close').on('click', function(e){
		//console.log(1)
		e.preventDefault()
		$callback.addClass('is-closed')
		$body.addClass('overlay-is-closed')

	})
	$('body').on('click', function (e) {

		if (!$('.callback').hasClass('is-closed') 
			&& (!$(e.target).closest('.callback-inner').length
			&& !$(e.target).closest('.js-button-do-callback').length)) {
				e.preventDefault()
				$callback.addClass('is-closed')
				$body.addClass('overlay-is-closed')

		}
	});

	

}
openCallBack()


function openMessagingPopup() {
  var $button = $('.js-show-messaging-popup')
  var $popup = $('#messagingPopup')


  
  if (!$('#messagingPopup').length) return false;
  var ESCAPE_KEYCODE = 27

  $button.on('click', function(){
   
      $popup.addClass('active')
       $(document).on('keydown.messagingPopup', function(e) {
        if (e.keyCode == ESCAPE_KEYCODE) {
          e.preventDefault()
          $popup.removeClass('active')
          $(document).off( "keydown.messagingPopup" )
        }
      });
       
  })
  $('.js-close-messaging').on('click', function(e){
    
    e.preventDefault()
    $popup.removeClass('active')

  })
  $('body').on('click touchend', function (e) {
    
    if (($('#messagingPopup').hasClass('active') 
      && (!$(e.target).closest('#messagingPopup').length 
      && !$(e.target).closest('.js-show-messaging-popup').length))
      ||$(e.target).closest('.js-close-messaging').length ) {
        e.preventDefault()
        $popup.removeClass('active')	
    }
  });
}
openMessagingPopup();
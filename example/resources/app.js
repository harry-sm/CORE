
CORE.module.create('body', ['mediator', 'dom'],  function ($) {
	function addClass(className){
		$.dom.addClass(className, $);
	}
	function removeClass(className){
		$.dom.removeClass(className, $);
	}
	// console.log("#search-bar", $);
	return {
		init : function (){
			$.mediator.listen({
				'body:addClass': addClass,
				'body:removeClass': removeClass
			});
		},
		destroy: function (){
			$.mediator.ignore();
		}
	};
});


CORE.module.create('#header-controls', ['events', 'mediator'], function($) {
	var
		$searchTrigger = $.find('#search-trigger')
	;
	
	function showSearch(){
		$.mediator.notify([
			{
				type: 'body:addClass',
				data: 'show-search'
			},
			{
				type: 'search:onFocus',
				data: null
			}
		]);
	}
	
	return {
		init: function(){
			$.events.on($searchTrigger, 'click', showSearch);
		},
		destroy: function (){
			$.events.off($searchTrigger, 'click', showSearch);
			$searchTrigger = null;
		}
	};
});


CORE.module.create('#search-bar', ['events', 'dom', 'mediator'], function ($) {
	var
		$search = $.find('#search').domEl[0],
		$closeSearch = $.find('.close-search')
	;

	function onFocus (){
		$search.focus();
	}
	function onBlur (){
		$search.value = '';
	}

	function closePage (){
		$.mediator.notify({
			type: 'body:removeClass',
			data: 'show-search'
		});
		onBlur();
	}
	
	return {
		init: function() {
			
			$.events.on($closeSearch, 'click', closePage);
			$.mediator.listen({
				'search:onFocus': onFocus
			});
		},
		destroy: function (){
			$.mediator.ignore();
		}
	};
});


CORE.module.create('#accordian', ['dom'], function ($) {
	
	return {
		init: function() {
			$.plugin('accordion', $);
		},
		destroy: function () {
			this.plugin = null;
		}
	};

}, ['accordion']);

CORE.module.start('body');
CORE.module.start('#search-bar');
CORE.module.start('#header-controls');
CORE.module.start('#accordian');
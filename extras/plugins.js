CORE.plugin.create('accordion', ['dom', 'events'], function( $ ) {
	var
		nPrev,
		nIdx,
		_$elem,
		$accordionBtns
	;

	function selectAccordionContent (){
		nIdx = $.dom.index(this, $accordionBtns);

		if(nPrev === nIdx){
			$.dom.removeClass('current', $accordionBtns[nIdx]);
			nPrev = null;
			return;
		}
		$.dom.removeClass('current', $accordionBtns);
		$.dom.addClass('current', $accordionBtns[nIdx]);

		nPrev = nIdx;
	}
	return {
		init: function ($elem){
			_$elem = $elem;
			$accordionBtns = _$elem.find('.accordion-btn');

			$.events.on(_$elem, 'click', '.accordion-btn', selectAccordionContent);
		},
		destroy: function (){
			$.events.off(_$elem, 'click', '.accordion-btn', selectAccordionContent);
		}
	};
});


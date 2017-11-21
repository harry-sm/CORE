CORE.extension.create('events', function (data){
	var util = data.oUtil;
	return {
		on : function ($el, sEvt, sSelector, fFn) {
			if ($el && sEvt && sSelector) {
				if($el == document)
					$el = document;
				else if ($el == window)
					$el = window;
				else
					$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;
				Zepto($el).on(sEvt, sSelector, fFn);
			}
			else {
				util.log(2, "Attaching Event ' " + sEvt + "' : FAILED : Wrong Aruguments");
			}
		},
		off : function ($el, sEvt, sSelector, fFn) {
			if ($el) {
				if($el == document)
					$el = document;
				else if ($el == window)
					$el = window;
				else
					$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;

				Zepto($el).off(sEvt, sSelector, fFn);
			}
			else {
				util.log(2, "Detaching Event ' " + sEvt + "' : FAILED : Wrong Aruguments");
			}
		},

		debounce : function (nTime, $el, sEvt, sSelector, fFn){

			function debounce (fFn, nDelay) {
				var
					nTimer = null
				;
				return function () {
					var
						oContext = this,
						args = arguments
					;
					clearTimeout(nTimer);

					nTimer = setTimeout(function () {
						fFn.apply(oContext, args);
					}, nDelay);

				};
			} // delay


			if ($el && sEvt && sSelector) {
				if(util.typeOf(sSelector, 'function'))
					fFn = sSelector;


				var fDfn = debounce( function (event){
					fFn.apply(this, event, arguments);
				}, nTime);

				if(util.typeOf(sSelector, 'function'))
					sSelector = fDfn;
				else
					fFn = fDfn;

				if($el == document)
					$el = document;
				else if ($el == window)
					$el = window;
				else
					$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;
				Zepto($el).on(sEvt, sSelector, fFn);
			}
			else {
				util.log(2, "Attaching Event ' " + sEvt + "' : FAILED : Wrong Aruguments");
			}
		}
	};
});

CORE.extension.create('dom', function (oData){
	var
		util = oData.oUtil
	;

	function cssClass(sType, sClassName, $el){
		$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;

		switch (sType) {
			case 'add':
				Zepto($el).addClass(sClassName);
			break;
			case 'remove':
				Zepto($el).removeClass(sClassName);
			break;
			case 'toggle':
				Zepto($el).toggleClass(sClassName);
			break;
			case 'contains':
				return Zepto($el).hasClass(sClassName);
			break;
		}
	}
	return {
		addClass: function (sClassName, $el) {
			cssClass('add', sClassName, $el);
		},
		removeClass: function (sClassName, $el) {
			cssClass('remove', sClassName, $el);
		},
		toggleClass: function (sClassName, $el) {
			cssClass('toggle', sClassName, $el);
		},
		hasClass: function (sClassName, $el) {
			return cssClass('contains', sClassName, $el);
		},
		css: function ($el, oProp, sVal){
			$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;
			Zepto($el).css(oProp, sVal);
		},
		offset: function ($el){
			$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;
			return Zepto($el).offset();
		},
		index: function ($el, $els){
			$el = (util.typeOf($el, 'object')) ? $el.domEl : $el;

			for(var i = 0; i < $els.length; i++){
				if($els[i] === $el){
					return i;
				}
			}
			return -1;
		},
		detect: {
			_el : document.createElement("div"),

			event: function (prop){
				var
					t,
					event = {
						transition: {
							"transition"      : "transitionend",
							"OTransition"     : "oTransitionEnd",
							"MozTransition"   : "transitionend",
							"WebkitTransition": "webkitTransitionEnd"
						},
						animation: {
							'WebkitAnimation' : 'webkitAnimationEnd',
							'OAnimation'      : 'oAnimationEnd',
							'msAnimation'     : 'MSAnimationEnd',
							'animation'       : 'animationend'
						},
					}
				;
				event = event[prop];
				for (t in event){
					if (this._el.style[t] !== undefined){
						return event[t];
					}
				}
			},
			prop: function (prop){
				var
					ii,
					ll,
					_prefix = ["","Webkit","Moz","O","ms","Khtml"],
					_prop   = prop.charAt(0).toUpperCase() + prop.substr(1)
				;

				for(ii = 0, ll = _prefix.lenght; ii < ll; ii++ ){
					_prop = _prefix[ii] + _prop;
					if ( this._el.style[_prop] !== 'undifinded'){
						return true;
					}
				}
				return false;
			},

		},//detect
	};
});

CORE.extension.create('mediator', function (data){
	var
		util = data.oUtil,
		sModID = data.sModuleID,
		oModuleData = data.oModules
	;

	return {
		listen : function (oEvent) {
			if (util.typeOf(oEvent, 'object') && sModID) {
				if (oModuleData[sModID]) {
					oModuleData[sModID].events = oEvent;
				}
				else {
					util.log(2, "Register Module Event : '" + oEvent.type + "' : FAILED : Module does not exist");
				}
			}
			else {
				util.log(2, "Register Module Event: '" + oEvent.type  + "' : FAILED : Arguments of wrong type");
			}
		},
		notify : function (oEvent) {
			var sModID, oModule;
			if(util.typeOf(oEvent, 'object')){
				fire(oEvent);
			}
			else if(util.typeOf(oEvent, 'array')) {
				for(var i = 0, l = oEvent.length; i<l; i++){
					fire(oEvent[i]);
				}
			}
			else {
				util.log(1, "Notifying '" + oEvent + "': FAILED : Arguments wrong type");
			}
			
			
			function fire (oEvent){
				for (sModID in oModuleData) {
					if (oModuleData.hasOwnProperty(sModID)){
						oModule = oModuleData[sModID];
						if (oModule.events && oModule.events[oEvent.type]) {
							oModule.events[oEvent.type](oEvent.data);
						}
					}
				}
			}
		},
		ignore: function () {
			if (util.typeOf(sModID, 'string') &&
				sModID && (sModID = oModuleData[sModID]) &&
				sModID.events)
			{
				delete sModID.events;
			}
		},
	};
});

CORE.extension.create('service', function (data){
	var
		util = data.oUtil,
		sModID = data.sModuleID,
		oModuleData = data.oModules,
		oModule
	;

	function registerService(sServiceID, fFactory){
		if (util.typeOf(sServiceID, 'string') && util.typeOf(fFactory, 'function') && sModID) {
			if (oModuleData[sModID]) {
				oModule = oModuleData[sModID];
				oModule.services = {};
				oModule.services[sServiceID] = fFactory;
			}
			else {
				util.log(2, "Register Service : '" + sServiceID, + "' : FAILED : Module does not exist");
			}
		}
		else {
			util.log(2, "Register Service: '" + sServiceID, + "' : FAILED : Arguments of wrong type");
		}
	}

	function startService (sServiceID){
		var oMod;
		for (oMod in oModuleData) {
			if (oModuleData.hasOwnProperty(oMod)){
				oMod = oModuleData[oMod];

				if (util.typeOf(sServiceID, 'string')) {
					if (oMod.services && oMod.services[sServiceID]) {
						return oMod.services[sServiceID]();
					}
				}
			}
		}
		return;
	}

	function removeService () {
		if (oModule &&
			oModule.services)
		{
			delete oModule.services;
		}
	}

	return {
		service : function (sServiceID, fFactory) {
			if (sServiceID && util.typeOf(fFactory, 'function')) {
				registerService(sServiceID, fFactory);
				return;
			}
			else if (sServiceID){
				return startService(sServiceID);
			}
			else if (!sServiceID){
				removeService();
			}
		},
	};
});



CORE.extension.create('ajax', function( oData ) {

	return {
		ajax: function (oOptions){
			Zepto.ajax(oOptions);
		},
		getJSON: function (sRoute, oData){
			Zepto.getJSON(sRoute, oData);
		}

	};
});


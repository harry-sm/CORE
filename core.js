/**
Copyright (c) 2015 Rojay Simpson
*/




var CORE = (function (){
	
		var
			debug = true,
			oModuleData = {}
		;

		var logger = function ( nSeverity, sMsg, allowLog ) {
			allowLog = allowLog ? allowLog : debug;
			if(allowLog){
				console[ (nSeverity === 1) ? 'log' : (nSeverity === 2) ? 'warn' : 'error'](sMsg);
			}
		}
	
		var util = {
			/**
			 * Check to see the if object is of type.
			 * @param  {object} obj    Object type that is to be checked.
			 * @param  {string} sType  Type checking object against.
			 * @return {boolean}       Returns whether object matches type.
			 */
			typeOf : function (obj, sType){
				obj = Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
				return sType.toLowerCase() === obj;
			},
			/**
			 * Merge two objects together in the first object.
			 * @param  {object} oTarget object
			 * @param  {object} oSource object
			 * @return {object}         Returns merged object.
			 */
			merge : function (oTarget, oSource){
				if (this.typeOf(oTarget, 'object') &&
					this.typeOf(oSource, 'object'))
				{
					Object.keys(oSource).map(function (prop) {
						(oTarget[prop] = oSource[prop]);
					});
					return oTarget;
				}
				else{
					core.log(1, 'Merge : Failed : One Or More Arguments Not Of Type Object');
				}
			},
			/**
			 * Merge two objects together in the first object if the properties exsist in both objects
			 * @param  {object} oTarget object
			 * @param  {object} oSource object
			 * @return {object}         Returns new object
			 */
			 extend : function ( oTarget, oSource ) {
	
				var keys = Object.keys(oSource);
	
				if(this.typeOf(oTarget, 'object') && this.typeOf(oSource, 'object')){
	
					keys.map(function (prop) {
						prop in oTarget && (oTarget[prop] = oSource[prop]);
					});
	
					return oTarget;
				}
			},
	
			log : function ( nType, sMsg ) {
				core.log(nType, sMsg);
			}
		};//util
		
		
		var core = {
			debug : function ( bOption ) {
				dubug = (bOption) ? true : false;
			},
	
			log : function ( nSeverity, sMsg ) {
				logger(nSeverity, sMsg)
			},
	
			module : {
				export: {
					/**
					 * This factory function registers a new module to CORE module management system.
					 * @param  {string}   sModuleID   The module name which is use to query the DOM for corresponding element with an ID with the same name.
					 * @param  {array}    aExtensions An array containing the extension IDs of the module's dependencies.
					 * @param  {function} fFn         The function that contains the behaviors of the module.
					 * @param  {array}    aPlugins    An array containing the plugin IDs of the module's dependencies.
					 * @return {null}     null
					 */
					create : function ( sModuleID, aExtensions, fFn, aPlugins ) {
						if( !util.typeOf( aExtensions, 'array' ) ) {
							core.log(2, "Register Module : '" + sModuleID+ "' : WARNING : No Extentions Found");
		
							if (util.typeOf( aExtensions, 'function' ) ) {
								fFn = aExtensions;
								aExtensions = null;
							}
						}
		
						if (util.typeOf( sModuleID, 'string' ) &&
							util.typeOf( fFn ,'function' ) )
						{
							oModuleData[sModuleID] = {
								fFactory: fFn,
								oInstance: null,
								aExtensions: ( util.typeOf( aExtensions, 'array' ) ) ? aExtensions : [],
								aPlugins: ( util.typeOf( aPlugins, 'array' ) ) ? aPlugins : false
		
							};	
						}
						else {
							core.log(2, "Register Module : '" + sModuleID + "' : FAILED : Arguments Of Wrong Type");
						}
					},
					/**
					 * Starts the module by creating a new instance of it.
					 * @param  {string} sModuleID The name of the module that should be instantiated.
					 * @param  {object} oData     Any data that should be consumes upon the module instantiation. The data is passed to the init() function of the module and is optional.
					 * @return {null}           
					 */
					start : function ( sModuleID, oData ) {
						var oMod = oModuleData[sModuleID];
		
						if (oMod) {
							oMod.oInstance = core.module.instantiate (sModuleID);
		
							if (oMod.oInstance) {
		
								if (util.typeOf( oMod.oInstance.init, 'function') &&
									util.typeOf( oMod.oInstance.destroy, 'function'))
								{
									if(oData)
										oMod.oInstance.init(oData);
									else
										oMod.oInstance.init();
								}
								else {
									core.log(2, "Start Module : '" + sModuleID + "' : FAILED : Module Has No Init Or Destory Functions");
								}
							}
							else {
									core.log(2, "Start Module : '" + sModuleID + "' : FAILED : Could Not Instantiate");
								}
						}
						else {
							core.log(2, "Start Module : '" + sModuleID + "' : FAILED : Module Does Not Exist");
						}
					},
		
					/**
					 * Stops the module by calling the destroy method and removing the instance from CORE.
					 * @param  {string} sModuleID The name of the module instance that should be destroyed.
					 * @return {null}           
					 */
					stop : function ( sModuleID ) {
						var oMod = oModuleData[moduleId];
		
						if (oMod && oMod.oInstance) {
							oMod.oInstance.destroy();
							oMod.oInstance = null;
						}
						else {
							core.log(2, "Stop Module : '" + sModuleID + "' : FAILED : Module Does Not Exist Or Has Not Been Started");
						}
					},
		
					/**
					 * Start all modules except the ones specified.
					 * @param  {array} aExcept An array containing all the module IDs that should be instantiated.
					 * @return {null}
					 */
					startAll : function ( aExcept ) {
						var
							bExcptType = util.typeOf(aExcept, 'array'),
							nL = (bExcptType) ? aExcept.length : null
						;
		
						for(var sModule in oModuleData){
							if(bExcptType){
								while(nL--){
									if(sModule !== aExcerption[nL]){
										this.start(sModule);
									}
								}
							}
							else {
								this.start(sModule);
							}
						}
					},
					/**
					 * Stop all modules except the ones specified.
					 * @param  {array} aExcept An array containing all the module IDs that should not be instantiated.
					 * @return {null}
					 */
					stopAll : function ( aExcept ) {
						var
							bExcptType = util.typeOf(aExcept, 'array'),
							nL = (bExcptType) ? aExcept.length : null
						;
		
						for(var sModule in oModuleData){
							if(bExcptType){
								while(nL--){
									if(sModule !== aExcerption[nL]){
										this.stop(sModule);
									}
								}
							}
							else {
								this.stop(sModule);
							}
						}
					},
					/**
					 * Stops and then starts modules.
					 * @param  {string} aModuleID The name of the module that should be restarted.
					 * @return {null}
					 */
					restart : function ( aModuleID ) {
						if(util.typeOf(aModuleID, 'array')){
							var
								oMod,
								sModuleID,
								nModIdx = aModule.length
							;
		
							while (nModIdx--){
								sModuleID = aModuleID[nModIdx];
								oMod      = oModuleData[aModuleID[nModIdx]];
		
								if (oMod !== 'undefined' &&
									oMod.instance !== null)
								{
									this.stop(sModuleID);
									this.start(sModuleID);
								}
								else{
									core.log(2, "Restart Module : '" + sModuleID + "' : FAILED : Module Does Not Exist");
								}
							}
						}
					},
				},//export
				/**
				 * Instantiate Module.
				 * @param  {string} sModuleID    The name of the module.
				 * @return {Object}              Returns module instance data.
				 */
				instantiate : function ( sModuleID ){
	
					var
						oExtensions  = {},
						oMod         = oModuleData[sModuleID],
						oModInstance = this.createInstance( sModuleID ),
						oPlugins     = ( oMod.aPlugins ) ? core.plugin.instantiate( oMod.aPlugins ) : false
					;
	
					if (oMod.aExtensions.length !== 0) {
						oExtensions  = core.extension.instantiate( oMod.aExtensions, sModuleID );
					}
	
					if (oPlugins) {
						oMod.plugins = oPlugins;
						oModInstance.plugin = function ( sPluginID, oData ) {
							var
								oPlugin = oMod.plugins[sPluginID]
							;
							if( oPlugin ) {
								oPlugin.init(oData);
								return oPlugin;
							}
							else {
								core.log(2, "Request Plugin : '" + sPluginID + "' : FAILED : Plugin Does Not Exist");
							}
						};
					}
					else {
						oModInstance.plugin = function ( sPluginID, oData ) {
							core.log(3, "Requested Plugin : '" + sPluginID + "' : ERROR : No such plugin name was passed to the module create method");
						}
					}					
	
					oModInstance = util.merge( oExtensions, oModInstance );

					oMod.tempInstance = oMod.fFactory.call( oModInstance, oModInstance );
					return (oMod.tempInstance) ? oMod.tempInstance : false;
				},
				/**
				 * Create the instance of the module
				 * @param  {string} sQuery The name of the module to be queried in the dom.
				 * @return {object}        Returns html collections and other helper methods.
				 */
				createInstance: function ( sQuery ) {
					var
						oElem,
						oExports = {},
						oELEMENT = core.dom.query (sQuery),
						oDomEl
					;
	
					function arrToObj ( aData ) {
						if(!aData)
							return {};
	
						return aData.reduce ( function ( prev, cur, idx ) {
								prev[idx] = cur;
								return prev;
							}, {});
					}
	
					// oDomEl                  = arrToObj (oELEMENT.el);
					// oExports                = oDomEl;
					oExports.moduleIdentifier  = sQuery;
					oExports.length            = oELEMENT.length;
					oExports.domEl             = oELEMENT.el;
	
					oExports.find = function ( sEl ) {
	
						if(!util.typeOf(sEl, 'string')){
							core.log(3, "Find Element '" + sEl + "': FAILED : Query Must Be Of Type String");
							return oExports;
						}
	
						oElem           = oELEMENT.query(sEl);
						oDomEl          = arrToObj (oElem.el);
						oExports        = oDomEl;
						oExports.name   = sEl;
						oExports.length = oElem.length;
						oExports.domEl  = oElem.el;
						oExports.find   = this.find;
						oExports.context = this.name;
	
						return oExports;
					};
					return oExports;
				}

			},//module
	

			plugin : {
				oPluginData : {},
				/**
				 * Registers plugin to CORE.
				 * @param  {string}   sPluginID   The name of the plugin. This should be unique.
				 * @param  {array}    aExtensions An array containing the extension IDs of the module's dependencies.
				 * @param  {function} fFn         The function that contains the implementation details of the plugin.
				 * @return {null}     null
				 */
				create : function ( sPluginID, aExtensions, fFn ) {
					var
						oTemp = {}
					;
					if( !util.typeOf( aExtensions, 'array' ) ) {
						core.log(2, "Register Module : '" + sPluginID + "' : FAILED : No Extentions Found");
						return;
					}
	
					if (util.typeOf(sPluginID, 'string') &&
						util.typeOf(fFn ,'function') ||
						util.typeOf(fFn ,'string'))
					{
						this.oPluginData[sPluginID] = {
							fFactory: fFn,
							oInstance: null,
							aExtensions: (util.typeOf(aExtensions, 'array')) ? aExtensions : []
						};
					}
					else {
						core.log(2, "Register Plugin : '" + sPluginID + "' : FAILED : Arguments of wrong type");
					}
				},
	
				/**
				 * Insantaite Plugin
				 * @param  {array}  aPlugins     List of plugin.
				 * @param  {object} oPluginData  Contains a list of plugin Data.
				 * @return {object}              Returns instance of plugins.
				 */
				instantiate : function (aPlugins, _oPluginData, oModule) {
					if ( util.typeOf( aPlugins, 'array') ) {
	
						var
							aAllPlugins = aPlugins,
							nPluginIDLgt = aAllPlugins.length,
	
							oPlugin,
							sPluginID,
							oPluginData,
	
							oTemp = {},
							oPlugins = {}
						;
						oModule ? {module: oModule} : {}
						oPluginData = ( util.typeOf( _oPluginData, 'object' ) ) ?  _oPluginData : this.oPluginData;
						while ( nPluginIDLgt-- ){
							
							sPluginID = aAllPlugins[nPluginIDLgt];
	
							oPlugin = oPluginData[sPluginID];
							if (util.typeOf( oPlugin, 'object' ) ) {
								//get new instance of plugin
								oPlugin.oInstance = new oPlugin.fFactory( core.extension.instantiate( oPlugin.aExtensions ) );

								if (util.typeOf( oPlugin.oInstance.init, 'function') &&
									util.typeOf( oPlugin.oInstance.destroy, 'function')) {
										//namespace plugin methods
										oTemp[sPluginID] = oPlugin.oInstance;
										//merge mutiple plugins into a single object
										oPlugins = util.merge( oPlugins, oTemp);
									}
									else {
										core.log(2, "Instantiate Plugin : '" + sPluginID + "' : FAILED : Plugin has no init or destory functions");
									}
							}
							else {
								core.log(2, "Instantiate Plugin : '" + sPluginID + "' : FAILED : Plugin Does Not Exist");
							}
						}
						oTemp = null;
						return oPlugins;
					}
					else {
						core.log(2, "Instantiate Plugins: FAILED : Arguments of Wrong Type");
						return false;
					}
				}
			},
	
			extension:{
				oExtensions: {},
				/**
				 * Create a new extension
				 * @param  {string}   sExtensionID  The name of the extension. This should be unique.
				 * @param  {function} fFn           The function that contains the implementation details of the extension.
				 * @return {boolean}
				 */
				create : function (sExtensionID, fFn){
					var aReserveNames = ['domEl', 'length', 'find', 'moduleIdentifier','plugin'];

					if(aReserveNames.indexOf(sExtensionID) > -1) {
						core.log(3, "Create Extension : '" + sExtensionID + "' : FAILED : Extension name matches one of the reserve names: " + aReserveNames);
						return false;
					}

					if(/[^a-zA-Z]+/.test(sExtensionID)) {
						core.log(3, "Create Extension : '" + sExtensionID + "' : FAILED : Extension ID must not contain special charaters or numbers");
						return false;
					}

					if (!util.typeOf(sExtensionID, 'string') &&
						!util.typeOf(fFn, 'function'))
					{
						core.log(2, "Create Extension : '" + sExtensionID + "' : FAILED : Arguments Of Wrong Type");
						return false;
					}
	
					this.oExtensions[sExtensionID] = {
						fFactory:fFn
					};
					return true;
				},
				/**
				 * Returns requested extension
				 * @param  {string} sExtensionID The name of the extension.
				 * @param  {string} sModuleID    The module name that requested the extension
				 * @return {object}              The instance of the extension
				 */
				request : function (sExtensionID, sModuleID){
					var
						oData = {
							oUtil: util,
							sModuleID: sModuleID,
							oModules: oModuleData
						},
						oExtensionNamespace = {},
						oExtensionInstance
					;
					oExtensionInstance = (this.oExtensions[sExtensionID]) ? this.oExtensions[sExtensionID].fFactory(oData) : null;
					
					oExtensionNamespace[sExtensionID] = oExtensionInstance;
					
					if(oExtensionInstance === null){
						core.log(2, "Request Extension : '" + sExtensionID + "': FAILED : Extension Does Not Exist");
						return false;
					}

					return oExtensionNamespace;
				},
				/**
				 * Instantiate extensions.
				 * @param  {array} aExtensions List of extension names
				 * @param  {string} sModuleID   The name module name requesting the extension
				 * @return {object}             Returns the instance data of the extentions
				 */
				instantiate: function (aExtensions, sModuleID) {
	
					var
						aEx         = [],
						nExIndex    = aExtensions.length,
	
						nExtIx,
						oExtension,
						oExtInstance
					;
	
					while ( nExIndex-- ) {
						oExtension = core.extension.request( aExtensions[nExIndex], sModuleID );
						if( oExtension ) {
							aEx.push( oExtension );
						}
					}
	
					nExtIx = aEx.length;
	
					if (nExtIx > 0) {
						oExtInstance = {};
	
						while (nExtIx--) {
							oExtInstance = util.merge(oExtInstance, aEx[nExtIx]);
						}
					}

					return oExtInstance;
				}
			},//extension
	
	
			dom:{
				/**
				 * Queries the DOM.
				 * @param  {string} el      The dom element identifier.
				 * @param  {object} context The context by which to search the html collection.
				 * @return {object}         Returns HTML collections and other helper methods
				 */
				query: function query (el, context){
					var
						aEl      = [],
						oRet     = {},
						aElem    = [],
						oThat    = this,
						_context = (util.typeOf(context, 'array') ? context : [document]),
						sSym,
						oElem,
						nElIx,
						nContextIdx
					;
	
					if(/^#[A-Z][\w|-]+[^\.#\s]$/i.test(el)){
						sSym = '#';
					}
					else if(/^\.[A-Z][\w|-]+[^\.#\s]$/i.test(el)){
						sSym = '.';
					}
					else {
						sSym = '!';
					}
	
					if(sSym !== '!'){
						el = el.slice(1);
					}
	
					nContextIdx = _context.length;
	
					switch(sSym){
						case '#':
							oElem = document.getElementById(el);
							aElem = (oElem !== null) ? [oElem]: [];
						break;
	
						case '.':
							while(nContextIdx--){
								aEl.push( _context[nContextIdx].getElementsByClassName(el) );
							}
	
							if (!aEl[0])
								break;
	
							nElIx = aEl[0].length;
	
							while(nElIx--){
								aElem.unshift(aEl[0][nElIx]);
							}
						break;
	
						case '!':
							while(nContextIdx--){
								aEl.push( _context[nContextIdx].querySelectorAll(el) );
							}
	
							nElIx = aEl[0].length;
	
							while(nElIx--){
								aElem.unshift(aEl[0][nElIx]);
							}
						break;
					}
					
					oRet.el = aElem;
					oRet.length = aElem.length;
					oRet.query = function (sEl) {
						var el = oThat.query(sEl, aElem);

						if(el.length < 1){
							core.log(3, "Find Element '" + sEl + "': FAILED : Element Does Not Exist");
							return false;
						}
						else {
							return el;
						}
					};
					return oRet;
				},
			},//dom

			/**
			 * Extends the core
			 * @param  {string} sExtensionID  The name of the extension. This should be unique.
			 * @param  {function} fFn         The function that contains the implementation details of the extension.
			 * @return {null}
			 */
			extend: function (sExtensionID, fFn){
				if (util.typeOf(sExtensionID, 'string') &&
					util.typeOf(fFn, 'function'))
				{
					this[sExtensionID] = fFn();
				}
				else {
					core.log(2, "CORE Extension'" + sExtensionID + "': FAILED : Arguments Wrong Type");
				}
			}
	
		};//core
	
		/**
		 * Object used to expose the core public methods
		 * @type {Object}
		 */
		var oExports = {
			debug: core.debug,
			log: function ( nSeverity, sMsg ) {
				logger(nSeverity, sMsg, true);
			},
			module: core.module.export,
			plugin: {
				create: function (sName, aExtensions, fFn){
					core.plugin.create(sName, aExtensions, fFn);
				}
			},
			extension: {
				create: function (sName, fFn){
					core.extension.create(sName, fFn);
				}
			}
			
		};
	
		return oExports;
	})();
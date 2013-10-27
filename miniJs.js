/**
*
* Create singleton for collections
*
* @constructor 
*/

miJs = miniJs = function () {
	
	/**
	*
	* Access to collections as function
	*
	* @this {miJs}
	* @param   {Object | Array | Function | String}  arg                 Object for work
	* @param   {Boolean}                            [chainFunctionFlag]  Use chain function?
	* @returns {miJsObject | miJsArray | miJsFunction} 
	*/
	var miJsCallback = function (arg, chainFunctionFlag) {
		if (arguments.length) {
			// Is Array
			if (arg instanceof Array)
				return new miJsArray(arg, chainFunctionFlag);
			
			// Is Function
			if (typeof arg == 'function')
				return new miJsFunction(arg, chainFunctionFlag);
			
			// Is String
			if (typeof arg == 'string')
				return new miJsString(arg, chainFunctionFlag);
			
			// Is Object
			return new miJsObject(arg, chainFunctionFlag);
		}
	}

	/**
	*
	* Access for collection functions for work with Object
	*
	* @this {miJs}
	* @param   {Object}  objectArg           Object for work
	* @param   {Boolean} [chainFunctionFlag] Use chain function?
	* @returns {miJsObject}
	*/
	miJsCallback.object = function (objectArg, chainFunctionFlag) {
		return new miJsObject(objectArg, chainFunctionFlag);
	}

	/**
	*
	* Access for collection functions for work with Array
	*
	* @this {miJs}
	* @param   {Array}   arrayArg         Array for work
	* @param   {Boolean} [chainFunctionFlag] Use chain function?
	* @returns {miJsArray}
	*/
	miJsCallback.array = function (arrayArg, chainFunctionFlag) {
		return new miJsArray(arrayArg, chainFunctionFlag);
	}

	/**
	*
	* Access for collection functions for work with Function
	*
	* @this {miJs}
	* @param {Function} functionArg         Function for work
	* @param {Boolean}  [chainFunctionFlag] Use chain function?
	* @returns {miJsFunction}
	*/				
	miJsCallback.function = function (functionArg, chainFunctionFlag) {
		return new miJsFunction(functionArg, chainFunctionFlag);
	};

	/**
	*
	* Access for collection functions for work with String
	*
	* @this {miJs}
	* @param {String}    stringArg          String for work
	* @param {Boolean}  [chainFunctionFlag] Use chain function?
	* @returns {miJsString}
	*/				
	miJsCallback.string = function (stringArg, chainFunctionFlag) {
		return new miJsString(stringArg, chainFunctionFlag);
	};

	/**
	*
	* Show all passed arguments in alert dialog
	*
	* @this {miJs}
	*/
	miJsCallback.alert = function () {
		var alertString = "";
		for (var i = 0; i < arguments.length; i++)
			alertString += i + ": " + arguments[i] + '\n';
		alert(alertString);
	};

	/**
	*
	* Create timer
	*
	* @returns {Function} callback
	* @returns {Function} Time after calling miJs.timer
	*/
	miJsCallback.timer = function() {
		var startTime = new Date().getTime();
		return function() {
			return (new Date().getTime() - startTime);
		}
	};

	/**
	*
	* Local variable
	* @see {miJsObject.with}
	*/
	miJsCallback.this = undefined;


	return miJsCallback;

	
	/**
	*
	* Create miJsObject - collection functions for work with Objects in JS
	*
	* @constructor
	* @this {miJsObject}
	* @param {Object}  currentObject        Object for work
	* @param {Boolean} [chainFunctionFlag]  Use chain function?
	*/

	function miJsObject(currentObject, chainFunctionFlag) {

		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag;
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined;

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/
		this.chain = function () {
			chainFlag = !chainFlag;
			return chainFlag ? this : this.result;
		};

		/**
		* The object cloning
		*
		* @param   {Array}   [keyArray]  Array of key for copy
		* @param   {Boolean} [ignoreKey] If key in keyArray, it no copy to distination object.
		* @returns {Object}              Object cloning
		*/
		this.clone = function(keyArray, ignoreKey) {
			currentObject = this.result || currentObject;
			
			// recursively clone
			var result = function (obj, keyArray, ignoreKey) {
				var localResult = (obj instanceof Array) ? [] : {};
				for (var i = 0, keys = miJs.object(obj).keys(); i < keys.length; i++) {
					var key = keys[i];
                    if (keyArray &&
						(!!ignoreKey == (
							keyArray && keyArray.indexOf ? (keyArray.indexOf(key) !== -1) : miJs.object(key).in(keyArray))
						)
					)
						continue;
					localResult[key] = typeof obj[key] == 'object' ? arguments.callee(obj[key]) : obj[key];
				}
				return localResult;
			} (currentObject, keyArray, ignoreKey);

			// return result
			if (chainFlag) {
				if (result instanceof Array)
					return miJs.array(result, true);
				else {
					this.result = result;
					return this;
				}
			} else
				return result;
		};

		/**
		*
		* Tests for the equality of the passed object
		*
		* @param   {Object}  testObject
		* @returns {Boolean} Result
		*/
		this.equal = function (testObject) {
			currentObject = this.result || currentObject;
			// recursively test
			var result = function(first, second) {
				if (first == undefined || second == undefined) 
					return first == second;
				if (first.length != second.length) 
					return false;
				if (first.toString() != second.toString())
					return false;
                if (!isNaN(first) && !isNaN(second))
                    return first == second;
                if ((typeof first == 'string' || first instanceof String) &&
                    (typeof second == 'string' || second instanceof String)
                )
                    return first == second;
				for (var i = 0, keys = miJs.object(first).keys(); i < keys.length; i++) {
					var key = keys[i];
                    if (typeof first[key] == 'object') {
						if (!(second[key] && arguments.callee(first[key], second[key])))
							return false;
					} else if (typeof first[key] == 'function') {
						if (first[key].toString() != second[key].toString())
							return false;
					} else if (first[key] !== second[key])
                        return false;
                }
				return true;	
			} (currentObject, testObject);

			return chainFlag ? (this.result = result, this) : result;
		};

		/**
		*
		* Tests for the occurrence of an object in an array
		* 
		* @param   {Array}   array 
		* @returns {Boolean} Is object in the array
		*/
		this.in = function (array) {
			currentObject = this.result || currentObject;
			for (var i = 0; i < array.length; i++) 
				if (miJs.object(currentObject).equal(array[i])) 
					return chainFlag ? (this.result = true, this) : true;
			return chainFlag ? (this.result = false, this) : false;
		};

		/**
		*
		* Show all value of object in alert window
		*
		* @param {Array}   [keyArray] Array of keys
		* @param {Boolean} [showThis] Show key-value, if it not in keyArray
        * @returns {Object|undefined}
		*/
		this.alert = function (keyArray, showThis) {
			currentObject = (this.result !== undefined) ? this.result : currentObject;
			var showString = "";
			for (var i = 0, keys = currentObject.keys(); i < keys.length; i++) {
				var key = keys[i];
                if (showThis)
					showString += miniJs.object(key).in(keyArray) ? "" : key + "=" + currentObject[key].toString() + '\n';
				else
					showString += keyArray ? (miniJs.object(key).in(keyArray) ? key + "=" + currentObject[key].toString() + '\n': "") :
											 key + "=" + (currentObject[key] == undefined ? '' : currentObject[key].toString()) + '\n';
            }
			if ((typeof currentObject != 'object') > (currentObject instanceof Array))
				showString = currentObject.toString();
			
			alert(showString);
			
			if (chainFlag)
				return this;
		};

		/**
		*
		* Set value in object. If key not found in object, it will add.
		*
		* @param {Object}           setValue   Object with value for sating
		* @param {Boolean|Function} [filter]   Set value if current key in currentObject is undefined,
		*									   else sating or call function filter for all key and
		*									   object. if filter return true, then value will set.
        * @returns {Object|undefined}
		*/
		this.set = function(setValue, filter) {
			currentObject = this.result || currentObject;
			var isFunction = typeof filter == 'function';
			for (var i = 0, keys=miJs.object(setValue).keys(); i < keys.length; i++) {
				var key = keys[i];
                if (isFunction) {
					if (!filter(currentObject, setValue, key)) {
						continue;
                    }
				} else if (filter && currentObject[key] !== undefined) {
					continue;
                }

				if (typeof setValue[key] == 'object') {
					if (currentObject[key] == undefined) {
						currentObject[key] = setValue[key] instanceof Array ? [] : {};
                    }
					miniJs.object(currentObject[key]).set(setValue[key], filter);
				} else if (typeof setValue[key] == 'function') {
					currentObject[key] = miniJs.function(setValue[key]).clone();
                } else {
					currentObject[key] = setValue[key];
                }
			}
			if (chainFlag)
				return this;
		};

		/**
		*
		* Set link to current object in miniJs.this
		*/
		this.with = function () {
			currentObject = this.result || currentObject;
			miniJs.this = currentObject;
			if (chainFlag) {
				return this;
            }
		};

		/**
		*
		* Return new object contains all diff keys-value currentObject and compareObj.
		* If flag fromCompareObject == true, value diff object set from compareObject, 
		* else from currentObject
		*
		* @param   {Object}  compareObj        Object for compare
		* @param   {Boolean} fromCompareObject Value copy from compareObject
		* @returns {Object}                    Diff object
		*/
		this.diff = function(compareObj, fromCompareObject) {
			currentObject = this.result || currentObject;
			var diffArrayKey = [];
			for (var i = 0, keys = miJs.object(currentObject).keys(); i < keys.length; i++) {
				var key = keys[i];
                if (!miJs.object(currentObject[key]).equal(compareObj[key])) {
					diffArrayKey.push(key);
                }
            }
			var diffObject = miJs.object(fromCompareObject ? compareObj : currentObject).clone(diffArrayKey);
			return chainFlag ? (this.result = diffObject, this) : diffObject;
		};

		/**
		*
		* Return array of all keys name of currentObject.
		*
		* @returns {Array}
		*/
		this.keys = function () {
			currentObject = this.result || currentObject;
			if (Object.keys !== undefined) {
				return chainFlag ? (this.result = Object.keys(currentObject), this) : Object.keys(currentObject);
            }
			var arrayOfKey = [];
			for (var i in currentObject) {
                arrayOfKey.push(i);
            }
			return chainFlag ? (this.result = arrayOfKey, this) : arrayOfKey;
		};

		/**
		*
		* Return currentObj[key]
		* 
		* @param {String} key Key Name
		* @returns            Value currentObj[key]
		*/
		this.value = function (key) {
			currentObject = this.result || currentObject;
			return chainFlag ? (this.result = currentObject[key], this) : currentObject[key];
		};

		/**
		*
		* Return key name of value in currentObject, else return undefined
		*
		* @param                      value Value for searching
		* @returns {String|undefined}       Key name
		*/
		this.key = function(value) {
			currentObject = this.result || currentObject;
			for (var i = 0, keys = miJs.object(currentObject).keys(); i < keys.length; i++) {
				var key = keys[i];
                if (miJs.object(currentObject[key]).equal(value)) {
					return chainFlag ? (this.result = key, this) : key;
                }
            }
			return chainFlag ? (this.result = undefined, this) : undefined;
		};

		/**
		*
		* Work with currentObject as array. Use chainFlag copy.
		*
		* @returns {object} miJs.array(currentObject)
		*/
		this.array = function () {
			currentObject = this.result || currentObject;
			var arrayWork = miJs.array(currentObject, chainFlag);
			return chainFlag ? (arrayWork.result = currentObject, arrayWork) : arrayWork;
		};

		/**
		*
		* Work with currentObject as function. Use chainFlag copy.
		*
		* @returns {object} miJs.function(currentObject)
		*/
		this.function = function () {
			currentObject = this.result || currentObject;
			var functionWork = miJs.function(currentObject, chainFlag);
			return chainFlag ? (functionWork.result = currentObject, functionWork) : functionWork;
		};

		/**
		*
		* Call function with currentObject as argument.
		* If flagCopyResult == true, then result of function set in this.result (default==false)
		*
		* @param {Function} cb
		* @param {Boolean}  [flagCopyResult]
		* @returns this
		*/
		this.external = function(cb, flagCopyResult) {
			currentObject = this.result || currentObject;
			var result = cb(currentObject);
			if (flagCopyResult)
				this.result = result;
			return this;
		};
	}


	/**
	*
	* Create miJsArray - coolection functions for work with Array in Js
	*
	* @constructor
	* @this {miJsArray}
	* @param {Array}   currentArray      Array for work
	* @param {Boolean} chainFunctionFlag Use chain function?
	*/
	function miJsArray(currentArray, chainFunctionFlag) {
		
		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag;
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined;

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag;
			return chainFlag ? this : this.result;
		};


		/**
		*
		* The array cloning
		*
		* @returns {Array} Clone of this array
		*/
		this.clone = function () {
			currentArray = this.result || currentArray;
			return chainFlag ? (this.result = miJs.object(currentArray).clone(), this) : miJs.object(currentArray).clone();
		};

		/**
		*
		* Tests for the equality of the passed array
		*
		* @param {Array} arr Array for test
		* @returns {Boolean} Result
		*/
		this.equal = function (arr) {
			currentArray = this.result || currentArray;
			return chainFlag ? (this.result = miJs.object(currentArray).equal(arr), this): miJs.object(currentArray).equal(arr);
		};

		/*
		*
		* Show all elements of array in alert window
		*
		*/
		this.alert = function () {
			currentArray = (this.result !== undefined) ? this.result : currentArray;
			var showString = '';
			for (var i = 0; i < currentArray.length; i++) {
				showString += i + '=' + currentArray[i].toString() + '\n';
            }
			if (typeof currentArray != 'object') {
				showString += "" + currentArray;
            }
			alert (showString);
			if (chainFlag) {
				return this;
            }
		};

		/**
		*
		* Iteration run functions for all elements in array and return array of result
		*
		* @param   {Function|String}     f Callback
		* @returns {Array|Object} Results function f
		*/
		this.map = function(f) {
			currentArray = this.result || currentArray;
            if (typeof f == 'string') {
                f = miJs.string(f).lambda();
            }
			if (currentArray.map !== undefined) {
				return chainFlag ? (this.result = currentArray.map(f), this) : currentArray.map(f);
            }
			var result = [];
			for (var i = 0; i < currentArray.length; i++) {
				result.push(f(currentArray[i], i, currentArray));
            }
			return chainFlag ? (this.result = result, this) : result;
		};

		/**
		*
		* Creates a new array with all elements that pass the test implemented by the provided function.
		* 
		* @param   {Function|String} f Callback
		* @returns {Array}
		*/
		this.filter = function(f) {
			currentArray = this.result || currentArray;
            if (typeof f == 'string') {
                f = miJs.string(f).lambda();
            }
			if (currentArray.filter !== undefined) 
				return chainFlag ? (this.result = currentArray.filter(f), this) : currentArray.filter(f);
			var result = [];
			for (var i = 0; i < currentArray.length; i++) 
				if (f(currentArray[i], i, currentArray))
					result.push(currentArray);
			return chainFlag ? (this.result = result, this) : result;
		};

		/**
		*
		* Creates a new array will all elements and no repeat
		*
		* @returns {Array}
		*/
		this.distinct = function() {
			currentArray = this.result || currentArray;
			var result = [];
			for (var el = 0; el < currentArray.length; el++) {
				if (!miJs.object(currentArray[el]).in(result)) {
					var count = 1;
					for (var i = el + 1; i < currentArray.length; i++) {
						if (miJs.object(currentArray[el]).equal(currentArray[i])) {
							count++;
                        }
						if (count > 1) {
							result.push(currentArray[el]);
							break
						}
					}
					if (count == 1) {
						result.push(currentArray[el]);
                    }
				}
			}
			return chainFlag ? (this.result = result, this) : result;
		};

		/**
		*
		* Return a new array with no specified item
		*
		* @param   {*} element Finding elem
		* @returns {Array}
		*/
		this.delete = function (element) {
			return this.filter(function(i) {
                return !miJs.object(i).equal(element)
            });
		};

		/**
		* 
		* All element of currentArray passed in function f
		*
		* @param {Function} f Function for work
        * @returns {Array|Object}
		*/
		this.each = function (f) {
			currentArray = this.result || currentArray;
            if (typeof f == 'string') {
                f = miJs.string(f).lambda();
            }
			if (currentArray.forEach !== undefined) {
				return chainFlag ? (currentArray.forEach(f), this) : currentArray.forEach(f);
            }
			for (var i = 0; i < currentArray.length; i++) {
				f(currentArray[i], i, currentArray);
            }
			if (chainFlag) {
				return this;
            }
		};

		/**
		*
		* Return currentArray[index]
		*
		* @param {Number} index
		* @returns               currentArray[index]
		*/
		this.value = function(index) {
			currentArray = this.result || currentArray;
			return chainFlag ? (this.result = currentArray[index], this) : currentArray[index];
		};

		/**
		*
		* Return index of element
		* 
		* @param   {Object|Function}   	element Value of element
		* @param   {Boolean}           	[flag]  If flag == true, then element is function for compare
		* @returns {Number| undefined} 	        Index of element
		*/
		this.index = function(element, flag) {
			currentArray = this.result || currentArray;
			for (var i = 0; i < currentArray.length; i++) {
				if (flag ? element(currentArray[i]) : miJs.object(currentArray[i]).equal(element)) {
					return chainFlag ? (this.result = i, this) : i;
                }
            }
			return chainFlag ? (this.result = i, this) : undefined;
		};
		

		/**
		*
		* Work with currentArray as object. Use chainFlag copy.
		*
		* @returns {object} miJs.object(currentArray)
		*/
		this.object = function () {
			currentArray = this.result || currentArray;
			var objectWork = miJs.object(currentArray, chainFlag);
			return chainFlag ? (objectWork.result = currentArray, objectWork) : objectWork;
		};

		/**
		*
		* Work with currentArray as function. Use chainFlag copy.
		*
		* @returns {object} miJs.function(currentObject)
		*/
		this.function = function () {
			currentArray = this.result || currentArray;
			var functionWork = miJs.function(currentArray, chainFlag);
			return chainFlag ? (functionWork.result = currentArray, functionWork) : functionWork;
		};
		/**
		*
		* Reduce function
		* 
		* @param {Function|String} f
		* @param start
		* @returns {*}
		*/
		this.reduce = function(f, start) {
			currentArray = this.result || currentArray;
			var ret = start;
            if (typeof f == 'string') {
                f = miJs.string(f).lambda();
            }
			if (currentArray.reduce) {
				ret = currentArray.reduce(f, ret);
            } else {
				for (var i = 0; i < currentArray.length; i++) {
					ret = f(ret, currentArray[i], i, currentArray);
                }
            }
			return chainFlag ? (this.result = ret, this) : ret;
		};

		/**
		*
		* Call function with currentArray as argument.
		* If flagCopyResult == true, then result of function set in this.result (default==false)
		*
		* @param {Function} cb
		* @param {Boolean}  [flagCopyResult]
		* @returns this
		*/
		this.external = function(cb, flagCopyResult) {
			currentArray = this.result || currentArray;
			var result = cb(currentArray);
			if (flagCopyResult) {
				this.result = result;
            }
			return this;
		};

        /**
         *
         * Set link to current array in miniJs.this
         * returns {*}
         */
        this.with = function () {
            currentArray = this.result || currentArray;
            miniJs.this = currentArray;
            if (chainFlag) {
                return this;
            }
        };

	}


	/**
	*
	* Create miJsFunction - collection functions for work with Function in JS
	*
	* @constructor
	* @this {miJsFunction}
	* @param {Function} currentFunction   Function for work
	* @param {Boolean}  chainFunctionFlag Use chain function?
	*/
	function miJsFunction(currentFunction, chainFunctionFlag) {
		
		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag;
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined;

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag;
			return chainFlag ? this : this.result;
		};

		/*
		* Decorator caching functions
		*
		* @returns {Function} Function currentFunction with cache
		*/
		this.cache = function () {
		    var ret = function () {
		        for (var i in ret.base.argument)  {
		            if (ret.base.argument.hasOwnProperty(i) && miniJs.object(ret.base.argument[i]).equal(arguments)) {
		                return ret.base.retValue[i];
                    }
                }
		        ret.base.argument.push(arguments);
		        var value = currentFunction.apply(this, arguments);
		        ret.base.retValue.push(value);
		        return value;
		    };
		    var r;
		    ret.base = {argument: [], retValue: []};
			return chainFlag ? (r = miJs.function(ret, true), r.result = ret, r) : ret;
		};

		/**
		*
		* Decorator logging function
		*
		* @returns {Function} Function currentFunction with log
		*/
		this.log = function () {
			var ret = function () {
				var value = currentFunction.apply(this, arguments);
				ret.log.push({args: arguments, ret: value});
				return value;
			};
			var r;
			ret.log = [];
			return chainFlag ? (r = miJs.function(ret, true), r.result = ret, r) : ret;
		};

		/**
		*
		* Cloning function
		* 
		* @returns {Function} Clone function
		*/
		this.clone = function() {
		    var temp = function () {
		    	return currentFunction.apply({}, arguments)
		    };
		    var r;
		    return chainFlag ? (r = miJs.function(temp, true), r.result = temp, r) : temp;
		};

		/**
		*
		* Set param function as object
		*
		* Example: f(x, y, z, angle) => miJs(f).objectArgument('dot.x', 'dot.y', 'dot.z', 'angle') => 
		* f({
		*	dot: {
		*		x: 1,
		*		y: 2,
		*		z: 3
		*	},
		*	angle: 30
		*  })
		*
		* @returns {Function}
		*/
		this.objectArgument = function() {
			var r, arrayLink = Array.prototype.slice.call(arguments),
			    ret = function (object) {
					var listArgs = [],
					    buildArguments = function (obj, parentKey) {
							miJs.object(obj, true).keys().array().each(function (el) {
								var index = arrayLink.indexOf(parentKey + el);
								if (index !== -1) {
									listArgs[index] = obj[el];
                                } else {
									buildArguments(obj[el], parentKey + el + '.');
                                }
							});
						};
					buildArguments(object, '');
					return currentFunction.apply(this, listArgs);
				};
			return chainFlag ? (r = miJs.function(ret, true), r.result = ret, r) : ret;
		};

		/**
		*
		*	Profiling function (time, count call)
		*	
		*	@returns {Function}
		*/
		this.profile = function() {
			var r,
                ret = function () {
					var startTime = new Date().getTime(),
						value = currentFunction.apply(this, arguments),
						timing = new Date().getTime() - startTime;
					ret.count++;
					ret.time.all.push(timing);
					return value;
				};

			ret.time = {
				max : function () { 
					return Math.max.apply(Math, ret.time.all);
				},
				min : function () {
					return Math.min.apply(Math, ret.time.all);
				},
				middle : function () {
					var sumDuration = 0;
                    for (var i = 0, len = ret.time.all.length; i < len; i++) {
                        sumDuration += ret.time.all[i];
                    }
                    return sumDuration / len;
				},
				all : []
			};
			ret.count = 0;
			return chainFlag ? (r = miJs.function(ret, true), r.result = ret, r) : ret;
		};

		/**
		*
		* Call function with currentFunction as argument.
		* If flagCopyResult == true, then result of function set in this.result (default==false)
		*
		* @param {Function} cb
		* @param {Boolean}  [flagCopyResult]
		* @returns this
		*/
		this.external = function(cb, flagCopyResult) {
			var result = cb(currentFunction),
				r      = miJs.function(result, chainFlag); 
			if (flagCopyResult)
				r.result = result;
			return r;
		}
	}

	
	/**
	 * Create miJsString - collection functions for work with String in JS
	 * @constructor
	 * @this {miJsString}
	 * @param  {String}  currentString     String for work
	 * @param  {Boolean} chainFunctionFlag Use chain function?
	 */
	function miJsString(currentString, chainFunctionFlag) {
		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag;
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined;

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag;
			return chainFlag ? this : this.result;
		};

		/**
		 * Convert currentString to function
		 * @return {Function} Function after parsing currentString
		 */
		this.lambda = function() {
		    var args = [],
			    expr = currentString,
			    exprArgs;
		    if (/\s*:\s*/.test(expr) != null) {
	            exprArgs = currentString.split(/\s*:\s*/);
	            args = exprArgs[0].split(/\s*,\s*|\s+/m);
	            expr = exprArgs.slice(1).join(':');
		    } else {
		        throw "String '" + currentString + "' can\'t convert to Function";
            }
		    return new Function(args, 'return (' + expr + ')');
		}
	}
}();
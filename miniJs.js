/**
*
* Create singleton for collections
*
* @constructor 
*/

miJs = miniJs = function () {
	
	var ret = function () {
		if (arguments.length){
			if (arguments[0] instanceof Array)
				return new jsArray(arguments[0], arguments[1])
			if (typeof arguments[0] == 'function')
				return new jsFunction(arguments[0], arguments[1])
			return new jsObject(arguments[0], arguments[1])
		}
	}

	ret.object = function (obj, chainFlag) {
		return new jsObject(obj, chainFlag)
	}
				
	ret.function = function (f, chainFlag) {
		return new jsFunction(f, chainFlag)
	}

	ret.array = function (arr, chainFlag) {
		return new jsArray(arr, chainFlag)
	}

	ret.this = undefined

	return ret

	
	/**
	* Create jsObject - collection functions for work with Objects in JS
	*
	* @constructor
	* @this {jsObject}
	* @param {Object} currentObject Object for work
	* @param {Boolean} chainFunctionFlag flag chain function
	*/

	function jsObject(currentObject, chainFunctionFlag) {

		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag
			return chainFlag ? this : this.result
		}

		/**
		* The object cloning
		*
		* @returns {Object} Object cloning
		*/
		this.clone = function() {
			currentObject = this.result || currentObject
			var result = function (obj) {
							var r = (obj instanceof Array) ? [] : {}
							for (var i in obj)
								r[i] = typeof obj[i] == 'object' ? arguments.callee(obj[i]) : obj[i]
							return r
						} (currentObject)
			return chainFlag ? (result instanceof Array ? miJs.array(result, true) : (this.result = result, this)) : result;
		}

		/**
		*
		* Tests for the equality of the passed object
		*
		* @param {Object} obj
		* @returns {Boolean} Result
		*/
		this.equal = function (obj) {
			currentObject = this.result || currentObject
			var result = function(first, second) {
				if (first == undefined || second == undefined) return first == second;
				if (first.length != second.length) return false
				for (var i in first) 
					if (typeof first[i] == 'object') {
						if (!second[i] || !arguments.callee(first[i], second[i])) return false
					} else if (typeof first[i] == 'function') {
						if (first[i].toString() != second[i].toString()) return false
						}
					else 
						if (first[i] !== second[i]) return false
				if (first.length == undefined && first.toString() != second.toString()) 
					return false
				return true	
			} (currentObject, obj)
			return chainFlag ? (this.result = result, this) : result
		}

		/**
		*
		* Tests for the occurrence of an object in an array
		* 
		* @param {Array} array 
		* @returns {Boolean} Is object in the array
		*/
		this.in = function (array) {
			currentObject = this.result || currentObject
			for (var i in array) 
				if (miJs.object(currentObject).equal(array[i])) 
					return chainFlag ? (this.result = true, this) : true;
			return chainFlag ? (this.result = false, this) : false;
		}

		/**
		*
		* Show all value of object in alert window
		*
		* @param {Array}   [keyArray] Array of keys
		* @param {Boolean} [showThis] Show key-value, if it not in keyArray
		*/
		this.alert = function (keyArray, showThis) {
			currentObject = this.result || currentObject
			var showString = ""
			for (var i in currentObject)
				if (showThis) 
					showString += miniJs.object(i).in(keyArray) ? "" : i + "=" + currentObject[i].toString() + '\n'
				else
					showString += keyArray ? (miniJs.object(i).in(keyArray) ? i + "=" + currentObject[i].toString() + '\n': "") : 
											 i + "=" + (currentObject[i] == undefined ? '' : currentObject[i].toString()) + '\n'
			alert(showString)
			if (chainFlag)
				return this
		}

		/**
		*
		* Set value in object. If key not found in object, it will add.
		*
		* @param {Object}  setValue      Object with value for seting
		* @param {Boolean} [ifUndefined] Set value if current key in currentObject undefineded, else not seting
		*/
		this.set = function(setValue, ifUndefined) {
			currentObject = this.result || currentObject
			for (var i in setValue) 
				if (ifUndefined && currentObject[i] !== undefined) 
					continue
				if (typeof setValue[i] == 'object') {
					if (currentObject[i] == undefined) 
						currentObject[i] = setValue[i] instanceof Array ? [] : {}
					miniJs.object(currentObject[i]).set(setValue[i])
				} else if (typeof setValue[i] == 'function')
					currentObject[i] = miniJs.function(setValue[i]).clone()
				else
					currentObject[i] = setValue[i]
			if (chainFlag)
				return this
		}

		/**
		*
		* Set link to current object in miniJs.this
		*/
		this.with = function () {
			currentObject = this.result ||  currentObject
			miniJs.this = currentObject
			if (chainFlag)
				return this
		}
	}


	/**
	*
	* Create jsArray - coolection functions for work with Array in Js
	*
	* @constructor
	* @this {jsArray}
	* @param {Array} currentArray Array for work
	* @param {Boolean} chainFunctionFlag flag chain function
	*/
	function jsArray(currentArray, chainFunctionFlag) {
		
		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag
			return chainFlag ? this : this.result
		}


		/**
		*
		* The array cloning
		*
		* @returns {Array} Clone of this array
		*/
		this.clone = function () {
			currentArray = this.result || currentArray
			return chainFlag ? (this.result = currentArray.slice(0), this) : currentArray.slice(0);
		}

		/**
		*
		* Tests for the equality of the passed array
		*
		* @param {Array} arr Array for test
		* @returns {Boolean} Result
		*/
		this.equal = function (arr) {
			currentArray = this.result || currentArray
			return chainFlag ? (this.result = miJs.object(currentArray).equal(arr), this): miJs.object(currentArray).equal(arr);
		}

		/*
		*
		* Show all elements of array in alert window
		*
		*/
		this.alert = function () {
			currentArray = this.result || currentArray
			var showString = ''
			for (var i in currentArray)
				showString += i + '=' + currentArray[i].toString() + '\n'
			alert (showString)
			if (chainFlag) 
				return this
		}

		/**
		*
		* Iter run functions for all elements in array and return aray of result
		*
		* @param {Function} f Callback
		* @returns {Array} Results function f
		*/
		this.map = function(f) {
			currentArray = this.result || currentArray
			if (currentArray.map !== undefined) 
				return chainFlag ? (this.result = currentArray.map(f), this) : currentArray.map(f);
			var result = []
			for (var i in currentArray)
				result.push(f(currentArray[i]));
			return chainFlag ? (this.result = result, this) : result;
		}

		/**
		*
		* Creates a new array with all elements that pass the test implemented by the provided function.
		* 
		* @param {Function} f Callback
		* @returns {Array}
		*/
		this.filter = function(f) {
			currentArray = this.result || currentArray
			if (currentArray.filter !== undefined) 
				return chainFlag ? (this.result = currentArray.filter(f), this) : currentArray.filter(f)
			var result = []
			for (var i in currentArray) 
				if (f(currentArray[i])) 
					result.push(currentArray)
			return chainFlag ? (this.result = result, this) : result
		}

		/**
		*
		* Creates a new array will all elemets and no repeat
		*
		* @returns {Array}
		*/
		this.uniq = function() {
			currentArray = this.result || currentArray
			var result = []
			for (var el in currentArray) {
				if (!miJs.object(currentArray[el]).in(result)) {
					var count = 0
					for (var i in currentArray) {
						count += miJs.object(currentArray[el]).equal(currentArray[i]) ? 1 : 0
						if (count > 1) {
							result.push(currentArray[el])
							break
						}
					}
					if (count == 1) 
						result.push(currentArray[el])
				}
			}
			return chainFlag ? (this.result = result, this) : result
		}

		/**
		*
		* Delete all element equal passed in array 
		*
		* @param {Object} element Finding elem
		* @returns {Array}
		*/
		this.delete = function (element) {
			var result = this.filter(
				function(i){return !miJs.object(i).equal(element)})
			return chainFlag ? this : result
		}

		/**
		* 
		* All element of currentArray passed in function f
		*
		* @param {Function} f Function for work
		*/
		this.each = function (f) {
			currentArray = this.result || currentArray
			if (currentArray.forEach !== undefined)
				return chainFlag ? (currentArray.forEach(f), this) : currentArray.forEach(f)
			for (var i in currentArray)
				f(currentArray[i])
			if (chainFlag)
				return this
		}

	}


	/**
	*
	* Create jsFunction - collection functions for work with Function in JS
	*
	* @constructor
	* @this {jsFunction}
	* @param {Function} currentFunction Function for work
	* @param {Boolean} chainFunctionFlag flag chain function
	*/
	function jsFunction(currentFunction, chainFunctionFlag) {
		
		/**
		*
		* Chain Functions flag
		*/
		var chainFlag = !!chainFunctionFlag
		
		/**
		*
		* Result for chain functions
		*/
		this.result = undefined

		/**
		*
		* Change flag chainFlag and if it equal true, return result
		*
		* @return [] Return result chain Functions 
		*/

		this.chain = function () {
			chainFlag = !chainFlag
			return chainFlag ? this : this.result
		}

		/*
		* Decorator caching functions
		*
		* @returns {Function} Function currentFunction with cache
		*/
		this.cache = function () {
		    var ret = function () {
		        for (var i in ret.base.argument) 
		            if (ret.base.argument.hasOwnProperty(i) && miniJs.object(ret.base.argument[i]).equal(arguments)) 
		                return ret.base.retValue[i]
		        ret.base.argument.push(arguments)
		        var value = currentFunction.apply(this, arguments)
		        ret.base.retValue.push(value)
		        alert(ret.base.argument[ret.base.argument.length - 1][0])
		        return value
		    }
		    ret.base = {argument: [], retValue: []}
		    if (chainFlag) {
		    	var r =  miJs.function(ret, true)
		    	r.result = ret
		    	return r
		    }
		    return  ret
		}

		/**
		*
		* Decorator logging function
		*
		* @returns {Function} Function currentFunction with log
		*/
		this.log = function () {
			var ret = function () {
				var value = currentFunction.apply(this, arguments)
				ret.log.push({args: arguments, ret: value})
			}
			ret.log = []
		    if (chainFlag) {
		    	var r =  miJs.function(ret, true)
		    	r.result = ret
		    	return r
		    }
		    return  ret
		}

		/**
		*
		* Cloning function
		* 
		* @returns {Function} Clone function
		*/
		this.clone = function() {
		    var temp = function temporary() {return currentFunction.apply({}, arguments)}
		    for(var key in currentFunction) 
		        temp[key] = currentFunction[key];
		    if (chainFlag) {
		    	var r =  miJs.function(temp, true)
		    	r.result = temp
		    	return r
		    }
		    return  ret
		}
	}
}()





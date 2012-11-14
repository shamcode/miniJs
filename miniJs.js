/*
*
* Create singleton for collections
*
* @constructor 
* @this {miniJs}
*/

miJs = miniJs = new function () {
	this.object = function (obj) {
		return new jsObject(obj)
	}
				
	this.function = function (f) {
		return new jsFunction(f)
	}

	this.array = function (arr) {
		return new jsArray(arr)
	}

	this.this = undefined
}




/*
* Create jsObject - collection functions for work with Objects in JS
*
* @constructor
* @this {jsObject}
* @param {Object} currentObject Object for work
*/

function jsObject(currentObject) {

	/*
	* The object cloning
	*
	* @returns {Object} Object cloning
	*/
	this.clone = function() {
		return function (obj) {
			var r = (obj instanceof Array) ? [] : {}
			for (var i in obj)
				r[i] = typeof obj[i] == 'object' ? arguments.callee(obj[i]) : obj[i]
			return r
		} (currentObject)
	}

	/*
	*
	* Tests for the equality of the passed object
	*
	* @param {Object} obj
	* @returns {Boolean} Result
	*/
	this.equal = function (obj) {
		return function(first, second) {
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
	}

	/*
	*
	* Tests for the occurrence of an object in an array
	* 
	* @param {Array} array 
	* @returns {Boolean} Is object in the array
	*/
	this.in = function (array) {
		for (var i in array) 
			if (this.equal(array[i])) return true
		return false
	}

	/*
	*
	* Show all value of object in alert window
	*
	* @param {Array}   [keyArray] Array of keys
	* @param {Boolean} [showThis] Show key-value, if it not in keyArray
	*/
	this.alert = function (keyArray, showThis) {
		var showString = ""
		for (var i in currentObject)
			if (showThis) 
				showString += miniJs.object(i).in(keyArray) ? "" : i + "=" + currentObject[i].toString() + '\n'
			else
				showString += keyArray ? (miniJs.object(i).in(keyArray) ? i + "=" + currentObject[i].toString() + '\n': "") : 
										 i + "=" + (currentObject[i] == undefined ? '' : currentObject[i].toString()) + '\n'
		alert(showString)
	}

	/*
	*
	* Set value in object. If key not found in object, it will add.
	*
	* @param {Object}  setValue      Object with value for seting
	* @param {Boolean} [ifUndefined] Set value if current key in currentObject undefineded, else not seting
	*/
	this.set = function(setValue, ifUndefined) {
		for (var i in setValue) 
			if (ifUndefined && currentObject[i] !== undefined) 
				continue
			else if (typeof setValue[i] == 'object') {
				if (currentObject[i] == undefined) 
					currentObject[i] = setValue[i] instanceof Array ? [] : {}
				miniJs.object(currentObject[i]).set(setValue[i])
			} else if (typeof setValue[i] == 'function')
				currentObject[i] = miniJs.function(setValue[i]).clone()
			else
				currentObject[i] = setValue[i]
	}

	/*
	*
	* Set link to current object in miniJs.this
	*/
	this.with = function () {
		miniJs.this = currentObject
	}
}


/*
*
* Create jsArray - coolection functions for work with Array in Js
*
* @constructor
* @this {jsArray}
* @param {Array} currentArray Array for work
*/
function jsArray(currentArray) {
	
	/*
	*
	* The array cloning
	*
	* @returns {Array} Clone of this array
	*/
	this.clone = function () {
		return currentArray.slice(0)
	}

	/*
	*
	* Tests for the equality of the passed array
	*
	* @param {Array} arr Array for test
	* @returns {Boolean} Result
	*/
	this.equal = function (arr) {
		return miJs.object(currentArray).equal(arr)
	}

	/*
	*
	* Show all elements of array in alert window
	*
	*/
	this.alert = function () {
		var showString = ''
		for (var i in currentArray)
			showString += i + '=' + currentArray[i].toString() + '\n'
		alert (showString)
	}

	/*
	*
	* Iter run functions for all elements in array and return aray of result
	*
	* @param {Function} f Callback
	* @returns {Array} Results function f
	*/
	this.map = function(f) {
		if (currentArray.map !== undefined) 
			return currentArray.map(f)
		var result = []
		for (var i in currentArray)
			result.push(f(currentArray[i]))
		return result
	}

	/*
	*
	* Creates a new array with all elements that pass the test implemented by the provided function.
	* 
	* @param {Function} f Callback
	* @returns {Array}
	*/
	this.filter = function(f) {
		if (currentArray.filter !== undefined) 
			return currentArray.filter(f)
		var result = []
		for (var i in currentArray) 
			if (f(currentArray[i])) 
				result.push(currentArray)
		return result
	}

	/*
	*
	* Creates a new array will all elemets and no repeat
	*
	* @returns {Array}
	*/
	this.uniq = function() {
		var result = []
		for (var el in currentArray) {
			if (miJs.object(currentArray[el]).in(result))
				continue
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
		return result
	}

	/*
	*
	* Delete all element equal passed in array 
	*
	* @param {Object} element Finding elem
	* @returns {Array}
	*/
	this.delete = function (element) {
		return this.filter(function(i){return !miJs.object(i).equal(element)})
	}

}




/*
*
* Create jsFunction - collection functions for work with Function in JS
*
* @constructor
* @this {jsFunction}
* @param {Function} currentFunction Function for work
*/
function jsFunction(currentFunction) {
	

	/*
	* Decorator caching functions
	*
	* @returns {Function} Function currentFunction with cache
	*/
	this.cache = function () {
	    var ret = function () {
	        for (var i in ret.base.argument) 
	            if (ret.base.argument[i].hasOwnProperty(i) && miniJs.object(ret.base.argument[i]).equal(arguments)) 
	                return ret.base.retValue[i]
	        ret.base.argument.push(arguments)
	        var value = currentFunction.apply(this, arguments)
	        ret.base.retValue.push(value)
	        return value
	    }
	    ret.base = {argument: [], retValue: []}
	    return ret
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
		return ret
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
	        temp[key] = typeof currentFunction[key] == 'object' ? miJs.object(currentFunction[key]).clone(): currentFunction[key];
	    return temp;
	}
}

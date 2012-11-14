/*
*
* Create singleton for collections
*
* @constructor 
* @this {miniJs}
*/

miJs = miniJs = new function () {
	var _jsObject = new jsObject()
	this.object = function (obj) {
		_jsObject.currentObject = obj
		return _jsObject
	}
				
	var _jsFunction = new jsFunction()
	this.function = function (f) {
		_jsFunction.currentFunction = f
		return _jsFunction
	}

	var _jsArray = new jsArray()
	this.array = function (arr) {
		_jsArray.currentArray = arr
		return _jsArray
	}

	this.this = undefined
}




/*
* Create jsObject - collection functions for work with Objects in JS
*
* @constructor
* @this {jsObject}
*/

function jsObject() {

	//Object for work
	this.currentObject = undefined
	
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
		} (this.currentObject)
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
		} (this.currentObject, obj)
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
		for (var i in this.currentObject)
			if (showThis) 
				showString += miniJs.object(i).in(keyArray) ? "" : i + "=" + this.currentObject[i].toString() + '\n'
			else
				showString += keyArray ? (miniJs.object(i).in(keyArray) ? i + "=" + this.currentObject[i].toString() + '\n': "") : 
										 i + "=" + (this.currentObject[i] == undefined ? '' : this.currentObject[i].toString()) + '\n'
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
			if (ifUndefined && this.currentObject[i] !== undefined) 
				continue
			else if (typeof setValue[i] == 'object') {
				if (this.currentObject[i] == undefined) 
					this.currentObject[i] = setValue[i] instanceof Array ? [] : {}
				miniJs.object(this.currentObject[i]).set(setValue[i])
			} else if (typeof setValue[i] == 'function')
				this.currentObject[i] = miniJs.function(setValue[i]).clone()
			else
				this.currentObject[i] = setValue[i]
	}

	/*
	*
	* Set link to current object in miniJs.this
	*/
	this.with = function () {
		miniJs.this = this.currentObject
	}
}


/*
*
* Create jsArray - coolection functions for work with Array in Js
*
* @constructor
* @this {jsArray}
*/
function jsArray() {
	
	//Array for work
	this.currentArray = undefined

	/*
	*
	* The array cloning
	*
	* @returns {Array} Clone of this array
	*/
	this.clone = function () {
		return this.currentArray.slice(0)
	}

	/*
	*
	* Tests for the equality of the passed array
	*
	* @param {Array} arr Array for test
	* @returns {Boolean} Result
	*/
	this.equal = function (arr) {
		return miJs.object(this.currentArray).equal(arr)
	}

	/*
	*
	* Show all elements of array in alert window
	*
	*/
	this.alert = function () {
		var showString = ''
		for (var i in this.currentArray)
			showString += i + '=' + this.currentArray[i].toString() + '\n'
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
		if (this.currentArray.map !== undefined) 
			return this.currentArray.map(f)
		var result = []
		for (var i in this.currentArray)
			result.push(f(this.currentArray[i]))
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
		if (this.currentArray.filter !== undefined) 
			return this.currentArray.filter(f)
		var result = []
		for (var i in this.currentArray) 
			if (f(this.currentArray[i])) 
				result.push(this.currentArray)
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
		for (var el in this.currentArray) {
			if (miJs.object(this.currentArray[el]).in(result))
				continue
			var count = 0
			for (var i in this.currentArray) {
				count += miJs.object(this.currentArray[el]).equal(this.currentArray[i]) ? 1 : 0
				if (count > 1) {
					result.push(this.currentArray[el])
					break
				}
			}
			if (count == 1) 
				result.push(this.currentArray[el])
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
*/
function jsFunction() {
	
	//Function for work

	this.currentFunction = undefined
	
	/*
	* Decorator caching functions
	*
	* @returns {Function} Function this.currentFunction with cache
	*/
	this.cache = function () {
		var currentFunction = this.currentFunction
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
	* @returns {Function} Function this.currentFunction with log
	*/
	this.log = function () {
		var currentFunction = this.currentFunction
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
		var currentFunction = this.currentFunction
	    var temp = function temporary() {return currentFunction.apply({}, arguments)}
	    for(var key in this.currentFunction) 
	        temp[key] = typeof this.currentFunction[key] == 'object' ? miJs.object(this.currentFunction[key]).clone(): this.currentFunction[key];
	    return temp;
	}
}

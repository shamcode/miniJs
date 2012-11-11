


/*
* 
* Init miniJs
*
* Create global Object miniJs
*/

miJs = miniJs = new miniJs()


/*
*
* Create main object for collections
*
* @constructor 
* @this {miniJs}
*/

function miniJs() {
	this.object = function (obj) {
		return new jsObject(obj)
	}
				
	this.function = function (f) {
		return new jsFunction(f)
	}
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
			if (first.length !== second.length) return false
			for (var i in first) 
				if (typeof first[i] == 'object') {
					if (!second[i] || !arguments.callee(first[i], second[i])) return false
				} else if (typeof first[i] == 'function') {
					if (first[i].toString() != second[i].toString()) return false
					}
				else 
					if (first[i] !== second[i]) return false
			return true	
		} (currentObject, obj)
	}

	/*
	*
	* Tests for the occurrence of an object in an array
	* 
	* @param {Array} array 
	* @param {Boolean} Is object in the array
	*/
	this.in = function (array) {
		for (var i in array) 
			if (this.equal(array[i])) return true
		return false
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
	* @returns {Function} Function f with cache
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
	* @param {Function} f Function
	* @returns {Function} Function f with log
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
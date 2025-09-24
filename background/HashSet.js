function HashSet(){
}

HashSet.prototype.add = function(key, val){
	this[key] = val;
}

HashSet.prototype.remove = function(key){
	delete this[key];
}

HashSet.prototype.contains = function(key){
	return this.hasOwnProperty(key);
}

HashSet.prototype.matches = function(str){
	for(let key of Object.keys(this)){
		let regEx;

		if(this[key] === RegExType.CASE_INSENSITIVE){
			regEx = new RegExp(key, "i");
		}else if(this[key] == RegExType.CASE_SENSITIVE){
			regEx = new RegExp(key);
		}

		if(regEx.test(str))
			return true;
	}

	return false;
}

HashSet.prototype.keys = function(){
	return Object.keys(this);
}

HashSet.prototype.values = function(){
	return Object.values(this);
}

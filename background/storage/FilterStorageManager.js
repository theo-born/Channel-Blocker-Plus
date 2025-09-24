function FilterStorageManager(storage){
	this.storage = storage;
	this.sets = {};

	for(let ft of Object.values(FilterType)){
		this.sets[ft] = new HashSet();
	}
}

FilterStorageManager.prototype.initSets = async function(){
	for(let ft of Object.values(FilterType)){
		let storageContainer = await this.storage.get(String(ft));
		Object.assign(this.sets[ft], storageContainer[String(ft)]);
	}
}

FilterStorageManager.prototype.add = function(filterType, str, val){
	let exists = this.sets[filterType].hasOwnProperty(str) && this.sets[filterType][str] === val;

	this.sets[filterType].add(str, val);
	this.updateStorage(filterType);

	return !exists;
}

FilterStorageManager.prototype.remove = function(filterType, str){
	let exists = this.sets[filterType].hasOwnProperty(str);

	this.sets[filterType].remove(str);
	this.updateStorage(filterType);

	return exists;
}

FilterStorageManager.prototype.getHashSet = function(filterType){
	return this.sets[filterType];
}

FilterStorageManager.prototype.isBlocked = function(input){

	if(this.sets[FilterType.BLOCKED_USERS].contains(input.user_channel_name))
		return true;

	if(this.sets[FilterType.EXCLUDED_USERS].contains(input.user_channel_name))
		return false;

	if(this.sets[FilterType.NAME_REGEXS].matches(input.user_channel_name))
		return true;

	if(input.additional === undefined)
		return false;

	if(input.additional.type === "comment"){

		return this.sets[FilterType.COMMENT_REGEXS].matches(input.additional.content);
	}else if(input.additional.type === "title"){

		return this.sets[FilterType.TITLE_REGEXS].matches(input.additional.content);
	}
}

FilterStorageManager.prototype.updateStorage = async function(filterType){
	let storageUpdate = {};
	storageUpdate[filterType] = this.sets[filterType];
	await this.storage.set(storageUpdate);
}

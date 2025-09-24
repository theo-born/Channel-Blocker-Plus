
function completeConfig(config){
	if(config.observeOnCharacterData === undefined){
		config.observeOnCharacterData = "all";
	}
}

function onCharacterDataObserved(characterDataParent, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey){
	let characterData = characterDataParent.innerText.trim();

	if(config.observeOnCharacterData === "all"){
		characterDatas[characterDatasKey] = characterData;

		if(Object.keys(characterDatas).length === Object.keys(config.characterDataSelectors).length){
			onObserved(anchor, Object.assign({}, characterDatas), characterDataParents, _config);

			for(let prop in characterDatas){
				delete characterDatas[prop];
			}
		}
	}else if(config.observeOnCharacterData === "any"){

		onObserved(anchor, {[characterDatasKey]: characterData}, characterDataParents, _config);
	}
}

function createCharacterDataObserverRec(characterDataSelectorIndex, subCharacterData, observers, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey){
	let characterDataSelector = config.characterDataSelectors[characterDatasKey];

	if(characterDataSelectorIndex < characterDataSelector.length){
		let subSubCharacterDatas = $(subCharacterData).find(characterDataSelector[characterDataSelectorIndex]);

		if(subSubCharacterDatas.length > 0){
			createCharacterDataObserverRec(characterDataSelectorIndex+1, subSubCharacterDatas[0], observers, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey);
		}else{
			let firstTime = true;

			observers.push(new MutationSummary({
				callback: (summaries) => {
					if(firstTime && summaries.length > 0){
						if(summaries[0].added.length > 0){
							firstTime = false;

							createCharacterDataObserverRec(characterDataSelectorIndex+1, summaries[0].added[0], observers, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey);
						}
					}
				},
				rootNode: subCharacterData,
				queries: [{element: characterDataSelector[characterDataSelectorIndex]}]
			}));
		}
	}else{
		characterDataParents[characterDatasKey] = subCharacterData;

		onCharacterDataObserved(subCharacterData, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey);

		observers.push(new MutationSummary({
			callback: (summaries) => {
				for(let summary of summaries){
					if(summary.added.length === 1 && summary.removed.length === 1 || summary.valueChanged.length === 1){
						onCharacterDataObserved(subCharacterData, config, _config, onObserved, anchor, characterDatas, characterDataParents, characterDatasKey);
					}
				}
			},
			rootNode: subCharacterData,
			queries: [{characterData: true}]
		}));
	}
}

function createCharacterDataObserver(observers, config, _config, onObserved, anchor, characterDatasFound, characterDataParents, characterDatasKey){
	createCharacterDataObserverRec(0, anchor, observers, config, _config, onObserved, anchor, characterDatasFound, characterDataParents, characterDatasKey);
}

function onAnchorFound(observers, config, _config, onObserved, anchor){
	let characterDatas = {};
	let characterDataParents = {};

	for(let key in config.characterDataSelectors){
		createCharacterDataObserver(observers, config, _config, onObserved, anchor, characterDatas, characterDataParents, key);
	}
}

function createaAnchorObserverRec(anchorSelectorIndex, subAnchor, observers, config, _config, onObserved){
	if(anchorSelectorIndex < config.anchorSelector.length-1){
		for(let subSubAnchor of $(subAnchor).find(config.anchorSelector[anchorSelectorIndex])){
			createaAnchorObserverRec(anchorSelectorIndex+1, subSubAnchor, observers, config, _config, onObserved);
		}

		observers.push(new MutationSummary({
			callback: (summaries) => {
				for(let summary of summaries){
					for(let subSubAnchor of summary.added){
						createaAnchorObserverRec(anchorSelectorIndex+1, subSubAnchor, observers, config, _config, onObserved);
					}
				}
			},
			rootNode: subAnchor,
			queries: [{element: config.anchorSelector[anchorSelectorIndex]}]
		}));
	}else{
		for(let anchor of $(subAnchor).find(config.anchorSelector[anchorSelectorIndex])){
			onAnchorFound(observers, config, _config, onObserved, anchor);
		}

		observers.push(new MutationSummary({
			callback: (summaries) => {
				for(let summary of summaries){
					for(let anchor of summary.added){
						onAnchorFound(observers, config, _config, onObserved, anchor);
					}
				}
			},
			rootNode: subAnchor,
			queries: [{element: config.anchorSelector[anchorSelectorIndex]}]
		}));
	}
}

function Observer(_config, onObserved){
	this.observers = [];

	let config = Object.assign({}, _config);
	completeConfig(config);

	try{
		createaAnchorObserverRec(0, document, this.observers, config, _config, onObserved);
	}catch(exception){
		console.debug(exception);
	}
}

function disconnect(){
	while(this.observers.length > 0){
		this.observers.pop().disconnect();
	}
}

Observer.prototype.constructor = Observer;

Observer.prototype.disconnect = disconnect;

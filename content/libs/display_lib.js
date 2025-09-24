function toggleVisibilty(element, isBlocked){
	if((element.style.display === "none") === isBlocked){
		return;
	}

	if(isBlocked){
		$(element).hide(contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}else{
		$(element).show(contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}
}

function fade(element, isBlocked){
	if((element.style.display === "none") === isBlocked){
		return;
	}

	if(isBlocked){
		$(element).fadeOut(contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}else{
		$(element).fadeIn(contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}
}

function toggleVisibiltyVertical(element, isBlocked){
	if((element.style.display === "none") === isBlocked){
		return;
	}

	if(isBlocked){
		for (let child of element.children) {
			child.style.width = child.clientWidth + "px";
		}

		$(element).animate({width: "hide"}, contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}else if(element.style.display === "none"){
		$(element).animate({width: "show"}, contentUIConfig[ContentUI.ANIMATION_SPEED], () => {
			for (let child of element.children) {
				child.style.width = "";
			}
		});
	}
}

function toggleVisibiltyHorizontal(element, isBlocked){
	if((element.style.display === "none") === isBlocked){
		return;
	}

	if(isBlocked){
		$(element).animate({height: "hide"}, contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}else{
		$(element).animate({height: "show"}, contentUIConfig[ContentUI.ANIMATION_SPEED]);
	}
}

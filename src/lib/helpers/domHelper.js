export function redirect(href) {
	let link = document.createElement('a');
	link.style = 'width: 0; height: 0; margin: 0; padding: 0;';
	link.href = href;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export const getClientWidth = () => {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

export const getChartSize = (clientWidth: number) => {
	let margin: {top: number, right: number, bottom: number, left: number}, width, height;
	if (clientWidth < 321) {
		margin = { top: 6, right: 20, bottom: 20, left: 32 };
		width = 260 - margin.left - margin.right;
		height = 150 - margin.top - margin.bottom;
	} else if (clientWidth >= 321 && clientWidth < 574) {
		margin = { top: 6, right: 20, bottom: 20, left: 32 };
		width = 300 - margin.left - margin.right;
		height = 160 - margin.top - margin.bottom;
	} else if (clientWidth >= 574 && clientWidth < 772) {
		margin = { top: 30, right: 40, bottom: 20, left: 40 };
		width = 510 - margin.left - margin.right;
		height = 320 - margin.top - margin.bottom;
	} else if (clientWidth >= 772 && clientWidth < 992) {
		margin = { top: 30, right: 40, bottom: 20, left: 40 };
		width = 660 - margin.left - margin.right;
		height = 333 - margin.top - margin.bottom;
	} else if (clientWidth >= 992 && clientWidth < 1200) {
		margin = { top: 30, right: 40, bottom: 30, left: 26 };
		width = 900 - margin.left - margin.right;
		height = 470 - margin.top - margin.bottom;
	} else if (clientWidth >= 1200) {
		margin = { top: 30, right: 40, bottom: 30, left: 26 };
		width = 960 - margin.left - margin.right;
		height = 500 - margin.top - margin.bottom;
	}
	
	return {margin, width, height};
}
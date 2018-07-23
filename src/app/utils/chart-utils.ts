export class ChartUtils {
    getClientWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    getChartSize(clientWidth: number) {
        let margin, width, height;
        if (clientWidth < 321) {
			// poor UX but neccessary to fit screen
			margin = { top: 6, right: 20, bottom: 20, left: 20 };
			width = 280 - margin.left - margin.right;
			height = 150 - margin.top - margin.bottom;

		} else if(clientWidth >= 321 && clientWidth < 574) {
			margin = { top: 6, right: 20, bottom: 20, left: 20 };
			width = 300 - margin.left - margin.right;
			height = 160 - margin.top - margin.bottom;

		} else if(clientWidth > 720 && clientWidth < 960) {
			margin = { top: 30, right: 20, bottom: 20, left: 20 };
			width = 660 - margin.left - margin.right;
			height = 333 - margin.top - margin.bottom;
		} else if (clientWidth > 960) {
			margin = { top: 30, right: 40, bottom: 30, left: 20 };
			width = 960 - margin.left - margin.right;
			height = 500 - margin.top - margin.bottom;
        }
        
        return {margin, width, height};
    }
}
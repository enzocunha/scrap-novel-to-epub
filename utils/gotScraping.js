const { gotScraping } = require('got-scraping');

const returnHTML = async (url) => {
	const { body } = await gotScraping.get(url);
	return body;
};

module.exports = {
	returnHTML,
};

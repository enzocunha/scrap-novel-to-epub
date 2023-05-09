const { generateEpubFrom } = require('./utils/epub-gen-memory.js');



(async () => {
	await generateEpubFrom('https://novelfull.com/martial-peak.html');
})();

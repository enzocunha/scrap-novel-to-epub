const epub = require('epub-gen-memory').default;
const { writeFile } = require('fs').promises;

const {
	returnNovelFullMetadata,
	returnAllNovelFullChapters,
} = require('./cheerio');

const generateEpubFrom = async (url) => {
	// Scrap
	const { metadata, chaptersBeforeToc, firstChapterURL } =
		await returnNovelFullMetadata(url);
	const chapters = await returnAllNovelFullChapters(firstChapterURL);

	// Settings
	const options = {
		...metadata,
		verbose: true,
		numberChaptersInTOC: false,
	};

	const content = [
		{
			title: 'Info',
			content: chaptersBeforeToc.info,
			beforeToc: true,
			excludeFromToc: true,
		},
		{
			title: 'Synopsis',
			content: chaptersBeforeToc.description,
			beforeToc: true,
			excludeFromToc: true,
		},
		...chapters,
	];

	// Generate
	const epubBuffer = await epub(options, content);
	await writeFile(`${metadata.title}.epub`, epubBuffer);
};

module.exports = {
	generateEpubFrom,
};

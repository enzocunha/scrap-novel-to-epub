const cheerio = require('cheerio');
const { returnHTML } = require('./gotScraping');

const NOVELFULL_BASE = 'https://novelfull.com';

const returnNovelFullMetadata = async (url) => {
	const html = await returnHTML(url);
	const $ = cheerio.load(html);

	const title = $('div.desc:nth-child(1) > h3:nth-child(1)').text();
	const author = $('.info > div:nth-child(1) > a:nth-child(2)').text();
	const description = $('.desc-text').html();
	const firstChapterURL =
		NOVELFULL_BASE +
		$('.list-chapter > li:nth-child(1) > a:nth-child(2)').attr('href');

	// Fixing relative path
	const cover = NOVELFULL_BASE + $('.book img').attr('src');
	$('.book img').attr('src', cover);
	const info = $('.info-holder').html();

	return {
		metadata: { title, author, cover },
		chaptersBeforeToc: { description, info },
		firstChapterURL,
	};
};

const returnNovelFullChapter = async (url) => {
	const html = await returnHTML(url);
	const $ = cheerio.load(html);

	const title = $('.chapter-title').text();
	const content = $('#chapter-content').html();

	let nextChapter = $(
		'.chapter-nav > div:nth-child(1) > a:nth-child(3)'
	).attr('href');
	if (nextChapter) {
		nextChapter = NOVELFULL_BASE + nextChapter;
	}

	return {
		title,
		content,
		nextChapter,
	};
};

const returnAllNovelFullChapters = async (url) => {
	// Pass url of the first chapter
	const html = await returnHTML(url);
	const $ = cheerio.load(html);

	const chapters = [];
	while (url) {
		const { title, content, nextChapter } = await returnNovelFullChapter(
			url
		);

		// Keeping track of progress
		console.log(title);

		chapters.push({ title, content });
		url = nextChapter;
	}

	return chapters;
};

module.exports = {
	returnNovelFullMetadata,
	returnNovelFullChapter,
	returnAllNovelFullChapters,
};

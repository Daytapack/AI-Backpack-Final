import puppeteer from "puppeteer";

// Initial URL to start crawling
const initialUrl = 'https://www.indeed.com/?from=gnav-homepage';

// Set a limit to the number of pages to crawl
const maxPagesToCrawl = 30; // You can adjust this limit

// User-Agent header for your crawler
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

// Keywords that may indicate job-related URLs
const jobKeywords = ['jobs', 'job-search', 'q-', 'vjk='];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the User-Agent header
  await page.setUserAgent(userAgent);

  const crawl = async (url) => {
    try {
      await page.goto(url);

      // Wait for relevant elements to be available
      await page.waitForSelector('a');

      // Process the page here
      console.log(`Crawled: ${url}`);

      // Check if the URL contains job-related keywords
      const isJobPage = jobKeywords.some(keyword => url.includes(keyword));

      // If it's not a job-related page, skip further processing
      if (!isJobPage) {
        console.log('Skipped non-job page');
        return;
      }

      // Extract links from the page
      const links = await page.evaluate(() => {
        // Extract all links on the page
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map(a => a.href);
      });

      // You can do more with the crawled data here
      // ...

      // Continue crawling other pages (up to the limit)
      if (crawledPages < maxPagesToCrawl) {
        for (const link of links) {
          if (link.startsWith('http') || link.startsWith('https')) {
            await crawl(link);
          }
        }
      }
    } catch (error) {
      console.error(`Error crawling ${url}: ${error}`);
    }
  };

  // Set the initial limit of pages crawled to 0
  let crawledPages = 0;

  // Start the crawling process
  await crawl(initialUrl);

  await browser.close();
})();

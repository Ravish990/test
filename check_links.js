const { check } = require('linkinator');
const glob = require('glob');

async function run() {
  glob('**/*.html', { ignore: 'node_modules/**' }, async (err, files) => {
    if (err) {
      console.error('Error finding HTML files:', err);
      process.exit(1);
    }

    let allLinksValid = true;

    const promises = files.map(async (file) => {
      const results = await check({
        path: file,
        recurse: true,
        concurrency: 5
      });

      for (const link of results.links) {
        if (link.state === 'BROKEN') {
          console.error(`Broken link found in ${file}: ${link.url}`);
          allLinksValid = false;
        }
      }
    });

    Promise.all(promises).then(() => {
      if (allLinksValid) {
        console.log('All links are valid!');
        process.exit(0); 
      } else {
        process.exit(1);
      }
    });
  });
}

run().catch(console.error);

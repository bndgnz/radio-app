import fs from 'fs';
const {readFile, writeFile} = require('fs');
import { Feed } from 'feed';
import { createClient } from "contentful"; 
   

export default async function generateRssFeed() {

  const truncate = (input) =>
  input?.length > 100 ? `${input.substring(0, 99)}...` : input;

 const site_url =  process.env.NEXT_PUBLIC_SITE_URL;

 const feedOptions = {
  title: "Waiheke Radio Podcasts | RSS Feed",
  description: "Welcome to Waiheke Radio Podcasts",
  id: site_url,
  link: site_url,
  image: `${site_url}/logo.png`,
  favicon: `${site_url}/favicon.png`,
  copyright: `All rights reserved ${new Date().getFullYear()}, Waiheke Radio`,
  generator: "Feed for Node.js",
  feedLinks: {
    rss2: `${site_url}/rss.xml`,
    json: `${site_url}/feed.json`,
    atom: `${site_url}/atom.xml`
  },
  
};

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const posts = await client.getEntries({
  content_type: "amazonPodcast",
  locale: "en-US",
  limit: 30,
  order: '-sys.createdAt',
});
console.log(posts)
const feed = new Feed(feedOptions);

posts.items.forEach((post) => {
  feed.addItem({
    title: post.fields.title.replaceAll("&", " and "),
    
    link: `${site_url}/podcast/${post.fields.slug}`,
    enclosure: post.fields.amazonUrl,
    description: truncate(post.fields.description.replaceAll("&", " and ")),
    date: new Date(post.fields.date),

  });
});

 fs.writeFileSync('./public/rss.xml', feed.rss2());

 readFile('./public/rss.xml', 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  const replaced = contents.replace('\<channel\>', '\<channel\>\n\<atom:link href="https://www.waihekeradio.org.nz/rss.xml" rel="self" type="application/rss+xml" />');
  const typeReplaced = replaced.replaceAll('type="image/mp3"', 'type="audio/mpeg"');

  writeFile('./public/rss.xml', typeReplaced, 'utf-8', function (err) {
    console.log(err);
  });

});
 
}
import fs from "fs";
import { Feed } from "feed";
import { createClient } from "contentful";

export default async function generateRssFeed() {
  const site_url = "https://www.waihekeradio.org.nz";

  const author = {
    name: "Waiheke Radio",
    email: "info@waihekeradio.org.nz",
    link: "https://www.waihekeradio.org.nz",
  };

  const category = { name:"Community Radio Podcast",}


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
    author,
    category,
   
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
 
  const feed = new Feed(feedOptions);

  posts.items.forEach((post) => {
    feed.addItem({
      title: post.fields.title.replaceAll("&", " and "),
      image: post.fields.podcastImage,
      id: `${site_url}/podcast/${post.fields.slug}`,
      link: `${site_url}/podcast/${post.fields.slug}`,
      enclosure: post.fields.amazonUrl,
      description: post.fields.description.replaceAll("&", " and "),
      date: new Date(post.fields.date),
      author: [author],
      category: [category]
       
    });
  });
 
fs.writeFileSync('./public/atom.xml', feed.atom1());
fs.writeFileSync('./public/feed.json', feed.json1());
 

 

fs.readFile('./public/rss.xml', 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }

  const replaced = contents.replace('\<channel\>', '\<channel\>\n\<atom:link href="https://www.waihekeradio.org.nz/rss.xml" rel="self" type="application/rss+xml" />');

console.log (replaced) 


  fs.writeFileSync('./public/rss-test.xml', replaced, 'utf-8', function (err) {
    console.log(err);
  });
});



}

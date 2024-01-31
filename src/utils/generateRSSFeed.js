import fs from 'fs';
const {readFile, writeFile} = require('fs');
import { Feed } from 'feed';
import { createClient } from "contentful"; 
 

export default async function generateRssFeed(props) {
const site_url =  process.env.NEXT_PUBLIC_SITE_URL;
const rssFeedTitle = props[0];
const rssFileLink = site_url+"/"+props[1]+".xml";
const rssFileName =  "./public/"+props[1]+".xml";
 
let rssShowTitle;

 rssShowTitle= props[1].replaceAll("-"," ").toUpperCase() ; 
  const truncate = (input) =>
  input?.length > 100 ? `${input.substring(0, 99)}...` : input;

  const feedOptions = {
  title: rssShowTitle +" Podcasts | RSS Feed",
  description:"All Podcasts from " +rssShowTitle+" - Waiheke Radio, New Zealand",
  id: site_url,
  link: site_url,
  image: `${site_url}/logo.png`,
  favicon: `${site_url}/favicon.png`,
  copyright: `All rights reserved ${new Date().getFullYear()}, Waiheke Radio`,
  generator: "Feed for Node.js",
  feedLinks: {
    rss2: `${rssFileLink}`,
    json: `${site_url}/feed.json`,
    atom: `${site_url}/atom.xml`
  },
 
  
};

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});




const posts = await client.getEntries({
  include: 10,
  content_type: "amazonPodcast",
  order: '-sys.createdAt',
  "fields.show.fields.slug": props[1] ,
  'fields.show.sys.contentType.sys.id': 'shows',
  locale: "en-US",
  limit: 50,

  

});


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

 fs.writeFileSync(rssFileName, feed.rss2());

 readFile(rssFileName, 'utf-8', function (err, contents) {
  if (err) {
    console.log(err);
    return;
  }
  const replaced = contents.replace('\<channel\>', '\<channel\>\n\<atom:link href="https://www.waihekeradio.org.nz/rss.xml" rel="self" type="application/rss+xml" />');
  const typeReplaced = replaced.replaceAll('type="image/mp3"', 'type="audio/mpeg"');
  const nameSpace = typeReplaced.replaceAll('<rss version="2.0">', '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
  const length  = nameSpace.replaceAll('length="0"', 'length="123456"');

  const author  = length.replaceAll('<item>', '<item>\n<author>Waiheke Radio (info@waihekeradio.org.nz) </author>\n');
 
  writeFile(rssFileName, author, 'utf-8', function (err) {
    console.log(err);
  });

});
 
}
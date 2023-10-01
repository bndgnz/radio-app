import fs from "fs";
import { Feed } from "feed";
import { createClient } from "contentful";

export default async function generateRssFeed() {
  const site_url = "localhost:3000";

  const feedOptions = {
    title: "Waiheke Radio Podcasts | RSS Feed",
    description: "Welcome to Waiheke Radio Podcasts Feed!",
    id: site_url,
    link: site_url,
    image: `${site_url}/logo.png`,
    favicon: `${site_url}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Waiheke Radio`,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${site_url}/rss.xml`,
    },
  };

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const posts = await client.getEntries({
    content_type: "amazonPodcast",
    locale: "en-US",
    limit: 1000,
  });

  const feed = new Feed(feedOptions);

  posts.items.forEach((post) => {
    feed.addItem({
      title: post.fields.title,
      id: `${site_url}/podcast/${post.fields.slug}`,
      link: post.fields.amazonUrl,
      description: post.fields.description,
      date: new Date(post.fields.date),
    });
  });
  fs.writeFileSync("./public/rss.xml", feed.rss2());
}

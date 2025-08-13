import fs from "fs";
import path from "path";
import { Feed } from "feed";
import { createClient } from "contentful";

export default async function generateRssFeed(props) {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;

  console.log("???????????????????", site_url)
  const rssFeedTitle = props[0];
  const rssFileLink = site_url + "/" + props[1] + ".xml";
  const rssFileName = path.join(process.cwd(), "public", "rss.xml");

  let rssShowTitle;

  rssShowTitle = props[0].replaceAll("-", " ");
  const truncate = (input) =>
    input?.length > 500 ? `${input.substring(0, 499)}...` : input;

  const feedOptions = {
    title:"Waiheke Radio Podcasts",
    description: "All podcasts from community radio station Waiheke Radio. Aotearoa/New Zealand",
    id: site_url,
    link: site_url,
    image: `${site_url}/WR-logo-3000-3000.png`,
    favicon: `${site_url}/favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Waiheke Radio`,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${rssFileLink}`,
      json: `${site_url}/feed.json`,
      atom: `${site_url}/atom.xml`,
    },
  };

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const posts = await client.getEntries({
    include: 10,
    content_type: "amazonPodcast",
    order: "-sys.createdAt",
    locale: "en-US",
    limit: 50,
  });

  const feed = new Feed(feedOptions);

  posts.items.forEach((post) => {
    const itemData = {
      title: post.fields.title.replaceAll("&", " and "),
      link: `${site_url}/podcast/${post.fields.slug}`,
      description: truncate(post.fields.description.replaceAll("&", " and ")),
      date: new Date(post.fields.date),
      author: {
        name: "Waiheke Radio",
        email: "info@waihekeradio.org.nz",
        link: "http://waihekeradio.org.nz",
      },
    };
    
    // Only add enclosure if amazonUrl exists and is a valid URL
    if (post.fields.amazonUrl && typeof post.fields.amazonUrl === 'string' && post.fields.amazonUrl.startsWith('http')) {
      itemData.enclosure = {
        url: post.fields.amazonUrl,
        type: 'audio/mpeg'
      };
    }
    
    feed.addItem(itemData);
  });

  try {
    fs.writeFileSync(rssFileName, feed.rss2());
  } catch (error) {
    console.error("Error writing RSS file:", error);
    return;
  }

  fs.readFile(rssFileName, "utf-8", function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }
    const replaced = contents.replace(
      "<channel>",
      '<channel>\n<atom:link href="' +
        site_url +
        '/rss.xml" type="application/rss+xml"  rel="self" />'
    );
    const typeReplaced = replaced.replaceAll(
      'type="image/mp3"',
      'type="audio/mpeg"'
    );
    const nameSpace = typeReplaced.replaceAll(
      '<rss version="2.0">',
      '<rss xmlns:atom="http://www.w3.org/2005/Atom"  xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:spotify="http://www.spotify.com/ns/rss" xmlns:psc="http://podlove.org/simple-chapters/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">'
    );
    const length = nameSpace.replaceAll('length="0"', 'length="4123456"');
    const author = length.replaceAll(
      "<channel>",
      '<channel>\n<spotify:countryOfOrigin>NZ-AUK</spotify:countryOfOrigin>\n<itunes:owner>\n<itunes:name>Waiheke Radio</itunes:name>\n<itunes:email>admin@waihekeradio.org.nz</itunes:email>\n</itunes:owner>\n<itunes:explicit>false</itunes:explicit>\n<language>en</language>\n<itunes:image href="https://www.waihekeradio.org.nz/WR-logo-3000-3000.png"/>\n<itunes:category text="Arts" />\n<itunes:type>episodic</itunes:type>\n<itunes:keywords>Waiheke Island Auckland New Zealand Community Radio station arts music interviews local content artists Artworks Oneroa culture</itunes:keywords>\n<itunes:author>Waiheke Radio</itunes:author>'
    );
    const itemauthor = author.replaceAll(
      "<item>",
      "<item>\n<itunes:author>Waiheke Radio</itunes:author>"
    );

    fs.writeFile(rssFileName, itemauthor, "utf-8", function (err) {
      if (err) console.log(err);
    });
  });
}

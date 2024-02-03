import fs from "fs";
const { readFile, writeFile } = require("fs");
import { Feed } from "feed";
import { createClient } from "contentful";
import { useQuery, gql } from "@apollo/client";

export default async function generateRssFeed(props) {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;
  const rssFeedTitle = props[0];
  const rssFileLink = site_url + "/" + props[1] + ".xml";
  const rssFileName = "./public/" + props[1] + ".xml";
  var doBuild;
  var rssImage;

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const show = await client
    .getEntries({
      content_type: "shows",
      "fields.slug": props[1],
      locale: "en-US",
      limit: 1,
    })
    .then(function (entries) {
      entries.items.forEach(function (entry) {
        if (entry.fields.rss == true) {
          doBuild = true;

          if (
            entry.fields.rssFeedThumbnail != null ||
            entry.fields.rssFeedThumbnail != undefined
          ) {
            rssImage = entry.fields.rssFeedThumbnail[0].secure_url;
          } else {
            rssImage = site_url + "/logo.png";
          }
        }
      });
    });

  if (doBuild == true) {
    let rssShowTitle;

    rssShowTitle = props[1].replaceAll("-", " ").toUpperCase();
 
    


    const truncate = (input) =>
      input?.length > 100 ? `${input.substring(0, 99)}...` : input;

    const feedOptions = {
      title: rssShowTitle + " Podcasts | RSS Feed",
      description:
        "All Podcasts from " + rssShowTitle + " - Waiheke Radio, New Zealand",
      id: site_url,
      link: site_url,
      image: `${rssImage}`,
      favicon: `${site_url}/favicon.png`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Waiheke Radio`,
      generator: "Feed for Node.js",
      feedLinks: {
        rss2: `${rssFileLink}`,
        json: `${site_url}/feed.json`,
        atom: `${site_url}/atom.xml`,
      },
    };

    const posts = await client.getEntries({
      include: 10,
      content_type: "amazonPodcast",
      order: "-sys.createdAt",
      "fields.show.fields.slug": props[1],
      "fields.show.sys.contentType.sys.id": "shows",
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
    readFile(rssFileName, "utf-8", function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }

      const replacestring =
        '<channel>\n<atom:link href="' +
        site_url +
        "/" +
        props[1] +
        '.xml" type="application/rss+xml"  rel="self" />';
      const replaced = contents.replace("<channel>", replacestring);
      const typeReplaced = replaced.replaceAll(
        'type="image/mp3"',
        'type="audio/mpeg"'
      );
      const nameSpace = typeReplaced.replaceAll(
        '<rss version="2.0">',
        '<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">'
      );
      const length = nameSpace.replaceAll('length="0"', 'length="4123456"');
      const author = length.replaceAll(
        "<channel>",
        '<channel>\n<itunes:owner>\n<itunes:name>Waiheke Radio</itunes:name>\n<itunes:email>admin@waihekeradio.org.nz</itunes:email>\n</itunes:owner>\n<itunes:explicit>false</itunes:explicit>\n<language>en</language>\n<itunes:image href="'+rssImage+'"/>\n<itunes:category text="Arts" />\n<itunes:type>episodic</itunes:type>\n'
      );
      const itemauthor = author.replaceAll(
        "<item>",
        "<item>\n<itunes:author>Waiheke Radio</itunes:author>"
      );
      writeFile(rssFileName, itemauthor, "utf-8", function (err) {
        console.log(err);
      });
    });
  }
}

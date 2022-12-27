import { createClient } from "contentful";
import { config } from "dotenv";
import { ILandingPageFields } from "../@types/contentful";
import { IShowsFields } from "../@types/contentful";
import {IPodcastFields} from "../@types/contentful";

/*
 * We tell TypeScript that those environment variables are always defined.
 * If you want to learn more about this madness, read:
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTENTFUL_SPACE_ID: string;
      CONTENTFUL_ACCESS_TOKEN: string;
    }
  }
}

config();

export default class ContentService {
  static get instance() {
    return new ContentService();
  }

  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  async getLandingPageBySlug(slug: string) {
    return (
      await this.client.getEntries<ILandingPageFields>({
        content_type: "landingPage",
        "fields.slug": slug,
      })
    ).items[0];
  }

  async getShowPageBySlug(slug: string) {
    return (
      await this.client.getEntries<IShowsFields>({
        content_type: "shows",
        "fields.slug": slug,
      })
    ).items[0];
  }

  async getPodcastBySlug(slug: string) {
    return (
      await this.client.getEntries<IPodcastFields>({
        content_type: "podcast",
        "fields.slug": slug,
      })
    ).items[0];
  }





  async getEntriesByType<T>(type: string) {
    return (
      await this.client.getEntries<T>({
        content_type: type,
      })
    ).items;
  }
}
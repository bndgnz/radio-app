import { createClient, ContentfulClientApi } from "contentful";
import { config } from "dotenv";
import { ILandingPageFields } from "../@types/contentful";
import { IShowsFields } from "../@types/contentful";
import {IAmazonPodcastFields} from "../@types/contentful";

/*
 * We tell TypeScript that those environment variables are always defined.
 * If you want to learn more about this madness, read:
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
 
 
export default class ContentService {
  static get instance() {
    return new ContentService();
  }

  client: ContentfulClientApi;
  previewClient: ContentfulClientApi;

  constructor() {
    const requiredEnvVars = [
      'CONTENTFUL_SPACE_ID',
      'CONTENTFUL_ACCESS_TOKEN'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    this.client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    this.previewClient = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      host: 'preview.contentful.com',
    });
  }

  async getLandingPageBySlug(slug: string, preview=false) {
 
    return (
      await this.client.getEntries<ILandingPageFields>({
        content_type: "landingPage",
        "fields.slug": slug,
      })
    ).items[0];
  }

  async getShowPageBySlug(slug: string, preview=false) {
    return (
      await this.client.getEntries<IShowsFields>({
        content_type: "shows",
        "fields.slug": slug,
      })
    ).items[0];
  }

  async getPodcastBySlug(slug: string, preview=false) {
    return (
      await this.client.getEntries<IAmazonPodcastFields>({
        content_type: "amazonPodcast",
        "fields.slug": slug,
      })
    ).items[0];
  }





  async getEntriesByType<T>(type: string, preview=false) {
    return (
      await this.client.getEntries<T>({
        content_type: type,
      })
    ).items;
  }
}
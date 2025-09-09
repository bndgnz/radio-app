require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('contentful');
const sanityClient = require('@sanity/client').createClient;
const { v4: uuidv4 } = require('uuid');

// Contentful client
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Sanity client
const sanity = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN, // Using the token from .env.local
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Map to store Contentful ID to Sanity ID mappings
const idMappings = new Map();

// Helper function to convert Contentful Rich Text to Sanity Portable Text
function convertRichTextToPortableText(richText) {
  if (!richText || !richText.content) return [];
  
  // This is a simplified conversion - you may need to enhance it
  return richText.content.map(node => {
    if (node.nodeType === 'paragraph') {
      return {
        _type: 'block',
        _key: uuidv4(),
        style: 'normal',
        markDefs: [],
        children: node.content?.map(child => ({
          _type: 'span',
          _key: uuidv4(),
          text: child.value || '',
          marks: [],
        })) || [],
      };
    }
    // Add more node type conversions as needed
    return null;
  }).filter(Boolean);
}

// Helper to convert Cloudinary image data
function convertCloudinaryImage(image) {
  if (!image) return null;
  const imageData = Array.isArray(image) ? image[0] : image;
  return {
    public_id: imageData.public_id,
    version: imageData.version,
    format: imageData.format,
    width: imageData.width,
    height: imageData.height,
    secure_url: imageData.secure_url || imageData.url,
  };
}

// Helper to generate Sanity document ID from Contentful ID
function generateSanityId(contentfulId, type) {
  return `${type}-${contentfulId}`;
}

async function migrateContentType(contentType, transformer) {
  console.log(`\nMigrating ${contentType}...`);
  
  try {
    const entries = await contentfulClient.getEntries({
      content_type: contentType,
      include: 3, // Include nested references
    });

    const documents = [];
    
    for (const entry of entries.items) {
      const sanityId = generateSanityId(entry.sys.id, contentType);
      idMappings.set(entry.sys.id, sanityId);
      
      const document = await transformer(entry, sanityId);
      if (document) {
        documents.push(document);
      }
    }

    // Upload to Sanity in batches
    const batchSize = 100;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const transaction = sanity.transaction();
      
      batch.forEach(doc => {
        transaction.createOrReplace(doc);
      });
      
      await transaction.commit();
      console.log(`  Uploaded ${Math.min(i + batchSize, documents.length)}/${documents.length} documents`);
    }
    
    console.log(`✓ Migrated ${documents.length} ${contentType} documents`);
    return documents.length;
  } catch (error) {
    console.error(`✗ Error migrating ${contentType}:`, error);
    return 0;
  }
}

// Transformer functions for each content type
const transformers = {
  staff: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'staff',
    title: entry.fields.title,
    slug: entry.fields.slug ? { current: entry.fields.slug } : undefined,
    path: entry.fields.path,
    headshot: convertCloudinaryImage(entry.fields.headshot),
    // Omit image fields that reference assets for now
    // photo: entry.fields.photo ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    currentDj: entry.fields.currentDj || false,
    shortBio: entry.fields.shortBio,
    content: entry.fields.content ? convertRichTextToPortableText(entry.fields.content) : undefined,
  }),

  sponsor: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'sponsor',
    title: entry.fields.title,
    introduction: entry.fields.introduction,
    description: entry.fields.description ? convertRichTextToPortableText(entry.fields.description) : undefined,
    // Omit image fields for now
    // image: entry.fields.image ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
  }),

  showSlot: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'showSlot',
    title: entry.fields.title,
    day: entry.fields.day,
    startTime: entry.fields.startTime,
    endTime: entry.fields.endTime,
    amPm: entry.fields.amPm,
  }),

  shows: (entry, sanityId) => {
    // Handle components if they exist in shows
    let components = undefined;
    if (entry.fields.components && Array.isArray(entry.fields.components)) {
      components = entry.fields.components.map(comp => {
        return transformers.transformComponent(comp);
      }).filter(Boolean);
    }

    return {
      _id: sanityId,
      _type: 'shows',
      title: entry.fields.title,
      slug: entry.fields.slug ? { current: entry.fields.slug } : undefined,
      path: entry.fields.path,
      // Omit image fields for now
      // image: entry.fields.image ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
      cimage: convertCloudinaryImage(entry.fields.cimage),
      showBanner: entry.fields.showBanner || false,
      archived: entry.fields.archived || false,
      introduction: entry.fields.introduction,
      content: entry.fields.content ? convertRichTextToPortableText(entry.fields.content) : undefined,
      components: components,
      timeSlots: entry.fields.timeSlots?.map(slot => ({
        _type: 'reference',
        _ref: generateSanityId(slot.sys.id, 'showSlot'),
      })),
      showUrl: entry.fields.showUrl,
      playlistUrl: entry.fields.playlistUrl,
      dj: entry.fields.dj?.map(dj => ({
        _type: 'reference',
        _ref: generateSanityId(dj.sys.id, 'staff'),
      })),
      rss: entry.fields.rss || false,
      chat: entry.fields.chat || false,
      facebook: entry.fields.facebook,
      twitter: entry.fields.twitter,
      tikTok: entry.fields.tikTok,
      linkedIn: entry.fields.linkedIn,
      website: entry.fields.website,
      applePodcasts: entry.fields.applePodcasts,
      spotify: entry.fields.spotify,
      instagram: entry.fields.instagram,
      discord: entry.fields.discord,
      sponsor: entry.fields.sponsor ? {
        _type: 'reference',
        _ref: generateSanityId(entry.fields.sponsor.sys.id, 'sponsor'),
      } : undefined,
    };
  },

  amazonPodcast: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'amazonPodcast',
    title: entry.fields.title,
    slug: entry.fields.slug ? { current: entry.fields.slug } : undefined,
    podcastImage: convertCloudinaryImage(entry.fields.podcastImage),
    description: entry.fields.description,
    date: entry.fields.date,
    amazonUrl: entry.fields.amazonUrl,
    show: entry.fields.show ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.show.sys.id, 'shows'),
    } : undefined,
  }),

  accordion: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'accordion',
    title: entry.fields.title,
    accordionItems: entry.fields.accordionItems?.map(item => {
      if (!item.sys) return null;
      return {
        _type: 'reference',
        _ref: generateSanityId(item.sys.id, item.sys.contentType.sys.id),
      };
    }).filter(Boolean),
  }),

  amazonPlaylist: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'amazonPlaylist',
    title: entry.fields.title,
    description: entry.fields.description,
    podcasts: entry.fields.podcasts?.map(podcast => ({
      _type: 'reference',
      _ref: generateSanityId(podcast.sys.id, 'amazonPodcast'),
    })),
    pagination: entry.fields.pagination || false,
    countPerPage: entry.fields.countPerPage,
    sorting: entry.fields.sorting || false,
  }),

  banner: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'banner',
    title: entry.fields.title,
    subTitle: entry.fields.subTitle,
    bannerImage: convertCloudinaryImage(entry.fields.bannerImage),
    // heroImage: entry.fields.heroImage ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    video: entry.fields.video ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.video.sys.id, 'video'),
    } : undefined,
    button: entry.fields.button ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.button.sys.id, 'navigationLink'),
    } : undefined,
    buttonText: entry.fields.buttonText,
    bannerLink: entry.fields.bannerLink,
    ctaLayout: entry.fields.ctaLayout ? 
      transformers.transformComponent(entry.fields.ctaLayout) : undefined,
  }),

  config: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'config',
    title: entry.fields.title,
    path_prefix: entry.fields.path_prefix,
    siteProductionUrl: entry.fields.siteProductionUrl,
    description: entry.fields.description,
    header: entry.fields.header ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.header.sys.id, 'headerConfiguration'),
    } : undefined,
    footer: entry.fields.footer ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.footer.sys.id, 'footer'),
    } : undefined,
  }),

  filteredAmazonPlaylist: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'filteredAmazonPlaylist',
    title: entry.fields.title,
    showName: entry.fields.showName,
    titleContains: entry.fields.titleContains,
    descriptionContains: entry.fields.descriptionContains,
    startDate: entry.fields.startDate,
    endDate: entry.fields.endDate,
    show: entry.fields.show ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.show.sys.id, 'shows'),
    } : undefined,
    pagination: entry.fields.pagination || false,
    countPerPage: entry.fields.countPerPage,
    sorting: entry.fields.sorting || false,
  }),

  footer: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'footer',
    title: entry.fields.title,
    // logo: entry.fields.logo ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    social_links: entry.fields.social_links?.map(link => ({
      _type: 'reference',
      _ref: generateSanityId(link.sys.id, 'linkedIcon'),
    })),
    quickLInks: entry.fields.quickLInks?.map(link => ({
      _type: 'reference',
      _ref: generateSanityId(link.sys.id, 'navigationLink'),
    })),
    copyright: entry.fields.copyright,
    rightColumn: entry.fields.rightColumn ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.rightColumn.sys.id, 'message'),
    } : undefined,
  }),

  headerConfiguration: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'headerConfiguration',
    title: entry.fields.title,
    // logo: entry.fields.logo ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    alert: entry.fields.alert,
    mainMenu: entry.fields.mainMenu ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.mainMenu.sys.id, 'menu'),
    } : undefined,
    secondaryMenu: entry.fields.secondaryMenu ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.secondaryMenu.sys.id, 'menu'),
    } : undefined,
    callToAction: entry.fields.callToAction ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.callToAction.sys.id, 'message'),
    } : undefined,
  }),

  introductionAndContent: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'introductionAndContent',
    title: entry.fields.title,
  }),

  latestPodcasts: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'latestPodcasts',
    title: entry.fields.title,
    filterByShow: entry.fields.filterByShow ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.filterByShow.sys.id, 'shows'),
    } : undefined,
    numberToShow: entry.fields.numberToShow,
    showTitle: entry.fields.showTitle || false,
    pagination: entry.fields.pagination || false,
    countPerPage: entry.fields.countPerPage,
    showSorting: entry.fields.showSorting || false,
  }),

  layout: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'layout',
    title: entry.fields.title,
    columns: entry.fields.columns?.map(column => 
      transformers.transformComponent(column)
    ).filter(Boolean),
    showLayoutTitle: entry.fields.showLayoutTitle || false,
  }),

  layoutColum: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'layoutColumn',
    title: entry.fields.title,
    layoutComponent: entry.fields.layoutComponent?.map(component => {
      if (!component?.sys?.contentType?.sys?.id) return null;
      const componentType = component.sys.contentType.sys.id;
      // Some components are references, others are inline objects
      if (['schedule', 'shows', 'staff', 'stream', 'amazonPodcast'].includes(componentType)) {
        return {
          _type: 'reference',
          _ref: generateSanityId(component.sys.id, componentType),
        };
      } else {
        return transformers.transformComponent(component);
      }
    }).filter(Boolean),
    bootstrapWidth: entry.fields.bootstrapWidth,
    offset: entry.fields.offset,
  }),

  linkedIcon: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'linkedIcon',
    title: entry.fields.title,
    introduction: entry.fields.introduction,
    fontAwesomeClasses: entry.fields.fontAwesomeClasses,
    link: entry.fields.link,
  }),

  list: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'list',
    title: entry.fields.title,
    type: entry.fields.type,
    showStatus: entry.fields.showStatus,
    showSchedule: entry.fields.showSchedule ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.showSchedule.sys.id, 'schedule'),
    } : undefined,
    staffStatus: entry.fields.staffStatus,
    banners: entry.fields.banners?.map(banner => ({
      _type: 'reference',
      _ref: generateSanityId(banner.sys.id, 'banner'),
    })),
  }),

  menu: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'menu',
    title: entry.fields.title,
    // logo: entry.fields.logo ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    links: entry.fields.links?.map(link => ({
      _type: 'reference',
      _ref: generateSanityId(link.sys.id, 'navigationLink'),
    })),
    featuredButton: entry.fields.featuredButton ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.featuredButton.sys.id, 'message'),
    } : undefined,
  }),

  message: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'message',
    title: entry.fields.title,
    headline: entry.fields.headline,
    overview: entry.fields.overview ? convertRichTextToPortableText(entry.fields.overview) : undefined,
    linkText: entry.fields.linkText,
    linkUrl: entry.fields.linkUrl,
    // image: entry.fields.image ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    iconClass: entry.fields.iconClass,
  }),

  navigationLink: (entry, sanityId) => {
    // Debugging: log problematic entry
    try {
      return {
        _id: sanityId,
        _type: 'navigationLink',
        linkText: entry.fields.linkText,
        internalLink: entry.fields.internalLink?.sys?.id ? {
          _type: 'reference',
          _ref: generateSanityId(entry.fields.internalLink.sys.id, entry.fields.internalLink.sys.contentType.sys.id),
        } : undefined,
        sublinks: entry.fields.sublinks?.map(sublink => sublink?.sys?.id ? ({
          _type: 'reference',
          _ref: generateSanityId(sublink.sys.id, 'navigationLink'),
        }) : null).filter(Boolean),
      };
    } catch (error) {
      console.error('Error transforming navigationLink:', entry.sys.id, error);
      return {
        _id: sanityId,
        _type: 'navigationLink',
        linkText: entry.fields.linkText || 'Untitled',
      };
    }
  },

  playlist: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'playlist',
    title: entry.fields.title,
    showTitle: entry.fields.showTitle || false,
    description: entry.fields.description,
    url: entry.fields.url,
    height: entry.fields.height,
    hideVisualPlayer: entry.fields.hideVisualPlayer || false,
    archivedShow: entry.fields.archivedShow || false,
  }),

  playlistGrid: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'playlistGrid',
    title: entry.fields.title,
    showTitle: entry.fields.showTitle || false,
    playlistItems: entry.fields.playlistItems?.map(playlist => 
      transformers.transformComponent(playlist)
    ).filter(Boolean),
    rowHeight: entry.fields.rowHeight,
    columnBootstrapWidth: entry.fields.columnBootstrapWidth,
    showVisualPlayer: entry.fields.showVisualPlayer || false,
  }),

  queryStringPlaylist: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'queryStringPlaylist',
    title: entry.fields.title,
    height: entry.fields.height,
  }),

  schedule: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'schedule',
    title: entry.fields.title,
    showTodayOnly: entry.fields.showTodayOnly || false,
    monday: entry.fields.monday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    tuesday: entry.fields.tuesday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    wednesday: entry.fields.wednesday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    thursday: entry.fields.thursday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    friday: entry.fields.friday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    saturday: entry.fields.saturday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
    sunday: entry.fields.sunday?.map(show => ({
      _type: 'reference',
      _ref: generateSanityId(show.sys.id, 'shows'),
    })),
  }),

  searchBox: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'searchBox',
    title: entry.fields.title,
  }),

  showsOnToday: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'showsOnToday',
    title: entry.fields.title,
    schedule: entry.fields.schedule ? {
      _type: 'reference',
      _ref: generateSanityId(entry.fields.schedule.sys.id, 'schedule'),
    } : undefined,
  }),

  sponsorsList: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'sponsorsList',
    title: entry.fields.title,
    sponsors: entry.fields.sponsors?.map(sponsor => ({
      _type: 'reference',
      _ref: generateSanityId(sponsor.sys.id, 'sponsor'),
    })),
  }),

  stream: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'stream',
    title: entry.fields.title,
    url: entry.fields.url,
    playingNow: entry.fields.playingNow,
  }),

  video: (entry, sanityId) => ({
    _id: sanityId,
    _type: 'video',
    title: entry.fields.title,
    // image: entry.fields.image ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
    introduction: entry.fields.introduction,
    watchMessage: entry.fields.watchMessage,
    youtubeId: entry.fields.youtubeId,
  }),

  // Component transformers for inline components
  transformComponent: (comp) => {
    const type = comp.sys?.contentType?.sys?.id;
    if (!type || !comp.fields) return null;
    
    const baseComponent = {
      _key: uuidv4(),
      _type: type,
      _originalId: comp.sys?.id,
    };

    // Helper function to safely transform field values, avoiding circular references
    const safeTransformField = (value, key) => {
      if (!value) return value;
      
      // Skip circular reference fields
      if (key === 'show' && value.sys) return undefined;
      if (key === 'dj' && Array.isArray(value)) return undefined;
      if (key === 'sponsor' && value.sys) return undefined;
      
      // Handle rich text
      if (typeof value === 'object' && value.nodeType) {
        return convertRichTextToPortableText(value);
      }
      
      // Handle Cloudinary images
      if (Array.isArray(value) && value[0]?.public_id) {
        return convertCloudinaryImage(value);
      }
      
      // Handle simple arrays and objects (but avoid nested references)
      if (Array.isArray(value)) {
        return value.map(item => {
          if (item.sys) return undefined; // Skip referenced content
          if (item.fields) {
            // Transform field objects but keep it shallow
            return {
              _key: uuidv4(),
              title: item.fields.title,
              description: item.fields.description,
              content: item.fields.content ? convertRichTextToPortableText(item.fields.content) : undefined,
            };
          }
          return item;
        }).filter(Boolean);
      }
      
      // For primitive values, return as-is
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
      
      return undefined; // Skip complex objects that might cause circular references
    };

    // Transform based on component type with safe field handling
    switch (type) {
      case 'message':
        return {
          ...baseComponent,
          title: comp.fields.title,
          headline: comp.fields.headline,
          overview: safeTransformField(comp.fields.overview, 'overview'),
          linkText: comp.fields.linkText,
          linkUrl: comp.fields.linkUrl,
          iconClass: comp.fields.iconClass,
        };
      
      case 'schedule':
        return {
          ...baseComponent,
          title: comp.fields.title,
          showTodayOnly: comp.fields.showTodayOnly || false,
        };
      
      case 'stream':
        return {
          ...baseComponent,
          title: comp.fields.title,
          url: comp.fields.url,
          playingNow: comp.fields.playingNow,
        };
      
      case 'playlist':
        return {
          ...baseComponent,
          title: comp.fields.title,
          showTitle: comp.fields.showTitle || false,
          description: comp.fields.description,
          url: comp.fields.url,
          height: comp.fields.height,
          hideVisualPlayer: comp.fields.hideVisualPlayer || false,
          archivedShow: comp.fields.archivedShow || false,
        };
      
      case 'layout':
        return {
          ...baseComponent,
          title: comp.fields.title,
          showLayoutTitle: comp.fields.showLayoutTitle || false,
          columns: safeTransformField(comp.fields.columns, 'columns'),
        };
      
      case 'layoutColum':
      case 'layoutColumn':
        return {
          ...baseComponent,
          _type: 'layoutColumn',
          title: comp.fields.title,
          bootstrapWidth: comp.fields.bootstrapWidth,
          offset: comp.fields.offset,
          layoutComponent: safeTransformField(comp.fields.layoutComponent, 'layoutComponent'),
        };
      
      case 'accordion':
        return {
          ...baseComponent,
          title: comp.fields.title,
          accordionItems: safeTransformField(comp.fields.accordionItems, 'accordionItems'),
        };
      
      case 'queryStringPlaylist':
        return {
          ...baseComponent,
          title: comp.fields.title,
          height: comp.fields.height,
        };
      
      case 'amazonPlaylist':
        return {
          ...baseComponent,
          title: comp.fields.title,
          description: comp.fields.description,
          pagination: comp.fields.pagination || false,
          countPerPage: comp.fields.countPerPage,
          sorting: comp.fields.sorting || false,
        };
      
      case 'latestPodcasts':
        return {
          ...baseComponent,
          title: comp.fields.title,
          numberToShow: comp.fields.numberToShow,
          showTitle: comp.fields.showTitle || false,
          pagination: comp.fields.pagination || false,
          countPerPage: comp.fields.countPerPage,
          showSorting: comp.fields.showSorting || false,
        };
      
      case 'filteredAmazonPlaylist':
        return {
          ...baseComponent,
          title: comp.fields.title,
          showName: comp.fields.showName,
          titleContains: comp.fields.titleContains,
          descriptionContains: comp.fields.descriptionContains,
          startDate: comp.fields.startDate,
          endDate: comp.fields.endDate,
          pagination: comp.fields.pagination || false,
          countPerPage: comp.fields.countPerPage,
          sorting: comp.fields.sorting || false,
        };
      
      case 'list':
        return {
          ...baseComponent,
          title: comp.fields.title,
          type: comp.fields.type,
          showStatus: comp.fields.showStatus,
          staffStatus: comp.fields.staffStatus,
        };
      
      case 'video':
        return {
          ...baseComponent,
          title: comp.fields.title,
          introduction: comp.fields.introduction,
          watchMessage: comp.fields.watchMessage,
          youtubeId: comp.fields.youtubeId,
        };
      
      case 'playlistGrid':
        return {
          ...baseComponent,
          title: comp.fields.title,
          showTitle: comp.fields.showTitle || false,
          rowHeight: comp.fields.rowHeight,
          columnBootstrapWidth: comp.fields.columnBootstrapWidth,
          showVisualPlayer: comp.fields.showVisualPlayer || false,
          playlistItems: safeTransformField(comp.fields.playlistItems, 'playlistItems'),
        };
      
      case 'showsOnToday':
        return {
          ...baseComponent,
          title: comp.fields.title,
        };
      
      case 'sponsorsList':
        return {
          ...baseComponent,
          title: comp.fields.title,
        };
      
      case 'searchBox':
        return {
          ...baseComponent,
          title: comp.fields.title,
        };
      
      case 'introductionAndContent':
        return {
          ...baseComponent,
          title: comp.fields.title,
        };
      
      default:
        // For unknown component types, safely preserve available fields
        const transformedFields = {};
        Object.keys(comp.fields).forEach(key => {
          const transformedValue = safeTransformField(comp.fields[key], key);
          if (transformedValue !== undefined) {
            transformedFields[key] = transformedValue;
          }
        });
        
        return {
          ...baseComponent,
          ...transformedFields,
        };
    }
  },

  landingPage: (entry, sanityId) => {
    // Handle components with full data migration
    let components = undefined;
    if (entry.fields.components && Array.isArray(entry.fields.components)) {
      components = entry.fields.components.map(comp => {
        return transformers.transformComponent(comp);
      }).filter(Boolean);
    }
    
    return {
      _id: sanityId,
      _type: 'landingPage',
      title: entry.fields.title,
      slug: entry.fields.slug ? { current: entry.fields.slug } : undefined,
      path: entry.fields.path,
      cloudinaryImage: convertCloudinaryImage(entry.fields.cloudinaryImage),
      // Omit image fields for now
      // image: entry.fields.image ? { _type: 'image', asset: { _ref: 'image-placeholder' } } : undefined,
      showIntroduction: entry.fields.showIntroduction || false,
      showContent: entry.fields.showContent || false,
      showBanner: entry.fields.showBanner || false,
      teReoTitle: entry.fields.teReoTitle,
      introduction: entry.fields.introduction,
      content: entry.fields.content ? convertRichTextToPortableText(entry.fields.content) : undefined,
      components: components,
    };
  },

  // Add more transformers as needed...
};

async function runMigration() {
  console.log('Starting Contentful to Sanity migration...\n');
  
  // Check environment variables
  const requiredEnvVars = [
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ACCESS_TOKEN',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
  ];
  
  // Check for either SANITY_API_TOKEN or SANITY_API_WRITE_TOKEN
  if (!process.env.SANITY_API_TOKEN && !process.env.SANITY_API_WRITE_TOKEN) {
    requiredEnvVars.push('SANITY_API_TOKEN or SANITY_API_WRITE_TOKEN');
  }
  
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('\nPlease add SANITY_API_TOKEN to your .env file');
    console.error('You can create a token at: https://www.sanity.io/manage');
    process.exit(1);
  }

  let totalMigrated = 0;

  // Migrate in order of dependencies (core documents first, then dependent ones)
  // Only include content types that actually exist in Contentful
  const migrationOrder = [
    // Core independent documents first
    'staff',
    'sponsor',
    'showSlot',
    'linkedIcon',
    'video',
    'stream',
    
    // Documents that depend on the above
    'message',
    'navigationLink',
    'playlist',
    'amazonPodcast',
    'schedule',
    'shows',
    
    // Complex layout and container objects  
    'accordion',
    'amazonPlaylist',
    'filteredAmazonPlaylist',
    'latestPodcasts',
    'queryStringPlaylist',
    'list',
    'layoutColum',  // Note: this is the actual Contentful name (not layoutColumn)
    'layout',
    
    // Site structure documents
    'menu',
    'banner',
    'footer',
    
    // Complex pages last (depend on many other types)
    'landingPage',
  ];

  for (const contentType of migrationOrder) {
    if (transformers[contentType]) {
      totalMigrated += await migrateContentType(contentType, transformers[contentType]);
    }
  }

  console.log(`\n✓ Migration complete! Migrated ${totalMigrated} total documents.`);
  console.log('\nNext steps:');
  console.log('1. Upload any asset files (images) to Sanity manually or via the Sanity Studio');
  console.log('2. Update image references in the migrated documents');
  console.log('3. Test the application with the migrated data');
}

// Run the migration
runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
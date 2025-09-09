// Import all schema types
import config from './documents/config'
import landingPage from './documents/landingPage'
import shows from './documents/shows'
import staff from './documents/staff'
import sponsor from './documents/sponsor'
import amazonPodcast from './documents/amazonPodcast'
import banner from './documents/banner'
import footer from './documents/footer'
import headerConfiguration from './documents/headerConfiguration'
import menu from './documents/menu'
import navigationLink from './documents/navigationLink'
import linkedIcon from './documents/linkedIcon'
import schedule from './documents/schedule'
import showSlot from './documents/showSlot'
import stream from './documents/stream'
import video from './documents/video'
import component from './documents/component'
import pageDesign from './documents/pageDesign'
import theme from './documents/theme'

// Component documents (individually imported)
import accordion from './documents/accordion'
import carousel from './documents/carousel'
import layout from './documents/layout'
import layoutColumn from './documents/layoutColumn'
import list from './documents/list'
import message from './documents/message'
import latestPodcasts from './documents/latestPodcasts'
import playlist from './documents/playlist'
import remainingComponents from './documents/remainingComponents'
import djById from './documents/djById'

// Object types (inline components)
import showList from './objects/showList'
import showsOnToday from './objects/showsOnToday'

const schemaTypes = [
  // Documents
  config,
  landingPage,
  shows,
  staff,
  sponsor,
  amazonPodcast,
  banner,
  footer,
  headerConfiguration,
  menu,
  navigationLink,
  linkedIcon,
  schedule,
  showSlot,
  stream,
  video,
  component,
  pageDesign,
  theme,
  
  // Component Documents
  accordion,
  carousel,
  layout,
  layoutColumn,
  list,
  message,
  latestPodcasts,
  playlist,
  djById,
  ...remainingComponents,

  // Objects (inline types)
  showList,
  showsOnToday,
]

export default schemaTypes
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import ContentService from '@/src/utils/content-service';
import { PreviewBanner } from '@/src/components/PreviewBanner';
import styles from '../styles/Theme.module.css';

const themes = {
  'coral-reef': {
    primary: '#ff6b6b',
    secondary: '#ffa726',
    accent: '#a7f3d0',
    text: '#f0fdfa',
    background: 'linear-gradient(rgba(13, 79, 92, 0.7), rgba(45, 138, 143, 0.6)), url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'tropical-sunset': {
    primary: '#ffc107',
    secondary: '#ff7043',
    accent: '#ffecb3',
    text: '#fff5f0',
    background: 'linear-gradient(rgba(45, 27, 105, 0.8), rgba(123, 45, 58, 0.7)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80")'
  },
  'palm-grove': {
    primary: '#84cc16',
    secondary: '#65a30d',
    accent: '#d9f99d',
    text: '#fef3c7',
    background: 'linear-gradient(rgba(45, 80, 22, 0.75), rgba(77, 124, 15, 0.65)), url("https://images.unsplash.com/photo-1520637836862-4d197d17c38a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
  },
  'ocean-breeze': {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#bae6fd',
    text: '#f8fafc',
    background: 'linear-gradient(rgba(15, 118, 110, 0.7), rgba(14, 165, 233, 0.6)), url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'hibiscus-garden': {
    primary: '#ec4899',
    secondary: '#d946ef',
    accent: '#f9a8d4',
    text: '#fdf2f8',
    background: 'linear-gradient(rgba(124, 45, 18, 0.8), rgba(190, 24, 93, 0.7)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'coconut-beach': {
    primary: '#d2691e',
    secondary: '#6ee7b7',
    accent: '#fef3c7',
    text: '#fffbeb',
    background: 'linear-gradient(rgba(120, 53, 15, 0.75), rgba(161, 98, 7, 0.65)), url("https://images.unsplash.com/photo-1473116763249-2faaef81ccda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2096&q=80")'
  },
  'rainforest-canopy': {
    primary: '#22c55e',
    secondary: '#f59e0b',
    accent: '#bbf7d0',
    text: '#f7fee7',
    background: 'linear-gradient(rgba(26, 46, 5, 0.8), rgba(77, 124, 15, 0.7)), url("https://images.unsplash.com/photo-1544896478-d5c7be6e5e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'island-spice': {
    primary: '#b91c1c',
    secondary: '#fb923c',
    accent: '#fecaca',
    text: '#fef2f2',
    background: 'linear-gradient(rgba(127, 29, 29, 0.8), rgba(220, 38, 38, 0.7)), url("https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'lagoon-dream': {
    primary: '#06b6d4',
    secondary: '#a78bfa',
    accent: '#bae6fd',
    text: '#f0f9ff',
    background: 'linear-gradient(rgba(22, 78, 99, 0.75), rgba(14, 165, 233, 0.65)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'tropical-fruit': {
    primary: '#f97316',
    secondary: '#65a30d',
    accent: '#fed7aa',
    text: '#fff7ed',
    background: 'linear-gradient(rgba(154, 52, 18, 0.8), rgba(234, 88, 12, 0.7)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  }
};

interface Props {
  themePageData: any;
  menuData: any;
  draftMode?: boolean;
}

export default function ThemePage({ themePageData, menuData, draftMode }: Props) {
  const [activeTheme, setActiveTheme] = useState('coral-reef');

  // Use Sanity data when available
  const pageTitle = themePageData?.title || 'Waiheke Radio - Te Reo Irirangi o Waiheke';
  const backgroundImage = themePageData?.cloudinaryImage?.secure_url;

  // Log the props for debugging
  console.log('Theme page props:', { themePageData, menuData });

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes];
    if (!theme) return;

    // Apply CSS custom properties to document root
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
    document.documentElement.style.setProperty('--theme-text', theme.text);
    document.documentElement.style.setProperty('--theme-background', theme.background);
    
    // Apply body styles directly
    document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
    document.body.style.lineHeight = '1.4';
    document.body.style.fontSize = '14px';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    document.body.style.background = `${theme.background} center/cover fixed`;
    document.body.style.color = theme.text;
  };

  return (
    <>
      <PreviewBanner draftMode={draftMode} />
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {backgroundImage && (
          <meta property="og:image" content={backgroundImage} />
        )}
      </Head>

      <div className={styles.themeSelector}>
        <div className={styles.themeButtons}>
          {Object.entries(themes).map(([themeKey, themeData]) => {
            const camelCaseKey = themeKey.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return (
              <button
                key={themeKey}
                className={`${styles.themeBtn} ${styles[camelCaseKey]} ${activeTheme === themeKey ? styles.active : ''}`}
                onClick={() => setActiveTheme(themeKey)}
              >
                {themeKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.navContainer}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <img src="https://images.ctfassets.net/muwn01agnrp5/1ObAJOuazrKi5cDvhmF9Nb/1dc23f260d5d6977fb2075f8dc2c7f5e/Waiheke-Radio-logo-transparent.png" alt="Waiheke Radio" />
              </div>
              <div className={styles.siteInfo}>
                <h1>Waiheke Radio</h1>
                <div className={styles.frequencies}>88.3 & 107.4FM</div>
                <div className={styles.maori}>Te Reo Irirangi o Waiheke</div>
              </div>
            </div>
            <nav>
              <ul className={styles.navMenu}>
                <li><a href="#">Live</a></li>
                <li><a href="#">Podcasts</a></li>
                <li><a href="#">Shows</a></li>
                <li><a href="#">Election</a></li>
                <li><a href="#">Schedule</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <div className={styles.breakingBanner}>
          <div className={styles.breakingContent}>
            <h2>Waiheke Local Board Election 2025</h2>
            <p>Live coverage, candidate interviews & debate Monday 8 September 7-8.30pm at Artworks Theatre</p>
          </div>
        </div>

        <div className={styles.topContent}>
          <div className={styles.column}>
            <div className={styles.streamItem}>
              <h3 className={styles.streamTitle}>Live Radio Stream</h3>
              <audio controls src="https://s47.myradiostream.com:9962/listen"></audio>
              <div className={styles.nowPlaying}>
                <h4>Now Playing</h4>
                <div><strong>Coolio feat. L.V.</strong></div>
                <div>Gangsta&apos;s Paradise</div>
              </div>
            </div>
            <div className={styles.streamItem}>
              <h3 className={styles.streamTitle}>100% Pure Waiheke</h3>
              <audio controls src="https://s27.myradiostream.com:17343/stream"></audio>
              <div className={styles.nowPlaying}>
                <h4>Playing</h4>
                <div><strong>Nick Fraser</strong></div>
                <div>Live Waiheke Library May 2018</div>
              </div>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Latest News</h3>
              <ul className={styles.quickNews}>
                <li><span className={styles.newsTime}>15m ago</span><br />Election debate setup begins at Artworks Theatre</li>
                <li><span className={styles.newsTime}>1h ago</span><br />Ferry delays due to weather conditions</li>
                <li><span className={styles.newsTime}>2h ago</span><br />Community board meeting tonight 7pm</li>
                <li><span className={styles.newsTime}>3h ago</span><br />Local farmers market opens early Saturday</li>
                <li><span className={styles.newsTime}>4h ago</span><br />Road works on Ocean View Road continues</li>
                <li><span className={styles.newsTime}>5h ago</span><br />New art exhibition opens at Artworks</li>
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.sectionTitle}>Today - Tuesday Schedule</h3>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>NOW</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>Music Mix</div>
                <div className={styles.showHost}>Automated playlist</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>1-2PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>100% Pure Waiheke Daily Dose</div>
                <div className={styles.showHost}>Chris Walker - All Waiheke music</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>5-7PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>Sandi&apos;s Stereo Tours</div>
                <div className={styles.showHost}>Sandi Bezzant</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>7-8PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>Island Life</div>
                <div className={styles.showHost}>Weekly magazine show</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>8-9PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>The Navigator</div>
                <div className={styles.showHost}>Martini Gotje</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>9-10PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>Metrognome</div>
                <div className={styles.showHost}>Electronic music journey</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
            <div className={styles.scheduleItem}>
              <div className={styles.scheduleTime}>10-11PM</div>
              <div className={styles.showInfo}>
                <div className={styles.showName}>Can You Dig It?!</div>
                <div className={styles.showHost}>Vinyl deep cuts & rarities</div>
              </div>
              <button className={styles.miniPlayButton}></button>
            </div>
          </div>

          <div className={styles.column}>
            <div>
              <h3 className={styles.sectionTitle}>Featured Content</h3>
              <div className={styles.featuredInterview}>
                <div className={styles.featuredImage}></div>
                <div className={styles.featuredTitle}>Cath Handley: Outgoing Local Board Chair</div>
                <div className={styles.featuredDesc}>Reflecting on her 9 years serving the Waiheke community as Local Board Chair. Not seeking re-election in 2025.</div>
                <button className={styles.playButton}>Listen Now - 18min</button>
              </div>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Election Candidates</h3>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1754813585/Josier_Rainer_muhlkz.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Josie Heap Rainer</div>
                  <div className={styles.candidateRole}>Local Board candidate</div>
                </div>
              </div>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1756440576/Local%20People/local%20board%20election%202025/Genevieve-Sage-crop_edtahs.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Genevieve Sage</div>
                  <div className={styles.candidateRole}>Waitematā/Gulf Islands Council</div>
                </div>
              </div>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1755931956/Local%20People/local%20board%20election%202025/grant-high-res_dfl0do.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Grant Crawford</div>
                  <div className={styles.candidateRole}>Local Board candidate</div>
                </div>
              </div>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1754899534/Local%20People/local%20board%20election%202025/wayne-mcintosh_yobftt.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Wayne McIntosh</div>
                  <div className={styles.candidateRole}>Local Board candidate</div>
                </div>
              </div>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1756018827/Local%20People/local%20board%20election%202025/Kerrin2_pe0jws.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Kerrin Leoni</div>
                  <div className={styles.candidateRole}>Mayoral candidate</div>
                </div>
              </div>
              <div className={styles.candidateItem}>
                <div className={styles.candidateAvatar} style={{backgroundImage: 'url("https://res.cloudinary.com/waiheke-radio/image/upload/f_auto/q_auto/v1754813197/Xan_plyr4s.jpg")'}}></div>
                <button className={styles.miniPlayButton}></button>
                <div className={styles.showInfo}>
                  <div className={styles.candidateName}>Xan Hamilton</div>
                  <div className={styles.candidateRole}>Local Board candidate</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Recent Podcasts</h3>
              <ul className={styles.quickNews}>
                <li><span className={styles.newsTime}>Today</span><br />Sunday Sessions - Alternative Rock Mix</li>
                <li><span className={styles.newsTime}>Yesterday</span><br />Counting the Beat - Local Artists Special</li>
                <li><span className={styles.newsTime}>Monday</span><br />Coconut Wireless - Island News Roundup</li>
                <li><span className={styles.newsTime}>Sunday</span><br />High Impact Insensitivity Radio Show</li>
                <li><span className={styles.newsTime}>Saturday</span><br />Just Kidding - Comedy Hour with Locals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const { draftMode = false } = ctx;
  
  try {
    const [themePageData, menuData] = await Promise.all([
      ContentService.instance.getLandingPageBySlug('theme', draftMode),
      ContentService.instance.getMenuData(draftMode)
    ]);
    
    // Log the theme page data to see what we get from Sanity
    console.log('Theme page data from Sanity:', JSON.stringify(themePageData, null, 2));
    
    return {
      props: {
        themePageData: themePageData || null,
        menuData: menuData || null,
        draftMode,
      },
    };
  } catch (error) {
    console.error('Error fetching theme page data:', error);
    return {
      props: {
        themePageData: null,
        menuData: null,
        draftMode,
      },
    };
  }
};
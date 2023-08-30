import Head from "next/head";
function Seo(props: any) {
  return (
    <div>
      <Head>
        <title key="title">{props.title} | Waiheke Island Radio</title>
        <meta
          key="og:description"
          property="og:description"
          content={props.description}
        />
<meta name="google-site-verification" content="QjAHTlD8fDaJp9bzKekX0-CLSsV0sU0_PXKvB3ZOcCc" />
        <meta name="description" content={props.description} />
        <meta
          name="facebook-domain-verification"
          content="al5atttw71uz7xzkfjt7abch2xku7f"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:locale" property="og:locale" content="en_IE" />

        <link
          rel="icon"
          type="image/png"
          href={
            "https://waihekeradio.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2018/01/31013454/cropped-waiheke_radio_logo-small-32x32.png"
          }
        ></link>
      </Head>
    </div>
  );
}

export default Seo;

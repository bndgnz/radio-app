export default async function handler(
  req: {
    query: {
      slug: string;
    };
  },
  res
): Promise<any> {
  if (!req.query.slug) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  const location = 'https://www.waihekeradio.org.nz/' + req.query.slug;
  res.setPreviewData({});
  res.writeHead(307, { Location: location });
  res.end();
}

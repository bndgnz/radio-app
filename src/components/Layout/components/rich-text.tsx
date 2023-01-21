import { useQuery, gql } from "@apollo/client";
 
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const GET_RICH_TEXT = gql`

  query GetRichText($entryId: String!) {
    entry(id: $entryId) {
      richText
      ... on Entry {
        assets {
          sys {
            id
          }
          fields {
            title
            file {
              url
              contentType
              fileName
            }
          }
        }
      }
    }
  }
`;

const ContentfulRichText = ({ entryId }) => {
    const { loading, error, data } = useQuery(GET_RICH_TEXT, {
        variables: { entryId }
    });

    const options = {
        renderNode: {
            'embedded-asset-block': (node) => {
                const asset = data.entry.assets.find(
                    asset => asset.sys.id === node.data.target.sys.id
                );

                const mimeType = asset.fields.file.contentType;
                const mimeGroup = mimeType.split('/')[0];

                switch (mimeGroup) {
                    case 'image':
                        return <img src={asset.fields.file.url} alt={asset.fields.title} />;
                    case 'video':
                        return <video controls src={asset.fields.file.url} />;
                    default:
                        return <a href={asset.fields.file.url}>{asset.fields.file.fileName}</a>;
                }
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {data.entry.richText && documentToReactComponents(data.entry.richText, options)}
        </div>
    );
};

export default ContentfulRichText;

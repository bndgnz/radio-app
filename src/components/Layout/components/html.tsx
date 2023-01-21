import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import React from "react";

class ContentfulRichText {
  

    render() {
        const options = {
            renderNode: {
                'embedded-asset-block': (node) => {
                    const { file } = node.data.target.fields;
                    const mimeType = file.contentType;
                    const mimeGroup = mimeType.split("/")[0];

                    switch (mimeGroup) {
                        case "image":
                            return <img src={file.url} alt={node.data.target.fields.title['en-US']} />;
                        case "video":
                            return <video controls src={file.url} />;
                        default:
                            return <a href={file.url}>{file.fileName}</a>;
                    }
                }
            }
        };

        return (
            <div>
              
            </div>
        );
    }
}

export default ContentfulRichText;

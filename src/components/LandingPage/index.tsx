import React from "react";
import { ILandingPageFields  } from "../../@types/contentful";
 

const Article = ({ slug, title, introduction }: ILandingPageFields ) => (
  <a href={`/${slug}`}  >
    <h2>{title} &rarr;</h2>
    <p>{introduction}</p>
  </a>
);

export default Article;
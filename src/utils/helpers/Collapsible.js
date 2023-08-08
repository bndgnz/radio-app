import React from "react";
 

const Collapsible = ({ summary, children }) => {
  return (
    <details>
      <summary>{summary}</summary>
      {children}
    </details>
  );
};

export default Collapsible;
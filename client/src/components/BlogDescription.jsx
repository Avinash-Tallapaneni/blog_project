import React from "react";

const BlogDescription = ({htmlString}) => {
  // const htmlString = `
  //   <p>This is a <strong>sample blog post</strong> with some dummy content.</p>

  //   <p>This is a sample blog post with some dummy content. <em>This is emphasized text.</em></p>

  //   <ul>
  //     <li>This is a sample blog post with some dummy content.</li>
  //     <li>This is another point in the list.</li>
  //     <li>And here's a third point.</li>
  //   </ul>

  //   <ol>
  //     <li>This is an ordered list item.</li>
  //     <li>Another item in the ordered list.</li>
  //     <li>And one more for good measure.</li>
  //   </ol>

  //   <p>This is a sample blog post with some <strong>bold text</strong>. This is a sample blog post with some dummy content.</p>

  //   <p>This is a sample blog post with some dummy content. This is a <a href="#">sample link</a>.</p>

  //   <p>This is a sample blog post with some dummy content. <br /> This is a new line using the line break tag.</p>
  // `;

  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default BlogDescription;

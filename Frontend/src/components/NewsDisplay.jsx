import React from 'react';

function NewsDisplay({ news }) {
  return (
    <div>
      <h2>📰 Related News</h2>
      <ul>
        {news.map((article, index) => (
          <li key={index}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsDisplay;

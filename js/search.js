'use strict';
const $searchResults = document.querySelector('.search-results');

window.onload = () => {
  const q = getParameterByName('q');
  document.querySelector(`[name=q]`).value = q;

  $searchResults.innerHTML = 'Loading...';
  fetch(buildApiUrl({ q }))
    .then(r => r.json())
    .then(result => {
      $searchResults.innerHTML = '';
      result.count != 0 
        ? result.shabads.forEach(({ shabad }) => addSearchResult(shabad, q))
        : noResults();
    })
    .catch(error => showError(error));
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function addSearchResult(shabad, q) {
  const { Gurmukhi, English, ID, SourceID, PageNo, RaagEnglish, WriterEnglish } = shabad;
  const getURL = ID =>  `${window.location.origin + window.location.pathname.replace('search.html', 'shabad.html')}?id=${ID}`;
  $searchResults.appendChild(
    h('li', { class: 'search-result' }, [
      h('a', { href: `shabad.html?id=${ID}&q=${q}`, class: 'gurbani-font' }, Gurmukhi),
      h('a', { href: `shabad.html?id=${ID}`, class: 'url', }, getURL(ID)),
      h('p', { }, English),
      h('div', { class: 'meta flex wrap'} , [
        h('a', { href: '#', }, `${SOURCES[SourceID]} - ${PageNo}`),
        h('a', { href: '#', }, `${WriterEnglish}`),
        h('a', { href: '#', }, `${RaagEnglish}`),
      ]),
    ])
  );
}

function noResults() {
  $searchResults.appendChild(h('h2', { }, 'No results found'));
}

function showError(error) {
  $searchResults.appendChild(h('h2', { }, [
    h('h3', { class: 'text-center' }, 'Facing some issues'),
    h('code', {}, JSON.stringify(error, null, 2))
  ]));
}

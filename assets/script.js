var sjs = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: '<a class="list-group-item list-group-item-action" href="{{ site.url }}{url}"><div class="d-flex justify-content-between"><h5 class="mb-1">{title}</h5></div><p class="mb-1">{subtitle}</p></a>'
})
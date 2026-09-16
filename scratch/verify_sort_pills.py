import urllib.request
import re

def test_sort_pills():
    url = 'http://localhost:8080/index.html'
    res = urllib.request.urlopen(url)
    html = res.read().decode('utf-8')

    assert res.status == 200
    assert 'class="sort-pills-list"' in html, "sort-pills-list not in index.html"
    assert 'data-sort="popular"' in html, "data-sort=popular not in index.html"
    assert 'data-sort="latest"' in html, "data-sort=latest not in index.html"
    assert 'data-sort="rating"' in html, "data-sort=rating not in index.html"
    assert 'data-sort="az"' in html, "data-sort=az not in index.html"
    assert '<select id="sortSelector"' not in html, "Old select box still present in index.html"

    # Check CSS
    css_res = urllib.request.urlopen('http://localhost:8080/css/components.css')
    css = css_res.read().decode('utf-8')
    assert '.sort-pill' in css, ".sort-pill not in components.css"
    assert '.sort-pills-list' in css, ".sort-pills-list not in components.css"
    assert 'scrollbar-width: none' in css, "scrollbar-width: none not in components.css"

    # Check JS
    js_res = urllib.request.urlopen('http://localhost:8080/js/app.js')
    js = js_res.read().decode('utf-8')
    assert 'this.sortPills' in js, "this.sortPills not in js/app.js"
    assert 'pill.dataset.sort' in js, "pill.dataset.sort not in js/app.js"

    print("ALL SORT PILLS AND SCROLLBAR HIDING TESTS PASSED!")

if __name__ == '__main__':
    test_sort_pills()

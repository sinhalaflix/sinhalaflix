import re

def verify():
    # 1. Read files
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()
    with open('admin.html', 'r', encoding='utf-8') as f:
        admin_html = f.read()
    with open('js/data.js', 'r', encoding='utf-8') as f:
        data_js = f.read()
    with open('js/app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()
    with open('js/admin.js', 'r', encoding='utf-8') as f:
        admin_js = f.read()
    with open('css/components.css', 'r', encoding='utf-8') as f:
        components_css = f.read()

    errors = []

    # Check 1: 'TV Networks & Studios' must NOT exist anywhere in index.html, admin.html
    if 'TV Networks & Studios' in index_html:
        errors.append("Found 'TV Networks & Studios' in index.html")
    if 'TV Networks & Studios' in admin_html:
        errors.append("Found 'TV Networks & Studios' in admin.html")

    # Check 2: 'Studio Dub' must NOT exist in data.js or admin.html
    if 'Studio Dub' in data_js:
        errors.append("Found 'Studio Dub' in js/data.js")
    if 'Studio Dub' in admin_html:
        errors.append("Found 'Studio Dub' in admin.html")

    # Check 3: 'cartoon_series' must NOT exist in data.js, admin.html, js/app.js, js/admin.js, css/components.css
    for name, content in [('data.js', data_js), ('admin.html', admin_html), ('app.js', app_js), ('admin.js', admin_js), ('components.css', components_css)]:
        if 'cartoon_series' in content:
            errors.append(f"Found 'cartoon_series' in {name}")

    # Check 4: 'Cartoon Series' (case insensitive) must NOT exist in index.html, admin.html, data.js
    for name, content in [('index.html', index_html), ('admin.html', admin_html), ('data.js', data_js)]:
        if re.search(r'cartoon\s+series', content, re.IGNORECASE):
            errors.append(f"Found 'cartoon series' in {name}")

    # Check 5: Hiru TV and TV Derana presence
    if 'data-channel="Hiru TV"' not in index_html:
        errors.append("Hiru TV channel pill not found in index.html")
    if 'data-channel="TV Derana"' not in index_html:
        errors.append("TV Derana channel pill not found in index.html")
    if 'value="Hiru TV"' not in admin_html:
        errors.append("Hiru TV option not found in admin.html")
    if 'value="TV Derana"' not in admin_html:
        errors.append("TV Derana option not found in admin.html")

    # Check 6: Categories prefix verification:
    # "Sinhala Cartoons" (WITHOUT dubbed)
    # "Sinhala Dubbed Movies"
    # "Sinhala Dubbed Teledramas"
    # "Sinhala Dubbed K-Dramas"
    required_in_index = [
        "Sinhala Cartoons (කාටූන්)",
        "Sinhala Dubbed Movies (චිත්‍රපට)",
        "Sinhala Dubbed Teledramas (ටෙලි නාට්‍ය)",
        "Sinhala Dubbed K-Dramas (කොරියන් නාට්‍ය)"
    ]
    for req in required_in_index:
        if req not in index_html:
            errors.append(f"Expected category label '{req}' not found in index.html")

    required_in_admin = [
        "🦁 Sinhala Cartoons (කාටූන්)",
        "🎬 Sinhala Dubbed Movies (චිත්‍රපට)",
        "📺 Sinhala Dubbed Teledramas (ටෙලි නාට්‍ය)",
        "🌸 Sinhala Dubbed K-Dramas (කොරියන් නාට්‍ය)"
    ]
    for req in required_in_admin:
        if req not in admin_html:
            errors.append(f"Expected category label '{req}' not found in admin.html")

    # Check 7: No "Dubbed" in Sinhala Cartoons header
    if "Sinhala Dubbed Cartoons" in index_html:
        errors.append("Found 'Sinhala Dubbed Cartoons' in index.html - 'cartoons' should NOT have 'Dubbed'")
    if "Sinhala Dubbed Cartoons" in admin_html:
        errors.append("Found 'Sinhala Dubbed Cartoons' in admin.html - 'cartoons' should NOT have 'Dubbed'")

    if errors:
        print("VERIFICATION FAILED WITH ERRORS:")
        for err in errors:
            print(" -", err)
        return False
    else:
        print("ALL AUDIT CHECKS PASSED PERFECTLY!")
        return True

if __name__ == '__main__':
    verify()

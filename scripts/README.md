# GitHub Pages Path Fix Script

This script automatically fixes all paths in HTML files to work correctly on GitHub Pages deployment at `https://shinhanfinancer.github.io/fecredit/`.

## Features

- ✅ Fixes CSS bundle paths (sb/, uSkinned/)
- ✅ Fixes JavaScript SDK paths (adds https:// protocol)
- ✅ Fixes asset paths (assets/icons/, etc.)
- ✅ Fixes form actions
- ✅ Fixes internal navigation links
- ✅ Preserves external URLs (https://, http://)
- ✅ Dry-run mode for previewing changes
- ✅ Validation checks for common mistakes

## Usage

### Preview changes (dry-run mode)
```bash
node scripts/fix-paths.js --dry-run
```

### Apply changes
```bash
node scripts/fix-paths.js
```

### Process a specific file
```bash
node scripts/fix-paths.js --file=path/to/file.html
```

### Dry-run with specific file
```bash
node scripts/fix-paths.js --dry-run --file=www.fecredit.com.vn/index.html
```

## What it fixes

### 1. CSS Bundle Paths
```html
<!-- Before -->
<link href="sb/sitebuilder-ltr-css-bundle.css..." />

<!-- After -->
<link href="/fecredit/www.fecredit.com.vn/sb/sitebuilder-ltr-css-bundle.css..." />
```

### 2. JavaScript SDK Paths
```html
<!-- Before -->
<script src="../api.pushio.com/webpush/sdk/wpIndex_min.js" />

<!-- After -->
<script src="https://api.pushio.com/webpush/sdk/wpIndex_min.js" />
```

### 3. Asset Paths
```html
<!-- Before -->
<img src="assets/icons/chevron-down.svg" alt="icon">

<!-- After -->
<img src="/fecredit/www.fecredit.com.vn/assets/icons/chevron-down.svg" alt="icon">
```

### 4. Form Actions
```html
<!-- Before -->
<form action="/search/" method="get">

<!-- After -->
<form action="/fecredit/search/" method="get">
```

### 5. Internal Navigation Links
```html
<!-- Before -->
<a href="/ve-chung-toi/">Về chúng tôi</a>

<!-- After -->
<a href="/fecredit/ve-chung-toi/">Về chúng tôi</a>
```

## Configuration

You can modify the configuration constants at the top of the script:

```javascript
const BASE_PATH = '/fecredit';                    // Base path for internal links
const WWW_PATH = '/fecredit/www.fecredit.com.vn'; // Path for assets/CSS
const DEFAULT_FILE = 'www.fecredit.com.vn/index.html'; // Default file to process
```

## Output

The script provides detailed output including:

1. **Changes Summary**: Lists all types of changes made and their counts
2. **Preview**: Shows first 5 changes in dry-run mode
3. **Validation**: Checks for any remaining unfixed paths

Example output:
```
=== GitHub Pages Path Fixer ===

Mode: LIVE (will modify files)
Target file: www.fecredit.com.vn/index.html

--- Changes Summary ---

✓ CSS bundle paths (sb/): 9 replacement(s)
✓ CSS bundle paths (uSkinned/): 1 replacement(s)
✓ Assets in src attributes: 12 replacement(s)
✓ Form action (search): 2 replacement(s)
✓ Internal link: /ve-chung-toi/: 2 replacement(s)
...

Total replacements: 87

✅ Successfully updated www.fecredit.com.vn/index.html

--- Validation ---

✓ All paths appear to be correctly formatted

=== Done ===
```

## Adding New Internal Paths

To add new internal paths that need fixing, modify the `internalPaths` array in the script:

```javascript
const internalPaths = [
    '/ve-chung-toi/',
    '/lien-he/',
    // Add your new path here
    '/your-new-path/',
];
```

## Notes

- The script preserves external URLs (those starting with https:// or http://)
- It won't double-fix paths that are already correct
- Always run with `--dry-run` first to preview changes
- The script creates detailed logs of all changes made

## Troubleshooting

If paths are not being fixed correctly:

1. Run in dry-run mode to see what would be changed
2. Check the validation output for unfixed patterns
3. Verify your HTML syntax is correct
4. Check that the file path is correct

## License

This script is part of the FE Credit project.

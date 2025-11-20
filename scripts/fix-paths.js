#!/usr/bin/env node

/**
 * Script to fix paths in HTML files for GitHub Pages deployment
 * 
 * Usage:
 *   node scripts/fix-paths.js [--dry-run] [--file=path/to/file.html]
 * 
 * Options:
 *   --dry-run    Preview changes without modifying files
 *   --file       Specify a single file to process (default: www.fecredit.com.vn/index.html)
 * 
 * Examples:
 *   node scripts/fix-paths.js --dry-run
 *   node scripts/fix-paths.js --file=www.fecredit.com.vn/index.html
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_PATH = '/fecredit';
const WWW_PATH = '/fecredit/www.fecredit.com.vn';
const DEFAULT_FILE = 'www.fecredit.com.vn/index.html';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const fileArg = args.find(arg => arg.startsWith('--file='));
const targetFile = fileArg ? fileArg.split('=')[1] : DEFAULT_FILE;

console.log('=== GitHub Pages Path Fixer ===\n');
console.log(`Mode: ${isDryRun ? 'DRY RUN (preview only)' : 'LIVE (will modify files)'}`);
console.log(`Target file: ${targetFile}\n`);

// Check if file exists
if (!fs.existsSync(targetFile)) {
    console.error(`Error: File not found: ${targetFile}`);
    process.exit(1);
}

// Read file content
let content = fs.readFileSync(targetFile, 'utf8');
const originalContent = content;

// Define replacement patterns
const replacements = [
    // CSS bundles - sb/
    {
        pattern: /href="sb\//g,
        replacement: `href="${WWW_PATH}/sb/`,
        description: 'CSS bundle paths (sb/)'
    },
    // CSS bundles - uSkinned/
    {
        pattern: /href="uSkinned\//g,
        replacement: `href="${WWW_PATH}/uSkinned/`,
        description: 'CSS bundle paths (uSkinned/)'
    },
    // Assets in src
    {
        pattern: /src="assets\//g,
        replacement: `src="${WWW_PATH}/assets/`,
        description: 'Assets in src attributes'
    },
    // Assets in href
    {
        pattern: /href="\/assets\//g,
        replacement: `href="${WWW_PATH}/assets/`,
        description: 'Assets in href attributes'
    },
    // sb/ in href with leading slash
    {
        pattern: /href="\/sb\//g,
        replacement: `href="${WWW_PATH}/sb/`,
        description: 'SB paths with leading slash'
    },
    // External API with protocol fix
    {
        pattern: /src="\.\.\/api\.pushio\.com\//g,
        replacement: 'src="https://api.pushio.com/',
        description: 'External API protocol'
    },
    // Form actions - search
    {
        pattern: /action="\/search\/"/g,
        replacement: `action="${BASE_PATH}/search/"`,
        description: 'Form action (search)'
    },
    // Form actions - root (but not already fixed)
    {
        pattern: /action="\/"/g,
        replacement: `action="${BASE_PATH}/"`,
        description: 'Form action (root)'
    }
];

// Internal navigation paths that need fixing
const internalPaths = [
    '/ve-chung-toi/',
    '/lien-he/',
    '/tien-mat-linh-hoat/',
    '/vay-mua-xe-may/',
    '/vay-mua-dien-thoai-dien-may/',
    '/the-tin-dung/',
    '/bao-hiem-lien-ket/',
    '/mua-truoc-tra-sau/',
    '/san-pham-b-w/',
    '/tin-tuc-khuyen-mai/tin-tuc/',
    '/tin-tuc-khuyen-mai/khuyen-mai/',
    '/thanh-toan-truc-tuyen/',
    '/tim-diem-thanh-toan-giai-ngan/',
    '/khach-hang-to-chuc/',
    '/cau-hoi-thuong-gap/',
    '/gui-yeu-cau-va-khieu-nai/',
    '/cam-nang-truc-tuyen/',
    '/cam-nang-truc-tuyen/meo-tai-chinh/',
    '/tra-cuu-khong-lam-phien/'
];

// Add internal paths to replacements
internalPaths.forEach(internalPath => {
    replacements.push({
        pattern: new RegExp(`href="${internalPath.replace(/\//g, '\\/')}"`, 'g'),
        replacement: `href="${BASE_PATH}${internalPath}"`,
        description: `Internal link: ${internalPath}`
    });
});

// Add home page links (special handling for different contexts)
replacements.push(
    {
        pattern: /href="\/" /g,
        replacement: `href="${BASE_PATH}/" `,
        description: 'Home link (with space)'
    },
    {
        pattern: /href="\/">/g,
        replacement: `href="${BASE_PATH}/">`,
        description: 'Home link (with >)'
    }
);

// JavaScript redirects
replacements.push({
    pattern: /window\.location\.href = "\/tim-diem-thanh-toan-giai-ngan\/"/g,
    replacement: `window.location.href = "${BASE_PATH}/tim-diem-thanh-toan-giai-ngan/"`,
    description: 'JavaScript redirect'
});

// Apply replacements
let totalReplacements = 0;
const changeLog = [];

replacements.forEach(({ pattern, replacement, description }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
        const count = matches.length;
        totalReplacements += count;
        changeLog.push({ description, count });
        content = content.replace(pattern, replacement);
    }
});

// Display results
console.log('--- Changes Summary ---\n');
if (changeLog.length === 0) {
    console.log('✓ No changes needed - all paths are already correct!\n');
} else {
    changeLog.forEach(({ description, count }) => {
        console.log(`✓ ${description}: ${count} replacement(s)`);
    });
    console.log(`\nTotal replacements: ${totalReplacements}\n`);
}

// Show preview in dry-run mode
if (isDryRun && totalReplacements > 0) {
    console.log('--- Preview (first 5 changes) ---\n');
    
    // Show a diff-like preview
    const originalLines = originalContent.split('\n');
    const newLines = content.split('\n');
    let changesShown = 0;
    
    for (let i = 0; i < originalLines.length && changesShown < 5; i++) {
        if (originalLines[i] !== newLines[i]) {
            console.log(`Line ${i + 1}:`);
            console.log(`- ${originalLines[i].trim()}`);
            console.log(`+ ${newLines[i].trim()}`);
            console.log('');
            changesShown++;
        }
    }
    
    if (totalReplacements > 5) {
        console.log(`... and ${totalReplacements - 5} more changes\n`);
    }
}

// Write changes if not dry-run
if (!isDryRun && totalReplacements > 0) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`✅ Successfully updated ${targetFile}\n`);
} else if (isDryRun) {
    console.log('ℹ️  Dry run mode - no files were modified\n');
    console.log('To apply changes, run without --dry-run flag\n');
}

// Validation
if (totalReplacements > 0 || !isDryRun) {
    console.log('--- Validation ---\n');
    
    // Check for any remaining unfixed patterns (common mistakes)
    const checks = [
        {
            pattern: /href="sb\//,
            message: 'Found unfixed CSS bundle paths (sb/)'
        },
        {
            pattern: /href="uSkinned\//,
            message: 'Found unfixed CSS bundle paths (uSkinned/)'
        },
        {
            pattern: /src="assets\//,
            message: 'Found unfixed asset paths'
        },
        {
            pattern: /src="\.\.\/api\.pushio\.com\//,
            message: 'Found unfixed API paths'
        }
    ];
    
    let validationPassed = true;
    checks.forEach(({ pattern, message }) => {
        if (content.match(pattern)) {
            console.log(`⚠️  ${message}`);
            validationPassed = false;
        }
    });
    
    if (validationPassed) {
        console.log('✓ All paths appear to be correctly formatted\n');
    } else {
        console.log('\n⚠️  Some paths may need manual review\n');
    }
}

console.log('=== Done ===\n');
process.exit(0);

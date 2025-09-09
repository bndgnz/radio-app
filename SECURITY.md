# Security Measures - Zero-Width Character Injection Prevention

## Issue Resolved
**Date:** 2025-01-15  
**Severity:** Critical  
**Type:** Zero-Width Character Injection Attack

## What Was Discovered
Malicious zero-width Unicode characters were found injected into Sanity CMS content, specifically in the `textAlign` field of page layout columns. These characters were being directly rendered into HTML class attributes without sanitization, creating potential security vulnerabilities.

### Examples of Malicious Characters Found:
- `&ZeroWidthSpace;` (U+200B)
- `&zwnj;` (U+200C) 
- `&zwj;` (U+200D)
- `&#xFEFF;` (U+FEFF)
- And others in the range U+200B-U+200D, U+2060-U+2069

## Security Fixes Implemented

### 1. Input Sanitization
- **File:** `src/components/Layout/PageDesignLayout.tsx`
- **Fix:** Added sanitization functions for all user-controllable values used in className construction
- **Security Functions:**
  - `sanitizeTextAlign()` - Only allows valid CSS text-align values
  - `sanitizeColumnSize()` - Only allows valid Bootstrap column sizes (1-12)

### 2. Security Utilities
- **File:** `src/utils/security.ts`
- **Purpose:** Centralized security functions to prevent injection attacks
- **Functions:**
  - `removeZeroWidthCharacters()` - Removes malicious Unicode characters
  - `sanitizeTextAlign()` - Validates text alignment values
  - `sanitizeColumnSize()` - Validates Bootstrap column sizes
  - `sanitizeClassName()` - Cleans HTML class names
  - `sanitizeString()` - General string sanitization

### 3. Data Cleanup Script
- **File:** `scripts/clean-malicious-data.js`
- **Purpose:** One-time cleanup script to remove malicious characters from existing Sanity content
- **Usage:** `node scripts/clean-malicious-data.js`

## How to Run the Cleanup

1. **Backup your data first** (recommended):
   ```bash
   npx sanity dataset export production backup-before-cleanup.tar.gz
   ```

2. **Run the cleanup script:**
   ```bash
   node scripts/clean-malicious-data.js
   ```

3. **Review your content** after cleanup to ensure nothing was inadvertently changed.

## Prevention Measures

### For Developers:
1. **Never trust user input** - Always sanitize data before using it in className, innerHTML, or other DOM manipulations
2. **Use the security utilities** - Import functions from `src/utils/security.ts` for consistent sanitization
3. **Regular security audits** - Check for similar patterns in other components

### For Content Editors:
1. **Be cautious with copy-paste** - Malicious characters can be invisible when copied from external sources
2. **Report suspicious behavior** - If content appears differently than expected, report immediately
3. **Use Sanity Studio** - Avoid editing content through external tools or APIs when possible

## Technical Details

### Vulnerable Code Pattern (FIXED):
```typescript
// VULNERABLE - DON'T DO THIS
className={`col-12 col-md-${desktopCols} theme-column-${colIndex} ${column.textAlign ? `text-align-${column.textAlign}` : ''}`}
```

### Secure Code Pattern (IMPLEMENTED):
```typescript
// SECURE - DO THIS
const textAlignClass = column.textAlign ? `text-align-${sanitizeTextAlign(column.textAlign)}` : '';
className={`col-12 col-md-${desktopCols} theme-column-${colIndex} ${textAlignClass}`}
```

## Files Modified

### Security Implementation:
- `src/components/Layout/PageDesignLayout.tsx` - Added input sanitization
- `src/utils/security.ts` - New security utilities
- `scripts/clean-malicious-data.js` - Data cleanup script
- `SECURITY.md` - This documentation

### Testing Required:
- Test all page layouts render correctly
- Verify text alignment still works
- Check Bootstrap column sizing
- Ensure no legitimate content was affected

## Contact
If you discover any security issues, please report them immediately to the development team.

---
**Status:** ✅ RESOLVED  
**Review Date:** 2025-01-15  
**Next Review:** As needed
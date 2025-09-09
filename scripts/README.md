# Podcast Deduplication Scripts

This directory contains scripts to identify and remove duplicate podcasts from your Sanity dataset.

## Prerequisites

1. **Sanity Auth Token**: You need a Sanity auth token with write permissions
   - Go to [Sanity Manage](https://sanity.io/manage)
   - Select your project
   - Go to API section
   - Create a new token with Editor permissions
   - Set the environment variable: `SANITY_AUTH_TOKEN=your_token_here`

2. **Dependencies**: Make sure you have the required packages:
   ```bash
   npm install @sanity/client
   ```

## Scripts

### 1. `deduplicate-podcasts.js` (Main Script)

This script identifies duplicate podcasts based on:
- Title similarity (90%+ match)
- Same show + similar date (70%+ title match + within 7 days)

When choosing which podcast to keep, it prioritizes:
1. Most recent date
2. Has a slug
3. Longer description
4. Earlier created time (original)

### 2. `update-podcast-references.js` (Helper Script)

Handles updating references to podcasts after deduplication. Automatically updates:
- `featuredPodcast` fields in latestPodcasts documents
- `podcasts` arrays that reference the old podcast IDs

## Usage

### Step 1: Dry Run (Recommended First)

```bash
# See what would be changed without making any modifications
node scripts/deduplicate-podcasts.js --dry-run
```

This will show you:
- How many duplicate groups were found
- Which podcasts would be kept vs deleted
- How many references would be updated

### Step 2: Set Your Auth Token

```bash
# Windows
set SANITY_AUTH_TOKEN=your_token_here

# Mac/Linux
export SANITY_AUTH_TOKEN=your_token_here
```

### Step 3: Run the Deduplication

```bash
# Actually perform the deduplication
node scripts/deduplicate-podcasts.js
```

## Example Output

```
🚀 Podcast Deduplication Script
=====================================

📥 Fetching all podcasts from Sanity...
✅ Found 1,247 podcasts

📊 Analyzing 1,247 podcasts for duplicates...

🔍 Found 15 groups of duplicates:

📑 Group 1: "Xan Hamilton Local Board Candidate Interview 2025"
   ✅ KEEP: Xan Hamilton Local Board Candidate Interview 2025 (2025-01-15T10:00:00Z) [abc123]
   ❌ DELETE: Xan Hamilton Local Board Candidate Interview 2025 (2025-01-15T09:55:00Z) [def456]

🔄 Updating references: def456 → abc123
   Podcast: "Xan Hamilton Local Board Candidate Interview 2025"
   📎 Found 2 documents with references:
      - latestPodcasts: Featured Content
      - latestPodcasts: Show Highlights
   🔧 Applying 2 patches...
   ✅ Updated 2 references successfully
     ✅ Deleted successfully

📊 SUMMARY:
   • 15 duplicate groups found
   • 23 podcasts were deleted
   • 31 references were updated

✅ Deduplication complete!
```

## Safety Features

- **Dry Run Mode**: Always test first with `--dry-run`
- **Reference Updates**: Automatically updates all references before deletion
- **Detailed Logging**: See exactly what's being changed
- **Error Handling**: Script continues even if some operations fail
- **Smart Selection**: Keeps the "best" version of each duplicate

## Troubleshooting

### "SANITY_AUTH_TOKEN required" Error

Make sure you've set the environment variable correctly. The token needs Editor permissions.

### "No duplicates found" Message

This means your database is already clean! The script uses intelligent matching to avoid false positives.

### Reference Update Failures

If some references fail to update, the script will log the specific documents that need manual review. You can check these in your Sanity Studio.

### Permission Errors

Your Sanity token needs Editor or Admin permissions to delete documents and update references.

## Manual Review

After running the script, it's recommended to:

1. Check a few of the kept podcasts in Sanity Studio
2. Verify that featured podcasts and lists are still working correctly
3. Test your website to ensure all podcast links work

## Customization

You can modify the duplicate detection criteria in `deduplicate-podcasts.js`:

- **Title similarity threshold**: Change the `0.9` and `0.7` values in `findDuplicates()`
- **Date range**: Modify the `daysDiff <= 7` condition
- **Keep criteria**: Adjust the logic in `choosePodcastToKeep()`
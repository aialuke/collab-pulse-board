
/**
 * Batch Image Conversion Script for Supabase
 * 
 * This script fetches all feedback posts with images from Supabase,
 * converts the images to WebP format (or JPEG if WebP fails),
 * uploads them back to Supabase Storage, and updates the database references.
 * 
 * Usage:
 * 1. Set the environment variables for Supabase connection
 * 2. Run with: node convertExistingImagesToWebP.js [--limit=10] [--dryRun]
 * 
 * Options:
 * --limit=N: Process only N images (default: process all)
 * --dryRun: Run without making any actual changes (for testing)
 */

// Require Node.js modules
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xvdpcpsmcehzliyuqeuh.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ""; // Must be set
const OUTPUT_FORMAT = 'webp'; // Output format
const FALLBACK_FORMAT = 'jpeg'; // Fallback format if WebP fails
const QUALITY = 0.8; // Compression quality (0-1)
const MAX_WIDTH = 800; // Maximum width for resized images
const MAX_HEIGHT = 800; // Maximum height for resized images
const BATCH_SIZE = 5; // Number of images to process in parallel
const STORAGE_BUCKET = 'feedback-images'; // Supabase storage bucket name

// Parse command line arguments
const args = process.argv.slice(2);
const limitMatch = args.find(arg => arg.startsWith('--limit='));
const LIMIT = limitMatch ? parseInt(limitMatch.split('=')[1]) : Infinity;
const DRY_RUN = args.includes('--dryRun');

// Statistics
let totalImages = 0;
let processedImages = 0;
let failedImages = 0;
let totalOriginalSize = 0;
let totalCompressedSize = 0;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Main function to start the conversion process
 */
async function main() {
  if (!SUPABASE_SERVICE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_KEY environment variable must be set');
    process.exit(1);
  }

  console.log(`
======================================================
  🚀 Starting Image Conversion to WebP (${OUTPUT_FORMAT})
  🎯 Target dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}px 
  🗜️ Quality: ${QUALITY * 100}%
  🧪 Dry run: ${DRY_RUN ? 'Yes (no changes will be made)' : 'No'}
  🔢 Limit: ${LIMIT === Infinity ? 'No limit' : LIMIT}
======================================================
  `);

  try {
    // Fetch all feedback with images
    const feedbackItems = await fetchFeedbackWithImages();
    totalImages = feedbackItems.length;

    console.log(`Found ${totalImages} images to process`);
    console.log('Starting conversion process...');

    // Apply limit if specified
    const itemsToProcess = feedbackItems.slice(0, LIMIT);

    // Process in batches
    for (let i = 0; i < itemsToProcess.length; i += BATCH_SIZE) {
      const batch = itemsToProcess.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(processImage));

      // Log progress
      console.log(`Processed ${Math.min(i + BATCH_SIZE, itemsToProcess.length)} of ${itemsToProcess.length} images`);
    }

    // Log final statistics
    const averageReduction = totalOriginalSize > 0 
      ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2) 
      : 0;

    console.log(`
======================================================
  📊 Conversion Statistics
======================================================
  ✅ Successfully processed: ${processedImages} images
  ❌ Failed: ${failedImages} images
  📦 Original size: ${formatFileSize(totalOriginalSize)}
  📦 Compressed size: ${formatFileSize(totalCompressedSize)}
  📉 Size reduction: ${averageReduction}%
======================================================
    `);

  } catch (error) {
    console.error('Error in main process:', error);
  }
}

/**
 * Fetch all feedback posts with image URLs
 */
async function fetchFeedbackWithImages() {
  console.log('Fetching feedback posts with images...');
  
  const { data, error } = await supabase
    .from('feedback')
    .select('id, user_id, image_url')
    .not('image_url', 'is', null);
  
  if (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
  
  // Filter out items that already have WebP images
  return data.filter(item => {
    // Skip items that already have WebP images
    if (item.image_url && item.image_url.toLowerCase().endsWith('.webp')) {
      return false;
    }
    return item.image_url && item.user_id;
  });
}

/**
 * Process a single image: download, convert, upload, update database
 */
async function processImage(feedbackItem) {
  const { id, image_url, user_id } = feedbackItem;

  try {
    console.log(`Processing image for feedback ID: ${id}`);
    
    // Extract file path from URL
    const urlParts = new URL(image_url);
    const filePath = decodeURIComponent(urlParts.pathname.split('/').pop());
    const originalKey = `${user_id}/${filePath}`;
    
    // Download the image
    console.log(`Downloading image: ${originalKey}`);
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(originalKey);
    
    if (downloadError || !fileData) {
      throw new Error(`Failed to download image: ${downloadError?.message || 'No data returned'}`);
    }

    // Get original size
    const originalSize = fileData.size;
    totalOriginalSize += originalSize;
    
    // Convert to blob and then to buffer
    const buffer = await fileData.arrayBuffer();
    const originalImage = await loadImageFromBuffer(buffer);
    
    // Convert to WebP
    const { 
      compressedImage, 
      compressedSize, 
      outputFormat 
    } = await compressImage(originalImage, originalSize);
    
    totalCompressedSize += compressedSize;
    
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would convert image ${filePath} to ${outputFormat}`);
      console.log(`Original size: ${formatFileSize(originalSize)}, Compressed: ${formatFileSize(compressedSize)}`);
      processedImages++;
      return;
    }

    // Create new file name with WebP extension
    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
    const newFileName = `${fileNameWithoutExt}.${outputFormat}`;
    const newKey = `${user_id}/${newFileName}`;
    
    // Upload the converted image
    console.log(`Uploading converted image: ${newKey}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(newKey, compressedImage, {
        contentType: `image/${outputFormat}`,
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload converted image: ${uploadError.message}`);
    }
    
    // Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(newKey);
    
    // Update the database reference
    console.log(`Updating database reference for feedback ID: ${id}`);
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ image_url: publicUrl })
      .eq('id', id);
    
    if (updateError) {
      throw new Error(`Failed to update database: ${updateError.message}`);
    }
    
    console.log(`✅ Successfully processed image for feedback ID: ${id}`);
    console.log(`Original: ${formatFileSize(originalSize)}, Compressed: ${formatFileSize(compressedSize)}`);
    
    processedImages++;
  } catch (error) {
    console.error(`❌ Error processing image for feedback ID: ${id}`, error);
    failedImages++;
  }
}

/**
 * Load an image from a buffer
 */
async function loadImageFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    // Load image from buffer
    img.src = Buffer.from(buffer);
  });
}

/**
 * Compress an image using Canvas
 * Reuses logic from imageCompression.ts but adapted for Node.js environment
 */
async function compressImage(img, originalSize) {
  // Determine dimensions while maintaining aspect ratio
  let width = img.width;
  let height = img.height;
  
  if (width > MAX_WIDTH) {
    height = Math.round(height * (MAX_WIDTH / width));
    width = MAX_WIDTH;
  }
  
  if (height > MAX_HEIGHT) {
    width = Math.round(width * (MAX_HEIGHT / height));
    height = MAX_HEIGHT;
  }
  
  // Create canvas and context
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw image on canvas
  ctx.drawImage(img, 0, 0, width, height);
  
  // Try WebP first
  let outputFormat = OUTPUT_FORMAT;
  let compressedImage;
  
  try {
    compressedImage = canvas.toBuffer(`image/${OUTPUT_FORMAT}`, {
      quality: QUALITY
    });
  } catch (error) {
    // Fall back to JPEG if WebP fails
    console.warn(`WebP conversion failed, falling back to ${FALLBACK_FORMAT}`);
    outputFormat = FALLBACK_FORMAT;
    compressedImage = canvas.toBuffer(`image/${FALLBACK_FORMAT}`, {
      quality: QUALITY
    });
  }
  
  const compressedSize = compressedImage.length;
  
  return {
    compressedImage,
    originalSize,
    compressedSize,
    compressionRatio: originalSize / compressedSize,
    outputFormat
  };
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// Run the script
main()
  .then(() => {
    console.log('Image conversion process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

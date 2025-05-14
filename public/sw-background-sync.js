// Background sync handler for the service worker

// Handle background sync events
self.addEventListener('sync', (event) => {
  console.log('Background sync event received:', event.tag);
  
  if (event.tag.startsWith('feedback-') || 
      event.tag.startsWith('comment-') || 
      event.tag.startsWith('upvote-') || 
      event.tag.startsWith('report-')) {
    event.waitUntil(syncData(event.tag));
  }
});

// Process data from IndexedDB
async function syncData(queueName) {
  const storeName = `offline-${queueName}`;
  
  try {
    // Open database
    const db = await new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('offline-actions-db', 1);
      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onsuccess = () => resolve(openRequest.result);
    });
    
    // Get all items from store
    const items = await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
    
    if (!items || items.length === 0) {
      console.log(`No items to sync for queue: ${queueName}`);
      return;
    }
    
    console.log(`Processing ${items.length} items for queue: ${queueName}`);
    
    // Process each item
    for (const item of items) {
      try {
        // Determine API endpoint and method based on queue name
        let endpoint, method, body;
        
        if (queueName === 'feedback-create-queue') {
          endpoint = '/api/feedback';
          method = 'POST';
          body = item.data;
        } else if (queueName === 'comment-create-queue') {
          endpoint = `/api/feedback/${item.data.feedbackId}/comments`;
          method = 'POST';
          body = { content: item.data.content };
        } else if (queueName === 'upvote-toggle-queue') {
          endpoint = `/api/feedback/${item.data.feedbackId}/upvote`;
          method = 'POST';
          body = {};
        } else if (queueName === 'report-queue') {
          endpoint = `/api/feedback/${item.data.feedbackId}/report`;
          method = 'POST';
          body = { reason: item.data.reason };
        }
        
        // Make API request with retry logic
        await fetchWithRetry(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }, 3);
        
        // Remove item from store on success
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(item.id);
          
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
        
      } catch (error) {
        console.error(`Failed to process item for queue ${queueName}:`, error);
        // Keep item in store to retry on next sync
      }
    }
    
    // Notify main thread about sync completion
    if (self.clients) {
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.postMessage({
          type: 'BACKGROUND_SYNC_COMPLETE',
          queue: queueName,
        });
      }
    }
    
  } catch (error) {
    console.error(`Error during background sync for queue ${queueName}:`, error);
    throw error; // Let sync manager know to retry
  }
}

// Fetch with exponential backoff retry
async function fetchWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (true) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

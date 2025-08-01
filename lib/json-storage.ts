import fs from 'fs/promises'
import path from 'path'

// JSON file-based storage for persistence
const DATA_DIR = path.join(process.cwd(), 'data')
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  services: path.join(DATA_DIR, 'services.json'),
  bookings: path.join(DATA_DIR, 'bookings.json'),
  reviews: path.join(DATA_DIR, 'reviews.json'),
  messages: path.join(DATA_DIR, 'messages.json'),
  conversations: path.join(DATA_DIR, 'conversations.json'),
  notifications: path.join(DATA_DIR, 'notifications.json'),
  categories: path.join(DATA_DIR, 'categories.json'),
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Generic read function
export async function readJsonFile<T>(filename: keyof typeof FILES): Promise<T[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(FILES[filename], 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

// Generic write function
export async function writeJsonFile<T>(filename: keyof typeof FILES, data: T[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(FILES[filename], JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Initialize with default data if files don't exist
export async function initializeJsonStorage() {
  await ensureDataDir()
  
  // Check if files exist, if not create them with empty arrays
  for (const [key, filePath] of Object.entries(FILES)) {
    try {
      await fs.access(filePath)
    } catch {
      // File doesn't exist, create with empty array
      await fs.writeFile(filePath, '[]', 'utf8')
    }
  }
}
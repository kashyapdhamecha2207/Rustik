import fs from 'fs';
import path from 'path';

const DB_DIR = path.resolve('./.db');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class MockCollection {
  constructor(name, defaultData = []) {
    this.filePath = path.join(DB_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading mock collection ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing mock collection ${this.filePath}:`, error);
      return false;
    }
  }

  async find(filter = {}) {
    const items = this.read();
    return items.filter(item => {
      for (const key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const items = this.read();
    return items.find(item => {
      for (const key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const items = this.read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const items = this.read();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, data, options = {}) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1);
    this.write(items);
    return deleted[0];
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }
}

// Default collections
export const MockUsers = new MockCollection('users');
export const MockCustomers = new MockCollection('customers');
export const MockAppointments = new MockCollection('appointments');
export const MockServices = new MockCollection('services');
export const MockExpenses = new MockCollection('expenses');
export const MockCMS = new MockCollection('cms');

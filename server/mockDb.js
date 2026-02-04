// Simple In-Memory Database to replace MongoDB/Mongoose

const crypto = require('crypto');

class InMemoryCollection {
    constructor() {
        this.data = [];
    }

    async find(query = {}) {
        let results = [...this.data];
        // Basic sort support (mocking .sort({ date: -1 }))
        return {
            sort: ({ date }) => {
                if (date === -1) {
                    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                return results;
            }
        };
    }

    async findById(id) {
        return this.data.find(item => item._id === id);
    }

    async findOne() {
        return this.data[0];
    }

    async create(doc) {
        const newItem = {
            ...doc,
            _id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.data.push(newItem);
        return newItem;
    }

    // Mocking Mongoose Document's deleteOne
    async findByIdAndDelete(id) {
        const index = this.data.findIndex(item => item._id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            return true;
        }
        return false;
    }
}

// Special handling for Settings (singleton-ish)
class SettingsCollection extends InMemoryCollection {
    async create(doc) {
        // Ensure only one settings document exists for simplicity or update existing
        if (this.data.length > 0) {
            Object.assign(this.data[0], doc);
            return this.attachMethods(this.data[0]);
        }
        const newItem = await super.create(doc);
        return this.attachMethods(newItem);
    }

    async findOne() {
        const doc = await super.findOne();
        if (!doc) return null;
        return this.attachMethods(doc);
    }

    attachMethods(doc) {
        doc.save = async () => doc;
        return doc;
    }
}

// Create singletons
const expenses = new InMemoryCollection();
const settings = new SettingsCollection();

// Export interfaces matching Mongoose Models
module.exports = {
    Expense: {
        find: () => expenses.find(),
        create: (doc) => expenses.create(doc),
        findById: async (id) => {
            const doc = await expenses.findById(id);
            if (!doc) return null;
            // mimic mongoose document
            return {
                ...doc,
                deleteOne: () => expenses.findByIdAndDelete(id)
            };
        }
    },
    Settings: {
        findOne: () => settings.findOne(),
        create: (doc) => settings.create(doc)
    }
};

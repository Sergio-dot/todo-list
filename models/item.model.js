// Modello Item
class Item {
  constructor(title, description = null) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title must be a non-empty string');
    }

    this.title = title;
    this.description = description;
  }
}

module.exports = Item;

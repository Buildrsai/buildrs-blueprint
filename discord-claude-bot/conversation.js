/**
 * Gère les historiques de conversation par utilisateur.
 * Chaque utilisateur a son propre contexte, stocké en mémoire.
 */
class ConversationManager {
  constructor(maxPairs = 20) {
    this.histories = new Map();
    this.maxMessages = maxPairs * 2; // pairs = user + assistant
  }

  getHistory(userId) {
    if (!this.histories.has(userId)) {
      this.histories.set(userId, []);
    }
    return this.histories.get(userId);
  }

  setHistory(userId, history) {
    // Trim history if it exceeds max
    if (history.length > this.maxMessages) {
      // Always keep pairs (user + assistant), trim from the start
      const excess = history.length - this.maxMessages;
      const trimAt = excess % 2 === 0 ? excess : excess + 1;
      history = history.slice(trimAt);
    }
    this.histories.set(userId, history);
  }

  clearHistory(userId) {
    this.histories.delete(userId);
    return true;
  }

  clearAll() {
    this.histories.clear();
    return true;
  }

  getHistoryCount(userId) {
    const history = this.histories.get(userId);
    return history ? history.length : 0;
  }

  getUserCount() {
    return this.histories.size;
  }
}

module.exports = { ConversationManager };

const knowledgeBase = require('../data/knowledgeBase.json');

/**
 * Service: Search Knowledge Base by simple keyword matching
 */
function searchKnowledgeBase(query) {
  if (!query) return null;
  const lowerQuery = query.toLowerCase();

  const results = knowledgeBase.filter(item => 
    lowerQuery.includes(item.title.toLowerCase()) ||
    lowerQuery.includes(item.topic.toLowerCase()) ||
    item.content.toLowerCase().split(' ').some(word => word.length > 3 && lowerQuery.includes(word))
  );

  return results.length > 0 ? results : knowledgeBase;
}

module.exports = { searchKnowledgeBase };
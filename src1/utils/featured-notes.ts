import { getAllNotes, NoteNode, organizeNotesTree } from './notes-mdx';

/**
 * Get featured notes for the home page - TOP LEVEL ONLY
 * Priority:
 * 1. Top-level notes explicitly marked as featured in frontmatter
 * 2. Top-level notes with higher order values
 * 3. Top-level nodes with descriptions
 * 
 * @param limit Maximum number of notes to return
 * @returns Array of featured NoteNodes (top-level only)
 */
export function getFeaturedNotes(limit: number = 6): NoteNode[] {
  // Get all notes with their frontmatter
  const allNotes = getAllNotes();
  
  // Get organized tree for proper structure
  const notesTree = organizeNotesTree();
  
  // ONLY work with top-level nodes (root level)
  const topLevelNodes = notesTree;
  
  // First, find top-level notes explicitly marked as featured
  const featuredTopLevelNodes: NoteNode[] = [];
  
  // Check each top-level node if it's marked as featured
  for (const node of topLevelNodes) {
    // Find the corresponding note data to check frontmatter
    const noteData = allNotes.find(note => 
      note.slug.length === 1 && note.slug[0] === node.slug
    );
    
    if (noteData && noteData.frontmatter.featured === true) {
      featuredTopLevelNodes.push(node);
    }
  }
  
  // If we don't have enough featured notes, add other top-level nodes
  if (featuredTopLevelNodes.length < limit) {
    // Get remaining top-level nodes (not already featured)
    const remainingTopLevelNodes = topLevelNodes
      .filter(node => !featuredTopLevelNodes.includes(node))
      .sort((a, b) => {
        // Sort by order first
        if (a.order !== b.order) return a.order - b.order;
        
        // Then prioritize nodes with descriptions
        const aHasDesc = !!a.description;
        const bHasDesc = !!b.description;
        
        if (aHasDesc && !bHasDesc) return -1;
        if (!aHasDesc && bHasDesc) return 1;
        
        // Finally sort by title
        return a.title.localeCompare(b.title);
      });
    
    // Add remaining nodes until we reach the limit
    const needed = limit - featuredTopLevelNodes.length;
    featuredTopLevelNodes.push(...remainingTopLevelNodes.slice(0, needed));
  }
  
  // Return only the requested number of top-level nodes
  return featuredTopLevelNodes.slice(0, limit);
}
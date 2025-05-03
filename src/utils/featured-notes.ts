import { getAllNotes, NoteNode, organizeNotesTree } from './notes-mdx';

/**
 * Get featured notes for the home page
 * Priority:
 * 1. Notes explicitly marked as featured in frontmatter
 * 2. Notes with higher order values
 * 3. Root level nodes with descriptions
 * 
 * @param limit Maximum number of notes to return
 * @returns Array of featured NoteNodes
 */
export function getFeaturedNotes(limit: number = 6): NoteNode[] {
  // Get all notes with their frontmatter
  const allNotes = getAllNotes();
  
  // First, find notes explicitly marked as featured
  const featuredNotes = allNotes
    .filter(note => note.frontmatter.featured === true)
    .map(note => ({ slug: note.slug, frontmatter: note.frontmatter }));
  
  // Get organized tree for proper structure
  const notesTree = organizeNotesTree();
  
  // Convert featured notes to proper NoteNode objects
  const featuredNodes: NoteNode[] = [];
  
  // Map featured notes to tree nodes
  for (const featuredNote of featuredNotes) {
    const findNodeBySlug = (nodes: NoteNode[], slugParts: string[]): NoteNode | null => {
      if (slugParts.length === 0) return null;
      
      for (const node of nodes) {
        if (node.slug === slugParts[0]) {
          if (slugParts.length === 1) return node;
          return findNodeBySlug(node.children, slugParts.slice(1));
        }
      }
      
      return null;
    };
    
    const node = findNodeBySlug(notesTree, featuredNote.slug);
    if (node) featuredNodes.push(node);
  }
  
  // If we don't have enough featured notes, add top-level nodes with descriptions
  if (featuredNodes.length < limit) {
    // Sort nodes by order first, then by whether they have descriptions
    const remainingNodes = notesTree
      .filter(node => !featuredNodes.includes(node))
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
    featuredNodes.push(...remainingNodes.slice(0, limit - featuredNodes.length));
  }
  
  // Limit to requested number
  return featuredNodes.slice(0, limit);
}
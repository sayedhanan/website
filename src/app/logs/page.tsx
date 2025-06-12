'use client'

import { useState, useMemo } from 'react'
import { Search, Calendar, Brain, Code, BookOpen, Lightbulb, Coffee, Bug, Zap, Filter, X, ChevronDown } from 'lucide-react'

// Types
interface LogEntry {
  id: string
  date: string
  content: string
  tags: string[]
  category: 'learning' | 'coding' | 'research' | 'thoughts' | 'breakthrough' | 'struggle'
  mood?: 'excited' | 'confused' | 'satisfied' | 'frustrated' | 'curious'
}

// Sample data
const sampleLogs: LogEntry[] = [
  {
    id: '1',
    date: '2024-12-15',
    content: 'Finally cracked why attention mechanisms work! It\'s basically a learnable weighted lookup. The "query finds relevant keys" analogy clicked after implementing it from scratch.',
    tags: ['transformers', 'attention', 'breakthrough'],
    category: 'breakthrough',
    mood: 'excited'
  },
  {
    id: '2',
    date: '2024-12-14',
    content: 'Spent 3 hours debugging a memory leak in my CNN implementation. Turns out I was accumulating gradients without clearing them. torch.no_grad() is your friend.',
    tags: ['pytorch', 'debugging', 'cnn'],
    category: 'struggle',
    mood: 'frustrated'
  },
  {
    id: '3',
    date: '2024-12-13',
    content: 'Reading "Attention Is All You Need" for the third time. Each pass reveals new layers of genius. The positional encoding section makes so much more sense now.',
    tags: ['papers', 'transformers', 'nlp'],
    category: 'research',
    mood: 'curious'
  },
  {
    id: '4',
    date: '2024-12-12',
    content: 'Implemented a simple autoencoder today. Watching it learn to compress and reconstruct MNIST digits feels like magic. The latent space visualization is beautiful.',
    tags: ['autoencoders', 'mnist', 'unsupervised'],
    category: 'coding',
    mood: 'satisfied'
  },
  {
    id: '5',
    date: '2024-12-11',
    content: 'Been thinking about AI alignment lately. How do we ensure models do what we intend, not just what we specify? The reward hacking problem is fascinating and terrifying.',
    tags: ['ai-safety', 'alignment', 'philosophy'],
    category: 'thoughts',
    mood: 'curious'
  },
  {
    id: '6',
    date: '2024-12-10',
    content: 'Matrix multiplication in NumPy vs PyTorch - subtle differences in broadcasting rules caught me off guard. Always check tensor shapes when debugging!',
    tags: ['numpy', 'pytorch', 'linear-algebra'],
    category: 'learning',
    mood: 'confused'
  },
  {
    id: '7',
    date: '2024-12-09',
    content: 'Discovered this amazing paper on few-shot learning. The way they use meta-learning to adapt quickly to new tasks is brilliant. Need to implement MAML.',
    tags: ['meta-learning', 'few-shot', 'maml'],
    category: 'research',
    mood: 'excited'
  },
  {
    id: '8',
    date: '2024-12-08',
    content: 'Fixed a subtle bug in my gradient descent implementation. The learning rate was too high, causing oscillations. Sometimes the basics matter most.',
    tags: ['optimization', 'gradient-descent', 'debugging'],
    category: 'coding',
    mood: 'satisfied'
  }
]

const categoryIcons: Record<LogEntry['category'], any> = {
  learning: BookOpen,
  coding: Code,
  research: Search,
  thoughts: Brain,
  breakthrough: Zap,
  struggle: Bug
}

const categoryColors: Record<LogEntry['category'], string> = {
  learning: 'text-blue-600',
  coding: 'text-green-600',
  research: 'text-purple-600',
  thoughts: 'text-yellow-600',
  breakthrough: 'text-orange-600',
  struggle: 'text-red-600'
}

const moodEmojis: Record<NonNullable<LogEntry['mood']>, string> = {
  excited: '🚀',
  confused: '🤔',
  satisfied: '😌',
  frustrated: '😤',
  curious: '🧐'
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)
  const [yearFilter, setYearFilter] = useState<string>('all')

  // Get available years
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    sampleLogs.forEach(log => {
      years.add(new Date(log.date).getFullYear().toString())
    })
    return Array.from(years).sort().reverse()
  }, [])

  // Filter logs
  const filteredLogs = useMemo(() => {
    return sampleLogs.filter(log => {
      const matchesSearch = searchQuery === '' || 
                           log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory
      
      const matchesYear = yearFilter === 'all' || new Date(log.date).getFullYear().toString() === yearFilter
      
      return matchesSearch && matchesCategory && matchesYear
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchQuery, selectedCategory, yearFilter])

  // Visible logs (for pagination)
  const visibleLogs = filteredLogs.slice(0, visibleCount)
  const hasMore = filteredLogs.length > visibleCount

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Minimal Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Learning Logs</h1>
                <p className="text-sm text-gray-500">
                  {visibleLogs.length} of {filteredLogs.length} entries
                  {filteredLogs.length !== sampleLogs.length && ` (${sampleLogs.length} total)`}
                </p>
              </div>
            </div>
            
            {/* Compact Search & Filter */}
            <div className="flex items-center gap-2">
              {/* Year Filter (only show if multiple years) */}
              {availableYears.length > 1 && (
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`p-2 rounded-full transition-colors ${
                    selectedCategory !== 'all' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-40">
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setYearFilter('all')
                        setIsFilterOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        selectedCategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {Object.entries(categoryIcons).map(([category, IconComponent]) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsFilterOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                          selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${categoryColors[category as LogEntry['category']]}`} />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline - Content First */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-600">Try a different search term or filter</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {visibleLogs.map((log, index) => {
                const IconComponent = categoryIcons[log.category]
                const isToday = new Date(log.date).toDateString() === new Date().toDateString()
                
                return (
                  <div key={log.id} className="group">
                    {/* Timeline connector */}
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isToday ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white border-2 border-gray-200'
                        }`}>
                          <IconComponent className={`w-4 h-4 ${isToday ? 'text-white' : categoryColors[log.category]}`} />
                        </div>
                        {index < visibleLogs.length - 1 && (
                          <div className="w-0.5 h-16 bg-gradient-to-b from-gray-200 to-transparent mt-2" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group-hover:border-gray-200">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${categoryColors[log.category]}`}>
                                {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                              </span>
                              {log.mood && (
                                <span className="text-lg">{moodEmojis[log.mood]}</span>
                              )}
                            </div>
                            <time className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(log.date)}
                            </time>
                          </div>
                          
                          {/* Content */}
                          <p className="text-gray-800 leading-relaxed mb-4 text-[15px]">
                            {log.content}
                          </p>
                          
                          {/* Subtle Tags */}
                          <div className="flex flex-wrap gap-1">
                            {log.tags.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className="px-2 py-1 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                #{tag}
                              </button>
                            ))}
                            {log.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs text-gray-400">
                                +{log.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                >
                  Load More ({filteredLogs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
      

    </div>
  )
}
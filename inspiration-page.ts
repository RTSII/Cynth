import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Components
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Data and types
import { InspirationItem } from '@/types';
import { inspirationItems, getInspirationByType, getInspirationByTag } from '@/data/inspiration';

const Inspiration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'quotes' | 'videos'>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<InspirationItem | null>(null);
  
  // Get items based on active filters
  const getFilteredItems = (): InspirationItem[] => {
    let items = inspirationItems;
    
    // Filter by type if not "all"
    if (activeTab !== 'all') {
      items = getInspirationByType(activeTab === 'images' ? 'image' : activeTab === 'quotes' ? 'quote' : 'video');
    }
    
    // Filter by tag if selected
    if (activeTag) {
      items = items.filter(item => item.tags?.includes(activeTag));
    }
    
    return items;
  };
  
  // Get all unique tags from inspiration items
  const getAllTags = (): string[] => {
    const tags = new Set<string>();
    
    inspirationItems.forEach(item => {
      item.tags?.forEach(tag => {
        tags.add(tag);
      });
    });
    
    return Array.from(tags).sort();
  };
  
  const filteredItems = getFilteredItems();
  const allTags = getAllTags();
  
  // View item in fullscreen
  const openFullView = (item: InspirationItem) => {
    setViewItem(item);
  };
  
  // Close fullscreen view
  const closeFullView = () => {
    setViewItem(null);
  };
  
  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };
  
  // Calculate number of columns based on screen width
  // This would be better with a hook in a real app
  const getGridColumns = () => {
    const width = window.innerWidth;
    
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 3;
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inspiration</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'images' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('images')}
        >
          Images
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'quotes' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('quotes')}
        >
          Quotes
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'videos' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </div>
      
      {/* Tags Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeTag === tag
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Grid */}
      {filteredItems.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6`}>
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => openFullView(item)}>
              {item.type === 'image' && (
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="h-40 w-full">
                      <img 
                        src={item.source} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {item.type === 'quote' && (
                <Card 
                  className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: item.backgroundColor || '#F8F9FA' }}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl text-gray-400 mb-2">"</div>
                    <p className="text-lg italic mb-4">{item.quote}</p>
                    {item.author && (
                      <p className="text-right text-sm font-medium">— {item.author}</p>
                    )}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {item.type === 'video' && (
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                          <Play size={24} className="text-primary-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      )}
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found matching your filters.</p>
          <Button 
            variant="secondary" 
            onClick={() => {
              setActiveTab('all');
              setActiveTag(null);
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
      
      {/* Fullscreen View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full"
            onClick={closeFullView}
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl max-h-screen overflow-auto p-4">
            {viewItem.type === 'image' && (
              <div className="bg-white rounded-lg overflow-hidden">
                <img 
                  src={viewItem.source} 
                  alt={viewItem.title}
                  className="max-h-[70vh] mx-auto"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{viewItem.title}</h2>
                  {viewItem.description && (
                    <p className="text-gray-700 mt-2">{viewItem.description}</p>
                  )}
                </div>
              </div>
            )}
            
            {viewItem.type === 'quote' && (
              <div 
                className="bg-white rounded-lg p-8 max-w-xl mx-auto"
                style={{ backgroundColor: viewItem.backgroundColor || '#FFFFFF' }}
              >
                <div className="text-4xl text-gray-400 mb-4">"</div>
                <p className="text-2xl italic mb-6">{viewItem.quote}</p>
                {viewItem.author && (
                  <p className="text-right text-lg font-medium">— {viewItem.author}</p>
                )}
              </div>
            )}
            
            {viewItem.type === 'video' && viewItem.videoUrl && (
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative pb-[56.25%]">
                  <iframe
                    src={viewItem.videoUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={viewItem.title}
                  ></iframe>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold">{viewItem.title}</h2>
                  {viewItem.description && (
                    <p className="text-gray-700 mt-2">{viewItem.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspiration;
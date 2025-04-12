import { InspirationItem } from '../types';

export const inspirationItems: InspirationItem[] = [
  // Nature Images
  {
    id: 'ins-img-1',
    type: 'image',
    title: 'Sunrise Over Mountain Lake',
    source: '/assets/images/inspiration/sunrise-lake.jpg',
    description: 'A peaceful sunrise over a calm mountain lake, reflecting the golden light of dawn.',
    tags: ['Nature', 'Morning', 'Peace'],
  },
  {
    id: 'ins-img-2',
    type: 'image',
    title: 'Forest Path in Autumn',
    source: '/assets/images/inspiration/forest-path.jpg',
    description: 'A serene path through a forest with golden autumn leaves.',
    tags: ['Nature', 'Autumn', 'Path'],
  },
  {
    id: 'ins-img-3',
    type: 'image',
    title: 'Ocean Waves at Sunset',
    source: '/assets/images/inspiration/ocean-sunset.jpg',
    description: 'Gentle waves rolling onto shore during a vibrant sunset.',
    tags: ['Ocean', 'Sunset', 'Peace'],
  },
  {
    id: 'ins-img-4',
    type: 'image',
    title: 'Spring Flowers in Bloom',
    source: '/assets/images/inspiration/spring-flowers.jpg',
    description: 'Colorful wildflowers blooming in a sunny meadow.',
    tags: ['Flowers', 'Spring', 'Joy'],
  },
  {
    id: 'ins-img-5',
    type: 'image',
    title: 'Zen Garden Stones',
    source: '/assets/images/inspiration/zen-stones.jpg',
    description: 'Balanced stones in a peaceful zen garden setting.',
    tags: ['Zen', 'Balance', 'Mindfulness'],
  },
  
  // Videos
  {
    id: 'ins-vid-1',
    type: 'video',
    title: 'Gentle Waterfall Meditation',
    thumbnail: '/assets/images/inspiration/waterfall-thumbnail.jpg',
    videoUrl: 'https://player.vimeo.com/video/123456801',
    description: 'A peaceful 2-minute meditation featuring a gentle forest waterfall.',
    tags: ['Meditation', 'Water', 'Nature'],
  },
  {
    id: 'ins-vid-2',
    type: 'video',
    title: 'Morning Birdsong',
    thumbnail: '/assets/images/inspiration/birds-thumbnail.jpg',
    videoUrl: 'https://player.vimeo.com/video/123456802',
    description: 'Wake up to the beautiful sounds of morning birds in a peaceful garden.',
    tags: ['Birds', 'Morning', 'Sound'],
  },
  {
    id: 'ins-vid-3',
    type: 'video',
    title: 'Ocean Waves Relaxation',
    thumbnail: '/assets/images/inspiration/waves-thumbnail.jpg',
    videoUrl: 'https://player.vimeo.com/video/123456803',
    description: 'Relax to the rhythmic sounds and sight of ocean waves on a peaceful beach.',
    tags: ['Ocean', 'Relaxation', 'Sound'],
  },
  
  // Quotes
  {
    id: 'ins-quote-1',
    type: 'quote',
    title: 'Present Moment Awareness',,
    quote: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
    backgroundColor: '#E8F4F8',
    tags: ['Mindfulness', 'Presence', 'Wisdom'],
  },
  {
    id: 'ins-quote-2',
    type: 'quote',
    title: 'Inner Peace',
    quote: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    backgroundColor: '#F0F4E8',
    tags: ['Peace', 'Wisdom', 'Spirituality'],
  },
  {
    id: 'ins-quote-3',
    type: 'quote',
    title: 'Journey of a Thousand Miles',,
    quote: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    backgroundColor: '#F8EEE8',
    tags: ['Journey', 'Beginning', 'Wisdom'],
  },
  {
    id: 'ins-quote-4',
    type: 'quote',
    title: 'Power of Now',,
    quote: 'Realize deeply that the present moment is all you ever have.',
    author: 'Eckhart Tolle',
    backgroundColor: '#E8E8F8',
    tags: ['Present', 'Mindfulness', 'Awareness'],
  },
  {
    id: 'ins-quote-5',
    type: 'quote',
    title: 'Self-Care Wisdom',,
    quote: 'Almost everything will work again if you unplug it for a few minutes, including you.',
    author: 'Anne Lamott',
    backgroundColor: '#F8E8F0',
    tags: ['Self-Care', 'Rest', 'Wisdom'],
  },
  {
    id: 'ins-quote-6',
    type: 'quote',
    title: 'Aging Gracefully',,
    quote: 'The longer I live, the more beautiful life becomes.',
    author: 'Frank Lloyd Wright',
    backgroundColor: '#E8F0F8',
    tags: ['Aging', 'Life', 'Beauty'],
  },
  {
    id: 'ins-quote-7',
    type: 'quote',
    title: 'Movement and Joy',,
    quote: 'Movement is a medicine for creating change in a person's physical, emotional, and mental states.',
    author: 'Carol Welch',
    backgroundColor: '#F0F8E8',
    tags: ['Movement', 'Health', 'Change'],
  },
  {
    id: 'ins-quote-8',
    type: 'quote',
    title: 'Breath and Life',
    quote: 'Breath is the bridge which connects life to consciousness, which unites your body to your thoughts.',
    author: 'Thich Nhat Hanh',
    backgroundColor: '#F8F0E8',
    tags: ['Breath', 'Mindfulness', 'Connection'],
  }
];

// Functions to filter inspiration items
export const getInspirationByType = (type: 'image' | 'video' | 'quote'): InspirationItem[] => {
  return inspirationItems.filter(item => item.type === type);
};

export const getInspirationByTag = (tag: string): InspirationItem[] => {
  return inspirationItems.filter(item => item.tags?.includes(tag));
};

export const getRandomInspirationItem = (): InspirationItem => {
  const randomIndex = Math.floor(Math.random() * inspirationItems.length);
  return inspirationItems[randomIndex];
};

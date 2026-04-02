import fs from 'fs';
import path from 'path';

// Create a simple JSON file database for books
const booksData = {
  categories: [
    { id: 1, name: 'Leadership', slug: 'leadership', description: 'Inspire and lead with confidence' },
    { id: 2, name: 'Fiction', slug: 'fiction', description: 'Stories that captivate and transform' },
    { id: 3, name: 'Lifestyle', slug: 'lifestyle', description: 'Live intentionally and mindfully' },
    { id: 4, name: 'Self-Help', slug: 'self-help', description: 'Personal growth and development' }
  ],
  books: [
    // Leadership
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 15.99,
      image: '/books/atomic-habits.jpg',
      description: 'Transform your life through tiny, incremental changes. Learn the science of habit formation and how small actions compound into remarkable results.',
      category: 1,
      featured: true,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Start with Why',
      author: 'Simon Sinek',
      price: 18.99,
      image: '/books/start-with-why.jpg',
      description: 'Discover your purpose and inspire others. A revolutionary approach to leadership that explains why some organizations and leaders command loyalty.',
      category: 1,
      featured: true,
      rating: 4.7
    },
    {
      id: 3,
      title: 'Dare to Lead',
      author: 'Brené Brown',
      price: 17.99,
      image: '/books/dare-to-lead.jpg',
      description: 'Courageous leadership in a culture of fear. Learn how to be brave enough to lead with authenticity and vulnerability.',
      category: 1,
      featured: false,
      rating: 4.6
    },
    // Fiction
    {
      id: 4,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      price: 14.99,
      image: '/books/midnight-library.jpg',
      description: 'Between life and death lies a library where every choice creates a different life. Explore infinite possibilities and find meaning.',
      category: 2,
      featured: true,
      rating: 4.5
    },
    {
      id: 5,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      price: 16.99,
      image: '/books/project-hail-mary.jpg',
      description: 'A man wakes up on a spacecraft with no memory. Stranded in space, he must solve the greatest mystery to save humanity.',
      category: 2,
      featured: true,
      rating: 4.7
    },
    {
      id: 6,
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      price: 17.99,
      image: '/books/evelyn-hugo.jpg',
      description: 'A reclusive Hollywood icon finally tells her story. Glamour, mystery, and secrets unfold in this captivating novel.',
      category: 2,
      featured: false,
      rating: 4.6
    },
    // Lifestyle
    {
      id: 7,
      title: 'The Art of Minimalism',
      author: 'Joshua Fields Millburn & Ryan Nicodemus',
      price: 16.99,
      image: '/books/art-of-minimalism.jpg',
      description: 'Live with less, gain more. Learn how minimalism can lead to a more intentional, meaningful, and fulfilling life.',
      category: 3,
      featured: true,
      rating: 4.4
    },
    {
      id: 8,
      title: 'Eat, Pray, Love',
      author: 'Elizabeth Gilbert',
      price: 15.99,
      image: '/books/eat-pray-love.jpg',
      description: 'A journey of self-discovery across Italy, India, and Indonesia. Find balance, spirituality, and love within yourself.',
      category: 3,
      featured: false,
      rating: 4.3
    },
    // Self-Help
    {
      id: 9,
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      price: 14.99,
      image: '/books/power-of-now.jpg',
      description: 'Break free from suffering and live in the present moment. A transformative guide to inner peace and spiritual awakening.',
      category: 4,
      featured: true,
      rating: 4.7
    },
    {
      id: 10,
      title: 'Mindset',
      author: 'Carol S. Dweck',
      price: 16.99,
      image: '/books/mindset.jpg',
      description: 'Unlock your potential through the power of belief. Discover how a growth mindset can transform your life and success.',
      category: 4,
      featured: true,
      rating: 4.6
    },
    {
      id: 11,
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      price: 13.99,
      image: '/books/think-grow-rich.jpg',
      description: 'The classic guide to success and wealth creation. Learn the principles that have inspired millions to achieve their dreams.',
      category: 4,
      featured: false,
      rating: 4.5
    },
    {
      id: 12,
      title: 'Digital Minimalism',
      author: 'Cal Newport',
      price: 17.99,
      image: '/books/digital-minimalism.jpg',
      description: 'Reclaim your focus in a distracted world. Practical strategies for a healthier relationship with technology.',
      category: 3,
      featured: false,
      rating: 4.5
    }
  ]
};

// Write to a JSON file
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'books.json'),
  JSON.stringify(booksData, null, 2)
);

console.log('✓ Books database seeded successfully!');
console.log(`✓ ${booksData.categories.length} categories created`);
console.log(`✓ ${booksData.books.length} books created`);

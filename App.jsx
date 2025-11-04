import React, { useState, useMemo } from 'react';
import { Archive, Search, User, LogIn, Lock, Home, Users, Plus, Star } from 'lucide-react';

// --- MOCK DATA SETUP ---

// Simple unique ID generator for mock data
const generateId = () => Math.random().toString(36).substr(2, 9);

const initialUsers = [
  { id: 'u1', email: 'user@demo.com', name: 'Jane User', role: 'user', createdAt: new Date().toISOString() },
  { id: 'a1', email: 'admin@demo.com', name: 'Alex Admin', role: 'admin', createdAt: new Date().toISOString() },
];

const initialItems = [
  { id: 101, name: 'Quantum Blender 5000', category: 'Appliance', avgRating: 4.5 },
  { id: 102, name: 'Luminol Desk Lamp', category: 'Home Decor', avgRating: 4.8 },
  { id: 103, name: 'Ergo-Max Chair V2', category: 'Office Gear', avgRating: 4.1 },
  { id: 104, name: 'Aura Fitness Tracker', category: 'Wearable Tech', avgRating: 3.9 },
  { id: 105, name: 'Silent Coffee Grinder', category: 'Appliance', avgRating: 4.9 },
];

const initialReviews = [
  { id: 1, itemId: 101, userId: 'u1', userName: 'Jane User', rating: 5, comment: 'Incredibly powerful and easy to clean. Best blender I have ever owned!' },
  { id: 2, itemId: 101, userId: 'a1', userName: 'Alex Admin', rating: 4, comment: 'Good value, but the noise level is higher than expected. Still a great product overall.' },
  { id: 3, itemId: 102, userId: 'u1', userName: 'Jane User', rating: 5, comment: 'The lighting is perfect for late-night reading. Excellent design and build quality.' },
  { id: 4, itemId: 103, userId: 'a1', userName: 'Alex Admin', rating: 3, comment: 'Comfortable, but setting up the lumbar support was tricky. Could be improved.' },
  { id: 5, itemId: 105, userId: 'u1', userName: 'Jane User', rating: 5, comment: 'Truly silent! I can make my coffee without waking anyone up. A must-buy.' },
  { id: 6, itemId: 104, userId: 'a1', userName: 'Alex Admin', rating: 4, comment: 'Tracks accurately, but the app interface feels a bit clunky. Decent battery life.' },
];

// --- COMPONENTS ---

// Generic Button
const PrimaryButton = ({ children, onClick, disabled = false, icon: Icon, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition
      ${disabled
        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50 active:scale-[0.98]'}
      ${className}
    `}
  >
    {Icon && <Icon size={18} />}
    <span>{children}</span>
  </button>
);

// Star Rating Display
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        className={i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    );
  }
  return <div className="flex space-x-0.5">{stars} ({rating.toFixed(1)})</div>;
};

// Item Card Component (Button that shows review details)
const ItemCard = ({ item, reviews, onSelect }) => {
  const itemReviews = reviews.filter(r => r.itemId === item.id);
  const rating = itemReviews.length > 0
    ? (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length)
    : 0;

  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left p-4 bg-white hover:bg-indigo-50 transition duration-150 ease-in-out border border-slate-200 rounded-xl shadow-md flex justify-between items-center"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
        <p className="text-sm text-indigo-600">{item.category}</p>
      </div>
      <div className="flex flex-col items-end">
        <RatingStars rating={rating} />
        <span className="text-xs text-slate-500 mt-1">{itemReviews.length} Reviews</span>
      </div>
    </button>
  );
};

// --- VIEWS ---

// 1. Authentication View (Login/Signup)
const AuthPage = ({ onAuthSuccess, users, setUsers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Mock Login
      const user = users.find(u => u.email === email && u.password === password); // Password is not stored, but we'll check against a hardcoded demo set for simplicity
      if (email === 'user@demo.com' && password === '123' || email === 'admin@demo.com' && password === '123') {
        const loggedInUser = users.find(u => u.email === email);
        onAuthSuccess(loggedInUser);
      } else {
        setError('Invalid credentials. Try user@demo.com/123 or admin@demo.com/123.');
      }
    } else {
      // Mock Signup
      if (users.some(u => u.email === email)) {
        setError('This email is already registered.');
        return;
      }
      if (!email || !password || !name) {
        setError('All fields are required.');
        return;
      }

      const newUser = {
        id: generateId(),
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString(),
        // Note: Password is not stored securely for this demo, just for placeholder
        password: password
      };
      setUsers(prev => [...prev, newUser]);
      onAuthSuccess(newUser);
    }
  };

  const title = isLogin ? 'Sign In to Review Platform' : 'Create Account';
  const actionText = isLogin ? 'Login' : 'Sign Up';

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-slate-100">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-6 flex items-center justify-center space-x-2">
          <Archive className="text-indigo-600" size={32} />
          <span>{title}</span>
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

          <PrimaryButton type="submit" icon={isLogin ? LogIn : Plus} className="w-full">
            {actionText}
          </PrimaryButton>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Demo credentials: <strong>user@demo.com/123</strong> or <strong>admin@demo.com/123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Main User View (Search and Reviews)
const UserPage = ({ items, reviews }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const selectedItemReviews = useMemo(() => {
    if (!selectedItem) return [];
    return reviews.filter(r => r.itemId === selectedItem.id);
  }, [selectedItem, reviews]);

  // View switch: Show search results or selected item reviews
  if (selectedItem) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedItem(null)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 mb-6 text-sm font-medium"
        >
          &larr; Back to Item List
        </button>

        <h1 className="text-3xl font-bold text-slate-800">{selectedItem.name}</h1>
        <p className="text-md text-indigo-600 mb-6 border-b pb-4">{selectedItem.category}</p>

        <h2 className="text-xl font-semibold text-slate-700 mb-4">Customer Reviews ({selectedItemReviews.length})</h2>

        <div className="space-y-6">
          {selectedItemReviews.length > 0 ? (
            selectedItemReviews.map((review) => (
              <div key={review.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-slate-700">{review.userName}</div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="text-slate-600 italic">"{review.comment}"</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-slate-50 rounded-xl text-slate-500">
              No reviews yet for this product. Be the first!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Initial Search View
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Explore Products and Reviews</h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-lg transition"
        />
      </div>

      {/* Item List */}
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        {searchTerm ? `Results for "${searchTerm}"` : 'All Available Items'} ({filteredItems.length})
      </h2>
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} reviews={reviews} onSelect={setSelectedItem} />
          ))
        ) : (
          <div className="text-center p-12 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-md">
            No items found matching your search term.
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Admin View
const AdminPage = ({ users, setUsers, items, reviews }) => {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleCreateDemoUser = () => {
    if (!newUserName || !newUserEmail) return;

    if (users.some(u => u.email === newUserEmail)) {
      alert("Error: User with this email already exists.");
      return;
    }

    const newUser = {
      id: generateId(),
      email: newUserEmail,
      name: newUserName,
      role: 'user',
      createdAt: new Date().toISOString(),
      // For demo, we'll assume a standard demo password for all created users
      password: '123'
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center space-x-2 border-b pb-4">
        <Lock className="text-indigo-600" size={30} />
        <span>Admin Dashboard</span>
      </h1>

      {/* Demo User Creation Section */}
      <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center space-x-2">
          <Users size={20} />
          <span>Demo User Management</span>
        </h2>
        <p className="text-indigo-700 mb-4 text-sm">Create a new user instantly for demonstration purposes. Default password is '123'.</p>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="New User Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="flex-1 px-4 py-2 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="email"
            placeholder="New User Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <PrimaryButton onClick={handleCreateDemoUser} icon={Plus} className="w-full md:w-auto">
            Create Demo User
          </PrimaryButton>
        </div>
      </div>

      {/* Data Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">All Registered Users ({users.length})</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {users.map(user => (
              <li key={user.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center text-sm">
                <div className="truncate">
                  <span className="font-medium text-slate-800">{user.name}</span>
                  <span className="text-slate-500"> ({user.email})</span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                  {user.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Item and Review Stats */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Item and Review Stats</h2>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-4xl font-extrabold text-green-700">{items.length}</p>
              <p className="text-sm text-green-600">Total Items in Catalog</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-4xl font-extrabold text-yellow-700">{reviews.length}</p>
              <p className="text-sm text-yellow-600">Total Reviews Submitted</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-4xl font-extrabold text-indigo-700">{new Set(reviews.map(r => r.userId)).size}</p>
              <p className="text-sm text-indigo-600">Reviewers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// 4. Main App Container
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'user', 'admin'

  // Using useState for mock persistent data
  const [users, setUsers] = useState(initialUsers);
  const [items, setItems] = useState(initialItems);
  const [reviews, setReviews] = useState(initialReviews);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? 'admin' : 'user');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
  };

  // Nav Bar Component
  const Nav = () => (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <Archive className="text-indigo-600" size={28} />
        <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Review Demo Platform</h1>
        <h1 className="text-xl font-bold text-slate-800 sm:hidden">RDP</h1>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end text-sm">
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
            <span className="text-xs text-indigo-600 font-medium">({currentUser.role})</span>
          </div>

          {/* Navigation Buttons for Logged-in Users */}
          <PrimaryButton
            onClick={() => setCurrentView('user')}
            icon={Home}
            className={`!bg-transparent ${currentView === 'user' ? '!text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:text-indigo-600'} !shadow-none`}
          >
            Products
          </PrimaryButton>
          {currentUser.role === 'admin' && (
            <PrimaryButton
              onClick={() => setCurrentView('admin')}
              icon={Lock}
              className={`!bg-transparent ${currentView === 'admin' ? '!text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:text-indigo-600'} !shadow-none`}
            >
              Admin
            </PrimaryButton>
          )}

          <PrimaryButton onClick={handleLogout} icon={LogIn} className="!bg-red-500 hover:!bg-red-600 shadow-lg shadow-red-500/40">
            Logout
          </PrimaryButton>
        </div>
      )}
    </nav>
  );

  // Router Logic
  let content;
  switch (currentView) {
    case 'auth':
      content = <AuthPage onAuthSuccess={handleAuthSuccess} users={users} setUsers={setUsers} />;
      break;
    case 'user':
      content = <UserPage items={items} reviews={reviews} />;
      break;
    case 'admin':
      if (currentUser?.role === 'admin') {
        content = <AdminPage users={users} setUsers={setUsers} items={items} reviews={reviews} />;
      } else {
        // Fallback for non-admin users attempting to access the admin page
        content = (
          <div className="p-10 text-center text-red-600 bg-red-50 border border-red-200 m-10 rounded-xl">
            <Lock size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p>You must be an administrator to view this page.</p>
          </div>
        );
      }
      break;
    default:
      content = <div>404 Not Found</div>;
  }

  // Render the entire application structure
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {currentView !== 'auth' && <Nav />}
      <main className={currentView === 'auth' ? '' : 'pt-4 pb-12'}>
        {content}
      </main>
    </div>
  );
}

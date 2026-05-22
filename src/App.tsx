/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Star, 
  Plus, 
  Minus, 
  X,
  Pizza,
  Beef,
  Coffee,
  UtensilsCrossed,
  Fish,
  Drumstick,
  Flame
} from 'lucide-react';
import { FOOD_ITEMS } from './constants';
import { FoodItem, CartItem } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Баары', icon: <UtensilsCrossed size={20} /> },
    { id: 'burgers', name: 'Бургерлер', icon: <Beef size={20} /> },
    { id: 'pizza', name: 'Пицца', icon: <Pizza size={20} /> },
    { id: 'shawarma', name: 'Шаурма', icon: <Flame size={20} /> },
    { id: 'rolls', name: 'Ролдор', icon: <Fish size={20} /> },
    { id: 'chicken', name: 'Канаттар', icon: <Drumstick size={20} /> },
    { id: 'drinks', name: 'Суусундуктар', icon: <Coffee size={20} /> },
    { id: 'snacks', name: 'Закускалар', icon: <UtensilsCrossed size={20} /> },
  ];

  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sub-component for individual food items
  const FoodCard = ({ item, addToCart }: { item: FoodItem, addToCart: (i: FoodItem) => void }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      key={item.id}
      className="bg-white rounded-[2.5rem] p-6 premium-shadow border border-slate-100 group flex flex-col"
      id={`item-${item.id}`}
    >
      <div className="relative mb-6 overflow-hidden rounded-[2rem] h-52 bg-slate-100">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={14} className="text-orange-500 fill-orange-500" />
          <span className="text-xs font-bold">4.9</span>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-xl font-bold mb-2">{item.name}</h4>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-slate-400 text-xs block mb-1">Баасы</span>
          <span className="text-2xl font-bold text-orange-500">{item.price} сом</span>
        </div>
        <button 
          onClick={() => addToCart(item)}
          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-orange-500 transition-colors active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-orange-500 shadow-xl shadow-orange-500/10 transform -rotate-3 hover:rotate-0 transition-all cursor-pointer border border-orange-500/20">
              <Beef size={28} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black font-serif tracking-tighter text-slate-900 leading-[0.9]">
              MAK <span className="text-orange-500">BURGER</span>
            </h1>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1">
              PREMIUM FAST FOOD
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Издөө..." 
              className="bg-transparent border-none outline-none text-sm w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all active:scale-95"
            id="cart-button"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Banner */}
        <section className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900 p-12 text-white h-[400px] flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 max-w-lg"
          >
            <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Премиум сапат
            </span>
            <h2 className="text-5xl font-serif mb-6 leading-tight">
              Өзүңүзгө эң даамдуу тамактарды тартуулаңыз
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Эң жаңы азыктардан жасалган, тез жана ишенимдүү жеткирүү.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 group">
              Менюну көрүү
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          <div 
            className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-70 hidden md:block" 
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200)' }}
          />
        </section>

        {/* Categories */}
        <section className="mb-12 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-100'
                }`}
                id={`cat-${cat.id}`}
              >
                <span className={selectedCategory === cat.id ? 'text-orange-500' : 'text-slate-400'}>
                  {cat.icon}
                </span>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Menu Grid */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Биздин меню</h3>
            <span className="text-slate-400 text-sm">
              {selectedCategory === 'all' ? FOOD_ITEMS.length : filteredItems.length} тамак табылды
            </span>
          </div>

          <div className="space-y-16">
            {selectedCategory === 'all' ? (
              // Grouped display
              categories.filter(c => c.id !== 'all').map(category => {
                const categoryItems = FOOD_ITEMS.filter(item => {
                  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
                  return item.category === category.id && matchesSearch;
                });
                
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="scroll-mt-32" id={`section-${category.id}`}>
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                      <div className="bg-orange-500/10 text-orange-500 p-2 rounded-lg">
                        {category.icon}
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-slate-900">{category.name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryItems.map((item) => (
                        <FoodCard key={item.id} item={item} addToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              // Simple grid for specific category
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <FoodCard key={item.id} item={item} addToCart={addToCart} />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {filteredItems.length === 0 && (
              <div className="py-20 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Эч нерсе табылган жок</h4>
                <p className="text-gray-500">Башка сөз менен издеп көрүңүз же категорияны алмаштырыңыз.</p>
              </div>
            )}
          </div>
        </section>

        {/* Premium Dining Hall Section */}
        <section className="mb-20">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-20 flex flex-col justify-center">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">Биздин атмосфера</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  Заманбап премиум <br /> тез татым залы
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Биздин зал — бул заманбап тез татымдын жаңы деңгээли. Лофт стилиндеги дизайн, ыңгайлуу жумшак орундуктар жана тез тейлөө сиздин тамактанууңузду максималдуу комфорттуу кылат. 
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="border-l-2 border-orange-500 pl-4">
                    <h5 className="text-white font-bold mb-1">Заманбап Дизайн</h5>
                    <p className="text-slate-500 text-sm">Ультра-модерн стиль</p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-4">
                    <h5 className="text-white font-bold mb-1">Тез Тейлөө</h5>
                    <p className="text-slate-500 text-sm">Эң жогорку ылдамдык</p>
                  </div>
                </div>
                <button className="bg-white text-slate-900 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all w-fit">
                  Биз жөнүндө кененирээк
                </button>
              </div>
              <div className="relative min-h-[400px] lg:min-h-full">
                <img 
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Premium Fast Food Interior" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-slate-800">
              <div className="h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600093482702-c849992cc351?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-orange-500" />
                  <h2 className="text-2xl font-bold">Сиздин себетиңиз</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500">Себет азырынча бош</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <h5 className="font-bold mb-1">{item.name}</h5>
                        <p className="text-orange-500 font-bold mb-2">{item.price} сом</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-orange-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t space-y-4">
                  <div className="flex justify-between text-slate-500">
                    <span>Жалпы сумма</span>
                    <span>{cartTotal} сом</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Жеткирүү</span>
                    <span className="text-green-500 font-medium">Акысыз</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Төлөөгө:</span>
                    <span className="text-orange-500">{cartTotal} сом</span>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg active:scale-[0.98]">
                    Буйрутма берүү
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={24} className="text-orange-500" />
            <h1 className="text-xl font-bold font-serif">Mak Burger Express</h1>
          </div>
          <div className="flex gap-8 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-orange-500 transition-colors">Биз жөнүндө</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Меню</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Жеткирүү</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Байланыш</a>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 Mak Burger Express. Бардык укуктар корголгон.
          </p>
        </div>
      </footer>
    </div>
  );
}

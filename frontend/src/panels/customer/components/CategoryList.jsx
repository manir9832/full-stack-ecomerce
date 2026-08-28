

// import React from 'react';

// const CategoryList = ({ selectedCategory, onSelectCategory }) => {
//   const categories = [
//     'Vegetables & Fruits',
//     'Dairy & Breakfast',
//     'Snacks & Munchies',
//     'Beverages',
//     'Atta, Rice & Dal',
//     'Instant & Frozen Food',
//     'Personal Care',
//     'Household Essentials'
//   ];

//   return (
//     <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
//       <button
//         onClick={() => onSelectCategory('')}
//         className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
//           selectedCategory === ''
//             ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
//             : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'
//         }`}
//       >
//         <span>🛍️</span>
//         <span>All Products</span>
//       </button>

//       {categories.map((category, idx) => (
//         <button
//           key={idx}
//           onClick={() => onSelectCategory(category)}
//           className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
//             selectedCategory === category
//               ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
//               : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'
//           }`}
//         >
//           <span>🏷️</span>
//           <span>{category}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default CategoryList;




















import React from 'react';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { label: 'Grocery', value: 'Grocery', icon: '🌾' },
    { label: 'Dairy', value: 'Dairy', icon: '🥛' },
    { label: 'Snacks & Beverages', value: 'Snacks', icon: '🍿' },
    { label: 'Meat & Fish', value: 'Meat & Fish', icon: '🍗' },
    { label: 'Vegetables & Fruits', value: 'Vegetables', icon: '🥬' },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
      {/* All Products Button */}
      <button
        type="button"
        onClick={() => onSelectCategory('')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
          selectedCategory === ''
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'
        }`}
      >
        <span>🛍️</span>
        <span>All Products</span>
      </button>

      {/* Dynamic Exact Categories */}
      {categories.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onSelectCategory(cat.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${
            selectedCategory === cat.value
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500'
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
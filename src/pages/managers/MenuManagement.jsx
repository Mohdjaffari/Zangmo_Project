import React, { useState, useEffect } from 'react';
import '../../assets/styles/users.css';
import '../../assets/styles/pos.css';
import '../../assets/styles/add-item.css';
import ManagerSidebar from './ManagerSidebar';
import Topbar from '../../components/Topbar';

// Icons
const SearchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const ChevronDown = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>;
const BellIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const HelpIcon = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const SyncIcon = () => <svg width="16" height="16" fill="none" stroke="#fc8f34" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>;
const PlusIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const MartiniIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 2L12 14L22 2H2Z"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const WineIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 22H16"/><path d="M12 15V22"/><path d="M7 2H17V6C17 9.866 14.761 13 12 15C9.239 13 7 9.866 7 6V2Z"/></svg>;
const CoffeeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8H19C20.1046 8 21 8.89543 21 10V11C21 12.1046 20.1046 13 19 13H18"/><rect x="4" y="2" width="14" height="15" rx="2"/><path d="M4 17H18V19C18 20.6569 16.6569 22 15 22H7C5.34315 22 4 20.6569 4 19V17Z"/></svg>;
const XIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const StoreIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><rect x="3" y="3" width="18" height="8" rx="2"/></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const PrinterIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>;
const WifiIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;

// New Icons for Add Item View
const DragHandleIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
const CameraIcon = () => <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z"/><circle cx="12" cy="13" r="4"/><line x1="21" y1="9" x2="21.01" y2="9"/></svg>;
const EyeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const UtensilsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;
const EditIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const DistributionIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const InfoIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const ImageIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

function AddMenuItem({ onCancel, categories, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(() => {
    const firstCat = categories[0];
    return typeof firstCat === 'string' ? firstCat : (firstCat?.name || 'Starters');
  });
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Prime Beef Patty (200g)', type: 'MEAT' },
    { id: 2, name: 'Brioche Bun', type: 'GLUTEN' },
    { id: 3, name: 'Aged Cheddar Cheese', type: 'DAIRY' }
  ]);
  const [isSpicy, setIsSpicy] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [availableOnPOS, setAvailableOnPOS] = useState(true);
  const [onlineOrdering, setOnlineOrdering] = useState(false);
  const [quantityVal, setQuantityVal] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('grams');

  const [showAddIng, setShowAddIng] = useState(false);
  const [newIngName, setNewIngName] = useState('');
  const [newIngType, setNewIngType] = useState('MEAT');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddIngredient = () => {
    if (!newIngName.trim()) return;
    setIngredients([...ingredients, { id: Date.now(), name: newIngName, type: newIngType }]);
    setNewIngName('');
    setShowAddIng(false);
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter an Item Name.');
      return;
    }
    if (!price.trim()) {
      alert('Please enter a Price.');
      return;
    }

    let iconType = 'coffee';
    if (category.toLowerCase() === 'drinks') {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('martini') || lowerName.includes('cocktail') || lowerName.includes('margarita')) {
        iconType = 'martini';
      } else if (lowerName.includes('wine') || lowerName.includes('grigio') || lowerName.includes('chardonnay') || lowerName.includes('pinot')) {
        iconType = 'wine';
      }
    }

    onSave({
      id: Date.now(),
      name,
      category,
      price: price.includes('$') || price.includes('Rs') ? price : `Rs. ${price}`,
      description: description || 'No description provided.',
      status: availableOnPOS ? 'AVAILABLE' : 'SOLD OUT',
      image: selectedImagePreview || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
      iconType,
      ingredients,
      isSpicy,
      onlineOrdering,
      quantityVal: quantityVal ? parseFloat(quantityVal) : null,
      quantityUnit: quantityVal ? quantityUnit : ''
    });
  };

  return (
    <div className="add-menu-item-view">
      <div className="breadcrumb-pos">
        <span onClick={onCancel}>Menu</span> › <span onClick={onCancel}>Inventory</span> › <strong>Add New Item</strong>
      </div>
      
      <div className="pos-header-row" style={{marginBottom: '24px'}}>
        <div className="pos-title-block">
          <h1>Create Menu Item</h1>
          <p>Define the parameters for a new addition to the kitchen roster.</p>
        </div>
        <div className="pos-header-actions" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <button className="btn-outline" onClick={onCancel} style={{ background: 'white', border: '1px solid #c4c6cd', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#191c1e' }}>Discard Draft</button>
          <button className="btn-create-item" onClick={handleSave}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Item
          </button>
        </div>
      </div>

      <div className="add-item-container">
        <div className="add-item-col-left">
          <div className="card-panel">
            <div className="card-panel-header">
              <h3><InfoIcon /> General Information</h3>
            </div>
            <div className="card-panel-body">
              <div className="form-group">
                <label className="form-label">ITEM NAME <span className="required-dot" style={{color:'#ba1a1a'}}>*</span></label>
                <input type="text" className="input-field" placeholder="e.g., Z&M Signature Beef Burger" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="row">
                <div className="col">
                  <label className="form-label">CATEGORY <span className="required-dot" style={{color:'#ba1a1a'}}>*</span></label>
                  <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => {
                      const name = typeof cat === 'string' ? cat : cat.name;
                      return <option key={name} value={name}>{name}</option>;
                    })}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">PRICE (PKR) <span className="required-dot" style={{color:'#ba1a1a'}}>*</span></label>
                  <input type="text" className="input-field" placeholder="Rs. 0.00" value={price} onChange={(e) => setPrice(e.target.value)} style={{fontFamily: 'monospace'}} />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="form-label">QUANTITY VALUE</label>
                  <input type="number" className="input-field" placeholder="e.g. 500" value={quantityVal} onChange={(e) => setQuantityVal(e.target.value)} step="any" min="0" />
                </div>
                <div className="col">
                  <label className="form-label">QUANTITY UNIT</label>
                  <select className="input-field" value={quantityUnit} onChange={(e) => setQuantityUnit(e.target.value)}>
                    <option value="grams">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liters">Liters (L)</option>
                    <option value="ml">Milliliters (mL)</option>
                    <option value="pieces">Pieces (pcs)</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{marginBottom: 0}}>
                <label className="form-label">DESCRIPTION</label>
                <textarea className="input-field" rows="4" placeholder="Briefly describe the flavor profile, portion size, and presentation..." value={description} onChange={(e) => setDescription(e.target.value)} style={{resize: 'vertical'}}></textarea>
              </div>
            </div>
          </div>

          <div className="card-panel">
            <div className="card-panel-header" style={{justifyContent: 'space-between', borderBottom: 'none', paddingBottom: '0'}}>
              <h3><UtensilsIcon /> Ingredients & Allergens</h3>
              <span onClick={() => setShowAddIng(!showAddIng)} style={{color: '#b45309', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <PlusIcon /> Add Ingredient
              </span>
            </div>
            <div className="card-panel-body">
              {showAddIng && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', background: '#f7f9fc', padding: '12px', borderRadius: '6px', border: '1px solid #e0e3e6', alignItems: 'center' }}>
                  <input type="text" className="input-field" placeholder="Ingredient Name" value={newIngName} onChange={(e) => setNewIngName(e.target.value)} style={{ flex: 2, height: '36px' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Type (e.g. MEAT)" 
                    value={newIngType} 
                    onChange={(e) => setNewIngType(e.target.value.toUpperCase())} 
                    list="ingredient-types"
                    style={{ flex: 1, height: '36px' }} 
                  />
                  <datalist id="ingredient-types">
                    <option value="MEAT" />
                    <option value="GLUTEN" />
                    <option value="DAIRY" />
                    <option value="VEGAN" />
                    <option value="NUTS" />
                  </datalist>
                  <button className="btn-create-item" onClick={handleAddIngredient} style={{ height: '36px', padding: '0 16px' }}>Add</button>
                </div>
              )}

              {ingredients.map(ing => (
                <div className="drag-list-item" key={ing.id}>
                  <div className="drag-handle"><DragHandleIcon /></div>
                  <span className="title">{ing.name}</span>
                  <span 
                    className={`status-badge badge-${ing.type.toLowerCase()}`} 
                    style={{ 
                      marginRight: '8px',
                      backgroundColor: ['meat', 'gluten', 'dairy'].includes(ing.type.toLowerCase()) ? undefined : '#f1f5f9',
                      color: ['meat', 'gluten', 'dairy'].includes(ing.type.toLowerCase()) ? undefined : '#475569'
                    }}
                  >
                    {ing.type}
                  </span>
                  <button onClick={() => handleRemoveIngredient(ing.id)} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <TrashIcon />
                  </button>
                </div>
              ))}
              
              <div style={{ borderTop: '1px solid #e0e3e6', marginTop: '16px', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="spicy" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} style={{width: '16px', height: '16px', accentColor: '#b45309'}} />
                <label htmlFor="spicy" style={{fontSize: '13px', color: '#43474c', cursor: 'pointer', fontWeight: '500'}}>Flag as "Spicy" on Menu</label>
              </div>
            </div>
          </div>
        </div>

        <div className="add-item-col-right">
          <div className="card-panel">
            <div className="card-panel-header">
              <h3><ImageIcon /> Item Preview</h3>
            </div>
            <div className="card-panel-body">
              <label className="preview-upload-box" style={{
                backgroundImage: selectedImagePreview ? `url(${selectedImagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: selectedImagePreview ? '0' : '32px 20px',
                height: selectedImagePreview ? '180px' : 'auto',
                display: 'flex',
                cursor: 'pointer'
              }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                {!selectedImagePreview && (
                  <>
                    <CameraIcon />
                    <p style={{ margin: '0 0 4px 0' }}>Click to upload image</p>
                    <span style={{ fontSize: '11px', color: '#74777d' }}>PNG, JPG UP TO 5MB (16:9)</span>
                  </>
                )}
                {selectedImagePreview && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }} className="upload-overlay">
                    <CameraIcon />
                    <p style={{ margin: '4px 0 0 0', fontWeight: '600' }}>Change Image</p>
                  </div>
                )}
              </label>
              
              <div className="pos-preview-header">
                POS PREVIEW <EyeIcon />
              </div>
              <div className="pos-preview-inner" style={{
                backgroundImage: selectedImagePreview ? `url(${selectedImagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: selectedImagePreview ? 'transparent' : '#9ca3af'
              }}>
                <span className="pos-title">{name || 'Z&M Signature...'}</span>
                <span className="pos-price">{price ? (price.includes('$') || price.includes('Rs') ? price : `Rs. ${price}`) : 'Rs. 850'}</span>
              </div>
            </div>
          </div>

          <div className="card-panel">
            <div className="card-panel-header">
              <h3><DistributionIcon /> Distribution</h3>
            </div>
            <div className="card-panel-body">
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Available on POS</h4>
                  <p>VISIBLE FOR FLOOR STAFF</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={availableOnPOS} onChange={(e) => setAvailableOnPOS(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <h4>Online Ordering</h4>
                  <p>VISIBLE ON WEB/APP</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={onlineOrdering} onChange={(e) => setOnlineOrdering(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div style={{fontSize: '11px', fontWeight: '700', color: '#43474c', marginTop: '24px', marginBottom: '8px', letterSpacing: '0.5px'}}>TAX CONFIGURATION</div>
              <div className="tax-box">
                <div style={{fontWeight: '700', fontSize: '16px'}}>%</div>
                <div className="tax-info">
                  <h4>Standard GST (17%)</h4>
                  <p>Default government tax</p>
                </div>
                <EditIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuManagement() {
  const [currentView, setCurrentView] = useState('list');
  const [activeTab, setActiveTab] = useState('All Items');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };
  
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('zangmo_menu_categories');
    return saved ? JSON.parse(saved) : [
      { name: 'Starters', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop', description: 'Light dishes to kick off your dining experience' },
      { name: 'Mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop', description: 'Z&M Kitchen signature entrees and floor specials' },
      { name: 'Desserts', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop', description: 'Delectable sweets to finalize your meal' },
      { name: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop', description: 'Refreshing mocktails, cold brews, and premium beverages' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zangmo_menu_categories', JSON.stringify(categories));
  }, [categories]);

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('zangmo_menu_items');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
      name: 'Crispy Calamari',
      category: 'Starters',
      price: 'PKR 1,450.00',
      description: 'Fresh local squid, lightly battered with lemon aioli an...',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1599487405270-802ffcc9ab37?w=600&auto=format&fit=crop',
      quantityVal: 250,
      quantityUnit: 'grams'
    },
    {
      id: 2,
      name: 'Truffle Arancini',
      category: 'Starters',
      price: 'PKR 1,600.00',
      description: 'Wild mushroom risotto balls infused with black truffle oil...',
      status: 'SOLD OUT',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop',
      quantityVal: 4,
      quantityUnit: 'pieces'
    },
    {
      id: 3,
      name: 'Grilled Salmon',
      category: 'Mains',
      price: 'PKR 2,850.00',
      description: 'Atlantic salmon, honey glaze, seasonal greens, and saffro...',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop',
      quantityVal: 220,
      quantityUnit: 'grams'
    },
    {
      id: 4,
      name: 'Prime Ribeye',
      category: 'Mains',
      price: 'PKR 4,200.00',
      description: '300g grain-fed ribeye, peppercorn sauce, hand-cu...',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
      quantityVal: 300,
      quantityUnit: 'grams'
    },
    {
      id: 5,
      name: 'Spinach Ravioli',
      category: 'Mains',
      price: 'PKR 2,200.00',
      description: 'Handmade pasta filled with organic ricotta and spinach ...',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop',
      quantityVal: 200,
      quantityUnit: 'grams'
    },
    {
      id: 6,
      name: 'Classic Margherita',
      category: 'Mains',
      price: 'PKR 1,850.00',
      description: 'Stone-baked with buffalo mozzarella, san marzano...',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop',
      quantityVal: 1,
      quantityUnit: 'pieces'
    },
    {
      id: 7,
      name: 'Lava Cake',
      category: 'Desserts',
      price: 'PKR 1,200.00',
      description: 'Dark chocolate cake with a molten center and vanilla bean ice cream.',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop',
      quantityVal: 120,
      quantityUnit: 'grams'
    },
    {
      id: 8,
      name: 'NY Cheesecake',
      category: 'Desserts',
      price: 'PKR 1,150.00',
      description: 'Classic creamy cheesecake with a buttery crust and strawberry compote.',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1524351199678-961d224b1a45?w=600&auto=format&fit=crop',
      quantityVal: 150,
      quantityUnit: 'grams'
    },
    {
      id: 9,
      name: 'Espresso Martini',
      category: 'Drinks',
      price: 'PKR 1,800.00',
      description: 'Signature blend, vodka, coffee liqueur',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop',
      iconType: 'martini',
      quantityVal: 180,
      quantityUnit: 'ml'
    },
    {
      id: 10,
      name: 'Pinot Grigio',
      category: 'Drinks',
      price: 'PKR 1,400.00',
      description: 'Veneto, Italy (Glass)',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop',
      iconType: 'wine',
      quantityVal: 175,
      quantityUnit: 'ml'
    },
    {
      id: 11,
      name: 'Iced Latte',
      category: 'Drinks',
      price: 'PKR 750.00',
      description: 'Cold brew, milk, syrup',
      status: 'SOLD OUT',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop',
      iconType: 'coffee',
      quantityVal: 350,
      quantityUnit: 'ml'
    },
    {
      id: 12,
      name: 'Mint Lemonade',
      category: 'Drinks',
      price: 'PKR 450.00',
      description: 'Fresh mint, lime juice, and soda crushed with ice.',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
      iconType: 'coffee',
      quantityVal: 400,
      quantityUnit: 'ml'
    },
    {
      id: 13,
      name: 'Strawberry Shake',
      category: 'Drinks',
      price: 'PKR 650.00',
      description: 'Fresh organic strawberries blended with premium ice cream.',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop',
      iconType: 'coffee',
      quantityVal: 450,
      quantityUnit: 'ml'
    }
  ];
});

  useEffect(() => {
    localStorage.setItem('zangmo_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatStatus, setNewCatStatus] = useState('Active');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  const handleCategoryImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCatImage(URL.createObjectURL(file));
    }
  };
  const handleSaveItem = (newItem) => {
    setMenuItems([newItem, ...menuItems]);
    triggerToast(`Created item: ${newItem.name}`);
    setCurrentView('list');
  };

  const handleRemoveItem = (itemId) => {
    const itemToDelete = menuItems.find(i => i.id === itemId);
    if (window.confirm(`Are you sure you want to remove "${itemToDelete?.name || 'this item'}"?`)) {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      triggerToast("Item removed successfully.");
    }
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    const catNameNormalized = newCatName.trim();
    const exists = categories.some(cat => (typeof cat === 'string' ? cat : cat.name).toLowerCase() === catNameNormalized.toLowerCase());
    
    if (!exists) {
      setCategories([
        ...categories,
        {
          name: catNameNormalized,
          image: newCatImage.trim() || 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop',
          description: newCatDesc.trim() || 'Delicious additions created fresh daily.'
        }
      ]);
      triggerToast(`Category "${catNameNormalized}" created!`);
    } else {
      triggerToast(`Category "${catNameNormalized}" already exists.`);
    }

    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatImage('');
    setNewCatDesc('');
  };

  const renderSection = (cat) => {
    let catItems = menuItems.filter(item => item.category.toLowerCase() === cat.toLowerCase());
    
    if (searchQuery.trim()) {
      catItems = catItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (catItems.length === 0) return null;

    const categoryObj = categories.find(c => (typeof c === 'string' ? c : c.name).toLowerCase() === cat.toLowerCase());
    const catImage = categoryObj?.image || 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&auto=format&fit=crop';
    const catDesc = categoryObj?.description || 'Delicious options created fresh daily.';

    return (
      <div className="menu-section" key={cat} style={{ marginBottom: '40px' }}>
        <div 
          style={{
            position: 'relative',
            height: '180px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '24px',
            backgroundImage: `url(${catImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.15)'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)',
              zIndex: 1
            }}
          />
          <div 
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '24px',
              color: 'white',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '-0.5px', color: 'white' }}>{cat}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0', textShadow: '0 1px 2px rgba(0,0,0,0.4)', fontWeight: '500' }}>{catDesc}</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', padding: '6px 12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)' }}>{catItems.length} {catItems.length === 1 ? 'Item' : 'Items'}</span>
          </div>
        </div>
        
        {cat.toLowerCase() === 'desserts' ? (
          <div className="menu-grid-horizontal">
            {catItems.map(item => (
              <div className="menu-card-horizontal" key={item.id} style={{ position: 'relative' }}>
                <div className="h-img-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="h-card-body">
                  <div>
                    <div className="h-header-row">
                      <h3>{item.name}</h3>
                      <span className="h-price">{item.price}</span>
                    </div>
                    {item.quantityVal && (
                      <div className="item-quantity-badge" style={{ fontSize: '11px', color: '#b45309', fontWeight: '700', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Qty: {item.quantityVal} {item.quantityUnit}
                      </div>
                    )}
                    <p className="card-desc" style={{marginTop: '8px'}}>{item.description}</p>
                  </div>
                  <div className="h-footer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ba1a1a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: '#fef2f2',
                        transition: 'all 0.2s'
                      }}
                      title="Remove Item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cat.toLowerCase() === 'drinks' ? (
          <div className="menu-grid-list">
            {catItems.map(item => (
              <div className="menu-card-list" key={item.id} style={{ position: 'relative' }}>
                <div className="l-img-box" style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="l-details">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.name}
                    {item.quantityVal && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                        ({item.quantityVal} {item.quantityUnit})
                      </span>
                    )}
                  </h3>
                  <p>{item.description}</p>
                </div>
                <div className="l-price-status" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexDirection: 'row' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="l-price" style={{ color: item.status === 'SOLD OUT' ? '#74777d' : undefined }}>{item.price}</span>
                    <span className={`l-status ${item.status === 'SOLD OUT' ? 'out' : 'in-stock'}`}>
                      {item.status === 'SOLD OUT' ? 'Out' : 'In Stock'}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ba1a1a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      borderRadius: '6px',
                      backgroundColor: '#fef2f2',
                      transition: 'all 0.2s'
                    }}
                    title="Remove Item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="menu-grid">
            {catItems.map(item => (
              <div className="menu-card" key={item.id} style={{ position: 'relative' }}>
                <div className="card-img-wrapper">
                  <img src={item.image} alt={item.name} />
                  {item.status === 'SOLD OUT' && (
                    <div className="sold-out-backdrop">
                      <div className="sold-out-pill">SOLD OUT</div>
                    </div>
                  )}
                  <div className="card-price-overlay">{item.price}</div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(254, 242, 242, 0.9)',
                      border: '1px solid #fee2e2',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s',
                      zIndex: 2
                    }}
                    title="Remove Item"
                    className="delete-item-btn"
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div className="card-body">
                  <div className="card-title-row">
                    <h3>{item.name}</h3>
                    <div className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </div>
                  </div>
                  {item.quantityVal && (
                    <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Portion: {item.quantityVal} {item.quantityUnit}
                    </div>
                  )}
                  <p className="card-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pos-container">
      <ManagerSidebar activePage="menu-management" />
      
      <div className="pos-content">
        <Topbar title="Menu Management" />

        <div className="pos-page-content">
          {currentView === 'list' ? (
            <>
              <div className="pos-header-row">
                <div className="pos-title-block">
                  <h1>Menu Management</h1>
                  <p>Manage your kitchen's menu items, pricing, and availability.</p>
                </div>
                <div className="pos-header-actions">
                  <div className="sync-indicator">
                    <SyncIcon /> Menu Syncing with POS Terminals...
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline" onClick={() => setIsCategoryModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: 'white', border: '1px solid #c4c6cd', color: '#191c1e' }}>
                      <PlusIcon /> ADD CATEGORY
                    </button>
                    <button className="btn-create-item" onClick={() => setCurrentView('add')}>
                      <PlusIcon /> CREATE NEW ITEM
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e3e6', marginBottom: '32px' }}>
                <div className="pos-tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
                  {['All Items', ...categories.map(c => typeof c === 'string' ? c : c.name)].map(tab => (
                    <div 
                      key={tab}
                      className={`pos-tab ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(tab);
                      }}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                <div className="pos-search-wrapper" style={{ margin: 0, height: '38px', width: '280px' }}>
                  <SearchIcon />
                  <input type="text" placeholder="Search menu items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>

              <div className="menu-sections-wrapper">
                {activeTab === 'All Items' ? (
                  <>
                    {categories
                      .map(c => typeof c === 'string' ? c : c.name)
                      .filter(cat => cat !== 'Desserts' && cat !== 'Drinks')
                      .map(cat => renderSection(cat))}
                    {(categories.some(c => (typeof c === 'string' ? c : c.name) === 'Desserts') || categories.some(c => (typeof c === 'string' ? c : c.name) === 'Drinks')) && (
                      <div className="bottom-sections-row">
                        {categories.some(c => (typeof c === 'string' ? c : c.name) === 'Desserts') && renderSection('Desserts')}
                        {categories.some(c => (typeof c === 'string' ? c : c.name) === 'Drinks') && renderSection('Drinks')}
                      </div>
                    )}
                  </>
                ) : (
                  renderSection(activeTab)
                )}
              </div>
            </>
          ) : (
            <AddMenuItem 
              onCancel={() => setCurrentView('list')} 
              categories={categories}
              onSave={handleSaveItem}
            />
          )}
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Category</h3>
              <button className="close-btn" onClick={() => setIsCategoryModalOpen(false)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">CATEGORY NAME <span className="required-dot">*</span></label>
                <input type="text" className="input-field" placeholder="e.g. Seasonal Specials" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label className="form-label">CATEGORY COVER IMAGE</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label className="btn-outline" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    color: '#475569'
                  }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleCategoryImageChange} 
                    />
                    📁 Choose File
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {newCatImage ? 'Image selected' : 'No file chosen'}
                  </span>
                </div>
                
                {/* Live Preview & Stock suggestions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                  {newCatImage && (
                    <div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                      <img src={newCatImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span 
                      onClick={() => setNewCatImage('https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop')} 
                      style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #e2e8f0', fontWeight: '600' }}
                    >
                      🍢 Starters
                    </span>
                    <span 
                      onClick={() => setNewCatImage('https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop')} 
                      style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #e2e8f0', fontWeight: '600' }}
                    >
                      🍔 Mains
                    </span>
                    <span 
                      onClick={() => setNewCatImage('https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop')} 
                      style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #e2e8f0', fontWeight: '600' }}
                    >
                      🍰 Desserts
                    </span>
                    <span 
                      onClick={() => setNewCatImage('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop')} 
                      style={{ fontSize: '10px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #e2e8f0', fontWeight: '600' }}
                    >
                      🍹 Drinks
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">STATUS</label>
                <select className="input-field" value={newCatStatus} onChange={(e) => setNewCatStatus(e.target.value)}>
                  <option>Active</option>
                  <option>Hidden</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">INTERNAL DESCRIPTION</label>
                <textarea className="input-field" rows="2" placeholder="Brief description of this menu section..." value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} style={{resize: 'vertical'}}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
              <button className="btn-create" onClick={handleCreateCategory}>Create Category</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

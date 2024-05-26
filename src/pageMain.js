import * as React from 'react';
import './style.css';
import Menu from "./pageMenu.js";
import Popularitem from "./pagePopular.js"
import Checkout from './pageCart.js';
import menuItem from './menuItems.js';


export default function App() {

    const [isMainHovered, setIsMainHovered] = React.useState(false);
    const [isMenuHovered, setIsMenuHovered] = React.useState(false);
    const [isCartHovered, setIsCartHovered] = React.useState(false);
    const [isAboutUsHovered, setIsAboutUsHovered] = React.useState(false);

    const [showPopularItem, setshowPopularItem] = React.useState(true);
    const toggleshowPopularItem = () => {
        setshowPopularItem(true);
        setshowMenu(false);
        setShowCart(false);
        setShowAboutUs(false);
    };

    const [showMenu, setshowMenu] = React.useState(false);
    const toggleshowMenu = () => {
        setshowPopularItem(false);
        setshowMenu(true);
        setShowCart(false);
        setShowAboutUs(false);
    };

    const [showCart, setShowCart] = React.useState(false);
    const toggleshowCart = () => {
        setshowPopularItem(false);
        setshowMenu(false);
        setShowCart(true);
        setShowAboutUs(false);
    };

    const [showAboutUs, setShowAboutUs] = React.useState(false);
    const toggleShowAboutUs = () => {
        setshowPopularItem(false);
        setshowMenu(false);
        setShowAboutUs(true);
        setShowCart(false)
    };



    const [searchItem, setSearchItem] = React.useState([]);

    const SearchQuery = (query) => {
        if (!query) {
            document.getElementsByClassName('search-result')[0].style.display = 'none';
            setSearchItem([]);
            return;
        } else {
            document.getElementsByClassName('search-result')[0].style.display = 'block';
            const lowercaseQuery = query.toLowerCase();
            const filteredItems = menuItem.filter((item) =>
                item.name.toLowerCase().includes(lowercaseQuery)
            );
            setSearchItem(filteredItems);
        }
    }


    const [selectedItem, setSelectedItem] = React.useState(null);
    const [cart, setCart] = React.useState(JSON.parse(localStorage.getItem('cart')) || []);



    const updateCart = (cartData) => {
        setCart(cartData);
        localStorage.setItem('cart', JSON.stringify(cartData));
    };

    const increaseItemInCart = (newItem) => {
        const existingItem = cart.find((item) => item.name === newItem.name);
        if (existingItem) {
            if (existingItem.quantity < newItem.availablequantity) {
                const updatedCart = cart.map((item) =>
                    item.name === newItem.name ? { ...item, quantity: item.quantity + 1 } : item
                );
                updateCart(updatedCart);
            } else {
                return alert(`Max quantity reached for ${newItem.name}`)
            }
        } else {
            updateCart([...cart, { ...newItem, quantity: 1 }]);
        }
    }

    const decreaseItemInCart = (newItem) => {
        const existingItem = cart.find((item) => item.name === newItem.name);
        if (existingItem) {
            if (existingItem.quantity === 1) {
                const updatedCart = cart.filter((item) => item.name !== newItem.name);
                updateCart(updatedCart);
                console.log(`deleted ${newItem.name} from cart`);
            } else {
                const updatedCart = cart.map((item) =>
                    item.name === newItem.name ? { ...item, quantity: item.quantity - 1 } : item
                );
                updateCart(updatedCart);
            }
        }
    };

    const handleOpenDialog = (item) => {
        setSelectedItem(item);
    };

    const handleCloseDialog = () => {
        setSelectedItem(null);
        document.getElementsByClassName('searchbar')[0].value = "";
        document.getElementsByClassName('search-result')[0].style.display = 'none';
    };


    return (

        <>
            {selectedItem && <div className="darken-page" />}

            <div className="app-div">
                <img src="logo.png" alt='logo' className='app-logo' />
                <p className="app-title">Cheap Grocery Store</p>
                <div className='search-container'>
                    <div>
                        <input className="searchbar" placeholder='search' onChange={e => SearchQuery(e.target.value)}></input>
                        <div className='search-result'>
                            {searchItem.map((item) => (
                                <p className='search-text' onClick={() => handleOpenDialog(item)} >{item.name}</p>
                            ))}
                        </div>

                        <div>

                            {selectedItem !== null && (

                                <div className="popupPage">
                                    <button className="confirm" onClick={handleCloseDialog}>
                                        Confirm
                                    </button>
                                    <div className="header">{selectedItem.name}</div>
                                    <div>
                                        <img src={selectedItem.image} className="cart-image" alt={selectedItem.name} />
                                    </div>
                                    <div className="actions">
                                        <button className="cart-button" onClick={() => decreaseItemInCart(selectedItem)}>
                                            -
                                        </button>
                                        <div className="cart-quantity">{cart.find((cartItem) => cartItem.name === selectedItem.name)?.quantity || 0}</div>
                                        <button className="cart-button" onClick={() => increaseItemInCart(selectedItem)}>
                                            +
                                        </button>
                                    </div>
                                </div>
                            )
                            }


                        </div>

                    </div>


                </div>

                <p
                    className={isMainHovered ? 'app-main-hovered' : 'app-main'}
                    onClick={toggleshowPopularItem}
                    onMouseEnter={() => setIsMainHovered(true)}
                    onMouseLeave={() => setIsMainHovered(false)}
                >Main 🔥
                </p>
                <p
                    className={isMenuHovered ? 'app-menu-hovered' : 'app-menu'}
                    onClick={toggleshowMenu}
                    onMouseEnter={() => setIsMenuHovered(true)}
                    onMouseLeave={() => setIsMenuHovered(false)}
                >Menu 📋
                </p>
                <p
                    className={isCartHovered ? 'app-cart-hovered' : 'app-menu'}
                    onClick={toggleshowCart}
                    onMouseEnter={() => setIsCartHovered(true)}
                    onMouseLeave={() => setIsCartHovered(false)}
                >Cart 🛒
                </p>
                <p
                    className={isAboutUsHovered ? 'app-aboutus-hovered' : 'app-aboutus'}
                    onClick={toggleShowAboutUs}
                    onMouseEnter={() => setIsAboutUsHovered(true)}
                    onMouseLeave={() => setIsAboutUsHovered(false)}
                >AboutUs ❤️
                </p>
            </div>


            {showPopularItem ? (
                <div className="app-mainContent">
                    <p className='app-special-sign'>🔥🔥🔥Today's Special 🔥🔥🔥</p>
                    <p className='app-special-sign'>🔥🔥🔥Cheap Cheap Cheap 🔥🔥🔥</p>

                    <Popularitem />
                </div>
            ) : (
                <></>
            )}


            {showMenu ? (
                <div className="app-menuContent">
                    <Menu />
                </div>
            ) : (
                <></>
            )}

            {showCart ? (
                <div className="app-cartContent">
                    <Checkout />
                </div>
            ) : (
                <></>
            )}

            {showAboutUs ? (
                <div className="app-aboutusContent">
                    <p className='checkout-header'>About Us</p>

                    <p>❤️Thank you very much for visiting my first website ❤️</p>
                    <p>Contact Number: 0424 470 533</p>
                    <p>Location: Lane Cove 2066</p>
                    <p>Email Address: jessiechenqazwsx@gmail.com</p>
                    <p>Contact Person: Jessie Mingxia Chen</p>


                </div>
            ) : (
                <></>
            )}

        </>
    );
}
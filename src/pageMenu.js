import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { brown } from '@mui/material/colors';
import menuLabels from './menuLabel';
import menuItem from './menuItems';
import Card from 'react-bootstrap/Card';




const theme = createTheme({
    palette: {
        primary: {
            light: brown[500],
            main: '#482b13',
            dark: '#482b13',
            contrastText: '#fff',
        },
    },
});





export default function Menu() {
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
    };



    const [activeTab, setActiveTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            {selectedItem && <div className="darken-page" />}
            <ThemeProvider theme={theme}>
                <div>
                    <Tabs
                        value={activeTab}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs"
                        sx={{ backgroundColor: 'lightyellow', maxWidth: '1000px' }}
                    >
                        {menuLabels.map((tabName, index) => (
                            <Tab
                                sx={{ fontFamily: 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace', textTransform: 'none' }}
                                key={index}
                                label={tabName}

                            />
                        ))}
                    </Tabs >
                    <div className='menu-container'>
                        {menuItem.filter((item) => item.labels === menuLabels[activeTab]).map((item) => {
                            const cartItem = cart.find((cartItem) => cartItem.name === item.name);
                            const quantity = cartItem ? cartItem.quantity : 0;

                            return (
                                <div className="popular-card" key={item.name}>
                                    <Card>
                                        <Card.Img variant="top" src={item.image} className="popular-card-image" />
                                        <Card.Body className="popular-card-body">
                                            <Card.Text className="popular-card-title">{item.name}</Card.Text>
                                            <Card.Text className="popular-card-content">
                                                ${parseFloat(item.price).toFixed(2)} / {item.weight}
                                            </Card.Text>
                                            {item.availablequantity > 0 ? (
                                                <>
                                                    <button onClick={() => handleOpenDialog(item)} className="popular-card-button">
                                                        Add to Cart
                                                    </button>
                                                    {selectedItem === item && (
                                                        <div className="popupPage">
                                                            <button className="confirm" onClick={handleCloseDialog}>
                                                                Confirm
                                                            </button>
                                                            <div className="header">{item.name}</div>
                                                            <div>
                                                                <img src={item.image} className="cart-image" alt={item.name} />
                                                            </div>
                                                            <div className="actions">
                                                                <button className="cart-button" onClick={() => decreaseItemInCart(item)}>
                                                                    -
                                                                </button>
                                                                <div className="cart-quantity">{quantity}</div>
                                                                <button className="cart-button" onClick={() => increaseItemInCart(item)}>
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <button disabled className="popular-card-button">
                                                    Out of Stock
                                                </button>)
                                            }
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </ThemeProvider>
        </>
    );

}

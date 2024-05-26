import * as React from 'react';
import './style.css';
import Card from 'react-bootstrap/Card';

function PagePopular() {
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [menuItem, setMenuItem] = React.useState([]);
    const [cart, setCart] = React.useState(JSON.parse(localStorage.getItem('cart')) || []);

    React.useEffect(() => {
        try {
            fetch('http://localhost:4000/api/products', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setMenuItem(data.allProducts);
                })
    
        } catch {
            console.log("Error getting items from mongo db")
            setMenuItem([]);
        }
    }, []);


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

    return (
        <>
            {selectedItem && <div className="darken-page" />}
            <div className="popular-cards">
                {menuItem.filter((item) => item.popularItem === true).map((item) => {
                    const cartItem = cart.find((cartItem) => cartItem.name === item.name);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        
                        <div className="popular-card" key={item.name}>
                            <Card>
                                <Card.Img variant="top" src={item.image} className="popular-card-image" />
                                <Card.Body className="popular-card-body">
                                    <Card.Text className="popular-card-title">{item.name}</Card.Text>
                                    <Card.Text className="popular-card-content">
                                        ${parseFloat(item.price).toFixed(2)} / {item.weight} <br />
                                        Available: {item.availablequantity}
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
        </>
    );
}

export default PagePopular;
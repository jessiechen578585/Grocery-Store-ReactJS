import React from "react";
import './style.css';
import menuItem from './menuItems';


export default function Checkout() {
    const [cart, setCart] = React.useState(JSON.parse(localStorage.getItem('cart')) || []);


    // const [selectedItem, setSelectedItem] = React.useState(null);

    const updateCart = (cartData) => {
        setCart(cartData);
        localStorage.setItem('cart', JSON.stringify(cartData));
    };

    const increaseItemInCart = (newItem) => {
        const existingItem = cart.find((item) => item.name === newItem.name);
        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.name === newItem.name ? { ...item, quantity: item.quantity + 1 } : item
            );
            updateCart(updatedCart);
        } else {
            updateCart([...cart, { ...newItem, quantity: 1 }]);
        }
    };



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

    const removeItemInCart = (itemToRemove) => {
        const updatedCart = cart.filter((item) => item.name !== itemToRemove.name);
        updateCart(updatedCart);
    };

    const removeAllItemInCart = () => {
        updateCart([]);
    };


    const [checkoutConfirmed, setCheckoutConfirmed] = React.useState(false);
    const checkout = () => {
        cart.length === 0 ? alert("Cart is empty, please continue your shopping.") : setCheckoutConfirmed(true);
    };

    const [customerInfo, setCustomerInfo] = React.useState({
        fullName: '',
        email: '',
        address: '',
    });

    const createOrder = (cart, customerInfo) => {
        console.log(customerInfo)
        console.log(cart)

        fetch('http://localhost:4000/api/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname: customerInfo.fullName,
                email: customerInfo.email,
                address: customerInfo.address,
                orderdetail: 
                    cart.map((item) => {
                        return {
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity
                        }
                    })
                ,
                totalprice: totalPrice
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }

    const updateProducts = (cart) => {
        cart.forEach((item) => {
            fetch(`http://localhost:4000/api/updateProducts/${item.name}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: item.quantity
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
        })
    }

    const handleCheckout = () => {


        createOrder(cart, customerInfo);
        updateProducts(cart);

        setCheckoutConfirmed(false);
        updateCart([])

        setCustomerInfo({
            fullName: '',
            email: '',
            address: '',
        })
    };



    var totalPrice = 0;

    return (
        <>
            <div >
                <p className="checkout-header">Review Your Order</p>

                {cart.filter((item) => item.quantity > 0).map((item) => {
                    const itemName = item.name
                    const itemQuantity = item.quantity
                    const itemPrice = (itemQuantity * menuItem.find((item) => item.name === itemName).price);
                    totalPrice += itemPrice;

                    return (
                        <div className="checkout-items">
                            <div className="checkout-item">
                                <img alt="item" src={menuItem.find((item) => item.name === itemName).image} className="checkout-item-image" />
                            </div>

                            <div className="checkout-item-details">
                                <div> {itemName} </div>
                                <div> <br></br></div>
                                <div> ${parseFloat(menuItem.find((item) => item.name === itemName).price).toFixed(2)} / {menuItem.find((item) => item.name === itemName).weight}</div>
                                <div className="checkout-item-button">
                                    <div>
                                        <button className="cart-button" onClick={() => decreaseItemInCart(item)}>
                                            -
                                        </button>
                                    </div>
                                    <div className="cart-quantity">{itemQuantity}</div>
                                    <div>
                                        <button className="cart-button" onClick={() => increaseItemInCart(item)}>
                                            +
                                        </button>
                                    </div>
                                </div>

                            </div>



                            <div className="checkout-item-price">
                                Price: ${itemPrice.toFixed(2)}
                                <button className="cart-remove-button" onClick={() => removeItemInCart(item)}>
                                    Remove Item
                                </button>
                            </div>
                        </div>


                    )
                })}
                <pre className="checkout-header">Total price:       ${totalPrice.toFixed(2)}</pre>
                <button className="checkout-button" onClick={() => removeAllItemInCart()}> Clear All</button>
                <button className="checkout-button" onClick={() => checkout()}> Process to checkout</button>
                <div>
                    {checkoutConfirmed &&
                        <>
                            <div className="confirm-section">

                                <div className="confirm-fullname">
                                    Full Name
                                    <input placeholder='Full Name' value={customerInfo.fullName} onChange={e => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}></input>
                                </div>

                                <div className="confirm-email">
                                    Email
                                    <input placeholder='Email' value={customerInfo.email} onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}></input>
                                </div>

                                <div className="confirm-address">
                                    Address
                                    <input placeholder='Address' value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}></input>
                                </div>

                            </div>
                            <button className="checkout-button" onClick={() => setCheckoutConfirmed(false)}>Continue Shopping</button>
                            <button className="checkout-button" onClick={handleCheckout}>Checkout</button>




                        </>}
                </div>
            </div>
        </>

    )
}

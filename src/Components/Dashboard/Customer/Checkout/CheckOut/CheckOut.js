import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../../../App';
import CheckCart from '../CheckCart/CheckCart/CheckCart';
import PaymentInfo from '../PaymentInfo/PaymentInfo/PaymentInfo';
import ShippingDetail from '../ShippingDetail/ShippingDetail';
import './CheckOut.css';

const CheckOut = () => {
    const {loggedInUser} = useContext(UserContext);
    const [shippingData, setShippingData] = useState({});
    const [checkCart, setCheckCart] = useState({foodData:[]});
    const [paymentData, setPaymentData] = useState({});

    const token =  localStorage.getItem('token');
    const history = useHistory();
let handleConfirm;
if(shippingData.name){
    if(checkCart.foodData.length > 0 && checkCart.totalFoodMoneyDetail){
        if(paymentData.paymentMethod){
            const orderDetail = {
                shippingData: {...shippingData},
                checkCart: {...checkCart},
                paymentData:{...paymentData},
                status:'Pending',
                orderEmail: loggedInUser.email,
                orderDate: new Date().toLocaleDateString(),
                orderTime: new Date().toLocaleTimeString(),
            };
             handleConfirm = () => {
                fetch(`https://hot-onion-101.herokuapp.com/add_order?email=${loggedInUser.email}`, {
                    method:'POST',
                    headers:{
                        'Content-Type' : 'application/json',
                        "authorization" : `Bearer ${token}`
                    },
                    body:JSON.stringify(orderDetail)
                })
                .then(res => res.json())
                .then(data => {
                  if(data){
                    alert('Your Order Successfully Received. Thank You.');
                    setShippingData({});
                    setPaymentData({});
                    let foodData = [];
                    setCheckCart({foodData});
                    localStorage.removeItem('cart');
                    history.push('/dashboard/myOrder');
                     setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }});
            };
        };
    };
};

    return (
       <section className='container'>
           {
                checkCart.foodData.length ?
                <div>
                    <PaymentInfo handleConfirm={handleConfirm} paymentData={paymentData} setPaymentData={setPaymentData}/>
                </div>
                :
                <div className="row mt-3">
                    <div className="col-md-6 shipping_data_container d-flex justify-content-center">
                        <ShippingDetail loggedInUser={loggedInUser} setShippingData={setShippingData}/>
                    </div>
                    <div className="check_cart_container col-md-6">
                        <CheckCart setCheckCart={setCheckCart} shippingData={shippingData}/>
                    </div>
                </div>
            }
       </section>
    );
};

export default CheckOut;
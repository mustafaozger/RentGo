import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OrderCompletionPage.css';
import axios from 'axios';
import CartService from '../CartService/CartService';
import AuthUtils from '../authUtils/authUtils';

const OrderCompletionPage = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneAreaCode: '+90',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const formatExpiry = (value) => {
    let digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    } else if (digits.length === 2) {
      return digits + '/';
    }
    return digits;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone') newValue = newValue.replace(/\D/g, '').slice(0, 10);
    if (name === 'cardNumber') newValue = newValue.replace(/\D/g, '').slice(0, 16);
    if (name === 'cvv') newValue = newValue.replace(/\D/g, '').slice(0, 3);
    if (name === 'expiryDate') newValue = formatExpiry(newValue);

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const formatPhoneNumber = () => {
    const digits = formData.phone.replace(/\s/g, '');
    if (digits.length === 10) {
      const formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
      setFormData((prevData) => ({ ...prevData, phone: formatted }));
    }
  };

  const formatCardNumber = () => {
    const digits = formData.cardNumber.replace(/\s/g, '');
    if (digits.length > 0) {
      const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
      setFormData((prevData) => ({ ...prevData, cardNumber: formatted }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        toast.error(`Lütfen ${key} alanını doldurun.`);
        return;
      }
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (phoneDigits.length !== 10) {
      toast.error("Telefon numarası 10 haneli olmalıdır.");
      return;
    }
    if (cardDigits.length !== 16) {
      toast.error("Kart numarası 16 haneli olmalıdır.");
      return;
    }
    if (!expiryRegex.test(formData.expiryDate)) {
      toast.error("Son kullanma tarihi MM/YY formatında olmalıdır.");
      return;
    }
    if (formData.cvv.length !== 3) {
      toast.error("CVV kodu 3 haneli olmalıdır.");
      return;
    }

    const orderPayload = {
      cartId: CartService.getCartId(),
      reciverName: `${formData.firstName} ${formData.lastName}`,
      reciverPhone: phoneDigits,
      reciverAddress: formData.address,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        'https://localhost:9001/api/v1/Order/confirm',
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${AuthUtils.getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success("Sipariş başarıyla oluşturuldu!");

    setTimeout(() => {
        navigate('/order-success');
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <header className="header">
        <div className="logo">
         <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className="order-confirmation">Order Confirmation</div>
      </header>

      <main className="order-main">
        <form className="order-form" onSubmit={handleSubmit}>
          {/* Kişisel Bilgiler */}
          <section className="personal-info">
            <h2>Personal Information</h2>
            {/* İsim */}
            <div className="form-group">
              <label htmlFor="firstName">Name:</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            {/* Soyisim */}
            <div className="form-group">
              <label htmlFor="lastName">Surname:</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            {/* Adres */}
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            {/* Alan kodu */}
            <div className="form-group phone-group">
              <label htmlFor="phoneAreaCode">Area Code:</label>
              <select id="phoneAreaCode" name="phoneAreaCode" value={formData.phoneAreaCode} onChange={handleChange} required>
                <option value="+90">+90</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
            </div>
            {/* Telefon */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={formatPhoneNumber} required />
            </div>
          </section>

          {/* Ödeme Bilgileri */}
          <section className="payment-info">
            <h2>Payment Information</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} onBlur={formatCardNumber} required />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required />
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span> Loading...</> : "Confirm Order"}
          </button>
        </form>
      </main>
      <ToastContainer />
    </div>
  );
};

export default OrderCompletionPage;

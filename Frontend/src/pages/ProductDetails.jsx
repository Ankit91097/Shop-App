import { data, useParams } from "react-router-dom";
import { useState } from "react";
import "./ProductDetails.css";
import axios from "axios";
import { useEffect } from "react";

// UI only: sample product lookup; replace with API fetch later.

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getOneProduct = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/products/${id}`
    );
    setProduct(response.data.product);
  };

  const handlePayment = async () => {
    try {
      // Step 1: Create order on backend
      console.log(id);
      const { data: order } = await axios.post(
        `http://localhost:3000/api/payment/create/${id}`,
        {},
        { withCredentials: true }
      );

      // Step 2: Razorpay options
      const options = {
        key: "rzp_test_RD2xTcjiHfxSwK", // from .env (frontend can use only key_id)
        amount: order.newPayment.price.amount,
        currency: "INR",
        name: "My Company",
        description: "Test Transaction",
        order_id: order.newPayment.orderId,
        handler: async function (response) {
          console.log(response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          console.log(razorpay_order_id, razorpay_order_id, razorpay_signature);
          try {
            await axios.post(
              "http://localhost:3000/api/payment/verify",
              {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                signature: razorpay_signature,
              },
              {
                withCredentials: true,
              }
            );

            alert("Payment successful!");
          } catch (err) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name:
            order.newPayment.user.fullName.firstName +
            " " +
            order.newPayment.user.fullName.lastName,
          email: order.newPayment.user.email,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOneProduct();
  }, []);

  if (!product) {
    return (
      <div className="pd-shell">
        <p>Product not found.</p>
      </div>
    );
  }

  const priceFmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price.currency,
  }).format(product.price.amount);
  const activeImage = product.images?.[activeIndex];
  const out = product.stock <= 0;

  return (
    <div className="pd-shell" aria-labelledby="pd-title">
      <div className="pd-media" aria-label="Product images">
        {activeImage ? (
          <img src={activeImage} alt={product.title} className="pd-main-img" />
        ) : (
          <div className="pd-main-img" aria-hidden="true" />
        )}
        {product.images && product.images.length > 1 && (
          <div className="pd-thumbs" role="list">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                className={`pd-thumb ${i === activeIndex ? "active" : ""}`}
                role="listitem"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pd-info">
        <h1 id="pd-title" className="pd-title">
          {product.title}
        </h1>
        <div className={`pd-stock ${out ? "out" : ""}`}>
          {out ? "Out of stock" : `${product.stock} in stock`}
        </div>
        <div className="pd-price" aria-live="polite">
          {priceFmt}
        </div>
        <p className="pd-desc">{product.description}</p>
        <div className="pd-actions">
          <button
            onClick={() => handlePayment()}
            className="btn-buy"
            disabled={out}
          >
            {out ? "Unavailable" : "Buy now"}
          </button>
        </div>
        <div className="pd-meta">
          <span>
            <strong>ID:</strong> {product._id}
          </span>
          <span>
            <strong>Currency:</strong> {product.price.currency}
          </span>
        </div>
      </div>
    </div>
  );
}

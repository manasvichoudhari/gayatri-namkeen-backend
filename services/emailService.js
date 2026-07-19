const transporter = require("../config/mail");

// ============================
// ADMIN ORDER EMAIL
// ============================
const sendAdminOrderEmail = async (order) => {
  let products = "";

  order.items.forEach((item) => {
    products += `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.productName}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
      </tr>
    `;
  });

  const html = `
  <div style="font-family:Arial,sans-serif">

      <h2 style="color:#d35400;">
      🛒 New Order Received
      </h2>

      <hr>

      <p><b>Order ID:</b> ${order._id}</p>

      <p><b>Customer:</b> ${order.address.name}</p>

      <p><b>Phone:</b> ${order.address.phone}</p>

      <p><b>Payment:</b> ${order.paymentMethod}</p>

      <p><b>Total:</b> ₹${order.totalAmount}</p>

      <h3>Shipping Address</h3>

      <p>
      ${order.address.address}<br>
      ${order.address.city}<br>
      ${order.address.state} - ${order.address.pincode}
      </p>

      <h3>Products</h3>

      <table style="border-collapse:collapse;width:100%">
        <tr style="background:#f5f5f5">
          <th style="padding:8px;border:1px solid #ddd;">Product</th>
          <th style="padding:8px;border:1px solid #ddd;">Qty</th>
          <th style="padding:8px;border:1px solid #ddd;">Price</th>
        </tr>

        ${products}

      </table>

      <br>

      <h2>Total : ₹${order.totalAmount}</h2>

  </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order - ${order._id}`,
    html,
  });
};

// ============================
// CUSTOMER EMAIL
// ============================
const sendCustomerOrderEmail = async (order) => {
  if (!order.address.email) return;

  let products = "";

  order.items.forEach((item) => {
    products += `
      <li>
        ${item.productName}
        × ${item.quantity}
        - ₹${item.price}
      </li>
    `;
  });

  const html = `
  <div style="font-family:Arial">

      <h2 style="color:green;">
      Thank You for your Order ❤️
      </h2>

      <p>Hello <b>${order.address.name}</b>,</p>

      <p>Your order has been placed successfully.</p>

      <h3>Order Details</h3>

      <ul>
      ${products}
      </ul>

      <h3>Total : ₹${order.totalAmount}</h3>

      <h3>Payment : ${order.paymentMethod}</h3>

      <p>
      We will contact you shortly.
      </p>

      <br>

      <b>Gayatri Namkeen</b>

  </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: order.address.email,
    subject: "Order Confirmation - Gayatri Namkeen",
    html,
  });
};
 const sendOrderStatusEmail = async (order) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: order.address.email, // ya user email
    subject: `Order ${order.orderStatus}`,

    html: `
      <h2>Gayatri Namkeen</h2>

      <p>Hello ${order.address.name},</p>

      <p>Your order status has been updated.</p>

      <h3>Status: ${order.orderStatus}</h3>

      <p>Thank you for shopping with us.</p>
    `,
  });
};

module.exports = {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
  sendOrderStatusEmail,
};
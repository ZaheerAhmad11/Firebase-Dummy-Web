'use client';
import { useState } from "react";
import { 
  MdChevronRight, 
  MdDeliveryDining, 
  MdStorefront, 
  MdRemove, 
  MdAdd, 
  MdDeleteOutline, 
  MdShoppingCart,
  MdAccessTime,
  MdCalendarToday,
  MdDiscount
} from "react-icons/md";

const AddtoCart = () => {
  // Dummy data for testing
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Margherita Pizza", price: 12.99, quantity: 2 },
    { id: 2, name: "Caesar Salad", price: 8.99, quantity: 1 },
    { id: 3, name: "Tiramisu", price: 6.99, quantity: 1 },
  ]);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === "delivery" ? 2.99 : 0;
  const serviceFee = 1.50;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="w-100 rounded-lg bg-white shadow-xl border-l border-gray-200 h-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
      </div>

      {/* Delivery Options */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setDeliveryMethod("delivery")}
            className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
              deliveryMethod === "delivery"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            <MdDeliveryDining className="text-lg" />
            <div className="text-left">
              <div className="font-medium text-xs">Delivery</div>
              <div className="text-[10px] text-gray-400">£10 minimum</div>
            </div>
          </button>
          <button
            onClick={() => setDeliveryMethod("pickup")}
            className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
              deliveryMethod === "pickup"
                ? "bg-black text-white"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            <MdStorefront className="text-lg" />
            <div className="text-left">
              <div className="font-medium text-xs">Pickup</div>
              <div className="text-[10px] text-gray-400">£6 minimum</div>
            </div>
          </button>
        </div>

        {/* Time Slot */}
        <div className="flex items-center justify-between mt-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-1">
              <MdCalendarToday className="text-gray-500 text-sm" />
              <span className="text-xs font-medium">Today</span>
            </div>
            <div className="flex items-center gap-1">
              <MdAccessTime className="text-gray-500 text-sm" />
              <span className="text-xs font-medium">11:00 - 11:30</span>
            </div>
          </div>
          <MdChevronRight className="text-gray-400 text-xl" />
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <MdShoppingCart className="text-4xl text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">Your Cart is empty</p>
            <p className="text-gray-400 text-xs mt-1">Add items from our menu!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                  <p className="text-gray-600 font-medium text-sm">£{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1 py-0.5">
                  <button className="p-1 text-gray-600">
                    <MdRemove className="text-sm" />
                  </button>
                  <span className="w-6 text-center font-medium text-gray-700 text-sm">{item.quantity}</span>
                  <button className="p-1 text-gray-600">
                    <MdAdd className="text-sm" />
                  </button>
                </div>

                {/* Item Total & Delete */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 text-sm">
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button className="text-gray-400 hover:text-red-600">
                    <MdDeleteOutline className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        {/* Discount Code */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MdDiscount className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter discount code"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black bg-gray-50"
              />
            </div>
            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800">
              Apply
            </button>
          </div>
        </div>

        {/* Empty State Message */}
        {cartItems.length === 0 && (
          <div className="text-center py-2">
            <p className="text-gray-400 text-xs">Your cart is empty</p>
          </div>
        )}

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>£{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>£{serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-base font-bold text-gray-800">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-3 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2">
              <span>Proceed to Checkout</span>
              <MdChevronRight className="text-xl" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddtoCart;
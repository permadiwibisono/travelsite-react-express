import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Successful', 'Cancelled', 'Failed']
    },
    address: { type: String, required: true },
    paymentLink: { type: String },
    transactionId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;

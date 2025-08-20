// src/components/OrderCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, Truck, Star } from 'lucide-react';
import dayjs from 'dayjs';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'preparing':
      return <Package className="w-4 h-4" />;
    case 'ready':
      return <Truck className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'preparing':
      return 'primary';
    case 'ready':
      return 'secondary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getProgressWidth = (status) => {
  switch (status) {
    case 'pending':
      return '25%';
    case 'preparing':
      return '50%';
    case 'ready':
      return '75%';
    case 'completed':
      return '100%';
    default:
      return '0%';
  }
};

const getProgressBarColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500';
    case 'preparing':
      return 'bg-blue-500';
    case 'ready':
      return 'bg-green-500';
    case 'completed':
      return 'bg-purple-600';
    default:
      return 'bg-gray-400';
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const OrderCard = ({ order }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.id}
              </h3>
              <Badge
                variant={getStatusColor(order.status)}
                className="flex items-center gap-1"
              >
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Ordered {dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}
              </span>
              {order.status === 'completed' && (
                <div className="flex items-center gap-1 cursor-pointer text-purple-600 hover:text-purple-700 transition-colors">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Rate Order</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${order.total.toFixed(2)}
            </div>
            {order.status === 'pending' && (
              <p className="text-sm text-amber-600">
                Estimated: 15-20 min
              </p>
            )}
            {order.status === 'preparing' && (
              <p className="text-sm text-blue-600">
                Being prepared
              </p>
            )}
            {order.status === 'ready' && (
              <p className="text-sm text-green-600">
                Ready for pickup
              </p>
            )}
            {order.status === 'completed' && (
              <p className="text-sm text-gray-500">
                Delivered
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar for Active Orders */}
        {order.status !== 'completed' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Order Progress
              </span>
              <span className="text-sm text-gray-500">
                {getProgressWidth(order.status)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: getProgressWidth(order.status) }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`h-2 rounded-full ${getProgressBarColor(order.status)}`}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default OrderCard;
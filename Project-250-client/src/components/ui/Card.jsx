import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  ...props 
}) => {
  return (
    <motion.div
      // Enhanced hover animation: scales more and adds a light green back shadow
      whileHover={hover ? { 
        y: -5, // Moves the card slightly up on hover
        scale: 1.03, // Scales the card by 3%
        // Custom boxShadow for a light green glow/shadow effect
        // Uses RGB values from Tailwind's green-500 (rgb(34, 197, 94)) with increased opacity
        boxShadow: "10px 10px 15px -3px rgba(34, 197, 94, 0.4), 10px 4px 6px -2px rgba(34, 197, 94, 0.1)" 
      } : {}}
      // Defines the transition properties for the animation
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`
        ${glass 
          ? 'bg-white/100 backdrop-blur-md border border-white/20' // Glass effect styling
          : 'bg-white border border-zinc-200 ' // Default card styling
        }
        rounded-2xl shadow-md 
        ${hover ? 'transition-all duration-300 ease-in-out' : ''} /* Ensures smooth transitions for all properties */
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
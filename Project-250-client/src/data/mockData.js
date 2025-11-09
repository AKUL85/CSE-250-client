import dayjs from 'dayjs';

export const mockUsers = [
  {
    id: '1',
    role: 'student',
    name: 'Drubo ',
    email: 'Drubo.doe@university.edu',
    studentId: 'STU001',
    phone: '+1234567890',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    emergencyContact: '+1234567891',
    status: 'active',
    room: 'A-201',
    seat: 'A',
    walletBalance: 250.75,
    createdAt: dayjs().subtract(6, 'months').toISOString(),
  },
  {
    id: '2',
    role: 'admin',
    name: 'Sarah ',
    email: 'admin@university.edu',
    studentId: null,
    phone: '+1234567892',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    emergencyContact: '+1234567893',
    status: 'active',
    room: null,
    seat: null,
    walletBalance: 0,
    createdAt: dayjs().subtract(2, 'years').toISOString(),
  },
  {
    id: '3',
    role: 'student',
    name: 'MJ Saif',
    email: 'mike.johnson@university.edu',
    studentId: 'STU002',
    phone: '+1234567894',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    emergencyContact: '+1234567895',
    status: 'active',
    room: 'B-105',
    seat: 'B',
    walletBalance: 180.25,
    createdAt: dayjs().subtract(8, 'months').toISOString(),
  },
];

export const mockMenuItems = [
  {
    id: '1',
    day: 'monday',
    mealType: 'lunch',
    name: 'rui mas',
    category: 'lunch',
    allergens: ['gluten', 'dairy'],
    calories: 350,
    price: 40,
    description: 'Rui Fish Served with rice and vehetables Curry',
    image: 'https://i.postimg.cc/SKncq8dT/rui-macher-jhol-aloo-diyerohu-fish-gravy-with-potatoes-recipe-main-photo.jpg'
  },
  {
    id: '2',
    day: 'monday',
    mealType: 'lunch',
    name: 'Grilled Chicken Salad',
    category: 'main',
    allergens: [],
    calories: 280,
    price: 12.75,
    description: 'Fresh mixed greens with grilled chicken breast',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    day: 'monday',
    mealType: 'dinner',
    name: 'Beef Stir Fry',
    category: 'main',
    allergens: ['soy'],
    calories: 420,
    price: 15.25,
    description: 'Tender beef with vegetables in savory sauce',
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const mockOrders = [
  {
    id: '1',
    userId: '1',
    items: [
      { menuItemId: '1', qty: 2, price: 8.50, name: 'Pancakes with Syrup' },
      { menuItemId: '2', qty: 1, price: 12.75, name: 'Grilled Chicken Salad' }
    ],
    total: 29.75,
    status: 'completed',
    createdAt: dayjs().subtract(2, 'hours').toISOString(),
  },
  {
    id: '2',
    userId: '1',
    items: [
      { menuItemId: '3', qty: 1, price: 15.25, name: 'Beef Stir Fry' }
    ],
    total: 15.25,
    status: 'pending',
    createdAt: dayjs().subtract(30, 'minutes').toISOString(),
  },
];

export const mockComplaints = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    category: 'plumbing',
    title: 'Leaking Faucet',
    description: 'The bathroom faucet has been leaking for the past two days.',
    photos: ['https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg?auto=compress&cs=tinysrgb&w=400'],
    status: 'in_progress',
    priority: 'medium',
    assigneeId: '2',
    createdAt: dayjs().subtract(2, 'days').toISOString(),
    updates: [
      {
        id: '1',
        status: 'pending',
        note: 'Complaint received and assigned to maintenance team',
        createdAt: dayjs().subtract(2, 'days').toISOString(),
        createdBy: 'System',
      },
      {
        id: '2',
        status: 'in_progress',
        note: 'Maintenance team has started working on the issue',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        createdBy: 'Sarah Wilson',
      },
    ],
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    category: 'electricity',
    title: 'Power Outlet Not Working',
    description: 'The power outlet near the desk is not working properly.',
    photos: [],
    status: 'pending',
    priority: 'high',
    assigneeId: null,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    updates: [
      {
        id: '1',
        status: 'pending',
        note: 'Complaint received',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        createdBy: 'System',
      },
    ],
  },
];

export const mockRooms = [
  {
    id: '1',
    number: 'A-201',
    type: 'Quadra',
    capacity: 2,
    floor: 2,
    block: 'A',
    occupants: ['1'],
    amenities: ['wifi', 'ac', 'study_table', 'wardrobe'],
    status: 'occupied',
    rent: 800,
  },
  {
    id: '2',
    number: 'B-105',
    type: 'Quadra',
    capacity: 1,
    floor: 1,
    block: 'B',
    occupants: ['3'],
    amenities: ['wifi', 'ac', 'study_table', 'wardrobe', 'balcony'],
    status: 'occupied',
    rent: 1200,
  },
  {
    id: '3',
    number: 'A-205',
    type: 'Quadra',
    capacity: 2,
    floor: 2,
    block: 'A',
    occupants: [],
    amenities: ['wifi', 'ac', 'study_table', 'wardrobe'],
    status: 'available',
    rent: 800,
  },
];

export const mockTransactions = [
  {
    id: '1',
    userId: '1',
    amount: 100.00,
    type: 'credit',
    method: 'bkash',
    description: 'Wallet top-up',
    createdAt: dayjs().subtract(3, 'days').toISOString(),
    status: 'completed',
  },
  {
    id: '2',
    userId: '1',
    amount: -29.75,
    type: 'debit',
    method: 'wallet',
    description: 'Food order payment',
    createdAt: dayjs().subtract(2, 'hours').toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    userId: '1',
    amount: -15.00,
    type: 'debit',
    method: 'wallet',
    description: 'Laundry service',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    status: 'completed',
  },
];

export const mockSeatApplications = [
  {
    id: '1',
    userId: '1',
    preferences: {
      roomType: 'double',
      floor: 2,
      block: 'A',
      specialRequests: 'Quiet environment for studies',
    },
    status: 'approved',
    assignedRoom: 'A-201',
    assignedSeat: 'A',
    createdAt: dayjs().subtract(6, 'months').toISOString(),
    timeline: [
      {
        status: 'submitted',
        date: dayjs().subtract(6, 'months').toISOString(),
        note: 'Application submitted',
      },
      {
        status: 'under_review',
        date: dayjs().subtract(6, 'months').add(2, 'days').toISOString(),
        note: 'Application under review by admin',
      },
      {
        status: 'approved',
        date: dayjs().subtract(6, 'months').add(5, 'days').toISOString(),
        note: 'Application approved and room assigned',
      },
    ],
  },
];

export const mockLaundrySlots = [
  {
    id: '1',
    machineId: 'M001',
    userId: '1',
    startAt: dayjs().add(2, 'hours').toISOString(),
    endAt: dayjs().add(3, 'hours').toISOString(),
    status: 'booked',
    type: 'wash',
  },
  {
    id: '2',
    machineId: 'M002',
    userId: null,
    startAt: dayjs().add(4, 'hours').toISOString(),
    endAt: dayjs().add(5, 'hours').toISOString(),
    status: 'available',
    type: 'wash',
  },
];

// Dashboard KPI data
export const mockDashboardKPIs = {
  student: {
    walletBalance: 250.75,
    activeComplaints: 2,
    pendingOrders: 1,
    nextLaundrySlot: dayjs().add(2, 'hours').toISOString(),
    roomTemperature: 22,
    mealPlan: 'Full Board',
  },
  admin: {
    totalStudents: 150,
    occupancyRate: 85,
    pendingApplications: 12,
    activeComplaints: 8,
    monthlyRevenue: 125000,
    maintenanceRequests: 5,
  },
};
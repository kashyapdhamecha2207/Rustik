import User from '../models/User.js';
import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';
import Expense from '../models/Expense.js';
import CMS from '../models/CMS.js';
import Customer from '../models/Customer.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('🌱 Database already contains data. Skipping seeder.');
      return;
    }

    console.log('🌱 Database is empty. Seeding default data for Rustik Salon...');

    // 1. Create Default Users (Owner, Manager, Staff, Barbers)
    const owner = await User.create({
      name: 'Arthur Pendelton',
      email: 'owner@rustik.com',
      password: 'password123',
      role: 'owner',
      phone: '+1 (555) 019-2834',
      status: 'active'
    });

    const manager = await User.create({
      name: 'Clarissa Gold',
      email: 'manager@rustik.com',
      password: 'password123',
      role: 'manager',
      phone: '+1 (555) 019-9988',
      status: 'active'
    });

    const staff = await User.create({
      name: 'James Mercer',
      email: 'staff@rustik.com',
      password: 'password123',
      role: 'staff',
      phone: '+1 (555) 019-7722',
      status: 'active'
    });

    // Master Barbers/Artists
    const barber1 = await User.create({
      name: 'Marcus Gold',
      email: 'marcus@rustik.com',
      password: 'password123',
      role: 'barber',
      specialties: ['Classic Fade', 'Razor Shave', 'Beard Sculpting'],
      experience: 8,
      rating: 4.9,
      bio: 'Marcus has 8+ years styling elite clientele. Specializes in scissor precision and structural beard shaping.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
      instagram: '@marcus_rustik_cuts',
      phone: '+1 (555) 019-3344',
      status: 'active'
    });

    const barber2 = await User.create({
      name: 'Alexander Cutz',
      email: 'alex@rustik.com',
      password: 'password123',
      role: 'barber',
      specialties: ['Modern Crop', 'Textured Quiff', 'Hair Tattooing'],
      experience: 5,
      rating: 4.8,
      bio: 'Known for high-fashion runway looks and intricate graphic hair carvings. Alexander keeps your look ultra-modern.',
      avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=300',
      instagram: '@alex_cuts_gold',
      phone: '+1 (555) 019-4455',
      status: 'active'
    });

    const barber3 = await User.create({
      name: 'Sophia Blend',
      email: 'sophia@rustik.com',
      password: 'password123',
      role: 'barber',
      specialties: ['Luxury Coloring', 'Balayage', 'Scalp Therapies'],
      experience: 6,
      rating: 5.0,
      bio: 'Sophia is our premium dye technician and colorist. Master in highlight blends and luxury hot oil treatments.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      instagram: '@sophia_blend_colour',
      phone: '+1 (555) 019-5566',
      status: 'active'
    });

    console.log('✅ Default users created.');

    // 2. Create Services
    const services = [
      { name: 'Royal Haircut & Styling', category: 'haircut', price: 65, duration: 45, description: 'Precision scissor/clipper cut with scalp massage, hot towel treatment, blow dry, and premium pomade styling.', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=300' },
      { name: 'Classic Fade', category: 'haircut', price: 45, duration: 30, description: 'High, mid, or low fade blended to perfection. Includes hot lather neck shave.', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=300' },
      { name: 'Rustik Beard Sculpting & Razor Line', category: 'beard', price: 40, duration: 30, description: 'Detailed beard trimming, oil therapy, massage, and sharp straight-razor cheek & neck clean lines.', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300' },
      { name: 'The Gentleman Combo', category: 'grooming', price: 95, duration: 75, description: 'Royal Haircut + Beard Sculpting combined. Save money and walk out looking like royalty.', image: 'https://images.unsplash.com/photo-1593702295094-aec22597af65?auto=format&fit=crop&q=80&w=300' },
      { name: 'Signature Hair Coloring & Highlights', category: 'coloring', price: 120, duration: 90, description: 'Premium dye work, highlights, or gray coverage customized to your skin tone and style.', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=300' },
      { name: 'Charcoal Purifying Facial Treatment', category: 'facial', price: 50, duration: 45, description: 'Deep pore extraction, steam mask, cold stone massage, and luxury gold serum application.', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=300' }
    ];

    const dbServices = [];
    for (const service of services) {
      const dbService = await Service.create(service);
      dbServices.push(dbService);
    }
    console.log('✅ Services seeded.');

    // 3. Create Default Customers
    const customersData = [
      { name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '+1 (555) 012-3456', notes: 'Prefers classic fade. Likes high-end pomade.' },
      { name: 'Tony Stark', email: 'tony@stark.com', phone: '+1 (555) 012-7890', notes: 'Wants sharp beard razor lines. Very specific about length.' },
      { name: 'Clark Kent', email: 'clark@dailyplanet.com', phone: '+1 (555) 012-1111', notes: 'Simple style, parting on the left side.' },
      { name: 'Steve Rogers', email: 'steve@shield.gov', phone: '+1 (555) 012-2222', notes: 'Clean cut. Always tips well.' }
    ];

    const dbCustomers = [];
    for (const cust of customersData) {
      const dbCust = await Customer.create(cust);
      dbCustomers.push(dbCust);
    }
    console.log('✅ Customers seeded.');

    // 4. Create Mock Appointments for Revenue Dashboard
    const dates = [];
    const today = new Date();
    // Generate dates for past 30 days and next 7 days
    for (let i = -30; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const barbers = [barber1, barber2, barber3];
    const statusOptions = ['completed', 'completed', 'completed', 'confirmed', 'pending', 'cancelled'];
    const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

    console.log('⏳ Seeding mock appointments...');
    for (const date of dates) {
      const isPast = new Date(date) < today;
      const numAppointments = isPast ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 3); // 1-5 a day in past, 0-2 in future

      for (let j = 0; j < numAppointments; j++) {
        const customer = dbCustomers[Math.floor(Math.random() * dbCustomers.length)];
        const service = dbServices[Math.floor(Math.random() * dbServices.length)];
        const barber = barbers[Math.floor(Math.random() * barbers.length)];
        
        let status = 'completed';
        if (!isPast) {
          status = Math.random() > 0.5 ? 'confirmed' : 'pending';
        } else {
          status = Math.random() > 0.95 ? 'cancelled' : 'completed';
        }

        const appt = await Appointment.create({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          customerId: customer._id,
          serviceId: service._id,
          serviceName: service.name,
          barberId: barber._id,
          barberName: barber.name,
          date,
          time: times[Math.floor(Math.random() * times.length)],
          duration: service.duration,
          price: service.price,
          status,
          notes: Math.random() > 0.7 ? 'Client wants coffee on arrival.' : ''
        });

        // Add visit logs to customer profile
        if (status === 'completed') {
          await Customer.findByIdAndUpdate(customer._id, {
            $push: {
              visits: {
                date,
                services: [service.name],
                barberName: barber.name,
                amount: service.price,
                appointmentId: appt._id
              }
            }
          });
        }
      }
    }
    console.log('✅ Mock appointments seeded.');

    // 5. Seed Mock Expenses for Cashflow Analysis
    console.log('⏳ Seeding mock expenses...');
    const expenseCategories = ['inventory', 'rent', 'utilities', 'marketing', 'salary', 'other'];
    const expenseData = [
      { category: 'rent', amount: 3500, description: 'Monthly lease for luxury studio space', offsetDays: -28 },
      { category: 'salary', amount: 1500, description: 'Marcus commission & base', offsetDays: -15 },
      { category: 'salary', amount: 1200, description: 'Alexander commission & base', offsetDays: -15 },
      { category: 'salary', amount: 1400, description: 'Sophia commission & base', offsetDays: -15 },
      { category: 'inventory', amount: 450, description: 'Oribe styling products & beard pomades restocking', offsetDays: -20 },
      { category: 'utilities', amount: 320, description: 'Electricity & Water', offsetDays: -10 },
      { category: 'marketing', amount: 600, description: 'Instagram target ad campaigns', offsetDays: -5 },
      { category: 'inventory', amount: 150, description: 'Disinfectant barbicides and neck strips', offsetDays: -2 }
    ];

    for (const exp of expenseData) {
      const expDate = new Date();
      expDate.setDate(today.getDate() + exp.offsetDays);
      await Expense.create({
        category: exp.category,
        amount: exp.amount,
        description: exp.description,
        date: expDate.toISOString().split('T')[0]
      });
    }
    console.log('✅ Expenses seeded.');

    // 6. Seed CMS Settings
    await CMS.findOneAndUpdate(
      { key: 'homepage' },
      {
        value: {
          heroTitle: 'CRAFTING LEGACY THROUGH LUXURY GROOMING',
          heroSubtitle: 'Rustik Salon provides custom haircutting, straight-razor work, and premium facial therapies in a forest-obsidian atmosphere.',
          introText: 'Established in 2020, Rustik Salon is a master-tier grooming lounge catering to gentlemen of high standard. Our studio is built on the foundations of heritage barbering and luxury wellness.',
          studioHours: {
            weekdays: '09:00 AM - 08:00 PM',
            saturday: '09:00 AM - 06:00 PM',
            sunday: '10:00 AM - 04:00 PM'
          },
          whatsappLink: 'https://wa.me/15550192834',
          phone: '+1 (555) 019-2834',
          address: '42 Royal Oak Crescent, Sector 5, Metropolitan'
        }
      }
    );

    await CMS.findOneAndUpdate(
      { key: 'gallery' },
      {
        value: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600',
            title: 'Slick Back Pompadour Fade',
            barberName: 'Marcus Gold'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600',
            title: 'Modern Textured French Crop',
            barberName: 'Alexander Cutz'
          },
          {
            type: 'before-after',
            beforeUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            afterUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
            title: 'Total Grooming Transformation',
            barberName: 'Marcus Gold'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=600',
            title: 'Precision Straight Razor Lineup',
            barberName: 'Marcus Gold'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
            title: 'Premium Bleach Crop and Style',
            barberName: 'Sophia Blend'
          }
        ]
      }
    );

    await CMS.findOneAndUpdate(
      { key: 'testimonials' },
      {
        value: [
          { name: 'Bruce Wayne', role: 'Business Executive', rating: 5, comment: 'The level of service here is unmatched. It is more than a haircut — it is a therapeutic ritual. The forest-obsidian atmosphere feels private and extremely exclusive.' },
          { name: 'Tony Stark', role: 'Tech Investor', rating: 5, comment: 'Alexander Cutz has absolute surgical precision. Straight-razor beard lineups are incredibly clean. My permanent go-to grooming lounge.' },
          { name: 'Clark Kent', role: 'Journalist', rating: 5, comment: 'Extremely professional, elegant space, and very talented staff. The booking engine is smooth and the reminder alerts are helpful.' }
        ]
      }
    );
    console.log('✅ CMS Content Seeded.');
    console.log('🌱 Rustik Salon database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

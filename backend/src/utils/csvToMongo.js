import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Sale from '../models/Sale.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importCSV = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Sale.deleteMany({});
    console.log('Cleared existing data');

    const dataPath = path.join(__dirname, '../../data/sales_data.csv');
    const results = [];

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          customerId: data['Customer ID'],
          customerName: data['Customer Name'],
          phoneNumber: data['Phone Number'],
          gender: data['Gender'],
          age: parseInt(data['Age']),
          customerRegion: data['Customer Region'],
          customerType: data['Customer Type'],
          productId: data['Product ID'],
          productName: data['Product Name'],
          brand: data['Brand'],
          productCategory: data['Product Category'],
          tags: data['Tags']?.split(',').map(t => t.trim()) || [],
          quantity: parseInt(data['Quantity']),
          pricePerUnit: parseFloat(data['Price per Unit']),
          discountPercentage: parseFloat(data['Discount Percentage']),
          totalAmount: parseFloat(data['Total Amount']),
          finalAmount: parseFloat(data['Final Amount']),
          date: new Date(data['Date']),
          paymentMethod: data['Payment Method'],
          orderStatus: data['Order Status'],
          deliveryType: data['Delivery Type'],
          storeId: data['Store ID'],
          storeLocation: data['Store Location'],
          salespersonId: data['Salesperson ID'],
          employeeName: data['Employee Name']
        });
      })
      .on('end', async () => {
        await Sale.insertMany(results);
        console.log(`Imported ${results.length} records`);
        process.exit(0);
      });
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
};

importCSV();

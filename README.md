# Steadfast Courier Integration System

> **Automated order management and courier dispatch system for e-commerce businesses**

A comprehensive Google Apps Script solution that streamlines order processing, automates parcel dispatch through Steadfast Courier API, and provides real-time delivery tracking with automated inventory management.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)](https://developers.google.com/apps-script)

---

## 🎯 Overview

This system reduces manual data entry by **90%** and eliminates human error in order management by automating the entire workflow from customer order to delivery confirmation. Built specifically for small to medium e-commerce businesses using social media and messaging platforms for sales.

## ✨ Features

### 📝 Structured Data Processing
- Parse formatted order data with a single click
- Automatic validation of customer information (name, phone, address)
- Dynamic calculation of unit pricing and delivery fees
- Support for product variants and sizing

### 🚀 Automated Courier Dispatch
- One-click integration with Steadfast Courier API
- Automatic generation of unique invoice IDs with product tracking
- Instant retrieval and storage of consignment IDs
- Custom order notes with product and size information

### 📊 Order Management
- Sequential order ID generation (e.g., #1001, #1002)
- Automatic timestamp recording
- Status tracking through order lifecycle
- Centralized order database in Google Sheets

### 🔄 Real-Time Status Synchronization
- Bulk status updates from Steadfast API
- Automatic status mapping (Pending → Shipped → Delivered)
- Handles partial deliveries and cancellations
- Prevents duplicate status checks for completed orders

## 🛠️ Technical Stack

- **Platform**: Google Apps Script (JavaScript)
- **API Integration**: Steadfast Courier API v1
- **Data Storage**: Google Sheets
- **Authentication**: API Key + Secret Key

## 📦 Installation

### Prerequisites
- Google Account with access to Google Sheets
- Steadfast Courier account with API credentials
- Basic familiarity with Google Apps Script

### Setup Instructions

1. **Create a Google Sheet** with the following column structure:
   ```
   A: Order ID
   B: Date
   C: Customer Name
   D: Phone Number
   E: Address
   F: Parcel ID (Consignment ID)
   G: Product Name
   H: Size
   I: Quantity
   J: Unit Price
   K: Delivery Fee
   L: Total Amount
   M: Status
   P: Raw Input Data (for data entry)
   ```

2. **Open the Apps Script Editor**:
   - In your Google Sheet, go to `Extensions > Apps Script`

3. **Copy the Script**:
   - Delete any existing code in the editor
   - Copy the entire contents of [`Code.js`](Code.js) and paste it

4. **Configure API Credentials**:
   ```javascript
   const API_KEY = 'your_steadfast_api_key_here';
   const SECRET_KEY = 'your_steadfast_secret_key_here';
   ```

5. **Save and Authorize**:
   - Save the project (Ctrl+S or Cmd+S)
   - Refresh your Google Sheet
   - When prompted, authorize the script to access your data

6. **Name Your Sheet**:
   - Ensure your working sheet is named **"Orders"** (case-sensitive)

## 📖 Usage Guide

### Step 1: Prepare Order Data

Format your order data in the following pipe-delimited structure:
```
Name | Phone | Address | Product | Size | Total | Delivery
```

**Example**:
```
John Doe | 01712345678 | Flat 3B, House 42, Gulshan-2, Dhaka | K2 | 42 | 1500 | 120
```

> **Note**: You can use AI tools (such as ChatGPT or Gemini) to convert unstructured invoice text into this format. See [PROMPT.md](PROMPT.md) for a ready-to-use AI prompt.

### Step 2: Parse Invoice Data

1. Paste your formatted data into **Column P** of the active row
2. Select the cell in that row
3. Go to `📦 Steadfast System > Step 1: Parse Invoice`
4. The system will automatically populate all columns and generate an Order ID

### Step 3: Dispatch to Courier

1. Review the parsed data for accuracy
2. With the same row selected, go to `📦 Steadfast System > Step 2: Dispatch to Steadfast`
3. The system will:
   - Create an order in Steadfast
   - Retrieve the consignment ID
   - Update the status to "Pending"

### Step 4: Sync Delivery Status

- Periodically run `📦 Steadfast System > 🔄 Sync Delivery Statuses`
- The system will check all active orders and update their status based on Steadfast's delivery tracking

## 🔐 Security Best Practices

### Current Implementation
The script currently uses hardcoded API credentials for simplicity. **This is acceptable for personal use but not recommended for production environments.**

### Production Recommendations

1. **Use PropertiesService for Credential Storage**:
   ```javascript
   const API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
   const SECRET_KEY = PropertiesService.getScriptProperties().getProperty('SECRET_KEY');
   ```

2. **Set Properties via Script Editor**:
   - Go to Project Settings (gear icon)
   - Scroll to Script Properties
   - Add your credentials as key-value pairs

3. **Restrict API Access**:
   - Use Steadfast API IP whitelisting if available
   - Regularly rotate API keys
   - Monitor API usage logs

4. **Sheet Protection**:
   - Protect critical columns (Order ID, Parcel ID, Status) from manual editing
   - Use data validation for status columns

## 📂 Project Structure

```
Steadfast-System/
├── Code.js           # Main application script
├── README.md         # This file
├── PROMPT.md         # AI prompt for data formatting (optional helper)
└── LICENSE           # MIT License
```

## 🔧 Customization

### Adding New Products
Update the product validation in your data preparation process to include new product names.

### Modifying Status Mapping
Edit the `updateDeliveryStatuses()` function to customize how Steadfast statuses map to your local statuses:
```javascript
if (newStatus === "delivered") {
  sheet.getRange(i + 1, 13).setValue("Delivered");
}
```

### Changing Invoice ID Format
Modify the `steadfastInvoiceId` generation in `pushToSteadfast()`:
```javascript
const steadfastInvoiceId = productName + "-" + productSize + "-" + cleanOrderId;
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Name, Phone, or Total COD is missing" | Ensure Step 1 was completed successfully and all required fields are populated |
| "Please paste the Gemini output..." | Column P must contain properly formatted pipe-delimited data |
| API Connection Error | Verify API credentials and internet connectivity |
| Status not updating | Check that Parcel ID exists in Column F and order is not already Delivered/Cancelled |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👤 Author

**Sajir Hamid**

---

## 📌 Keywords

`google-apps-script` `automation` `ecommerce` `logistics` `courier-api` `order-management` `steadfast-courier` `inventory-management` `bangladesh` `delivery-tracking`

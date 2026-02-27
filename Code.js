/**
 * 1. PARSE DATA FROM COLUMN P
 */
function cleanInvoiceData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const activeCell = sheet.getActiveCell();
  const activeRow = activeCell.getRow();
  const rawLine = sheet.getRange(activeRow, 16).getValue(); // Column P
  
  if (!rawLine || !rawLine.includes("|")) {
    SpreadsheetApp.getUi().alert("Please paste the Gemini output into Column P first!");
    return;
  }

  const data = rawLine.split("|").map(item => item.trim());
  
  // 1. Fill basic Info
  sheet.getRange(activeRow, 3).setValue(data[0]);         // Name (C)
  sheet.getRange(activeRow, 4).setValue("'" + data[1]);  // Phone (D)
  sheet.getRange(activeRow, 5).setValue(data[2]);         // Add (E)
  sheet.getRange(activeRow, 7).setValue(data[3]);         // Product name (G)
  sheet.getRange(activeRow, 8).setValue(data[4]);         // Size (H)
  sheet.getRange(activeRow, 9).setValue(1);                // Qty (I)
  
  const totalAmount = parseFloat(data[5]) || 0;
  const deliveryFee = parseFloat(data[6]) || 0;
  const unitPrice = totalAmount - deliveryFee;

  sheet.getRange(activeRow, 10).setValue(unitPrice);      // Unit Price (J)
  sheet.getRange(activeRow, 11).setValue(deliveryFee);    // Delivery (K)
  sheet.getRange(activeRow, 12).setValue(totalAmount);    // Total (L)
  
  // 3. SEQUENTIAL ORDER ID (Column A)
  const orderIdCell = sheet.getRange(activeRow, 1);
  if (orderIdCell.getValue() === "") {
    let lastIdValue = sheet.getRange(activeRow - 1, 1).getValue().toString();
    // Remove # and any extra spaces to find the number
    let lastNum = parseInt(lastIdValue.replace(/[^0-9]/g, "")); 
    
    // If the row above is a header or empty, start at 1000
    if (isNaN(lastNum)) {
      lastNum = 1000;
    }
    orderIdCell.setValue("#" + (lastNum + 1));
  }
  
  sheet.getRange(activeRow, 2).setValue(new Date());
  sheet.getRange(activeRow, 13).setValue("Pending"); // Status (M)
  
  SpreadsheetApp.getUi().alert("✅ Done! Row updated.");
}


// CONFIGURATION
const API_KEY = 'YOUR_API_KEY_HERE'; 
const SECRET_KEY = 'YOUR_SECRET_KEY_HERE';
const STEADFAST_URL = 'https://portal.packzy.com/api/v1/create_order';

/**
 * 2. SEND DATA TO STEADFAST
 */
function pushToSteadfast() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const activeRow = sheet.getActiveCell().getRow();
  
  // 1. GENERATE THE INVOICE ID FOR STEADFAST ONLY
  const orderIdRaw = sheet.getRange(activeRow, 1).getValue().toString();
  const cleanOrderId = orderIdRaw.replace(/[^0-9]/g, "");
  const productName = sheet.getRange(activeRow, 7).getValue().toString();
  const productSize = sheet.getRange(activeRow, 8).getValue().toString();
  const steadfastInvoiceId = productName + "-"  + productSize + "-" + cleanOrderId;

  // 2. DATA MAPPING
  const name = sheet.getRange(activeRow, 3).getValue();                 // Column C
  const phone = sheet.getRange(activeRow, 4).getValue().toString();    // Column D
  const address = sheet.getRange(activeRow, 5).getValue();             // Column E
  const codAmount = sheet.getRange(activeRow, 12).getValue();          // Column L

  if (!name || !phone || !codAmount) {
    SpreadsheetApp.getUi().alert("Error: Name, Phone, or Total COD is missing!");
    return;
  }

  const payload = {
    "invoice": steadfastInvoiceId, // This unique ID goes to Steadfast
    "recipient_name": name,
    "recipient_phone": phone,
    "recipient_address": address,
    "cod_amount": codAmount,
    "note": "Product: " + productName + " | Size: " + productSize
  };

  const options = {
    "method": "post",
    "headers": {
      "Api-Key": API_KEY, 
      "Secret-Key": SECRET_KEY,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch("https://portal.packzy.com/api/v1/create_order", options);
    const result = JSON.parse(response.getContentText());

    if (result.status === 200) {
      // 3. UPDATED: SAVING CONSIGNMENT ID (Parcel ID) TO COLUMN F
      sheet.getRange(activeRow, 6).setValue(result.consignment.consignment_id); 
      
      sheet.getRange(activeRow, 13).setValue("Pending"); // Column M
      SpreadsheetApp.getUi().alert("✅ Success! Parcel ID: " + result.consignment.consignment_id);
    } else {
      SpreadsheetApp.getUi().alert("❌ Steadfast Error: " + result.message);
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert("⚠️ Connection Error: " + e.toString());
  }
}

/**
 * 3. CHECK DELIVERY STATUS (Updates Column M and Inventory)
 */
function updateDeliveryStatuses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  const data = sheet.getDataRange().getValues();
  
  // Headers are in Row 1, data starts Row 2
  for (let i = 1; i < data.length; i++) {
    const status = data[i][12]; // Column M (Status)
    const parcelId = data[i][5]; // Column F (Parcel ID)
    
    // We only check orders that are currently "Shipped"
    // if (status === "Shipped" && parcelId)
    if (status !== "Delivered" && status != "Cancelled" && parcelId) {
      const response = UrlFetchApp.fetch("https://portal.packzy.com/api/v1/status_by_cid/" + parcelId, {
        "method": "get",
        "headers": {
          "Api-Key": API_KEY,
          "Secret-Key": SECRET_KEY
        }
      });
      
      const result = JSON.parse(response.getContentText());
      
      if (result.status === 200) {
        const newStatus = result.delivery_status;
        // If Steadfast says 'delivered', update the sheet
        if (newStatus === "delivered") {
          sheet.getRange(i + 1, 13).setValue("Delivered"); 
        }
        else if(newStatus === "in_review") {
          sheet.getRange(i + 1, 13).setValue("Pending");
        }
        else if(newStatus === "pending") {
          sheet.getRange(i + 1, 13).setValue("Shipped");
        }
        else if (newStatus === "partial_delivered" || newStatus === "cancelled") {
          sheet.getRange(i + 1, 13).setValue("Cancelled");
        }
      }
    }
  }
  SpreadsheetApp.getUi().alert("Statuses updated based on Steadfast records!");
}


function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 Steadfast System')
    .addItem('Step 1: Parse Invoice', 'cleanInvoiceData')
    .addItem('Step 2: Dispatch to Steadfast', 'pushToSteadfast')
    .addSeparator()
    .addItem('🔄 Sync Delivery Statuses', 'updateDeliveryStatuses')
    .addToUi();
}
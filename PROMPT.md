# AI Data Formatting Prompt

> **Optional Helper Tool for Converting Unstructured Invoice Text**

If you receive order information through social media, messaging apps, or unstructured text formats, you can use AI assistants (ChatGPT, Google Gemini, Claude, etc.) to convert them into the required format for this system.

## 📋 Prompt Template

Copy and paste the following prompt into your preferred AI assistant, then paste your messy invoice data below it:

---

### Prompt:

```
Task: Extract and format customer order data from unstructured text.

I will provide you with messy customer invoice information. Your job is to extract the relevant data and format it into a single line with fields separated by the pipe character (|).

**Output Format:**
Name | Phone | Address | Product | Size | Total | Delivery

**Extraction Rules:**

1. **Name**: Extract full customer name with proper capitalization (Title Case)

2. **Phone**: Must be exactly 11 digits, starting with '0'. If the phone number has spaces or dashes, remove them. If no phone is provided, use a placeholder like "N/A"

3. **Address**: Combine all location details (house number, street, area, city) into a single line. Use commas to separate components.

4. **Product**: Extract the product name. Common products include: K2, Midnight, Roses, Icrus. Use the exact capitalization as mentioned.

5. **Size**: Extract size information (e.g., 38, 42, M, L, 36-L, etc.). If no size is mentioned, use "N/A"

6. **Total**: Extract only the numeric value of the total amount (remove currency symbols and text like "tk" or "taka")

7. **Delivery**: Extract only the numeric value of the delivery fee (remove currency symbols and text)

**Important:**
- Output ONLY the formatted single line
- Do NOT include explanations, headers, or additional text
- If any field is missing, use "N/A" as a placeholder
- Maintain the exact order of fields

**Example:**

Input:
```
Rohim Mia
01712345678
Pants size 38
House no. 426, Abc Road, Dhanmondi
TOTAL: 1070 tk
DELIVERY: 70 tk
```

Output:
```
Rohim Mia | 01712345678 | House 426, Abc Road, Dhanmondi | Pants | 38 | 1070 | 70
```

---

Now paste your unstructured invoice text below:
[PASTE YOUR INVOICE DATA HERE]
```

---

## 🎯 How to Use

1. **Copy the entire prompt above** (everything in the code block)

2. **Open your AI assistant** (ChatGPT, Gemini, Claude, etc.)

3. **Paste the prompt** and then paste your messy customer order data below it

4. **Copy the AI's output** (it will be a single line with | separators)

5. **Paste the output into Column P** of your Google Sheet

6. **Run Step 1: Parse Invoice** from the Steadfast System menu

## 💡 Tips

- You can process multiple orders in one go by asking the AI to format them all
- Save this prompt in your notes app for quick access
- If the AI makes mistakes, refine the product names in the prompt to match your specific catalog
- For recurring customers, you can create a database of phone numbers to cross-reference

## 🔧 Customization

If your business uses different product names, update the **Product** section of the prompt:

```
4. **Product**: Extract the product name. Valid products are: [ProductA, ProductB, ProductC]. Use exact capitalization.
```

Replace `[ProductA, ProductB, ProductC]` with your actual product names, maintaining consistent capitalization.

---

## ⚠️ Privacy Note

When using third-party AI services, be mindful of customer data privacy. If you handle sensitive information, consider:
- Using AI with privacy modes (e.g., ChatGPT's data controls)
- Manually formatting data for sensitive orders
- Implementing your own parsing solution

---

**Return to**: [Main README](README.md)

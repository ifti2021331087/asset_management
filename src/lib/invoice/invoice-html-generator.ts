export function generateInvoiceHtml(invoiceNumber: string, purchaseDate: Date, assetTitle: string, price: number): string {
    // Format the date nicely
    const formattedDate = purchaseDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Convert from cents (if applicable) and format to 2 decimal places
    const formattedPrice = (price / 100).toFixed(2);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceNumber}</title>
        <style>
            body {
                font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f3f4f6;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
            }
            /* Action bar for the print button */
            .action-bar {
                text-align: center;
                padding: 20px;
                background-color: #e5e7eb;
                border-bottom: 1px solid #d1d5db;
            }
            .print-btn {
                background-color: #111827;
                color: white;
                border: none;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 600;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .print-btn:hover {
                background-color: #374151;
            }
            .print-btn svg {
                width: 18px;
                height: 18px;
            }
            
            /* Responsive Invoice Container */
            .invoice-container {
                max-width: 800px;
                width: 100%;
                box-sizing: border-box; /* Ensures padding stays inside screen bounds */
                margin: 40px auto;
                background: #ffffff;
                padding: 50px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #f3f4f6;
                padding-bottom: 30px;
                margin-bottom: 40px;
            }
            .company-info h1 {
                margin: 0;
                font-size: 24px;
                color: #111827;
                letter-spacing: -0.5px;
            }
            .company-info p {
                margin: 5px 0 0;
                color: #6b7280;
                font-size: 14px;
            }
            .invoice-details {
                text-align: right;
            }
            .invoice-details h2 {
                margin: 0;
                font-size: 32px;
                color: #111827;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .invoice-details p {
                margin: 5px 0 0;
                color: #6b7280;
                font-size: 14px;
            }
            .billing-section {
                margin-bottom: 40px;
            }
            .billing-section h3 {
                margin: 0 0 10px;
                font-size: 14px;
                color: #9ca3af;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .billing-section p {
                margin: 0;
                color: #374151;
                font-size: 15px;
                font-weight: 500;
            }
            
            /* Table responsiveness */
            .table-wrapper {
                overflow-x: auto;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 40px;
                min-width: 500px;
            }
            th {
                text-align: left;
                padding: 12px;
                background-color: #f9fafb;
                color: #374151;
                font-weight: 600;
                font-size: 14px;
                border-bottom: 1px solid #e5e7eb;
            }
            td {
                padding: 16px 12px;
                border-bottom: 1px solid #e5e7eb;
                color: #4b5563;
                font-size: 15px;
            }
            .text-right {
                text-align: right;
            }
            .total-section {
                display: flex;
                justify-content: flex-end;
            }
            .total-table {
                width: 100%;
                max-width: 320px;
            }
            .total-table td {
                padding: 12px;
                border: none;
            }
            .total-row {
                font-weight: 700;
                font-size: 20px;
                color: #111827;
                border-top: 2px solid #e5e7eb !important;
            }
            .footer {
                margin-top: 60px;
                text-align: center;
                color: #9ca3af;
                font-size: 14px;
                border-top: 1px solid #f3f4f6;
                padding-top: 30px;
            }

            /* Mobile Adjustments */
            @media (max-width: 600px) {
                .invoice-container {
                    padding: 20px;
                    margin: 0;
                    border-radius: 0;
                }
                .header {
                    flex-direction: column;
                    gap: 20px;
                }
                .invoice-details {
                    text-align: left;
                }
            }

            /* Print Rules */
            @media print {
                body {
                    background-color: white;
                }
                .action-bar {
                    display: none; /* Hide the print button when printing */
                }
                .invoice-container {
                    box-shadow: none;
                    margin: 0;
                    padding: 0;
                    max-width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="action-bar">
            <button class="print-btn" onclick="window.print()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
            </button>
        </div>

        <div class="invoice-container">
            <div class="header">
                <div class="company-info">
                    <h1>Asset Platform Inc.</h1>
                    <p>123 Digital Way, Tech District</p>
                    <p>San Francisco, CA 94105</p>
                    <p>support@yourwebsite.com</p>
                </div>
                <div class="invoice-details">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice No:</strong> #${invoiceNumber}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                </div>
            </div>

            <div class="billing-section">
                <h3>Billed To</h3>
                <p>Valued Customer</p>
                <p>Digital Delivery</p>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>${assetTitle}</strong><br><span style="font-size: 13px; color: #6b7280;">Digital Asset Download</span></td>
                            <td class="text-right">1</td>
                            <td class="text-right">$${formattedPrice}</td>
                            <td class="text-right">$${formattedPrice}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="total-section">
                <table class="total-table">
                    <tr>
                        <td>Subtotal</td>
                        <td class="text-right">$${formattedPrice}</td>
                    </tr>
                    <tr>
                        <td>Tax (0%)</td>
                        <td class="text-right">$0.00</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total</td>
                        <td class="text-right">$${formattedPrice}</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p>If you have any questions concerning this invoice, contact our support team.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
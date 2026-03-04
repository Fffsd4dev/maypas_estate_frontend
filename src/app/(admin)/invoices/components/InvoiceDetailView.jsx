import { Card, CardBody } from 'react-bootstrap'
import { currency } from '@/context/constants'
import logoDark from '@/assets/images/logo-dark.png'
import { useState, useEffect, useRef } from 'react'
import html2pdf from 'html2pdf.js'

const InvoiceDetailView = ({ invoice, brandData }) => {
  const [brand, setBrand] = useState({
    name: null,
    addresses: null,
    phones: null,
    email: null,
    logo: null,
  })
  
  const invoiceRef = useRef(null)

  useEffect(() => {

    if (brandData) {
      const brandInfo = brandData.data || brandData

      if (brandInfo) {
        setBrand({
          name: brandInfo.name || null,
          addresses: Array.isArray(brandInfo.addresses) ? brandInfo.addresses : null,
          phones: Array.isArray(brandInfo.phones) ? brandInfo.phones : null,
          email: brandInfo.email || null,
          logo: brandInfo.logo || null,
        })
      }
    }
  }, [brandData])

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return

    const element = invoiceRef.current
    const invoiceNumber = invoice.invoice_number || (invoice.uuid ? invoice.uuid.slice(0, 8).toUpperCase() : 'invoice')
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // top, right, bottom, left margins in inches
      filename: `invoice-${invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }

    // Generate PDF
    html2pdf().set(opt).from(element).save()
  }

  if (!invoice) return null

  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date
        .toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(/,/g, ',')
    } catch (e) {
      return null
    }
  }

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return null
    const numAmount = parseFloat(amount)
    return `NGN ${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Calculate totals - only if payment_infos exists
  const subtotal = invoice.payment_infos?.length 
    ? invoice.payment_infos.reduce((sum, payment) => sum + parseFloat(payment.payment_fee || 0), 0)
    : (invoice.amount ? parseFloat(invoice.amount) : null)
  
  const total = subtotal

  // Invoice dates - only if created_at exists
  const invoiceDate = formatDate(invoice.created_at)
  const dueDate = invoiceDate // Same as invoice date in the example

  // Generate invoice number - only if uuid exists
  const invoiceNumber = invoice.invoice_number || (invoice.uuid ? invoice.uuid.slice(0, 8).toUpperCase() : null)

  // Get customer information - only if user data exists
  const customerName = invoice.user ? 
    `${invoice.user.first_name || ''} ${invoice.user.last_name || ''}`.trim() : 
    null
  
  const customerPhone = invoice.user?.phone || null
  const customerEmail = invoice.user?.email || null
  const customerAddress = invoice.apartment_unit?.apartment?.location || null

  // Service description - only if payment_infos exists
  const serviceDescription = invoice.payment_infos?.[0]?.payment_name || null
  const serviceDetails = 'Rental charge for ' + (invoice.apartment_unit?.apartment_unit_name || 'the unit') + ' - ' + (invoice.apartment_unit?.apartment?.name || 'the apartment')

  // Don't render if no essential data
  if (!invoiceNumber && !invoiceDate && !subtotal) {
    return null
  }

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              background: white !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              line-height: 1.5;
              color: #000;
            }
            .d-print-none {
              display: none !important;
            }
            .card {
              border: none !important;
              box-shadow: none !important;
              background: white !important;
            }
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .invoice-title {
            font-size: 32px;
            font-weight: 600;
            color: #000;
            margin-bottom: 20px;
            letter-spacing: -0.5px;
          }
          .company-name {
            font-size: 24px;
            font-weight: 600;
            color: #000;
            margin-bottom: 5px;
          }
          .company-details {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 5px;
          }
          .invoice-meta {
            font-size: 14px;
            color: #000;
            margin-bottom: 5px;
          }
          .invoice-meta-label {
            font-weight: 600;
            margin-right: 10px;
          }
          .bill-to {
            font-size: 14px;
            color: #000;
            // margin-top: 20px;
            margin-bottom: 20px;
          }
          .bill-to-title {
            font-weight: 600;
            margin-bottom: 10px;
          }
          .bill-to-details {
            line-height: 1.8;
            color: #333;
          }
          .table-custom {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 14px;
          }
          .table-custom th {
            text-align: left;
            padding: 12px 8px;
            border-bottom: 1px solid #ddd;
            font-weight: 600;
            color: #000;
          }
          .table-custom td {
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
            color: #333;
          }
          .table-custom td:last-child,
          .table-custom th:last-child {
            text-align: right;
          }
          .table-custom td:nth-child(3),
          .table-custom th:nth-child(3) {
            text-align: right;
          }
          .table-custom td:nth-child(2),
          .table-custom th:nth-child(2) {
            text-align: center;
          }
          .service-description {
            color: #666;
            font-size: 13px;
            margin-top: 4px;
            line-height: 1.4;
          }
          .totals {
            margin-top: 20px;
            font-size: 14px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
          }
          .total-label {
            width: 150px;
            font-weight: 500;
            color: #333;
          }
          .total-value {
            width: 150px;
            text-align: right;
            font-weight: 500;
            color: #000;
          }
          .amount-due {
            font-size: 16px;
            font-weight: 600;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          .notes {
            margin-top: 30px;
            font-size: 14px;
            color: #333;
            line-height: 1.6;
          }
          .notes-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #000;
          }
          .bank-details {
            background: #f9f9f9;
            padding: 15px;
            margin-top: 15px;
            font-size: 13px;
            line-height: 1.8;
            border-left: 3px solid #000;
          }
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            // margin-bottom: 30px;
          }
        `}
      </style>

      <div ref={invoiceRef}>
        <Card className="border-0">
          <CardBody className="p-4">
            {/* Header with Invoice Title and Logo */}
            <div className="header-section" style={{marginTop: "20px"}}>
              <div>
                <div className="invoice-title">INVOICE</div>
              </div>
              <div>
                {/* Logo - only if exists */}
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name || 'Company Logo'}
                    style={{maxWidth: '200px', objectFit: 'contain', marginBottom: '10px'}}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = 'none'
                    }}
                  />
                ) : null}

                {/* Company Name - only if exists */}
                {brand.name && <div className="company-name">{brand.name}</div>}
                
                {/* Addresses - only if exist */}
                {brand.addresses?.map((address, idx) => (
                  address && <div key={idx} className="company-details">{address}</div>
                ))}
                
                {/* Phones - only if exist */}
                {brand.phones?.map((phone, idx) => (
                  phone && <div key={idx} className="company-details">{phone}</div>
                ))}
                
                {/* Email - only if exists */}
                {brand.email && <div className="company-details">{brand.email}</div>}

                {/* Invoice Metadata - only show if data exists */}
                <div style={{ marginTop: '20px' }}>
                  {invoiceNumber && (
                    <div className="invoice-meta">
                      <span className="invoice-meta-label">Invoice Number:</span>
                      {invoiceNumber}
                    </div>
                  )}
                  {invoiceDate && (
                    <div className="invoice-meta">
                      <span className="invoice-meta-label">Invoice Date:</span>
                      {invoiceDate}
                    </div>
                  )}
                  {dueDate && (
                    <div className="invoice-meta">
                      <span className="invoice-meta-label">Payment Due:</span>
                      {dueDate}
                    </div>
                  )}
                  {total && (
                    <div className="invoice-meta">
                      <span className="invoice-meta-label">Amount Due:</span>
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To Section - only if any customer data exists */}
            {(customerName || customerAddress || customerPhone || customerEmail) && (
              <div className="bill-to">
                <div className="bill-to-title">Bill To</div>
                <div className="bill-to-details">
                  {customerName && <>{customerName}<br /></>}
                  {customerAddress && <>{customerAddress}<br /></>}
                  {customerPhone && <>{customerPhone}<br /></>}
                  {customerEmail && <>{customerEmail}</>}
                </div>
              </div>
            )}

            {/* Services Table - only if subtotal exists */}
            {subtotal && (
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Services</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="service-description">{serviceDetails}</div>
                    </td>
                    <td>1</td>
                    <td>{formatCurrency(subtotal)}</td>
                    <td>{formatCurrency(subtotal)}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Totals Section - only if subtotal exists */}
            {subtotal && (
              <div className="totals">
                <div className="total-row">
                  <span className="total-label">Sub Total:</span>
                  <span className="total-value">{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Taxable amount:</span>
                  <span className="total-value">{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">VAT:</span>
                  <span className="total-value">-</span>
                </div>
                <div className="total-row amount-due">
                  <span className="total-label">Amount Due:</span>
                  <span className="total-value">
                    <strong>{formatCurrency(total)}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Print-only footer */}
            <div className="d-none d-print-block text-center mt-5 pt-3" style={{ fontSize: '11px', color: '#999', borderTop: '1px solid #eee' }}>
              This is a computer generated invoice. No signature is required.
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="d-print-none mt-4">
        <div className="d-flex justify-content-end gap-2">
          <button onClick={() => window.print()} className="btn btn-outline-dark px-4 py-2" style={{ fontSize: '14px' }}>
            Print Invoice
          </button>
          <button 
            onClick={handleDownloadPDF} 
            className="btn btn-primary px-4 py-2" 
            style={{ fontSize: '14px' }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </>
  )
}

export default InvoiceDetailView;
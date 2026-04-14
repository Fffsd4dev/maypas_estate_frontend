import { Card, CardBody } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react'
import html2pdf from 'html2pdf.js'

const InvoiceDetailView = ({ invoice, brandData }) => {
  const [brand, setBrand] = useState({
    name: null,
    addresses: null,
    phones: null,
    email: null,
    logo: null,
    primary_color: null, // Add primary color
    secondary_color: null, // Add secondary color
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
          primary_color: brandInfo.primary_color || brandInfo.primaryColor || '#dc3545', // Fallback to danger red
          secondary_color: brandInfo.secondary_color || brandInfo.secondaryColor || '#c82333', // Darker red for gradient
        })
      }
    }
  }, [brandData])

  const handleDownloadPDF = () => {
    if (!invoiceRef.current) return

    const element = invoiceRef.current
    const invoiceNumber = invoice.invoice_number || (invoice.uuid ? invoice.uuid.slice(0, 8).toUpperCase() : 'invoice')
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
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
          month: 'long',
          year: 'numeric',
        })
    } catch (e) {
      return null
    }
  }

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return null
    const numAmount = parseFloat(amount)
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount)
  }

  // Calculate totals
  const subtotal = invoice.payment_infos?.length 
    ? invoice.payment_infos.reduce((sum, payment) => sum + parseFloat(payment.payment_fee || 0), 0)
    : (invoice.amount ? parseFloat(invoice.amount) : null)
  
  const total = subtotal
  const vat = 0
  const grandTotal = total + vat

  // Invoice dates
  const invoiceDate = formatDate(invoice.created_at) || formatDate(new Date().toISOString())
  const dueDate = invoiceDate

  // Generate invoice number
  const invoiceNumber = invoice.invoice_number || (invoice.uuid ? invoice.uuid.slice(0, 8).toUpperCase() : 'INV-001')

  // Get customer information
  const customerName = invoice.user ? 
    `${invoice.user.first_name || ''} ${invoice.user.last_name || ''}`.trim() : 
    'Customer'
  
  const customerPhone = invoice.user?.phone || null
  const customerEmail = invoice.user?.email || null
  
  // Get location
  const locationName = invoice.apartment_unit?.apartment?.location?.name || 
                       invoice.apartment_unit?.apartment?.location_id || 
                       'N/A'
  const apartmentName = invoice.apartment_unit?.apartment_unit_name || 'Unit'
  const buildingName = invoice.apartment_unit?.apartment?.name || 'Apartment'
  const customerAddress = `${apartmentName} - ${buildingName}, ${locationName}`

  // Service description
  const serviceDescription = invoice.payment_infos?.[0]?.payment_name || 'Rental Charges'
  const serviceDetails = `Monthly rental charge for ${apartmentName} in ${buildingName}`

  // Get status badge color
  const getStatusBadge = () => {
    const status = invoice.status?.toLowerCase()
    switch(status) {
      case 'completed':
        return { bg: '#d4edda', color: '#155724', text: 'Paid' }
      case 'pending':
        return { bg: '#fff3cd', color: '#856404', text: 'Pending' }
      case 'failed':
        return { bg: '#f8d7da', color: '#721c24', text: 'Failed' }
      default:
        return { bg: '#e2e3e5', color: '#383d41', text: status || 'N/A' }
    }
  }

  const statusBadge = getStatusBadge()
  
  // Use brand colors with red fallback
  const primaryColor = brand.primary_color || '#dc3545'
  const secondaryColor = brand.secondary_color || '#c82333'
  
  // Create gradient style
  const gradientStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
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
            .print-bg-light {
              background: transparent !important;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f8f9fa;
          }
          
          .modern-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          
          .gradient-header {
            padding: 30px 40px;
            color: white;
          }
          
          .invoice-title {
            font-size: 42px;
            font-weight: 700;
            letter-spacing: -1px;
            margin: 0;
            line-height: 1;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 8px;
          }
          
          .company-details {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
            margin-bottom: 5px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .info-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
            margin-bottom: 8px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 500;
            color: #212529;
            margin-bottom: 0;
          }
          
          .info-value-large {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 0;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #212529;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }
          
          .table-modern {
            width: 100%;
            border-collapse: collapse;
          }
          
          .table-modern th {
            text-align: left;
            padding: 15px 12px;
            background: #f8f9fa;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
            border-bottom: 2px solid #e9ecef;
          }
          
          .table-modern td {
            padding: 15px 12px;
            border-bottom: 1px solid #e9ecef;
            color: #495057;
          }
          
          .table-modern td:last-child,
          .table-modern th:last-child {
            text-align: right;
          }
          
          .table-modern td:nth-child(3),
          .table-modern th:nth-child(3) {
            text-align: right;
          }
          
          .table-modern td:nth-child(2),
          .table-modern th:nth-child(2) {
            text-align: center;
          }
          
          .service-description {
            color: #6c757d;
            font-size: 13px;
            margin-top: 5px;
            line-height: 1.4;
          }
          
          .totals-modern {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .total-row-modern {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
          }
          
          .total-label-modern {
            font-size: 14px;
            color: #6c757d;
          }
          
          .total-value-modern {
            font-size: 14px;
            font-weight: 500;
            color: #212529;
          }
          
          .grand-total {
            border-top: 2px solid #dee2e6;
            margin-top: 10px;
            padding-top: 15px;
          }
          
          .grand-total .total-label-modern {
            font-size: 18px;
            font-weight: 600;
            color: #212529;
          }
          
          .grand-total .total-value-modern {
            font-size: 24px;
            font-weight: 700;
          }
          
          .notes-modern {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
          }
          
          .notes-title-modern {
            font-size: 14px;
            font-weight: 600;
            color: #212529;
            margin-bottom: 10px;
          }
          
          .notes-text {
            font-size: 13px;
            color: #6c757d;
            line-height: 1.6;
          }
          
          .btn-custom {
            padding: 10px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .btn-primary-custom {
            border: none;
          }
          
          .btn-primary-custom:hover {
            opacity: 0.9;
          }
        `}
      </style>

      <div ref={invoiceRef}>
        <Card className="modern-card">
          {/* Gradient Header with Brand Colors */}
          <div className="gradient-header" style={gradientStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="invoice-title">INVOICE</div>
                <div style={{ marginTop: '10px' }}>
                  <span className="status-badge" style={{ background: statusBadge.bg, color: statusBadge.color }}>
                    {statusBadge.text}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name || 'Company Logo'}
                    style={{ maxWidth: '180px', maxHeight: '60px', objectFit: 'contain', marginBottom: '10px' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = 'none'
                    }}
                  />
                ) : null}
                {brand.name && <div className="company-name">{brand.name}</div>}
                {brand.addresses?.map((address, idx) => (
                  address && <div key={idx} className="company-details">{address}</div>
                ))}
                {brand.phones?.map((phone, idx) => (
                  phone && <div key={idx} className="company-details">{phone}</div>
                ))}
                {brand.email && <div className="company-details">{brand.email}</div>}
              </div>
            </div>
          </div>

          <CardBody className="p-4">
            {/* Invoice Metadata Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div className="info-card">
                <div className="info-label">Invoice Number</div>
                <div className="info-value">{invoiceNumber}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Invoice Date</div>
                <div className="info-value">{invoiceDate}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Due Date</div>
                <div className="info-value">{dueDate}</div>
              </div>
              <div className="info-card">
                <div className="info-label">Amount Due</div>
                <div className="info-value-large" style={{ color: primaryColor }}>{formatCurrency(total)}</div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="info-card" style={{ marginBottom: '30px' }}>
              <div className="section-title">Bill To</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '5px' }}>{customerName}</div>
                {customerAddress && <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>{customerAddress}</div>}
                {customerPhone && <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>{customerPhone}</div>}
                {customerEmail && <div style={{ fontSize: '14px', color: '#6c757d' }}>{customerEmail}</div>}
              </div>
            </div>

            {/* Services Table */}
            {subtotal && (
              <>
                <div className="section-title">Services Rendered</div>
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Description</th>
                      <th style={{ width: '15%' }}>Quantity</th>
                      <th style={{ width: '15%' }}>Unit Price</th>
                      <th style={{ width: '20%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ fontWeight: 500 }}>{serviceDescription}</div>
                        <div className="service-description">{serviceDetails}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(subtotal)}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(subtotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* Totals Section */}
            {subtotal && (
              <div className="totals-modern">
                <div className="total-row-modern">
                  <span className="total-label-modern">Subtotal</span>
                  <span className="total-value-modern">{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row-modern">
                  <span className="total-label-modern">Taxable Amount</span>
                  <span className="total-value-modern">{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-row-modern">
                  <span className="total-label-modern">VAT (0%)</span>
                  <span className="total-value-modern">{formatCurrency(vat)}</span>
                </div>
                <div className="total-row-modern grand-total">
                  <span className="total-label-modern">Total Due</span>
                  <span className="total-value-modern" style={{ color: primaryColor }}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="notes-modern">
              <div className="notes-title-modern">Payment Instructions</div>
              <div className="notes-text">
                Please make payment to the bank details provided below. This invoice is computer generated and requires no signature.
                For any questions regarding this invoice, please contact our support team.
              </div>
            </div>

            {/* Print-only footer */}
            <div className="d-none d-print-block text-center mt-5 pt-3" style={{ fontSize: '11px', color: '#999', borderTop: '1px solid #eee' }}>
              This is a computer generated invoice. No signature is required.
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="d-print-none mt-4">
        <div className="d-flex justify-content-end gap-3">
          <button 
            onClick={() => window.print()} 
            className="btn btn-outline-secondary btn-custom"
            style={{ borderColor: '#dee2e6' }}
          >
            <i className="bx bxs-printer me-2"></i>
            Print Invoice
          </button>
          <button 
            onClick={handleDownloadPDF} 
            className="btn btn-primary-custom btn-custom"
            style={{ background: primaryColor, border: 'none', color: '#fff' }}
            onMouseEnter={(e) => e.target.style.background = secondaryColor}
            onMouseLeave={(e) => e.target.style.background = primaryColor}
          >
            <i className="bx bxs-download me-2"></i>
            Download PDF
          </button>
        </div>
      </div>
    </>
  )
}

export default InvoiceDetailView;




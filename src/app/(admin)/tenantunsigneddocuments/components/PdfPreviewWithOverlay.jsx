import React, { useState, useEffect, useRef } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const PdfPreviewWithOverlay = ({ 
  pdfUrl, 
  onPositionSet, 
  selectedField, 
  existingPositions,
  isSelecting,
  pdfDimensions
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeHeight, setIframeHeight] = useState('600px');

  // Set up iframe loading handler
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      const handleLoad = () => {
        setLoading(false);
        // Try to get the actual iframe content dimensions
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const body = iframeDoc.body;
          if (body) {
            const height = body.scrollHeight;
            setIframeHeight(`${height}px`);
          }
        } catch (e) {

        }
      };
      
      iframe.addEventListener('load', handleLoad);
      
      // Trigger load if already loaded
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        handleLoad();
      }
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [pdfUrl]);

  // Handle click on the container
  const handleClick = (e) => {
    if (!isSelecting || !containerRef.current || !scale) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = containerRef.current.scrollTop;
    
    // Calculate click position relative to the visible area
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top + scrollTop;
    
    // Convert to PDF coordinates
    const pdfX = Math.round(x / scale);
    const pdfY = Math.round(pdfDimensions.height - (y / scale)); // Invert Y-axis for PDF
    
    onPositionSet(pdfX, pdfY);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxHeight: '600px',
        border: '1px solid #dee2e6',
        backgroundColor: '#f8f9fa',
        overflow: 'auto',
        cursor: isSelecting ? 'crosshair' : 'default'
      }}
      onClick={handleClick}
    >
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading PDF...</p>
        </div>
      )}
      
      {/* PDF IFrame */}
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        title="PDF Preview"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          pointerEvents: 'none', // Allow clicks to pass through to container
          display: loading ? 'none' : 'block'
        }}
        scrolling="no"
      />
      
      {/* Interactive Overlay for Markers */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none' // Don't block clicks to container
      }}>
        {/* Name Position Marker */}
        {existingPositions.name && (
          <div 
            style={{
              position: 'absolute',
              left: `${(existingPositions.name.x / pdfDimensions.width) * 100}%`,
              top: `${100 - (existingPositions.name.y / pdfDimensions.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 123, 255, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'auto', // Allow interaction with marker
              cursor: 'move'
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent setting new position
              if (window.confirm('Do you want to change the name position?')) {
                onPositionSet(existingPositions.name.x, existingPositions.name.y);
              }
            }}
          >
            <IconifyIcon icon="bx:user" className="me-1" />
            NAME
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(0, 123, 255, 0.9)'
            }}></div>
          </div>
        )}
        
        {/* Signature Position Marker */}
        {existingPositions.signature && (
          <div 
            style={{
              position: 'absolute',
              left: `${(existingPositions.signature.x / pdfDimensions.width) * 100}%`,
              top: `${100 - (existingPositions.signature.y / pdfDimensions.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(40, 167, 69, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'auto', // Allow interaction with marker
              cursor: 'move'
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent setting new position
              if (window.confirm('Do you want to change the signature position?')) {
                onPositionSet(existingPositions.signature.x, existingPositions.signature.y);
              }
            }}
          >
            <IconifyIcon icon="bx:edit" className="me-1" />
            SIGNATURE
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px transparent',
              borderTop: '8px solid rgba(40, 167, 69, 0.9)'
            }}></div>
          </div>
        )}
      </div>
      
      {/* Selection Indicator */}
      {isSelecting && (
        <div style={{
          position: 'sticky',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 193, 7, 0.95)',
          color: '#333',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '2px solid #ffc107',
          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          zIndex: 1001,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          <IconifyIcon icon="bx:crosshair" className="me-2" />
          Click anywhere on the document to set {selectedField} position
          <div className="mt-1 small">
            Scroll to view different parts of the document
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="danger" className="m-3">
          <IconifyIcon icon="bx:error" className="me-2" />
          {error}
        </Alert>
      )}
    </div>
  );
};

export default PdfPreviewWithOverlay;
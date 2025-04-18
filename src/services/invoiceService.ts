import { InvoiceData } from './../types/InvoiceData';
import api from "./api";


/**
 * Upload an invoice image for OCR and AI processing
 * @param file Invoice image file (.jpg, .png, etc.)
 * @returns Extracted transaction data
 */
export const uploadInvoice = async (file: File): Promise<InvoiceData> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/invoices/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error uploading invoice:", error);
    throw error;
  }
};

/**
 * Confirm and create a transaction from invoice data
 * @param invoiceData Transaction data extracted from invoice
 * @returns Created transaction
 */
export const confirmInvoice = async (invoiceData: Omit<InvoiceData, 'id'>): Promise<InvoiceData> => {
  try {
    const response = await api.post('/invoices/confirm', invoiceData);
    return response.data;
    
  } catch (error) {
    console.error("Error confirming invoice transaction:", error);
    throw error;
  }
};

export default {
  uploadInvoice,
  confirmInvoice
};
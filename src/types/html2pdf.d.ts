declare module "html2pdf.js" {
  export interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    imageTimeout?: number;
    logging?: boolean;
  }

  export interface JsPDFOptions {
    unit?: string;
    format?: string;
    orientation?: "portrait" | "landscape";
  }

  export interface Html2PdfOptions {
    margin?: number | number[] | string;
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: Html2CanvasOptions;
    jsPDF?: JsPDFOptions;
  }

  export interface Html2PdfInstance {
    set: (options: Html2PdfOptions) => Html2PdfInstance;
    from: (element: HTMLElement) => Html2PdfInstance;
    save: () => Promise<void>;
  }

  function html2pdf(): Html2PdfInstance;
  export default html2pdf;
}

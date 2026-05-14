// Google gtag global type definition
interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
}

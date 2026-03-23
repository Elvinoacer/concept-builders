
import { Badge } from "@/components/ui/badge";

interface Design {
  name: string;
  tags: string[];
  price: string;
}

interface DesignPurchaseFormProps {
  design: Design;
}

const DesignPurchaseForm: React.FC<DesignPurchaseFormProps> = ({ design }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-card p-6 rounded-xl shadow-2xl border border-cb-border">
        <h1 className="text-3xl font-bold text-cream tracking-tight">{design.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          {design.tags.map((tag, index) => (
            <Badge key={index} variant={tag === 'Best Seller' ? 'default' : 'secondary'}>{tag}</Badge>
          ))}
        </div>
        <p className="text-2xl font-bold text-gold mt-4">{design.price}</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-cream-dim" htmlFor="file-type">File Type</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-cb-border focus:outline-none focus:ring-gold focus:border-gold sm:text-sm rounded-md bg-surface text-cream" id="file-type" name="file-type">
              <option>PDF</option>
              <option>CAD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-cream-dim" htmlFor="drawing-set">Drawing Set</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-cb-border focus:outline-none focus:ring-gold focus:border-gold sm:text-sm rounded-md bg-surface text-cream" id="drawing-set" name="drawing-set">
              <option>Full Set</option>
              <option>Study Set</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gradient-to-r from-gold to-gold-light text-ink text-base font-bold tracking-wide hover:shadow-gold/20 transition-all shadow-xl">
            Buy Now
          </button>
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-surface text-cream border border-cb-border text-base font-bold tracking-wide hover:bg-ink transition-all">
            <span className="material-symbols-outlined"> shopping_cart </span>
            Add to Cart
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-muted">
          <p>Secure payment via Stripe & PayPal</p>
        </div>
        <div className="mt-4 flex justify-center gap-4 text-muted">
          <span className="text-xs font-semibold">100% Price Guarantee</span>
          <span className="text-xs font-semibold">Modification Service</span>
        </div>
        <div className="mt-6 flex justify-center items-center gap-2">
          <span className="text-sm font-medium">Share:</span>
          <div className="flex gap-2">
            <a className="text-gray-400 hover:text-gray-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.8.35-1.65.58-2.5.68.9-.54 1.6-1.4 1.9-2.4-.85.5-1.8 1.1-2.8 1.3-.8-1.1-2-1.8-3.3-1.8-2.5 0-4.5 2-4.5 4.5 0 .35.04.7.12 1.03-3.7-.2-7-1.9-9.2-4.6-.4.6-.6 1.4-.6 2.2 0 1.5.8 2.9 1.9 3.7-.7 0-1.4-.2-2-.6v.05c0 2.1 1.5 3.9 3.5 4.3-.35.1-.7.15-1.1.15-.28 0-.55-.03-.8-.08.55 1.7 2.15 3 4.05 3-1.5 1.2-3.4 1.8-5.5 1.8-.35 0-.7-.02-1.04-.06 2 1.2 4.3 2 6.8 2 8.1 0 12.5-6.7 12.5-12.5 0-.2 0-.4 0-.6.85-.6 1.55-1.4 2.15-2.2z"></path></svg></a>
            <a className="text-gray-400 hover:text-gray-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8.5C21 7.21 22.21 6 23.5 6S26 7.21 26 8.5 24.79 11 23.5 11 21 9.79 21 8.5m-8.5 4C9.71 12.5 8.5 11.29 8.5 10S9.71 7.5 12.5 7.5 16.5 8.71 16.5 12.5 15.29 17.5 12.5 17.5 8.5 16.29 8.5 13.5M4 12.5C4 10.29 5.79 8.5 8 8.5s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"></path></svg></a>
            <a className="text-gray-400 hover:text-gray-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8.5C21 7.21 22.21 6 23.5 6S26 7.21 26 8.5 24.79 11 23.5 11 21 9.79 21 8.5m-8.5 4C9.71 12.5 8.5 11.29 8.5 10S9.71 7.5 12.5 7.5 16.5 8.71 16.5 12.5 15.29 17.5 12.5 17.5 8.5 16.29 8.5 13.5M4 12.5C4 10.29 5.79 8.5 8 8.5s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z"></path></svg></a>
            <a className="text-gray-400 hover:text-gray-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.2 3.8A2 2 0 0018.5.5H5.5A2 2 0 003.8 2.2l-1.5 9.3a2 2 0 002 2.5h15.4a2 2 0 002-2.5L20.2 3.8zM6.5 11.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"></path></svg></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPurchaseForm;

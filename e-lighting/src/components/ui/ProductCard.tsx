// e-lighting/src/components/ui/ProductCard.tsx
export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <img 
        src={product.images?.[0] || '/placeholder.jpg'} 
        alt={product.name} 
        className="w-full h-64 object-cover mb-4" 
      />
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-orange-600">${product.price}</p>
    </div>
  );
}

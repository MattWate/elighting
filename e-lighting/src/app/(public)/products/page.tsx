// Inside your Catalogue grid loop:
<Link 
  key={category.id} 
  href={`/products/category/${category.slug}`} // Needs the /category/ prefix
  className="..."
>

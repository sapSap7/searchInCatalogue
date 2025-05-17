import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false); // Force end of loading after 3 seconds
    }, 3000);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Product>(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product : " + err);
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      fetchProduct();
    }
    return () => clearTimeout(timeout);
  }, [id]);

  if (loading) {
    return <p>Loading product..</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-container">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>
        <strong>Category:</strong>
        {product.category}
      </p>
      <p>
        <strong>Price:</strong>${product.price}
      </p>
      <p>
        <strong>Description:</strong>
        {product.description}
      </p>
    </div>
  );
};
export default ProductPage;

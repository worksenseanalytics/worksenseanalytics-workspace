/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Info, ArrowUpRight, Shirt } from "lucide-react";
import { Product } from "../../types";

interface TopProductsProps {
  products: Product[];
  onSeeDetails: () => void;
}

export default function TopProducts({ products, onSeeDetails }: TopProductsProps) {
  // Highlighted product (Blid Shorts)
  const highlightedProduct = {
    name: "Blid Shorts",
    value: "$4,730.33",
    progress: 12,
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 w-full" id="widget-top-products">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-sm font-semibold text-gray-900">Top Products</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Overview of top selling products
            </span>
          </div>
        </div>

        {/* Link */}
        <button 
          onClick={onSeeDetails}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
        >
          <span>See Details</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Split layout: Mini highlighted card + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Highlight card */}
        <div className="lg:col-span-4 bg-gray-50/50 border border-gray-100/50 rounded-2xl p-4 flex flex-col justify-between h-40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">
              <Shirt size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">{highlightedProduct.name}</h4>
              <span className="text-[10px] text-gray-400 font-medium">Bestseller candidate</span>
            </div>
          </div>

          <div className="my-2">
            <span className="text-lg font-extrabold text-gray-900">{highlightedProduct.value}</span>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-[#FF6433] h-1.5 rounded-full" 
                style={{ width: `${highlightedProduct.progress}%` }}
              />
            </div>
          </div>

          <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg self-start">
            {highlightedProduct.progress}% targets achieved
          </span>
        </div>

        {/* Right Side: Product Table */}
        <div className="lg:col-span-8 overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs text-gray-500">
            <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="pb-2">Product</th>
                <th className="pb-2 text-center">Sales</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-center">Stock</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.slice(0, 3).map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-3 font-semibold text-gray-900">{prod.name}</td>
                  <td className="py-3 text-center font-medium text-gray-600">{prod.sales} pcs</td>
                  <td className="py-3 text-right font-bold text-gray-900">${prod.revenue.toLocaleString()}</td>
                  <td className="py-3 text-center font-medium text-gray-600">{prod.stock}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.status === "In Stock" 
                        ? "bg-[#EEF2F6] text-[#4f46e5]" // Lavender/purple badge style from image
                        : "bg-[#FFF0F2] text-[#ff4b60]" // Pink/red badge style from image
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

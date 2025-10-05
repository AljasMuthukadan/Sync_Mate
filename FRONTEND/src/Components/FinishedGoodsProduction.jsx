import { useState } from "react";
import ProductionForm from "../Features/ProductionForm.jsx";
import ProductionHistory from "../Features/ProductionHistory.jsx";

export default function FinishedGoodsProduction({ items, setItems }) {
  const [finishedProduct, setFinishedProduct] = useState("");
  const [productionQty, setProductionQty] = useState(0);

  const [bom, setBOM] = useState({
    "Ice Cream": [
      { name: "Ice Cream Mix", qty: 50 },
      { name: "Stick", qty: 1 },
      { name: "Bottle", qty: 1 },
    ],
    "Chocolate Bar": [
      { name: "Cocoa Powder", qty: 20 },
      { name: "Sugar", qty: 10 },
      { name: "Wrapper", qty: 1 },
    ],
  });

  const [productionHistory, setProductionHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const produce = () => {
    if (!finishedProduct || productionQty <= 0) {
      alert("Select a finished product and quantity!");
      return;
    }

    const requiredMaterials = bom[finishedProduct];
    if (!requiredMaterials) {
      alert("BOM not defined for this product!");
      return;
    }

    const insufficient = requiredMaterials.filter((material) => {
      const item = items.find((i) => i.name === material.name);
      return !item || item.quantity < material.qty * productionQty;
    });

    if (insufficient.length > 0) {
      alert(
        "Not enough raw materials: " +
          insufficient.map((i) => i.name).join(", ")
      );
      return;
    }

    // Deduct raw materials
    const updatedItems = items.map((i) => {
      const material = requiredMaterials.find((m) => m.name === i.name);
      if (material) {
        return { ...i, quantity: i.quantity - material.qty * productionQty };
      }
      return i;
    });

    // Add finished product
    const existingFinished = updatedItems.find(
      (i) => i.name === finishedProduct
    );
    const productImage =
      items.find((i) => i.name === finishedProduct)?.image || null;

    if (existingFinished) {
      existingFinished.quantity += Number(productionQty);
    } else {
      updatedItems.push({
        id: updatedItems.length + 1,
        name: finishedProduct,
        quantity: Number(productionQty),
        category: "Finished Goods",
        image: productImage,
      });
    }

    setItems(updatedItems);

    // Save history
    const usedMaterials = requiredMaterials.map((m) => ({
      name: m.name,
      qty: m.qty * productionQty,
    }));

    setProductionHistory([
      {
        product: finishedProduct,
        qty: productionQty,
        date: new Date().toLocaleString(),
        image: productImage,
        materials: usedMaterials,
      },
      ...productionHistory,
    ]);

    setProductionQty(0);
    setFinishedProduct("");
    alert(`Produced ${productionQty} ${finishedProduct}(s) successfully!`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Production Form */}
      <ProductionForm
        items={items}
        bom={bom}
        setBOM={setBOM}
        onProduce={produce}
        finishedProduct={finishedProduct}
        setFinishedProduct={setFinishedProduct}
        productionQty={productionQty}
        setProductionQty={setProductionQty}
      />

      {/* Production History */}
      <ProductionHistory
        history={productionHistory}
        selectedHistory={selectedHistory}
        setSelectedHistory={setSelectedHistory}
      />
    </div>
  );
}

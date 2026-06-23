// src/components/ItemsPage.jsx 
"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ItemsPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "foods"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFoods(data);
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);

    const groupedFoods = foods.reduce((acc, food) => {
        const cat = food.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(food);
        return acc;
    }, {});

    if (loading) {
        return <p className="text-center py-10 text-neutral-400">Loading menu...</p>;
    }

    if (foods.length === 0) {
        return <p className="text-center py-10 text-neutral-400">No items available yet.</p>;
    }

    return (
        <div className="">
            {Object.entries(groupedFoods).map(([cat, items]) => (
                <div key={cat} className="mb-10">
                    <h2 className="text-2xl font-bold text-neutral-700 mb-4 border-b pb-2">
                        {cat}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {items.map((food) => (
                            <div key={food.id} className="bg-white overflow-hidden shadow-md hover:shadow-xl rounded-xl p-5 transition">
                                {food.imageUrl ? (
                                    <img
                                        src={food.imageUrl}
                                        alt={food.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                                        No Image
                                    </div>
                                )}
                                <h3 className="text-xl text-neutral-600 font-semibold mt-3">
                                    {food.name}
                                </h3>
                                <p className="text-gray-600 mt-1">Price: ${food.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemsPage;
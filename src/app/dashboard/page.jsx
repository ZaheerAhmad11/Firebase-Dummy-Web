"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

export default function DashboardPage() {

    //-------------------------
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    //-------------------------


    const [foods, setFoods] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState("");

    // ⬅️ NEW: categories now come from Firestore, not a hardcoded array
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    const fetchFoods = async () => {
        const querySnapshot = await getDocs(collection(db, "foods"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFoods(data);
    };

    // ⬅️ NEW
    const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const list = querySnapshot.docs.map((d) => d.id); // doc ID is the category name
        setCategories(list.sort());
    };

    //-------------------------
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/");
                return;
            }
            const admin = await isAdmin(user.uid);
            if (!admin) {
                router.push("/");
                return;
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    //-------------------------


    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    // ⬅️ NEW: auto-select first category once categories load
    useEffect(() => {
        if (categories.length > 0 && !category) {
            setCategory(categories[0]);
        }
    }, [categories]);

    // ⬅️ NEW: add a custom category
    const handleAddCategory = async () => {
        const trimmed = newCategory.trim();
        if (!trimmed) return;

        const alreadyExists = categories.some(
            (c) => c.toLowerCase() === trimmed.toLowerCase()
        );
        if (alreadyExists) {
            alert("That category already exists.");
            return;
        }

        await setDoc(doc(db, "categories", trimmed), { name: trimmed });
        setCategories((prev) => [...prev, trimmed].sort());
        setCategory(trimmed);
        setNewCategory("");
    };

    // ⬅️ NEW: remove a category
    const handleRemoveCategory = async (catName) => {
        const ok = window.confirm(
            `Remove "${catName}"? Foods already using it will keep showing this name, it just won't be selectable anymore.`
        );
        if (!ok) return;

        await deleteDoc(doc(db, "categories", catName));
        const updated = categories.filter((c) => c !== catName);
        setCategories(updated);
        if (category === catName) {
            setCategory(updated[0] || "");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) {
            alert("Please add or select a category first.");
            return;
        }

        let imageUrl = existingImageUrl;

        // Isolate the upload so a Storage failure doesn't kill the whole save
        if (image) {
            try {
                const imageRef = ref(storage, `foods/${Date.now()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            } catch (uploadErr) {
                console.error("Image upload failed:", uploadErr);
                alert(
                    "Image upload failed (likely because your Firebase project is still on the Spark plan — Storage needs Blaze). Saving the item without an image for now."
                );
                imageUrl = existingImageUrl; // fall back, don't block the rest of the save
            }
        }

        try {
            const priceNumber = Number(price) || 0; // ⬅️ store as number, not string

            if (editingId) {
                const foodRef = doc(db, "foods", editingId);
                await updateDoc(foodRef, { name, price: priceNumber, category, imageUrl });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "foods"), { name, price: priceNumber, category, imageUrl });
            }

            setName("");
            setPrice("");
            setImage(null);
            setExistingImageUrl("");
            await fetchFoods();
        } catch (err) {
            console.error("Failed to save food:", err);
            alert("Couldn't save this item — check the console for details.");
        }
    };
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "foods", id));
        fetchFoods();
    };

    const handleEdit = (food) => {
        setName(food.name);
        setPrice(food.price);
        setCategory(food.category || "");
        setEditingId(food.id);
        setExistingImageUrl(food.imageUrl || "");
    };

    const groupedFoods = foods.reduce((acc, food) => {
        const cat = food.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(food);
        return acc;
    }, {});

    if (loading) return <p>Loading...</p>;
    return (
        <div className="max-w-6xl mx-auto py-6">
            <div className="bg-white max-w-6xl shadow-lg rounded-xl p-6">
                <h1 className="text-3xl text-neutral-400 font-bold mb-6 text-center">
                    Dashboard
                </h1>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
                    <input
                        type="text"
                        placeholder="Food Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border text-neutral-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border text-neutral-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.length === 0 && <option value="">No categories</option>}
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border text-neutral-400 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className={`text-white rounded-lg px-4 py-3 transition ${editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {editingId ? "Update Food" : "Add Food"}
                    </button>
                </form>

                {/* ⬅️ NEW: Manage Categories */}
                <div className="mb- border-b pb-4">
                    <p className="text-sm font-semibold text-neutral-500 my-1">
                        Manage Categories
                    </p>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="New category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="border text-neutral-400 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                        />
                        <button
                            type="button"
                            onClick={handleAddCategory}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            + Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <span
                                key={cat}
                                className="flex items-center gap-2 bg-gray-100 text-neutral-600 px-3 py-1 rounded-full text-sm"
                            >
                                {cat}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(cat)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {categories.length === 0 && (
                            <span className="text-sm text-gray-400">No categories yet.</span>
                        )}
                    </div>
                </div>
            </div>

            {/* LIST — grouped by category */}
            {Object.entries(groupedFoods).map(([cat, items]) => (
                <div key={cat} className="mt-8">
                    <h2 className="text-xl font-bold text-neutral-300 mb-3">{cat}</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {items.map((food) => (
                            <div key={food.id} className="bg-white shadow-md rounded-xl p-5">
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
                                <h2 className="text-2xl text-neutral-500 font-semibold">{food.name}</h2>
                                <p className="text-gray-600 mt-2">Price: ${food.price}</p>

                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => handleEdit(food)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(food.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
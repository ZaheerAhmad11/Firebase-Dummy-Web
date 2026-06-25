import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";
import DummyPage from "@/components/DummyPage";

export default function Home() {
  return (
    <div className="flex flex-col px-12 py-10">
      <div className="flex justify-between">
      <ItemsPage className= " "/>
      <AddtoCart />
      </div>
      {/* <DummyPage /> */}
    </div>
  );
}

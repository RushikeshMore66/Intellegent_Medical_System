import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";

export default function Medicines() {

    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState("");

    const fetchMedicines = async () => {
        const response = await api.get(`/medicines?search=${search}&limit=10&offset=0`);
        setMedicines(response.data.data);
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    return (
        <DashboardLayout>

        <div className= "flex justify-between items-center mb-4" >

        <h2 className="text-2xl font-bold" > Medicines </h2>

            < button className = "bg-blue-600 text-white px-4 py-2 rounded" >
                Add Medicine
                    </button>

                    </div>

                    < input
    type = "text"
    placeholder = "Search medicine..."
    className = "border p-2 mb-4 w-64 rounded"
    value = { search }
    onChange = {(e) => setSearch(e.target.value)
}
      />

    < table className = "w-full bg-white shadow rounded" >

        <thead className="bg-gray-200" >

            <tr>
            <th className="p-3 text-left" > Name </th>
                < th className = "p-3 text-left" > Manufacturer </th>
                    < th className = "p-3 text-left" > GST % </th>
                        < th className = "p-3 text-left" > Price </th>
                            < th className = "p-3 text-left" > Action </th>
                                </tr>

                                </thead>

                                <tbody>

{
    medicines.map((m) => (

        <tr key= { m.id } className = "border-t" >

        <td className="p-3" > { m.name } </td>
    < td className = "p-3" > { m.manufacturer } </td>
    < td className = "p-3" > { m.gst_percentage } </td>
    < td className = "p-3" > { m.selling_price } </td>

    < td className = "p-3" >

    <button className="text-red-500" >
    Delete
    </button>

    </td>

    </tr>

    ))
}

</tbody>

    </table>

    </DashboardLayout>
  );
}
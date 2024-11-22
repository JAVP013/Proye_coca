import React, { useEffect, useState } from "react";
import { getIsRowSelected, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Stack, Tooltip, IconButton, tableBodyClasses } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllInventories } from "../services/remote/get/GetAllInventories";
import AddInventoryModal from "../modals/AddInventoriesModal";
import UpdateInventoryModal from "../modals/UpdateInventoriesModal";
import DeleteInventoryModal from "../modals/DeleteInventoriesModal"; // Importar el modal de eliminación
import DetailsInventoryModal from "../modals/DetailsInventoryModal";

const InventoriesColumns = [
  { accessorKey: "_id", header: "ID", size: 150 },
  { accessorKey: "Nombre", header: "Nombre", size: 150 },
  { accessorKey: "Direccion", header: "Dirección", size: 150 },
  { accessorKey: "Telefono", header: "Telefono", size: 150 },
  { accessorKey: "Email", header: "Email", size: 150 },
];

const InventoriesTable = () => {
  const [loadingTable, setLoadingTable] = useState(true);
  const [inventoriesData, setInventoriesData] = useState([]);
  const [addInventoryShowModal, setAddInventoryShowModal] = useState(false);
  const [updateInventoryShowModal, setUpdateInventoryShowModal] = useState(false);
  const [deleteInventoryShowModal, setDeleteInventoryShowModal] = useState(false); // Estado para el modal de eliminación
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [detailsInventoryShowModal, setDetailsInventoryShowModal] = useState(false);
  const [rowSelection, setRowSelection] = useState({});


  const fetchData = async () => {
    try {
      const allInventoriesData = await getAllInventories();
      const validatedData = allInventoriesData.map((item) => ({
        _id: item._id || "No disponible",
        Nombre: item.nombre || "No disponible",
        Telefono: item.contacto?.telefono || "No disponible",
        Email: item.contacto?.email || "No disponible",
        Direccion: "C.P.:" + item.direccion?.codigo_postal + ", Colonia: " + item.direccion?.colonia || "No disponible",
      }));
      setInventoriesData(validatedData);
      setLoadingTable(false);
    } catch (error) {
      console.error("Error al obtener los inventarios:", error);
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <MaterialReactTable
        columns={InventoriesColumns}
        data={inventoriesData}
        state={{
          isLoading: loadingTable,
          rowSelection,
        }}
        onRowSelectionChange={setRowSelection}
        initialState={{ density: "compact", showGlobalFilter: true }}
        enableRowSelection={true}

        renderTopToolbarCustomActions={() => (
          <Stack direction="row" sx={{ m: 1 }}>

            <Tooltip title="Agregar">
              <IconButton onClick={() => {

                const selectedData = Object.keys(rowSelection).map((key) => inventoriesData[key]);
                console.log("Datos seleccionados:", selectedData); // Mostrar datos seleccionados en consola

              }}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>


            <Tooltip title="Agregar">
              <IconButton onClick={() => setAddInventoryShowModal(true)}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Editar">
            <IconButton
        onClick={() => {
            const selectedData = Object.keys(rowSelection).map((key) => inventoriesData[key]);

            if (selectedData.length !== 1) {
                alert("Por favor, seleccione una sola fila para editar.");
                return;
            }

            // Pasa solo el ID del inventario seleccionado al modal de actualización
            setUpdateInventoryShowModal(true);
            setSelectedInventory(selectedData[0]);  // Guardamos el inventario seleccionado
        }}
    >
        <EditIcon />
    </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton onClick={() => {
            const selectedData = Object.keys(rowSelection).map((key) => inventoriesData[key]);

           

            // Pasa solo el ID del inventario seleccionado al modal de actualización
            setDeleteInventoryShowModal(true);
            setSelectedInventory(selectedData);  // Guardamos el inventario seleccionado
        }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Detalles">
            <IconButton onClick={() => {
            const selectedData = Object.keys(rowSelection).map((key) => inventoriesData[key]);

           

            // Pasa solo el ID del inventario seleccionado al modal de actualización
            setDetailsInventoryShowModal(true);
            setSelectedInventory(selectedData);  // Guardamos el inventario seleccionado
        }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        muiTableBodyCellProps={{
          sx: {
            color: "#FFFFFF", // Texto en tonalidades moradas para las celdas de datos
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            color: "#FFFFFF", // Texto blanco para los encabezados
            fontWeight: "bold", // Resaltar los encabezados
          },
        }}
        muiTableContainerProps={{
          sx: {
            backgroundColor: "#1E1B29", // Fondo oscuro para la tabla
          },
        }}
      />

      {/* Modales */}
      <AddInventoryModal
        showAddModal={addInventoryShowModal}
        setShowAddModal={setAddInventoryShowModal}
        fetchData={fetchData}
        onClose={() => setAddInventoryShowModal(false)}
      />

      <UpdateInventoryModal
        showUpdateModal={updateInventoryShowModal}
        setShowUpdateModal={setUpdateInventoryShowModal}
        selectedInventory={selectedInventory} // Pasa el inventario seleccionado
        fetchData={fetchData}
        onClose={() => setUpdateInventoryShowModal(false)}
      />

      <DeleteInventoryModal
        showDeleteModal={deleteInventoryShowModal}
        setShowDeleteModal={setDeleteInventoryShowModal}
        fetchData={fetchData}
        selectInventory={selectedInventory}
        onClose={() => setDeleteInventoryShowModal(false)}
      />

      <DetailsInventoryModal
        showDetailsModal={detailsInventoryShowModal}
        setShowDetailsModal={setDetailsInventoryShowModal}
        inventories={inventoriesData}
        selectedInventory={selectedInventory} // Pasa el inventario seleccionado
        onClose={() => setDetailsInventoryShowModal(false)}
      />
    </Box>

  );
};

export default InventoriesTable;




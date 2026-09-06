// controllers/logisticsController.js
const Inventory = require('../models/Inventory');

exports.getLogisticsStream = async (req, res) => {
    try {
        const { stationId, section } = req.params;
        
        let fullData = await Inventory.findOne({ station_id: stationId }).lean();

        if (!fullData) {
            return res.status(404).json({ 
                status: "error", 
                message: `Logistics data not found for station ${stationId}.` 
            });
        }

        // Map recent deliveries or items into inventory_ledger if it's empty, 
        // so your InventoryTable component has items to display!
        if (!fullData.inventory_ledger || fullData.inventory_ledger.length === 0) {
            fullData.inventory_ledger = (fullData.recent_deliveries || []).map(del => ({
                item_name: del.item,
                category: del.category,
                current_stock: del.qty,
                capacity_max: del.qty * 3,
                burn_rate: "Incidental",
                status: "Adequate"
            }));
        }

        // If a specific sub-section is requested
        if (section && fullData[section]) {
            return res.json({
                status: "success",
                data: {
                    station_id: fullData.station_id,
                    last_updated: fullData.last_updated || fullData.updatedAt,
                    [section]: fullData[section]
                }
            });
        }

        // Default: Send the complete nested structure your UI expects
        res.json({ 
            status: "success", 
            data: fullData 
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
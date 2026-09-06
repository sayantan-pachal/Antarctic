// simulation/engine.js

const environmentEngine = require('./engines/environmentEngine');
const energyEngine = require('./engines/energyEngine');
const infraEngine = require('./engines/infraEngine');
const alertEngine = require('./engines/alertEngine');
const logisticsEngine = require('./engines/logisticsEngine'); // <-- Added Logistics Engine

const Logistics = require('../models/Inventory'); // <-- Added MongoDB Model

// 1. FACTORY FUNCTION: Generates the COMPLETE baseline schema for a specific station
const generateInitialState = (stationId, profile) => {
    return {
        station_id: stationId,
        station_name: `${stationId} Antarctic Research Station`,
        timestamp: new Date().toISOString(),
        polling_interval_seconds: 2,
        
        // ==========================================
        // 1. ENERGY & POWER SYSTEMS
        // ==========================================
        energy: {
            generators: {
                gen_1: {
                    generator_id: "GEN-001", status: "ACTIVE", status_values: ["ACTIVE", "STANDBY", "STARTING", "SHUTDOWN", "FAULT", "MAINTENANCE"], status_color: "green",
                    operation: { runtime_total_hours: profile.genRuntime, runtime_since_maintenance_hours: 850, fuel_consumption_liters_per_hour: profile.fuelBurn, power_output_kw: profile.baseGen, efficiency_percent: profile.efficiency },
                    thresholds: { maintenance_interval_hours: 5000, maintenance_due_hours: 750, fuel_consumption_max_lph: 95, power_output_max_kw: 250, overload_threshold_kw: 240 }
                },
                gen_2: {
                    generator_id: "GEN-002", status: "STANDBY", status_values: ["ACTIVE", "STANDBY", "STARTING", "SHUTDOWN", "FAULT", "MAINTENANCE"], status_color: "yellow",
                    operation: { runtime_total_hours: 2100, runtime_since_maintenance_hours: 400, fuel_consumption_liters_per_hour: 0.0, power_output_kw: 0, ready_for_activation: true },
                    thresholds: { maintenance_interval_hours: 5000, maintenance_due_hours: 4600, power_output_max_kw: 250 }
                }
            },
            fuel_system: {
                primary_tank: { tank_id: "FUEL-TANK-01", total_capacity_liters: 50000, current_level_liters: 38250, current_level_percent: 76.5, level_trend: "decreasing", consumption_rate_liters_per_day: 2040, days_until_empty: 18.8, thresholds: { critical_low_liters: 5000, critical_low_percent: 10, warning_low_liters: 15000, warning_low_percent: 30 } },
                emergency_reserve: { tank_id: "FUEL-EMERGENCY-01", total_capacity_liters: 10000, current_level_liters: 10000, current_level_percent: 100, reserve_purpose: "Emergency power for 48 hours of essential systems", auto_lockout_at_percent: 5 }
            },
            power_distribution: {
                total_generation_kw: profile.baseGen, total_load_kw: profile.baseLoad, net_power_deficit_kw: profile.baseGen - profile.baseLoad, power_sourcing: "battery_backup_active",
                loads_by_section: {
                    living_quarters: { load_kw: profile.baseLoad * 0.35, percent_of_total: 35, status: "operational" },
                    main_lab: { load_kw: profile.baseLoad * 0.40, percent_of_total: 40, status: "operational" },
                    hvac_system: { load_kw: profile.baseLoad * 0.15, percent_of_total: 15, status: "operational" },
                    critical_systems: { load_kw: 20.0, percent_of_total: 8.2, status: "operational" },
                    other: { load_kw: 9.5, percent_of_total: 3.9, status: "operational" }
                },
                thresholds: { max_load_kw: 400, warning_load_kw: 350, deficit_warning_kw: -50 }
            },
            battery_system: {
                battery_bank_id: "BATT-BANK-01", total_capacity_kwh: 150, current_charge_kwh: 138, current_charge_percent: profile.batteryHealth, charge_trend: profile.baseGen < profile.baseLoad ? "decreasing" : "charging",
                performance: { charging_rate_kw: Math.max(0, profile.baseGen - profile.baseLoad), discharging_rate_kw: Math.max(0, profile.baseLoad - profile.baseGen), estimated_backup_hours_at_current_load: 2.3, efficiency_percent: 95 },
                thresholds: { critical_low_percent: 10, warning_low_percent: 20, max_discharge_rate_kw: 120 }
            },
            renewable_energy: {
                solar_panels: { system_id: "SOLAR-001", status: "operational", current_output_kw: profile.solarKW, seasonal_phase: "summer_high_output", weather_dependent: true }
            },
            interconnections: { critical_alert: "NONE", alert_description: "Grid stable.", recommended_action: "None", severity: "INFO" }
        },

        // ==========================================
        // 2. ENVIRONMENT & WEATHER
        // ==========================================
        environment: {
            exterior_conditions: {
                temperature: { outside_temperature_c: profile.baseTemp, temperature_trend: "stable", temperature_rate_of_change_c_per_hour: -0.5, thresholds: { extreme_cold_c: -50, severe_cold_c: -40, warning_cold_c: -35 }, alerts: { is_extreme_cold: false, is_severe_cold: false, is_warning_cold: profile.baseTemp <= -35 } },
                wind: { wind_speed_kmh: profile.baseWind, wind_gust_kmh: profile.baseWind + 15, wind_direction: "SSE", wind_direction_degrees: 157, wind_trend: "increasing", thresholds: { blizzard_threshold_kmh: 100, severe_wind_threshold_kmh: 75, warning_wind_threshold_kmh: 60 }, alerts: { is_blizzard_condition: false, is_severe_wind: false, is_warning_wind: false } },
                visibility: { visibility_meters: profile.baseWind > 60 ? 800 : 3200, visibility_trend: "improving", thresholds: { whiteout_meters: 100, severe_visibility_meters: 500, poor_visibility_meters: 1000 }, alerts: { is_whiteout: false, is_severe_visibility_low: false } }
            },
            weather_phenomena: {
                blizzard: { blizzard_warning: false, blizzard_active: false, blizzard_trigger_conditions: { wind_speed_kmh: profile.baseWind, wind_threshold: 100, visibility_meters: 3200, visibility_threshold: 500, both_conditions_met: false }, estimated_blizzard_duration_hours: 0, field_teams_affected_count: 0 },
                precipitation: { precipitation_type: "none", precipitation_type_values: ["none", "light_snow", "moderate_snow", "heavy_snow", "ice"], precipitation_rate_mm_per_hour: 0.0, snow_accumulation_today_mm: 0.0, total_snow_depth_on_ground_cm: 185 },
                atmospheric: { atmospheric_pressure_mb: 1013.2, pressure_trend: "stable", humidity_percent: 68, uv_index: 4, ozone_level_dobson_units: 280 }
            },
            solar_conditions: { solar_radiation_w_m2: profile.solarRadiation, solar_radiation_trend: "stable", seasonal_phase: "austral_summer", daylight_hours: 18, solar_panel_efficiency_percent: 78 },
            interconnections_with_other_systems: {
                impact_on_energy: { wind_supporting_generation: false, solar_supporting_generation: true, solar_output_contribution_kw: 60 },
                impact_on_operations: { outdoor_operations_possible: true, field_team_safety_status: "safe", recommendations: "Monitor wind speeds. If approaching 75 kmh, recall field teams." },
                impact_on_infrastructure: { snow_loading_on_roof: "moderate", structural_risk: "low", heating_demand: "moderate" }
            },
            alerts_local: [],
            air_quality: [
                { zone: "Living Quarters", co2_ppm: 410, o2_percent: 21.0, status: "ok" },
                { zone: "Research Lab", co2_ppm: 415, o2_percent: 21.0, status: "ok" },
                { zone: "Storage Bay", co2_ppm: 440, o2_percent: 20.9, status: "ok" }
            ],
            temperature_history: Array.from({ length: 7 }).map((_, i) => ({
                time: `-${(6 - i) * 4}h`,
                ext: profile.baseTemp,
                int: 19.5
            }))
        },

        // ==========================================
        // 3. INFRASTRUCTURE & MODULES
        // ==========================================
        infrastructure: {
            modules: {
                living_quarters: {
                    module_id: "MOD-LQ-001", status: "operational", status_values: ["operational", "fault", "maintenance", "offline"], status_color: "green",
                    thermal_management: { indoor_temperature_c: 19.5, temperature_setpoint_c: 20.0, temperature_critical_low_c: 5.0, temperature_warning_low_c: 10.0, temperature_trend: "stable", heating_active: true },
                    environmental: { humidity_percent: 45, humidity_max_threshold: 60, humidity_warning_threshold: 55, air_circulation_status: "nominal", co2_level_ppm: 420 },
                    safety: { fire_alarm_status: false, smoke_detector_status: "active", sprinkler_system: "active", emergency_exits_clear: true },
                    occupancy: { current_occupants: 6, max_capacity: 8, occupancy_percent: 75 }
                },
                main_lab: {
                    module_id: "MOD-LAB-001", status: "operational", status_color: "green",
                    thermal_management: { indoor_temperature_c: 19.8, temperature_setpoint_c: 20.0, temperature_critical_low_c: 5.0, temperature_warning_low_c: 10.0, temperature_trend: "stable", heating_active: true },
                    environmental: { humidity_percent: 42, humidity_max_threshold: 50, air_circulation_status: "nominal" },
                    equipment: { research_equipment_operational_percent: 100, critical_equipment_status: "all_operational", freezer_units_temp_c: -20.0 },
                    safety: { fire_alarm_status: false, chemical_storage_secure: true }
                },
                storage_module: {
                    module_id: "MOD-STORAGE-001", status: "operational", status_color: "green",
                    thermal_management: { indoor_temperature_c: -5.0, temperature_setpoint_c: -5.0, temperature_critical_high_c: 0.0, temperature_warning_high_c: -2.0, temperature_trend: "stable", refrigeration_active: true },
                    inventory_storage: { total_capacity_percent: 85, food_storage_status: "adequate", medical_storage_status: "adequate" }
                }
            },
            systems: {
                hvac_main: {
                    system_id: "HVAC-001", status: "nominal", status_values: ["nominal", "fault", "degraded", "maintenance"], status_color: "green", description: "Primary HVAC",
                    operation: { heating_active: true, ventilation_active: true, backup_available: true, efficiency_percent: 94 },
                    performance: { air_circulation_cfm: 5420, target_circulation_cfm: 5500, heat_exchanger_efficiency_percent: profile.efficiency },
                    thresholds: { maintenance_due_hours: 250, last_maintenance_date: "2026-08-20", next_maintenance_due: "2026-10-15" }
                },
                hvac_backup: { system_id: "HVAC-BACKUP-001", status: "standby", backup_heating_available: true }
            },
            structural_health: { snow_load_on_roof_kg: profile.snowLoad, snow_load_threshold_kg: 20000, snow_load_critical_threshold_kg: 25000, structural_integrity_percent: profile.integrity, roof_strain_sensors: "nominal", foundation_status: "stable" },
            alerts_local: [],
            pressure_history: Array.from({ length: 7 }).map((_, i) => ({
                time: `-${(6 - i) * 4}h`,
                pressure: 1.15,
                limit: 1.5
            })),
            airlocks: [
                { id: "AL-LivingQtrs", status: "secure", cycles: 14, pressureDrop_psi: 0.01 },
                { id: "AL-MainLab", status: "secure", cycles: 28, pressureDrop_psi: 0.01 },
                { id: "AL-Storage", status: "secure", cycles: 3, pressureDrop_psi: 0.02 }
            ]
        },
        health: {} // Evaluated dynamically by alertEngine
    };
};

// 2. STATION PROFILES
const maitriProfile = { 
    baseTemp: -38.5, baseWind: 55.0, baseLoad: 245.5, baseGen: 185.5, 
    efficiency: 88, batteryHealth: 55, genRuntime: 4250, fuelBurn: 85.0,
    solarKW: 20, solarRadiation: 150, snowLoad: 18000, integrity: 92
};

const bharatiProfile = { 
    baseTemp: -12.4, baseWind: 25.0, baseLoad: 160.0, baseGen: 220.0, 
    efficiency: 98, batteryHealth: 98, genRuntime: 1200, fuelBurn: 65.0,
    solarKW: 85, solarRadiation: 450, snowLoad: 4000, integrity: 99
};

const dbMemory = {
    Maitri: generateInitialState("Maitri", maitriProfile),
    Bharati: generateInitialState("Bharati", bharatiProfile) 
};

// ============================================================================
// 3. DATABASE INITIALIZATION: Pull Logistics from MongoDB to RAM
// ============================================================================
const initializeDatabaseLink = async () => {
    try {
        const maitriLog = await Logistics.findOne({ station_id: "Maitri" }).lean();
        const bharatiLog = await Logistics.findOne({ station_id: "Bharati" }).lean();
        
        if (maitriLog) dbMemory["Maitri"].logistics = maitriLog;
        if (bharatiLog) dbMemory["Bharati"].logistics = bharatiLog;
        
        console.log("Twin Engine: Database Logistics Loaded into RAM.");
    } catch (err) {
        console.error("Failed to link Logistics DB to Twin Engine:", err);
    }
};

initializeDatabaseLink();

// ============================================================================
// 4. THE PHYSICS LOOP: Fast 2-second RAM updates (No DB writes)
// ============================================================================
setInterval(() => {
    const now = new Date().toISOString();

    Object.keys(dbMemory).forEach(station => {
        let state = dbMemory[station];
        state.timestamp = now;

        // Run sub-engines sequentially
        state.environment = environmentEngine.tick(state.environment);
        state.energy = energyEngine.tick(state.energy, state.environment);
        state.infrastructure = infraEngine.tick(state.infrastructure, state.environment, state.energy);

        // Logistics burns dynamically in RAM (assuming 12 personnel)
        if (state.logistics) {
            state.logistics = logisticsEngine.tick(state.logistics, state.energy, 12);
        }

        // Run alert engine on complete current state
        state.health = alertEngine.evaluate(state);
    });
}, 2000); 

// ============================================================================
// 5. DATABASE SYNC LOOP: Saves RAM back to MongoDB every 5 minutes
// ============================================================================
setInterval(async () => {
    try {
        for (const station of Object.keys(dbMemory)) {
            if (dbMemory[station].logistics) {
                // Update MongoDB with the newly depleted fuel/food levels
                await Logistics.findOneAndUpdate(
                    { station_id: station },
                    { $set: dbMemory[station].logistics }
                );
            }
        }
        console.log("Twin Engine: Database Sync Complete.");
    } catch (err) {
        console.error("Twin Engine DB Sync Error:", err);
    }
}, 300000); // 300,000 ms = 5 minutes


// ============================================================================
// 6. EXPORTS
// ============================================================================

// Full telemetry export
exports.getLiveTelemetry = (stationId) => {
    if (!dbMemory[stationId]) throw new Error(`Station ${stationId} not found.`);
    return dbMemory[stationId];
};

// Dedicated alert endpoint export (returns the exact schema requested)
exports.getStationAlerts = (stationId) => {
    if (!dbMemory[stationId]) throw new Error(`Station ${stationId} not found.`);
    return alertEngine.evaluate(dbMemory[stationId]);
};
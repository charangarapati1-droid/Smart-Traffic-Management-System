package com.smarttraffic;

public class EmergencyController {

    private boolean emergencyActive;
    private String emergencyRoad;
    private String emergencyVehicle;

    public EmergencyController() {
        emergencyActive = false;
    }

    public void reportEmergency(String roadName, String vehicleType) {
        emergencyActive = true;
        emergencyRoad = roadName;
        emergencyVehicle = vehicleType;

        System.out.println("===== EMERGENCY ALERT =====");
        System.out.println(emergencyVehicle + " detected on " + emergencyRoad);
        System.out.println(emergencyRoad + " signal = GREEN");
        System.out.println("All other roads = RED");
    }

    public void clearEmergency() {
        emergencyActive = false;
        emergencyRoad = null;
        emergencyVehicle = null;

        System.out.println("Emergency cleared.");
        System.out.println("Traffic control returned to normal.");
    }

    public boolean isEmergencyActive() {
        return emergencyActive;
    }

    public String getEmergencyRoad() {
        return emergencyRoad;
    }
}
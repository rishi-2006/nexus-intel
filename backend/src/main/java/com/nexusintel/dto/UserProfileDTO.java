package com.nexusintel.dto;

public class UserProfileDTO {

    private String badgeNumber;
    private String department;
    private String clearanceLevel;
    private String phoneNumber;

    public UserProfileDTO() {
    }

    public UserProfileDTO(String badgeNumber, String department, String clearanceLevel, String phoneNumber) {
        this.badgeNumber = badgeNumber;
        this.department = department;
        this.clearanceLevel = clearanceLevel;
        this.phoneNumber = phoneNumber;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getClearanceLevel() {
        return clearanceLevel;
    }

    public void setClearanceLevel(String clearanceLevel) {
        this.clearanceLevel = clearanceLevel;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
